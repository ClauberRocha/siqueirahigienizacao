import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Validação leve de CPF: 11 dígitos, ignorando pontuação.
const cpfSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .refine((v) => v.length === 11, { message: "CPF deve ter 11 dígitos" });

// Telefone brasileiro: 10 ou 11 dígitos (DDD + número).
const phoneSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .refine((v) => v.length === 10 || v.length === 11, {
    message: "Telefone deve ter 10 ou 11 dígitos",
  });

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data inválida" });

const timeSlotSchema = z.enum(["morning", "afternoon"]);

const bookingSchema = z.object({
  scheduled_date: dateSchema,
  time_slot: timeSlotSchema,
  customer_name: z.string().trim().min(3, "Nome muito curto").max(120),
  customer_cpf: cpfSchema,
  customer_phone: phoneSchema,
  customer_address: z.string().trim().min(5, "Endereço muito curto").max(300),
  service: z.string().trim().min(3, "Descreva o serviço").max(1000),
});

export const getBookedSlots = createServerFn({ method: "GET" }).handler(
  async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .select("scheduled_date, time_slot")
      .gte("scheduled_date", today);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      scheduled_date: r.scheduled_date as string,
      time_slot: (r as { time_slot: string }).time_slot,
    }));
  },
);

// Mantido para compatibilidade caso algum consumidor legado ainda importe.
export const getBookedDates = createServerFn({ method: "GET" }).handler(
  async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .select("scheduled_date")
      .gte("scheduled_date", today);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => r.scheduled_date as string);
  },
);

export const createAppointment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [y, m, d] = data.scheduled_date.split("-").map(Number);
    const chosen = new Date(Date.UTC(y, m - 1, d));
    const todayUtc = new Date();
    todayUtc.setUTCHours(0, 0, 0, 0);
    if (chosen.getTime() < todayUtc.getTime()) {
      throw new Error("Não é possível agendar em datas passadas.");
    }
    if (chosen.getUTCDay() === 0) {
      throw new Error("Não atendemos aos domingos.");
    }

    const { data: existing, error: exErr } = await supabaseAdmin
      .from("appointments")
      .select("id")
      .eq("scheduled_date", data.scheduled_date)
      .eq("time_slot", data.time_slot)
      .maybeSingle();
    if (exErr) throw new Error(exErr.message);
    if (existing) throw new Error("Este horário já foi reservado. Escolha outro.");

    const { data: inserted, error } = await supabaseAdmin
      .from("appointments")
      .insert({
        scheduled_date: data.scheduled_date,
        time_slot: data.time_slot,
        customer_name: data.customer_name,
        customer_cpf: data.customer_cpf,
        customer_phone: data.customer_phone,
        customer_address: data.customer_address,
        service: data.service,
      })
      .select("id, scheduled_date, time_slot")
      .single();
    if (error) {
      if (error.code === "23505") {
        throw new Error("Este horário acabou de ser reservado. Escolha outro.");
      }
      throw new Error(error.message);
    }
    return {
      id: inserted.id,
      scheduled_date: inserted.scheduled_date,
      time_slot: (inserted as { time_slot: string }).time_slot,
    };
  });
