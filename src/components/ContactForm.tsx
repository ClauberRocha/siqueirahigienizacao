import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { siteConfig } from "@/lib/site-config";
import { track } from "@/lib/analytics";

const SERVICOS = [
  "Sofá",
  "Colchão",
  "Tapete",
  "Cadeira",
  "Poltrona",
  "Banco automotivo",
  "Veículo completo",
  "Outro",
];

type FormState = {
  nome: string;
  whatsapp: string;
  servico: string;
  bairro: string;
  mensagem: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = { nome: "", whatsapp: "", servico: "", bairro: "", mensagem: "" };

function validate(v: FormState): Errors {
  const e: Errors = {};
  if (v.nome.trim().length < 2) e.nome = "Informe seu nome completo";
  if (v.nome.trim().length > 100) e.nome = "Nome muito longo";

  const onlyDigits = v.whatsapp.replace(/\D/g, "");
  if (onlyDigits.length < 10 || onlyDigits.length > 11) {
    e.whatsapp = "Informe um WhatsApp válido com DDD";
  }

  if (!v.servico) e.servico = "Selecione o tipo de serviço";
  if (v.bairro.trim().length < 2) e.bairro = "Informe seu bairro";
  if (v.mensagem.trim().length > 1000) e.mensagem = "Mensagem muito longa";
  return e;
}

function formatWhatsappDisplay(digits: string) {
  const d = digits.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function ContactForm() {
  const [values, setValues] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [photoName, setPhotoName] = useState<string>("");

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Corrija os campos destacados", { description: "Alguns dados estão incompletos." });
      return;
    }

    setSubmitting(true);

    const digits = values.whatsapp.replace(/\D/g, "");
    const extra = values.mensagem.trim() ? `\n\n💬 ${values.mensagem.trim()}` : "";
    const photoLine = photoName ? `\n\n📎 Vou enviar a foto do estofado em seguida.` : "";
    const message =
      `Olá! Meu nome é ${values.nome.trim()}. ` +
      `Gostaria de um orçamento para ${values.servico}. ` +
      `Meu bairro é ${values.bairro.trim()}.` +
      `\n\n📱 ${formatWhatsappDisplay(digits)}` +
      extra +
      photoLine;

    const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

    track("contact_form_submit", {
      servico: values.servico,
      bairro: values.bairro,
      has_photo: Boolean(photoName),
      source: "contact_section",
    });

    window.open(url, "_blank", "noopener,noreferrer");

    toast.success("Mensagem pronta pra enviar!", {
      description: photoName
        ? "Abrimos o WhatsApp com seus dados. Anexe a foto direto no chat."
        : "Abrimos o WhatsApp com seus dados. É só apertar enviar.",
    });

    setValues(emptyForm);
    setPhotoName("");
    setSubmitting(false);
  };

  const fieldCls = (name: keyof FormState) =>
    `field ${errors[name] ? "!border-red-500" : ""}`;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="cf-nome" className="block text-sm font-medium mb-1.5">
          Nome completo *
        </label>
        <input
          id="cf-nome"
          type="text"
          autoComplete="name"
          maxLength={100}
          className={fieldCls("nome")}
          value={values.nome}
          onChange={(e) => setField("nome", e.target.value)}
          placeholder="Seu nome"
        />
        {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
      </div>

      <div>
        <label htmlFor="cf-whatsapp" className="block text-sm font-medium mb-1.5">
          WhatsApp (com DDD) *
        </label>
        <input
          id="cf-whatsapp"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={16}
          className={fieldCls("whatsapp")}
          value={values.whatsapp}
          onChange={(e) => setField("whatsapp", formatWhatsappDisplay(e.target.value))}
          placeholder="(98) 98888-0000"
        />
        {errors.whatsapp && <p className="text-xs text-red-500 mt-1">{errors.whatsapp}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-servico" className="block text-sm font-medium mb-1.5">
            Tipo de serviço *
          </label>
          <select
            id="cf-servico"
            className={fieldCls("servico")}
            value={values.servico}
            onChange={(e) => setField("servico", e.target.value)}
          >
            <option value="">Selecione...</option>
            {SERVICOS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.servico && <p className="text-xs text-red-500 mt-1">{errors.servico}</p>}
        </div>

        <div>
          <label htmlFor="cf-bairro" className="block text-sm font-medium mb-1.5">
            Bairro *
          </label>
          <input
            id="cf-bairro"
            type="text"
            maxLength={80}
            className={fieldCls("bairro")}
            value={values.bairro}
            onChange={(e) => setField("bairro", e.target.value)}
            placeholder="Ex.: Cohama"
          />
          {errors.bairro && <p className="text-xs text-red-500 mt-1">{errors.bairro}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="cf-mensagem" className="block text-sm font-medium mb-1.5">
          Detalhes (opcional)
        </label>
        <textarea
          id="cf-mensagem"
          rows={3}
          maxLength={1000}
          className={fieldCls("mensagem")}
          value={values.mensagem}
          onChange={(e) => setField("mensagem", e.target.value)}
          placeholder="Quantidade, tipo de tecido, manchas específicas…"
        />
        {errors.mensagem && <p className="text-xs text-red-500 mt-1">{errors.mensagem}</p>}
      </div>

      <div>
        <label htmlFor="cf-foto" className="block text-sm font-medium mb-1.5">
          Anexar foto do estofado (opcional)
        </label>
        <label
          htmlFor="cf-foto"
          className="field flex items-center justify-between gap-3 cursor-pointer hover:border-[color:var(--cyan)] transition-colors"
        >
          <span className="text-sm text-[color:var(--muted)] truncate">
            {photoName || "📷 Escolher foto (acelera muito o orçamento)"}
          </span>
          <span className="text-xs font-semibold text-[color:var(--cyan2)] shrink-0">
            {photoName ? "Trocar" : "Selecionar"}
          </span>
        </label>
        <input
          id="cf-foto"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? "")}
        />
        {photoName && (
          <p className="text-xs text-[color:var(--muted)] mt-1">
            A foto será enviada direto no chat do WhatsApp após abrir.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-wa w-full text-base disabled:opacity-60"
      >
        {submitting ? "Abrindo WhatsApp..." : "Enviar via WhatsApp →"}
      </button>

      <p className="text-xs text-[color:var(--muted)] text-center">
        ⚠️ Últimas 3 vagas da semana · orçamento grátis válido por 48h
      </p>
    </form>
  );
}
