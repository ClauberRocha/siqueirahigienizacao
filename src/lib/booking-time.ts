// Helpers de tempo para agendamento — São Luís/MA (UTC-3, sem horário de verão).

export const MIN_LEAD_HOURS = 2;

export const SLOT_END_HOUR = {
  morning: 12,
  afternoon: 18,
} as const;

export type BookingSlot = keyof typeof SLOT_END_HOUR;

// Retorna a "agora" no fuso de São Luís/MA (UTC-3), independente do fuso do servidor.
export function nowInSaoLuis(): { dateKey: string; hour: number; minute: number; totalMinutes: number } {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const local = new Date(utcMs - 3 * 3600_000);
  const yyyy = local.getUTCFullYear();
  const mm = String(local.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(local.getUTCDate()).padStart(2, "0");
  return {
    dateKey: `${yyyy}-${mm}-${dd}`,
    hour: local.getUTCHours(),
    minute: local.getUTCMinutes(),
    totalMinutes: local.getUTCHours() * 60 + local.getUTCMinutes(),
  };
}

// Retorna erro em pt-BR quando o slot já passou / está dentro da janela de antecedência mínima.
// Retorna null se está OK.
export function validateSlotLeadTime(
  scheduledDate: string,
  slot: BookingSlot,
): string | null {
  const nowLocal = nowInSaoLuis();
  if (scheduledDate < nowLocal.dateKey) {
    return "Não é possível agendar em datas passadas. Escolha uma data futura.";
  }
  if (scheduledDate !== nowLocal.dateKey) return null;

  const deadlineMinutes = (SLOT_END_HOUR[slot] - MIN_LEAD_HOURS) * 60;
  if (nowLocal.totalMinutes >= SLOT_END_HOUR[slot] * 60) {
    return slot === "morning"
      ? "O turno da manhã já encerrou hoje. Escolha a tarde ou outra data."
      : "O turno da tarde já encerrou hoje. Escolha uma data futura.";
  }
  if (nowLocal.totalMinutes >= deadlineMinutes) {
    const label = slot === "morning" ? "manhã" : "tarde";
    return `Este agendamento requer no mínimo ${MIN_LEAD_HOURS}h de antecedência. O turno da ${label} não aceita mais reservas hoje — escolha outro dia.`;
  }
  return null;
}

// Slots do dia de hoje que já não podem mais ser reservados (por lead time / encerramento).
export function pastOrTooLateSlotsForToday(): Set<BookingSlot> {
  const nowLocal = nowInSaoLuis();
  const out = new Set<BookingSlot>();
  for (const s of ["morning", "afternoon"] as BookingSlot[]) {
    const deadline = (SLOT_END_HOUR[s] - MIN_LEAD_HOURS) * 60;
    if (nowLocal.totalMinutes >= deadline) out.add(s);
  }
  return out;
}
