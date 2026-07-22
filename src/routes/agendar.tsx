import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import {
  getBookedSlots,
  createAppointment,
} from "@/lib/appointments.functions";
import { getPublicSettings } from "@/lib/settings.functions";
import { formatBrPhoneDisplay } from "@/lib/phone";
import {
  MIN_LEAD_HOURS,
  nowInSaoLuis,
  pastOrTooLateSlotsForToday,
  validateSlotLeadTime,
  type BookingSlot,
} from "@/lib/booking-time";

export const Route = createFileRoute("/agendar")({
  head: () => ({
    meta: [
      { title: `Agendar higienização — ${siteConfig.brandName}` },
      {
        name: "description",
        content:
          "Escolha uma data disponível e agende sua higienização online em São Luís/MA. Atendimento em domicílio com confirmação imediata.",
      },
      { property: "og:title", content: `Agendar higienização — ${siteConfig.brandName}` },
      {
        property: "og:description",
        content: "Veja as datas livres e agende sua higienização em poucos cliques.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AgendarPage,
});

type TimeSlot = BookingSlot;

const SLOT_LABELS: Record<TimeSlot, string> = {
  morning: "Manhã (08h – 12h)",
  afternoon: "Tarde (13h – 18h)",
};

const SLOT_PERIOD: Record<TimeSlot, string> = {
  morning: "Manhã",
  afternoon: "Tarde",
};

const SLOT_WINDOW: Record<TimeSlot, string> = {
  morning: "08h às 12h",
  afternoon: "13h às 18h",
};

function maskCPF(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) {
    return d
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }
  return d
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

function isPhoneValid(v: string): boolean {
  const d = v.replace(/\D/g, "");
  return d.length === 10 || d.length === 11;
}

function isCpfValid(v: string): boolean {
  return v.replace(/\D/g, "").length === 11;
}

type Confirmation = {
  id: string;
  dateLabel: string;
  slot: TimeSlot;
  name: string;
  cpf: string;
  phone: string;
  address: string;
  service: string;
  notes: string;
  ownerWhatsapp: string;
};

type FieldKey =
  | "date"
  | "slot"
  | "name"
  | "cpf"
  | "phone"
  | "address"
  | "service";

type FieldErrors = Partial<Record<FieldKey, string>>;

const FIELD_LABEL: Record<FieldKey, string> = {
  date: "Data",
  slot: "Horário",
  name: "Nome completo",
  cpf: "CPF",
  phone: "Telefone / WhatsApp",
  address: "Endereço",
  service: "Serviço",
};

function buildWhatsappMessage(c: Confirmation) {
  const lines = [
    `*Novo agendamento — ${siteConfig.brandName}*`,
    `Protocolo: ${c.id.slice(0, 8).toUpperCase()}`,
    ``,
    `👤 *Cliente*`,
    `Nome: ${c.name}`,
    `CPF: ${c.cpf}`,
    `Telefone: ${c.phone}`,
    `Endereço: ${c.address}`,
    ``,
    `📅 *Agendamento*`,
    `Data: ${c.dateLabel}`,
    `Turno: ${SLOT_PERIOD[c.slot]}`,
    `Horário: ${SLOT_WINDOW[c.slot]}`,
    ``,
    `🧼 *Serviço*`,
    c.service,
  ];
  if (c.notes.trim()) {
    lines.push(``, `📝 *Observações*`, c.notes.trim());
  }
  return lines.join("\n");
}

function AgendarPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const fetchBooked = useServerFn(getBookedSlots);
  const fetchSettings = useServerFn(getPublicSettings);
  const submitBooking = useServerFn(createAppointment);

  const { data: booked = [], isLoading } = useQuery({
    queryKey: ["booked-slots"],
    queryFn: () => fetchBooked(),
  });
  const { data: publicSettings } = useQuery({
    queryKey: ["public-settings"],
    queryFn: () => fetchSettings(),
  });

  const bookedMap = useMemo(() => {
    const m = new Map<string, Set<TimeSlot>>();
    for (const b of booked) {
      const set = m.get(b.scheduled_date) ?? new Set<TimeSlot>();
      set.add(b.time_slot as TimeSlot);
      m.set(b.scheduled_date, set);
    }
    return m;
  }, [booked]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<TimeSlot | "">("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [service, setService] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const dateKey = date ? format(date, "yyyy-MM-dd") : "";
  const takenSlots = dateKey ? bookedMap.get(dateKey) ?? new Set() : new Set();

  const todayKey = nowInSaoLuis().dateKey;
  const isToday = dateKey === todayKey;
  const pastSlots = isToday ? pastOrTooLateSlotsForToday() : new Set<TimeSlot>();

  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    if (!date) e.date = "Escolha uma data no calendário.";
    if (!slot) e.slot = "Selecione o turno (manhã ou tarde).";
    if (date && slot) {
      const leadErr = validateSlotLeadTime(format(date, "yyyy-MM-dd"), slot);
      if (leadErr) e.slot = leadErr;
    }
    if (name.trim().length < 3) e.name = "Informe seu nome completo.";
    if (!isCpfValid(cpf)) e.cpf = "CPF deve conter 11 dígitos.";
    if (!isPhoneValid(phone))
      e.phone = "Telefone inválido. Use DDD + número (ex.: (98) 98866-0241).";
    if (address.trim().length < 5) e.address = "Endereço incompleto.";
    if (service.trim().length < 3)
      e.service = "Descreva brevemente o serviço que precisa.";
    return e;
  };

  const mutation = useMutation({
    mutationFn: async () => {
      // Revalida no cliente
      const fieldErrors = validate();

      // Re-checa disponibilidade contra o backend imediatamente antes de enviar
      const fresh = await qc.fetchQuery({
        queryKey: ["booked-slots"],
        queryFn: () => fetchBooked(),
      });
      if (date && slot) {
        const k = format(date, "yyyy-MM-dd");
        const taken = fresh.some(
          (b) => b.scheduled_date === k && b.time_slot === slot,
        );
        if (taken) {
          fieldErrors.slot =
            "Este horário acabou de ser reservado. Escolha outro turno ou data.";
        }
      }

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        throw new Error("Verifique os campos destacados no formulário.");
      }
      setErrors({});

      return submitBooking({
        data: {
          scheduled_date: format(date!, "yyyy-MM-dd"),
          time_slot: slot as TimeSlot,
          customer_name: name,
          customer_cpf: cpf,
          customer_phone: phone,
          customer_address: address,
          service: service,
        },
      });
    },
    onSuccess: (res) => {
      const dateLabel = format(
        new Date(res.scheduled_date + "T00:00:00"),
        "PPPP",
        { locale: ptBR },
      );
      const c: Confirmation = {
        id: res.id,
        dateLabel,
        slot: res.time_slot as TimeSlot,
        name,
        cpf,
        phone,
        address,
        service,
        notes,
        ownerWhatsapp:
          publicSettings?.owner_whatsapp || siteConfig.whatsappNumber,
      };
      setConfirmation(c);
      toast.success("Agendamento confirmado!", {
        description: `${dateLabel} · ${SLOT_LABELS[c.slot]}`,
      });
      qc.invalidateQueries({ queryKey: ["booked-slots"] });
      setName("");
      setCpf("");
      setPhone("");
      setAddress("");
      setService("");
      setNotes("");
      setDate(undefined);
      setSlot("");
      setErrors({});
      router.invalidate();
    },
    onError: (err: Error) => {
      toast.error("Não foi possível agendar", { description: err.message });
    },
  });

  const isDayDisabled = (d: Date) => {
    if (d < today) return true;
    if (d > maxDate) return true;
    if (d.getDay() === 0) return true;
    const key = format(d, "yyyy-MM-dd");
    const s = bookedMap.get(key);
    let morningTaken = s?.has("morning") ?? false;
    let afternoonTaken = s?.has("afternoon") ?? false;
    if (key === todayKey) {
      const past = pastOrTooLateSlotsForToday();
      if (past.has("morning")) morningTaken = true;
      if (past.has("afternoon")) afternoonTaken = true;
    }
    return morningTaken && afternoonTaken;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-bold tracking-tight">
            {siteConfig.brandName}
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            Falar no WhatsApp
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {confirmation ? (
          <ConfirmationPanel
            confirmation={confirmation}
            onReset={() => setConfirmation(null)}
          />
        ) : (
          <BookingForm
            isLoading={isLoading}
            date={date}
            setDate={(d) => {
              setDate(d);
              setSlot("");
              setErrors((prev) => ({ ...prev, date: undefined, slot: undefined }));
            }}
            isDayDisabled={isDayDisabled}
            today={today}
            maxDate={maxDate}
            slot={slot}
            setSlot={(s) => {
              setSlot(s);
              setErrors((prev) => ({ ...prev, slot: undefined }));
            }}
            takenSlots={takenSlots as Set<TimeSlot>}
            pastSlots={pastSlots}
            name={name}
            setName={(v) => {
              setName(v);
              if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
            }}
            cpf={cpf}
            setCpf={(v) => {
              setCpf(v);
              if (errors.cpf) setErrors((p) => ({ ...p, cpf: undefined }));
            }}
            phone={phone}
            setPhone={(v) => {
              setPhone(v);
              if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
            }}
            address={address}
            setAddress={(v) => {
              setAddress(v);
              if (errors.address) setErrors((p) => ({ ...p, address: undefined }));
            }}
            service={service}
            setService={(v) => {
              setService(v);
              if (errors.service) setErrors((p) => ({ ...p, service: undefined }));
            }}
            notes={notes}
            setNotes={setNotes}
            errors={errors}
            onSubmit={() => mutation.mutate()}
            submitting={mutation.isPending}
          />
        )}
      </main>
    </div>
  );
}

function ErrorSummary({
  errors,
  onFocusField,
}: {
  errors: FieldErrors;
  onFocusField: (k: FieldKey) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const entries = (Object.entries(errors) as [FieldKey, string | undefined][])
    .filter(([, v]) => !!v) as [FieldKey, string][];

  useEffect(() => {
    if (entries.length > 0 && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      // Foca o primeiro campo inválido para correção rápida
      const first = entries[0][0];
      onFocusField(first);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries.length]);

  if (entries.length === 0) return null;

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="polite"
      className="mb-6 rounded-lg border border-destructive/40 bg-destructive/5 p-4"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-destructive">
            {entries.length === 1
              ? "Corrija o campo abaixo para continuar:"
              : `Corrija os ${entries.length} campos abaixo para continuar:`}
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {entries.map(([k, msg]) => (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => onFocusField(k)}
                  className="text-left text-destructive underline-offset-2 hover:underline"
                >
                  <span className="font-medium">{FIELD_LABEL[k]}:</span> {msg}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1 text-xs font-medium text-destructive">
      {msg}
    </p>
  );
}

function BookingForm(props: {
  isLoading: boolean;
  date: Date | undefined;
  setDate: (d: Date | undefined) => void;
  isDayDisabled: (d: Date) => boolean;
  today: Date;
  maxDate: Date;
  slot: TimeSlot | "";
  setSlot: (s: TimeSlot) => void;
  takenSlots: Set<TimeSlot>;
  pastSlots: Set<TimeSlot>;
  name: string;
  setName: (v: string) => void;
  cpf: string;
  setCpf: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  service: string;
  setService: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  errors: FieldErrors;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const {
    isLoading, date, setDate, isDayDisabled, today, maxDate,
    slot, setSlot, takenSlots, pastSlots,
    name, setName, cpf, setCpf, phone, setPhone,
    address, setAddress, service, setService,
    notes, setNotes, errors,
    onSubmit, submitting,
  } = props;

  const refs: Record<FieldKey, React.RefObject<HTMLElement | null>> = {
    date: useRef<HTMLDivElement>(null),
    slot: useRef<HTMLDivElement>(null),
    name: useRef<HTMLInputElement>(null),
    cpf: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    address: useRef<HTMLInputElement>(null),
    service: useRef<HTMLTextAreaElement>(null),
  };

  const focusField = (k: FieldKey) => {
    const el = refs[k]?.current as (HTMLElement & { focus?: () => void }) | null;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    if (typeof el.focus === "function") el.focus({ preventScroll: true } as FocusOptions);
  };

  const inv = (k: FieldKey) => (errors[k] ? "true" : undefined) as "true" | undefined;
  const describedBy = (k: FieldKey) => (errors[k] ? `err-${k}` : undefined);
  const inputErrClass = (k: FieldKey) =>
    errors[k] ? " border-destructive focus-visible:ring-destructive" : "";

  return (
    <>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Agendamento online
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Escolha uma data disponível
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Atendemos de segunda a sábado nos turnos manhã (08h–12h) e tarde
          (13h–18h). Selecione o melhor dia e horário, preencha seus dados e
          receba a confirmação automática.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Reservas requerem no mínimo <strong>{MIN_LEAD_HOURS}h de antecedência</strong>{" "}
          em relação ao fim do turno.
        </p>
      </div>

      <ErrorSummary errors={errors} onFocusField={focusField} />

      <div className="grid gap-8 md:grid-cols-[auto_1fr]">
        <Card className="p-4" ref={refs.date as React.RefObject<HTMLDivElement>} tabIndex={-1}>
          <div className="mb-3 text-sm font-semibold">Datas disponíveis</div>
          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Carregando agenda…</div>
          ) : (
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={isDayDisabled}
              locale={ptBR}
              fromDate={today}
              toDate={maxDate}
              className="pointer-events-auto"
            />
          )}
          <FieldError id="err-date" msg={errors.date} />
        </Card>

        <Card className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            noValidate
            className="space-y-4"
          >
            <div>
              <div className="text-sm font-semibold">Data selecionada</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {date
                  ? format(date, "PPPP", { locale: ptBR })
                  : "Escolha uma data no calendário ao lado."}
              </div>
            </div>

            <div ref={refs.slot as React.RefObject<HTMLDivElement>} tabIndex={-1}>
              <Label className="mb-2 block">Horário</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["morning", "afternoon"] as TimeSlot[]).map((s) => {
                  const taken = takenSlots.has(s);
                  const past = pastSlots.has(s);
                  const disabled = !date || taken || past;
                  const active = slot === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSlot(s)}
                      className={
                        "rounded-md border px-3 py-2 text-sm transition " +
                        (active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background hover:bg-muted") +
                        (errors.slot && !active ? " border-destructive" : "") +
                        (disabled
                          ? " cursor-not-allowed opacity-50 hover:bg-background"
                          : "")
                      }
                    >
                      {SLOT_LABELS[s]}
                      {taken && <span className="ml-1 text-xs">(ocupado)</span>}
                      {!taken && past && <span className="ml-1 text-xs">(encerrado)</span>}
                    </button>
                  );
                })}
              </div>
              {!date && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Selecione primeiro uma data para ver os horários.
                </p>
              )}
              <FieldError id="err-slot" msg={errors.slot} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" required minLength={3} maxLength={120}
                  ref={refs.name as React.RefObject<HTMLInputElement>}
                  aria-invalid={inv("name")} aria-describedby={describedBy("name")}
                  className={inputErrClass("name")}
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome" />
                <FieldError id="err-name" msg={errors.name} />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" required inputMode="numeric" value={cpf}
                  ref={refs.cpf as React.RefObject<HTMLInputElement>}
                  aria-invalid={inv("cpf")} aria-describedby={describedBy("cpf")}
                  className={inputErrClass("cpf")}
                  onChange={(e) => setCpf(maskCPF(e.target.value))}
                  placeholder="000.000.000-00" maxLength={14} />
                <FieldError id="err-cpf" msg={errors.cpf} />
              </div>
              <div>
                <Label htmlFor="phone">Telefone / WhatsApp</Label>
                <Input id="phone" required inputMode="tel" value={phone}
                  ref={refs.phone as React.RefObject<HTMLInputElement>}
                  aria-invalid={inv("phone")} aria-describedby={describedBy("phone")}
                  className={inputErrClass("phone")}
                  onChange={(e) => setPhone(maskPhone(e.target.value))}
                  placeholder="(98) 98866-0241" maxLength={16} />
                <FieldError id="err-phone" msg={errors.phone} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Endereço completo</Label>
                <Input id="address" required minLength={5} maxLength={300}
                  ref={refs.address as React.RefObject<HTMLInputElement>}
                  aria-invalid={inv("address")} aria-describedby={describedBy("address")}
                  className={inputErrClass("address")}
                  value={address} onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número, bairro, cidade" />
                <FieldError id="err-address" msg={errors.address} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="service">Serviço</Label>
                <Textarea id="service" required minLength={3} maxLength={1000}
                  ref={refs.service as React.RefObject<HTMLTextAreaElement>}
                  aria-invalid={inv("service")} aria-describedby={describedBy("service")}
                  className={"resize-y" + inputErrClass("service")}
                  value={service} onChange={(e) => setService(e.target.value)}
                  placeholder="Descreva o que precisa higienizar. Ex.: Sofá 3 lugares em tecido, 2 poltronas e tapete 2x3m."
                  rows={5} />
                <FieldError id="err-service" msg={errors.service} />
                <p className="mt-1 text-xs text-muted-foreground">
                  Quanto mais detalhes, melhor preparamos o atendimento.
                </p>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea id="notes" maxLength={500}
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex.: portão azul, ligar antes de chegar, animal de estimação em casa."
                  rows={3} className="resize-y" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
              size="lg"
            >
              {submitting ? "Confirmando…" : "Confirmar agendamento"}
            </Button>

            <p className="text-xs text-muted-foreground">
              Ao confirmar, você concorda em receber contato pelo telefone/WhatsApp
              para detalhes do atendimento.
            </p>
          </form>
        </Card>
      </div>
    </>
  );
}

function ConfirmationPanel({
  confirmation,
  onReset,
}: {
  confirmation: Confirmation;
  onReset: () => void;
}) {
  const message = buildWhatsappMessage(confirmation);
  const waUrl = `https://wa.me/${confirmation.ownerWhatsapp}?text=${encodeURIComponent(message)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Dados copiados para a área de transferência.");
    } catch {
      toast.error("Não foi possível copiar automaticamente.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
          ✅
        </div>
        <h1 className="mt-3 text-2xl font-bold">Agendamento confirmado!</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enviaremos os dados abaixo pelo WhatsApp para o proprietário
          ({formatBrPhoneDisplay(confirmation.ownerWhatsapp)}).
        </p>
      </div>

      <Card className="p-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Resumo do agendamento
        </div>
        <dl className="mt-3 space-y-2 text-sm">
          <Row label="Protocolo">{confirmation.id.slice(0, 8).toUpperCase()}</Row>
          <Row label="Data">{confirmation.dateLabel}</Row>
          <Row label="Horário">{SLOT_LABELS[confirmation.slot]}</Row>
          <Row label="Nome">{confirmation.name}</Row>
          <Row label="CPF">{confirmation.cpf}</Row>
          <Row label="Telefone">{confirmation.phone}</Row>
          <Row label="Endereço">{confirmation.address}</Row>
          <Row label="Serviço">{confirmation.service}</Row>
          {confirmation.notes.trim() && (
            <Row label="Observações">{confirmation.notes}</Row>
          )}
        </dl>

        <pre className="mt-5 max-h-64 overflow-auto rounded-md border bg-muted/40 p-3 text-xs whitespace-pre-wrap">
{message}
        </pre>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={copy}>
            📋 Copiar dados
          </Button>
          <Button asChild>
            <a href={waUrl} target="_blank" rel="noopener noreferrer">
              Enviar pelo WhatsApp →
            </a>
          </Button>
          <Button type="button" variant="ghost" onClick={onReset}>
            Fazer novo agendamento
          </Button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Seu pedido já ficou registrado no sistema. Se preferir, envie os dados
          copiados por qualquer outro canal.
        </p>
      </Card>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 pb-2 last:border-b-0 sm:flex-row sm:gap-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:w-28">
        {label}
      </dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}
