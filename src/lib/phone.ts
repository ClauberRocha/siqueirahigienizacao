// Utilitários de telefone brasileiro (formato WhatsApp E.164 sem sinal de +).
export function normalizeBrPhone(input: string): string {
  return (input ?? "").replace(/\D/g, "");
}

// Aceita: 5598988660241 (13 dígitos com celular), 559898660241 (12 dígitos com fixo),
// ou entrada sem código do país (10-11 dígitos DDD+número) — normaliza adicionando 55.
export function toWhatsappNumber(input: string): string | null {
  const digits = normalizeBrPhone(input);
  let n = digits;
  if (n.length === 10 || n.length === 11) n = "55" + n;
  // Precisa começar com 55 (Brasil) e ter DDD válido (2 dígitos após 55) + 8 ou 9 dígitos.
  if (!/^55\d{10,11}$/.test(n)) return null;
  const ddd = Number(n.slice(2, 4));
  if (ddd < 11 || ddd > 99) return null;
  return n;
}

export function formatBrPhoneDisplay(input: string): string {
  const n = toWhatsappNumber(input);
  if (!n) return input;
  const ddd = n.slice(2, 4);
  const rest = n.slice(4);
  if (rest.length === 9) return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
  return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
}
