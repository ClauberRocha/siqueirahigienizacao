// Tipos, mensagens de WhatsApp e persistência local do agendamento confirmado.
// Compartilhado entre /agendar e /agendar/confirmado, e reaproveitado pelo
// painel do proprietário para gerar as mensagens de cancelamento/remarcação
// enviadas ao cliente.

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { siteConfig } from "./site-config";
import type { BookingSlot } from "./booking-time";

export type TimeSlot = BookingSlot;

export const SLOT_LABELS: Record<TimeSlot, string> = {
  morning: "Manhã (08h – 12h)",
  afternoon: "Tarde (13h – 18h)",
};

export const SLOT_PERIOD: Record<TimeSlot, string> = {
  morning: "Manhã",
  afternoon: "Tarde",
};

export const SLOT_WINDOW: Record<TimeSlot, string> = {
  morning: "08h às 12h",
  afternoon: "13h às 18h",
};

export type Confirmation = {
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

const STORAGE_PREFIX = "siqueira:confirmation:";

export function saveConfirmation(c: Confirmation) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_PREFIX + c.id, JSON.stringify(c));
    // Fallback: também salva o último protocolo para acesso rápido.
    sessionStorage.setItem(STORAGE_PREFIX + "last", c.id);
  } catch {
    // ignora quotas / navegação privada
  }
}

export function loadConfirmation(id: string): Confirmation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + id);
    if (!raw) return null;
    return JSON.parse(raw) as Confirmation;
  } catch {
    return null;
  }
}

export function loadLastConfirmation(): Confirmation | null {
  if (typeof window === "undefined") return null;
  const last = sessionStorage.getItem(STORAGE_PREFIX + "last");
  return last ? loadConfirmation(last) : null;
}

export function buildWhatsappMessage(c: Confirmation) {
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

function dateLabelFromKey(dateKey: string) {
  return format(new Date(dateKey + "T00:00:00"), "PPPP", { locale: ptBR });
}

export function buildClientCancellationMessage(input: {
  name: string;
  scheduledDate: string;
  slot: TimeSlot;
  reason?: string;
}) {
  const lines = [
    `Olá, ${input.name.split(" ")[0] || input.name}! Aqui é da ${siteConfig.brandName}.`,
    ``,
    `Precisamos *cancelar* o seu agendamento:`,
    `📅 ${dateLabelFromKey(input.scheduledDate)}`,
    `🕒 ${SLOT_PERIOD[input.slot]} (${SLOT_WINDOW[input.slot]})`,
  ];
  if (input.reason && input.reason.trim()) {
    lines.push(``, `Motivo: ${input.reason.trim()}`);
  }
  lines.push(
    ``,
    `Se quiser reagendar, é só responder esta mensagem que já organizamos uma nova data. 💙`,
  );
  return lines.join("\n");
}

export function buildClientRescheduleMessage(input: {
  name: string;
  previousDate: string;
  previousSlot: TimeSlot;
  newDate: string;
  newSlot: TimeSlot;
}) {
  const lines = [
    `Olá, ${input.name.split(" ")[0] || input.name}! Aqui é da ${siteConfig.brandName}.`,
    ``,
    `Seu agendamento foi *remarcado*:`,
    `De: ${dateLabelFromKey(input.previousDate)} · ${SLOT_PERIOD[input.previousSlot]} (${SLOT_WINDOW[input.previousSlot]})`,
    `Para: *${dateLabelFromKey(input.newDate)}* · *${SLOT_PERIOD[input.newSlot]}* (${SLOT_WINDOW[input.newSlot]})`,
    ``,
    `Qualquer coisa é só responder aqui. Até já! 💙`,
  ];
  return lines.join("\n");
}
