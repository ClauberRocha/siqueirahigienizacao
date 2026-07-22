import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { toWhatsappNumber } from "./phone";

/** Leitura pública das configurações do site (número do WhatsApp do proprietário). */
export const getPublicSettings = createServerFn({ method: "GET" }).handler(
  async () => {
    // Public read is restricted at the DB level; use the trusted server client
    // to expose only the owner_whatsapp field, never updated_by / updated_at.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
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
