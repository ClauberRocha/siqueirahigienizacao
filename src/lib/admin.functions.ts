import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { validateSlotLeadTime } from "./booking-time";

/** Retorna se o usuário logado é administrador. */
export const getIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { isAdmin: !!data };
  });

/**
 * Bootstrap: se ainda não existir nenhum administrador, promove o usuário
 * logado a administrador. Ideal para o primeiro acesso do proprietário.
 */
export const claimAdminIfEmpty = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error: cErr } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (cErr) throw new Error(cErr.message);
    if ((count ?? 0) > 0) return { promoted: false };
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { promoted: true };
  });

export const listAppointments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("appointments")
      .select(
        "id, scheduled_date, time_slot, customer_name, customer_cpf, customer_phone, customer_address, service, status, cancellation_reason, created_at, updated_at",
      )
      .order("scheduled_date", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const statusEnum = z.enum([
  "pending",
  "confirmed",
  "in_progress",
  "done",
  "cancelled",
]);

const statusSchema = z.object({
  id: z.string().uuid(),
  status: statusEnum,
});

export const updateAppointmentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => statusSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("appointments")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Validação de telefone consistente com o formulário público.
const phoneSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .refine((v) => v.length === 10 || v.length === 11, {
    message: "Telefone deve ter 10 ou 11 dígitos",
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  customer_name: z.string().trim().min(3, "Nome muito curto").max(120),
  customer_phone: phoneSchema,
  customer_address: z.string().trim().min(5, "Endereço muito curto").max(300),
  service: z.string().trim().min(3, "Descreva o serviço").max(1000),
  status: statusEnum,
});

export const updateAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => updateSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { error } = await context.supabase
      .from("appointments")
      .update(patch)
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const rescheduleSchema = z.object({
  id: z.string().uuid(),
  scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  time_slot: z.enum(["morning", "afternoon"]),
});

export const rescheduleAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => rescheduleSchema.parse(data))
  .handler(async ({ data, context }) => {
    const [y, m, d] = data.scheduled_date.split("-").map(Number);
    const chosen = new Date(Date.UTC(y, m - 1, d));
    if (chosen.getUTCDay() === 0) {
      throw new Error("Não atendemos aos domingos.");
    }
    const leadError = validateSlotLeadTime(data.scheduled_date, data.time_slot);
    if (leadError) throw new Error(leadError);

    // Busca o estado atual para retornar previous* e permitir a mensagem ao cliente.
    const { data: current, error: curErr } = await context.supabase
      .from("appointments")
      .select("scheduled_date, time_slot, customer_name, customer_phone")
      .eq("id", data.id)
      .maybeSingle();
    if (curErr) throw new Error(curErr.message);
    if (!current) throw new Error("Agendamento não encontrado.");

    const { error } = await context.supabase
      .from("appointments")
      .update({
        scheduled_date: data.scheduled_date,
        time_slot: data.time_slot,
        status: "confirmed",
      })
      .eq("id", data.id);
    if (error) {
      // A constraint anti double-booking (índice único parcial) barra concorrência.
      if ((error as { code?: string }).code === "23505") {
        throw new Error("Este horário já foi reservado. Escolha outro.");
      }
      throw new Error(error.message);
    }
    return {
      ok: true,
      previous_date: current.scheduled_date as string,
      previous_slot: (current as { time_slot: string }).time_slot,
      customer_name: current.customer_name as string,
      customer_phone: (current as { customer_phone: string }).customer_phone,
    };
  });

const cancelSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().trim().max(500).optional(),
});

/**
 * Cancelamento "soft": mantém o registro para o histórico e libera o slot
 * (a constraint única parcial ignora status = 'cancelled').
 */
export const cancelAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => cancelSchema.parse(data))
  .handler(async ({ data, context }) => {
    const reason = data.reason && data.reason.length > 0 ? data.reason : null;
    const { data: updated, error } = await context.supabase
      .from("appointments")
      .update({ status: "cancelled", cancellation_reason: reason })
      .eq("id", data.id)
      .select("scheduled_date, time_slot, customer_name, customer_phone")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!updated) throw new Error("Agendamento não encontrado.");
    return {
      ok: true,
      scheduled_date: updated.scheduled_date as string,
      time_slot: (updated as { time_slot: string }).time_slot,
      customer_name: updated.customer_name as string,
      customer_phone: (updated as { customer_phone: string }).customer_phone,
    };
  });
