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
        content:
          "Veja as datas livres e agende sua higienização em poucos cliques.",
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

function AgendarPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const fetchBooked = useServerFn(getBookedDates);
  const submitBooking = useServerFn(createAppointment);

  const { data: booked = [], isLoading } = useQuery({
    queryKey: ["booked-dates"],
    queryFn: () => fetchBooked(),
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
      toast.success("Agendamento confirmado!", {
        description: `Sua visita está marcada para ${dateLabel}. Abrindo o WhatsApp para enviar os dados ao responsável…`,
      });
      qc.invalidateQueries({ queryKey: ["booked-dates"] });

      const msg =
        `*Novo agendamento — ${siteConfig.brandName}*\n\n` +
        `📅 Data: ${dateLabel}\n` +
        `⏰ Horário: ${siteConfig.businessHours} (atendimento de dia inteiro, ~8h)\n` +
        `👤 Nome: ${name}\n` +
        `🪪 CPF: ${cpf}\n` +
        `📍 Endereço: ${address}\n` +
        `🧼 Serviço: ${service || "Não informado"}`;
      const waUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(msg)}`;

      setName("");
      setCpf("");
      setAddress("");
      setService("");
      setDate(undefined);
      router.invalidate();

      if (typeof window !== "undefined") {
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }
    },
    onError: (err: Error) => {
      toast.error("Não foi possível agendar", { description: err.message });
    },
  });

  const isDayDisabled = (d: Date) => {
    if (d < today) return true;
    if (d > maxDate) return true;
    if (d.getDay() === 0) return true; // domingos
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
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Agendamento online
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Escolha uma data disponível
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Atendemos um serviço por dia (jornada de cerca de 8 horas), de
            segunda a sábado. Selecione o melhor dia, preencha seus dados e
            receba a confirmação automática.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[auto_1fr]">
          <Card className="p-4">
            <div className="mb-3 text-sm font-semibold">Datas disponíveis</div>
            {isLoading ? (
              <div className="p-6 text-sm text-muted-foreground">
                Carregando agenda…
              </div>
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
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                Disponível
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground/40" />
                Indisponível
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate();
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
                  <Input
                    id="name"
                    required
                    minLength={3}
                    maxLength={120}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    required
                    inputMode="numeric"
                    value={cpf}
                    onChange={(e) => setCpf(maskCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>
                <div>
                  <Label htmlFor="service">Serviço (opcional)</Label>
                  <Input
                    id="service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    placeholder="Ex.: Sofá 3 lugares"
                    maxLength={120}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Endereço completo</Label>
                  <Input
                    id="address"
                    required
                    minLength={5}
                    maxLength={300}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, número, bairro, cidade"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={!date || mutation.isPending}
                className="w-full"
                size="lg"
              >
                {mutation.isPending ? "Confirmando…" : "Confirmar agendamento"}
              </Button>

              <p className="text-xs text-muted-foreground">
                Ao confirmar, você concorda em receber contato pelo telefone/WhatsApp
                para detalhes do atendimento.
              </p>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
