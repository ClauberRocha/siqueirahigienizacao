import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import {
  getBookedDates,
  createAppointment,
} from "@/lib/appointments.functions";
import { getPublicSettings } from "@/lib/settings.functions";
import { formatBrPhoneDisplay } from "@/lib/phone";

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

function maskCPF(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

type Confirmation = {
  id: string;
  dateLabel: string;
  name: string;
  cpf: string;
  address: string;
  service: string;
  ownerWhatsapp: string;
};

function buildWhatsappMessage(c: Confirmation) {
  return (
    `*Novo agendamento — ${siteConfig.brandName}*\n\n` +
    `📅 Data: ${c.dateLabel}\n` +
    `⏰ Horário: ${siteConfig.businessHours} (atendimento de dia inteiro, ~8h)\n` +
    `👤 Nome: ${c.name}\n` +
    `🪪 CPF: ${c.cpf}\n` +
    `📍 Endereço: ${c.address}\n` +
    `🧼 Serviço: ${c.service || "Não informado"}`
  );
}

function AgendarPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const fetchBooked = useServerFn(getBookedDates);
  const fetchSettings = useServerFn(getPublicSettings);
  const submitBooking = useServerFn(createAppointment);

  const { data: booked = [], isLoading } = useQuery({
    queryKey: ["booked-dates"],
    queryFn: () => fetchBooked(),
  });
  const { data: publicSettings } = useQuery({
    queryKey: ["public-settings"],
    queryFn: () => fetchSettings(),
  });

  const bookedSet = useMemo(() => new Set(booked), [booked]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [address, setAddress] = useState("");
  const [service, setService] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!date) throw new Error("Escolha uma data.");
      return submitBooking({
        data: {
          scheduled_date: format(date, "yyyy-MM-dd"),
          customer_name: name,
          customer_cpf: cpf,
          customer_address: address,
          service: service || null,
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
        name,
        cpf,
        address,
        service,
        ownerWhatsapp:
          publicSettings?.owner_whatsapp || siteConfig.whatsappNumber,
      };
      setConfirmation(c);
      toast.success("Agendamento confirmado!", {
        description: `Sua visita está marcada para ${dateLabel}.`,
      });
      qc.invalidateQueries({ queryKey: ["booked-dates"] });
      setName("");
      setCpf("");
      setAddress("");
      setService("");
      setDate(undefined);
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
    return bookedSet.has(key);
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
            setDate={setDate}
            isDayDisabled={isDayDisabled}
            today={today}
            maxDate={maxDate}
            name={name}
            setName={setName}
            cpf={cpf}
            setCpf={setCpf}
            address={address}
            setAddress={setAddress}
            service={service}
            setService={setService}
            onSubmit={() => mutation.mutate()}
            submitting={mutation.isPending}
          />
        )}
      </main>
    </div>
  );
}

function BookingForm(props: {
  isLoading: boolean;
  date: Date | undefined;
  setDate: (d: Date | undefined) => void;
  isDayDisabled: (d: Date) => boolean;
  today: Date;
  maxDate: Date;
  name: string;
  setName: (v: string) => void;
  cpf: string;
  setCpf: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  service: string;
  setService: (v: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const {
    isLoading, date, setDate, isDayDisabled, today, maxDate,
    name, setName, cpf, setCpf, address, setAddress, service, setService,
    onSubmit, submitting,
  } = props;
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
          Atendemos um serviço por dia (jornada de cerca de 8 horas), de segunda a
          sábado. Selecione o melhor dia, preencha seus dados e receba a
          confirmação automática.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[auto_1fr]">
        <Card className="p-4">
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
        </Card>

        <Card className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" required minLength={3} maxLength={120}
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome" />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" required inputMode="numeric" value={cpf}
                  onChange={(e) => setCpf(maskCPF(e.target.value))}
                  placeholder="000.000.000-00" maxLength={14} />
              </div>
              <div>
                <Label htmlFor="service">Serviço (opcional)</Label>
                <Input id="service" value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="Ex.: Sofá 3 lugares" maxLength={120} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Endereço completo</Label>
                <Input id="address" required minLength={5} maxLength={300}
                  value={address} onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número, bairro, cidade" />
              </div>
            </div>

            <Button type="submit" disabled={!date || submitting} className="w-full" size="lg">
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
          <Row label="Horário">
            {siteConfig.businessHours} · atendimento de dia inteiro (~8h)
          </Row>
          <Row label="Nome">{confirmation.name}</Row>
          <Row label="CPF">{confirmation.cpf}</Row>
          <Row label="Endereço">{confirmation.address}</Row>
          <Row label="Serviço">{confirmation.service || "Não informado"}</Row>
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
