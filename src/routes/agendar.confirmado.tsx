import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { formatBrPhoneDisplay } from "@/lib/phone";
import {
  SLOT_LABELS,
  buildWhatsappMessage,
  loadConfirmation,
  loadLastConfirmation,
  type Confirmation,
} from "@/lib/booking-confirmation";

type Search = { id?: string };

export const Route = createFileRoute("/agendar/confirmado")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    id: typeof raw.id === "string" ? raw.id : undefined,
  }),
  head: () => ({
    meta: [
      { title: `Agendamento confirmado — ${siteConfig.brandName}` },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content:
          "Confirmação do seu agendamento com resumo dos dados e envio pelo WhatsApp.",
      },
    ],
  }),
  component: ConfirmadoPage,
});

function ConfirmadoPage() {
  const { id } = Route.useSearch();
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const c = id ? loadConfirmation(id) : loadLastConfirmation();
    setConfirmation(c);
    setReady(true);
  }, [id]);

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
        {!ready ? (
          <div className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
            Carregando…
          </div>
        ) : confirmation ? (
          <ConfirmationPanel confirmation={confirmation} />
        ) : (
          <NoConfirmation />
        )}
      </main>
    </div>
  );
}

function NoConfirmation() {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl">
        🔍
      </div>
      <h1 className="mt-3 text-xl font-bold">
        Não encontramos os dados deste agendamento
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A confirmação fica guardada temporariamente no seu navegador. Se você
        limpou os dados ou abriu em outro dispositivo, faça um novo pedido —
        seu agendamento anterior segue registrado no nosso sistema.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Button asChild>
          <Link to="/agendar">Novo agendamento</Link>
        </Button>
        <Button asChild variant="outline">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            Falar no WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}

function ConfirmationPanel({ confirmation }: { confirmation: Confirmation }) {
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
          Envie os dados abaixo pelo WhatsApp para o proprietário
          ({formatBrPhoneDisplay(confirmation.ownerWhatsapp)}) — leva 1 clique.
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
          <Button asChild variant="ghost">
            <Link to="/agendar">Fazer novo agendamento</Link>
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
