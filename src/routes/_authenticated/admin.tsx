import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { siteConfig } from "@/lib/site-config";
import { toWhatsappNumber, formatBrPhoneDisplay } from "@/lib/phone";
import { getAdminSettings, updateOwnerWhatsapp } from "@/lib/settings.functions";
import {
  getIsAdmin,
  listAppointments,
  updateAppointmentStatus,
  updateAppointment,
  rescheduleAppointment,
  cancelAppointment,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: `Painel do proprietário — ${siteConfig.brandName}` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type StatusKey = "pending" | "confirmed" | "in_progress" | "done" | "cancelled";

const STATUS_LABELS: Record<StatusKey, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  in_progress: "Em andamento",
  done: "Concluído",
  cancelled: "Cancelado",
};

const SLOT_LABEL: Record<string, string> = {
  morning: "Manhã (08–12h)",
  afternoon: "Tarde (13–18h)",
};

type Appointment = {
  id: string;
  scheduled_date: string;
  time_slot: string;
  customer_name: string;
  customer_cpf: string;
  customer_phone: string;
  customer_address: string;
  service: string | null;
  status: string;
  created_at: string;
};

function digitsOnly(s: string) {
  return (s ?? "").replace(/\D/g, "");
}

function maskPhone(v: string): string {
  const d = digitsOnly(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const PAGE_SIZE = 20;
type SortKey = "scheduled_date" | "created_at";
type SortDir = "asc" | "desc";

function AdminPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const fetchIsAdmin = useServerFn(getIsAdmin);
  const fetchSettings = useServerFn(getAdminSettings);
  const saveWhatsapp = useServerFn(updateOwnerWhatsapp);
  const fetchAppointments = useServerFn(listAppointments);
  const setStatus = useServerFn(updateAppointmentStatus);
  const saveAppointment = useServerFn(updateAppointment);
  const rescheduleFn = useServerFn(rescheduleAppointment);
  const cancelFn = useServerFn(cancelAppointment);

  const isAdminQ = useQuery({ queryKey: ["is-admin"], queryFn: () => fetchIsAdmin() });
  const isAdmin = isAdminQ.data?.isAdmin ?? false;

  const settingsQ = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => fetchSettings(),
    enabled: isAdmin,
  });
  const appointmentsQ = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: () => fetchAppointments(),
    enabled: isAdmin,
  });

  const [phone, setPhone] = useState("");
  useEffect(() => {
    if (settingsQ.data?.owner_whatsapp) setPhone(settingsQ.data.owner_whatsapp);
  }, [settingsQ.data?.owner_whatsapp]);

  const phoneValid = useMemo(() => !!toWhatsappNumber(phone), [phone]);

  // ---------- Filtros / ordenação / paginação ----------
  const [search, setSearch] = useState("");
  const [slotFilter, setSlotFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("scheduled_date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  // Modal de detalhes
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [editForm, setEditForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    service: "",
    status: "pending" as StatusKey,
  });

  // Modal de reagendamento
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    scheduled_date: "",
    time_slot: "morning" as "morning" | "afternoon",
  });

  // Confirmação de cancelamento
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);

  const apps = (appointmentsQ.data ?? []) as Appointment[];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const qDigits = digitsOnly(search);
    const from = dateFrom || null;
    const to = dateTo || null;
    const result = apps.filter((a) => {
      if (slotFilter !== "all" && a.time_slot !== slotFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (from && a.scheduled_date < from) return false;
      if (to && a.scheduled_date > to) return false;
      if (q) {
        const nameMatch = (a.customer_name ?? "").toLowerCase().includes(q);
        const cpfMatch = qDigits.length > 0 && digitsOnly(a.customer_cpf).includes(qDigits);
        const phoneMatch =
          qDigits.length > 0 && digitsOnly(a.customer_phone ?? "").includes(qDigits);
        if (!nameMatch && !cpfMatch && !phoneMatch) return false;
      }
      return true;
    });
    const sorted = [...result].sort((a, b) => {
      const va = String(a[sortKey] ?? "");
      const vb = String(b[sortKey] ?? "");
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [apps, search, slotFilter, statusFilter, dateFrom, dateTo, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  // Reset página ao mudar filtros/ordem
  useEffect(() => {
    setPage(1);
  }, [search, slotFilter, statusFilter, dateFrom, dateTo, sortKey, sortDir]);

  const saveMut = useMutation({
    mutationFn: () => saveWhatsapp({ data: { owner_whatsapp: phone } }),
    onSuccess: (res) => {
      toast.success("WhatsApp atualizado", {
        description: formatBrPhoneDisplay(res.owner_whatsapp),
      });
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
      qc.invalidateQueries({ queryKey: ["public-settings"] });
    },
    onError: (e: Error) => toast.error("Não foi possível salvar", { description: e.message }),
  });

  const statusMut = useMutation({
    mutationFn: (v: { id: string; status: StatusKey }) => setStatus({ data: v }),
    onSuccess: () => {
      toast.success("Status atualizado");
      qc.invalidateQueries({ queryKey: ["admin-appointments"] });
    },
    onError: (e: Error) => toast.error("Falha ao atualizar", { description: e.message }),
  });

  const editMut = useMutation({
    mutationFn: (v: {
      id: string;
      customer_name: string;
      customer_phone: string;
      customer_address: string;
      service: string;
      status: StatusKey;
    }) => saveAppointment({ data: v }),
    onSuccess: () => {
      toast.success("Agendamento atualizado");
      qc.invalidateQueries({ queryKey: ["admin-appointments"] });
      setEditing(null);
    },
    onError: (e: Error) => toast.error("Falha ao salvar", { description: e.message }),
  });

  const rescheduleMut = useMutation({
    mutationFn: (v: { id: string; scheduled_date: string; time_slot: "morning" | "afternoon" }) =>
      rescheduleFn({ data: v }),
    onSuccess: () => {
      toast.success("Agendamento remarcado");
      qc.invalidateQueries({ queryKey: ["admin-appointments"] });
      qc.invalidateQueries({ queryKey: ["booked-slots"] });
      setRescheduling(null);
    },
    onError: (e: Error) => toast.error("Não foi possível remarcar", { description: e.message }),
  });

  const cancelMut = useMutation({
    mutationFn: (id: string) => cancelFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Agendamento cancelado", { description: "Horário liberado na agenda." });
      qc.invalidateQueries({ queryKey: ["admin-appointments"] });
      qc.invalidateQueries({ queryKey: ["booked-slots"] });
      setCancelTarget(null);
      setEditing(null);
    },
    onError: (e: Error) => toast.error("Não foi possível cancelar", { description: e.message }),
  });

  const openEdit = (a: Appointment) => {
    setEditing(a);
    setEditForm({
      customer_name: a.customer_name,
      customer_phone: formatBrPhoneDisplay(a.customer_phone || ""),
      customer_address: a.customer_address,
      service: a.service ?? "",
      status: (a.status as StatusKey) ?? "pending",
    });
  };

  const openReschedule = (a: Appointment) => {
    setRescheduling(a);
    setRescheduleForm({
      scheduled_date: a.scheduled_date,
      time_slot: (a.time_slot === "afternoon" ? "afternoon" : "morning"),
    });
  };


  const editPhoneValid = useMemo(
    () => digitsOnly(editForm.customer_phone).length === 10 || digitsOnly(editForm.customer_phone).length === 11,
    [editForm.customer_phone],
  );

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const exportCsv = () => {
    if (filtered.length === 0) {
      toast.error("Nada para exportar", { description: "Ajuste os filtros e tente novamente." });
      return;
    }
    const header = [
      "Data",
      "Turno",
      "Cliente",
      "Telefone",
      "CPF",
      "Endereço",
      "Serviço",
      "Status",
      "Criado em",
    ];
    const rows = filtered.map((a) => [
      format(new Date(a.scheduled_date + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR }),
      SLOT_LABEL[a.time_slot] ?? a.time_slot,
      a.customer_name ?? "",
      a.customer_phone ?? "",
      a.customer_cpf ?? "",
      a.customer_address ?? "",
      a.service ?? "",
      STATUS_LABELS[a.status as StatusKey] ?? a.status,
      a.created_at ? format(new Date(a.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "",
    ]);
    const stamp = format(new Date(), "yyyy-MM-dd_HHmm");
    downloadCsv(`agendamentos_${stamp}.csv`, [header, ...rows]);
    toast.success(`Exportadas ${filtered.length} linhas em CSV.`);
  };

  if (isAdminQ.isLoading) {
    return <div className="p-10 text-sm text-muted-foreground">Carregando…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <h1 className="text-xl font-bold">Acesso negado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sua conta não tem permissão de administrador.
        </p>
        <Button className="mt-4" variant="outline" onClick={signOut}>
          Sair
        </Button>
      </div>
    );
  }

  const hasAnyFilter =
    !!search || slotFilter !== "all" || statusFilter !== "all" || !!dateFrom || !!dateTo;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <Link to="/" className="text-xs text-muted-foreground hover:underline">
              ← Ir para o site
            </Link>
            <h1 className="mt-1 text-lg font-bold">Painel do proprietário</h1>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Tabs defaultValue="agenda">
          <TabsList>
            <TabsTrigger value="agenda">Agendamentos</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="agenda" className="mt-4">
            <Card className="p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold">
                  Histórico ({filtered.length} de {apps.length}
                  {apps.length === 1 ? " solicitação" : " solicitações"})
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => appointmentsQ.refetch()}
                    disabled={appointmentsQ.isFetching}
                  >
                    Atualizar
                  </Button>
                  <Button size="sm" onClick={exportCsv} disabled={filtered.length === 0}>
                    Exportar CSV
                  </Button>
                </div>
              </div>

              <div className="mb-3 grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                <Input
                  placeholder="Buscar por nome, CPF ou telefone"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Select value={slotFilter} onValueChange={setSlotFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os turnos</SelectItem>
                    <SelectItem value="morning">Manhã (08–12h)</SelectItem>
                    <SelectItem value="afternoon">Tarde (13–18h)</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    {(Object.entries(STATUS_LABELS) as [StatusKey, string][]).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled_date">Ordenar por data</SelectItem>
                      <SelectItem value="created_at">Ordenar por criação</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
                    title={sortDir === "asc" ? "Ascendente" : "Descendente"}
                    aria-label="Alternar direção da ordenação"
                  >
                    {sortDir === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              </div>

              <div className="mb-3 grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                <div>
                  <Label htmlFor="date-from" className="text-xs text-muted-foreground">De</Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    max={dateTo || undefined}
                  />
                </div>
                <div>
                  <Label htmlFor="date-to" className="text-xs text-muted-foreground">Até</Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    min={dateFrom || undefined}
                  />
                </div>
                {hasAnyFilter && (
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearch("");
                        setSlotFilter("all");
                        setStatusFilter("all");
                        setDateFrom("");
                        setDateTo("");
                      }}
                    >
                      Limpar filtros
                    </Button>
                  </div>
                )}
              </div>

              {appointmentsQ.isLoading ? (
                <div className="text-sm text-muted-foreground">Carregando…</div>
              ) : apps.length === 0 ? (
                <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Nenhum agendamento registrado ainda.
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Nenhum resultado para os filtros aplicados.
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                          <th className="py-2 pr-3">Data</th>
                          <th className="py-2 pr-3">Turno</th>
                          <th className="py-2 pr-3">Cliente</th>
                          <th className="py-2 pr-3">Telefone</th>
                          <th className="py-2 pr-3">Serviço</th>
                          <th className="py-2 pr-3">Status</th>
                          <th className="py-2 pr-3">Criado</th>
                          <th className="py-2 pr-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageItems.map((a) => (
                          <tr key={a.id} className="border-b last:border-b-0 align-top">
                            <td className="py-2 pr-3 whitespace-nowrap">
                              {format(new Date(a.scheduled_date + "T00:00:00"), "dd/MM/yyyy", {
                                locale: ptBR,
                              })}
                            </td>
                            <td className="py-2 pr-3 whitespace-nowrap">
                              {SLOT_LABEL[a.time_slot] ?? a.time_slot}
                            </td>
                            <td className="py-2 pr-3">{a.customer_name}</td>
                            <td className="py-2 pr-3 whitespace-nowrap">
                              {a.customer_phone ? formatBrPhoneDisplay(a.customer_phone) : "—"}
                            </td>
                            <td className="py-2 pr-3 max-w-[240px] truncate" title={a.service ?? ""}>
                              {a.service ?? "—"}
                            </td>
                            <td className="py-2 pr-3">
                              <Select
                                value={a.status}
                                onValueChange={(v) =>
                                  statusMut.mutate({ id: a.id, status: v as StatusKey })
                                }
                              >
                                <SelectTrigger className="h-8 w-[150px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {(Object.entries(STATUS_LABELS) as [StatusKey, string][]).map(([k, v]) => (
                                    <SelectItem key={k} value={k}>{v}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-2 pr-3 whitespace-nowrap text-xs text-muted-foreground">
                              {a.created_at
                                ? format(new Date(a.created_at), "dd/MM/yy HH:mm", { locale: ptBR })
                                : "—"}
                            </td>
                            <td className="py-2 pr-3">
                              <div className="flex flex-wrap gap-1">
                                <Button size="sm" variant="outline" onClick={() => openEdit(a)}>
                                  Detalhes
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openReschedule(a)}
                                  disabled={a.status === "cancelled"}
                                >
                                  Reagendar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setCancelTarget(a)}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                    <div className="text-muted-foreground">
                      Página {currentPage} de {totalPages} · exibindo {pageItems.length} de {filtered.length}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                      >
                        Anterior
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                      >
                        Próxima
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="config" className="mt-4">
            <Card className="max-w-xl p-6">
              <div className="mb-3">
                <div className="text-sm font-semibold">WhatsApp do proprietário</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Este número recebe as confirmações de agendamento pelo WhatsApp Web.
                  Use o formato brasileiro com DDD.
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!phoneValid) {
                    toast.error("Número inválido", {
                      description: "Ex.: (98) 98866-0241",
                    });
                    return;
                  }
                  saveMut.mutate();
                }}
                className="space-y-3"
              >
                <div>
                  <Label htmlFor="phone">Número</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(98) 98866-0241"
                    aria-invalid={!phoneValid && phone.length > 0}
                  />
                  <div className="mt-1 text-xs">
                    {phone.length === 0 ? (
                      <span className="text-muted-foreground">Digite o número.</span>
                    ) : phoneValid ? (
                      <span className="text-green-600">
                        ✓ {formatBrPhoneDisplay(phone)} (será salvo como{" "}
                        <code>{toWhatsappNumber(phone)}</code>)
                      </span>
                    ) : (
                      <span className="text-destructive">
                        Formato inválido. Use DDD + número (10 ou 11 dígitos).
                      </span>
                    )}
                  </div>
                </div>
                <Button type="submit" disabled={!phoneValid || saveMut.isPending}>
                  {saveMut.isPending ? "Salvando…" : "Salvar"}
                </Button>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal de detalhes */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do agendamento</DialogTitle>
            {editing && (
              <DialogDescription>
                {format(new Date(editing.scheduled_date + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR })}
                {" · "}
                {SLOT_LABEL[editing.time_slot] ?? editing.time_slot}
                {" · CPF "}
                {editing.customer_cpf}
              </DialogDescription>
            )}
          </DialogHeader>
          {editing && (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!editPhoneValid) {
                  toast.error("Telefone inválido", { description: "Use DDD + número (10 ou 11 dígitos)." });
                  return;
                }
                editMut.mutate({
                  id: editing.id,
                  customer_name: editForm.customer_name,
                  customer_phone: digitsOnly(editForm.customer_phone),
                  customer_address: editForm.customer_address,
                  service: editForm.service,
                  status: editForm.status,
                });
              }}
            >
              <div>
                <Label htmlFor="edit-name">Cliente</Label>
                <Input
                  id="edit-name"
                  value={editForm.customer_name}
                  onChange={(e) => setEditForm((f) => ({ ...f, customer_name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input
                  id="edit-phone"
                  value={editForm.customer_phone}
                  onChange={(e) => setEditForm((f) => ({ ...f, customer_phone: maskPhone(e.target.value) }))}
                  placeholder="(98) 98866-0241"
                  aria-invalid={!editPhoneValid && editForm.customer_phone.length > 0}
                />
                {!editPhoneValid && editForm.customer_phone.length > 0 && (
                  <p className="mt-1 text-xs text-destructive">
                    Telefone inválido. Use DDD + número (10 ou 11 dígitos).
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-address">Endereço</Label>
                <Textarea
                  id="edit-address"
                  rows={2}
                  value={editForm.customer_address}
                  onChange={(e) => setEditForm((f) => ({ ...f, customer_address: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-service">Serviço</Label>
                <Textarea
                  id="edit-service"
                  rows={4}
                  value={editForm.service}
                  onChange={(e) => setEditForm((f) => ({ ...f, service: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(v) => setEditForm((f) => ({ ...f, status: v as StatusKey }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(STATUS_LABELS) as [StatusKey, string][]).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={editMut.isPending || !editPhoneValid}>
                  {editMut.isPending ? "Salvando…" : "Salvar alterações"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
