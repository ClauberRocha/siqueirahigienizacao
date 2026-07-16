import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { toWhatsappNumber } from "./phone";

/** Leitura pública das configurações do site (número do WhatsApp do proprietário). */
export const getPublicSettings = createServerFn({ method: "GET" }).handler(
  async () => {
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const client = createClient(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { data, error } = await client
      .from("site_settings")
      .select("owner_whatsapp")
      .eq("id", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { owner_whatsapp: data?.owner_whatsapp ?? "" };
  },
);

/** Leitura das configurações completas — apenas para o administrador. */
export const getAdminSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("site_settings")
      .select("owner_whatsapp, updated_at")
      .eq("id", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ?? { owner_whatsapp: "", updated_at: null };
  });

const updateSchema = z.object({
  owner_whatsapp: z
    .string()
    .trim()
    .min(10)
    .transform((v) => {
      const n = toWhatsappNumber(v);
      if (!n) throw new Error("Número de WhatsApp inválido. Use DDD + número (Brasil).");
      return n;
    }),
});

export const updateOwnerWhatsapp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => updateSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("site_settings")
      .update({ owner_whatsapp: data.owner_whatsapp, updated_by: context.userId })
      .eq("id", true);
    if (error) throw new Error(error.message);
    return { ok: true, owner_whatsapp: data.owner_whatsapp };
  });
