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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { siteConfig } from "@/lib/site-config";
import { toWhatsappNumber, formatBrPhoneDisplay } from "@/lib/phone";
import { getAdminSettings, updateOwnerWhatsapp } from "@/lib/settings.functions";
import {
  getIsAdmin,
  listAppointments,
  updateAppointmentStatus,
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

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmado",
  in_progress: "Em andamento",
  done: "Concluído",
  cancelled: "Cancelado",
};

function AdminPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const fetchIsAdmin = useServerFn(getIsAdmin);
  const fetchSettings = useServerFn(getAdminSettings);
  const saveWhatsapp = useServerFn(updateOwnerWhatsapp);
  const fetchAppointments = useServerFn(listAppointments);
  const setStatus = useServerFn(updateAppointmentStatus);

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
    mutationFn: (v: { id: string; status: "confirmed" | "in_progress" | "done" | "cancelled" }) =>
      setStatus({ data: v }),
    onSuccess: () => {
      toast.success("Status atualizado");
      qc.invalidateQueries({ queryKey: ["admin-appointments"] });
    },
    onError: (e: Error) => toast.error("Falha ao atualizar", { description: e.message }),
  });

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
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

  const apps = appointmentsQ.data ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
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

      <main className="mx-auto max-w-5xl px-6 py-8">
        <Tabs defaultValue="agenda">
          <TabsList>
            <TabsTrigger value="agenda">Agendamentos</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="agenda" className="mt-4">
            <Card className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold">
                  Histórico ({apps.length} {apps.length === 1 ? "solicitação" : "solicitações"})
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => appointmentsQ.refetch()}
                  disabled={appointmentsQ.isFetching}
                >
                  Atualizar
                </Button>
              </div>
              {appointmentsQ.isLoading ? (
                <div className="text-sm text-muted-foreground">Carregando…</div>
              ) : apps.length === 0 ? (
                <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Nenhum agendamento registrado ainda.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="py-2 pr-3">Data</th>
                        <th className="py-2 pr-3">Cliente</th>
                        <th className="py-2 pr-3">Serviço</th>
                        <th className="py-2 pr-3">Endereço</th>
                        <th className="py-2 pr-3">CPF</th>
                        <th className="py-2 pr-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apps.map((a) => (
                        <tr key={a.id} className="border-b last:border-b-0 align-top">
                          <td className="py-2 pr-3 whitespace-nowrap">
                            {format(new Date(a.scheduled_date + "T00:00:00"), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </td>
                          <td className="py-2 pr-3">{a.customer_name}</td>
                          <td className="py-2 pr-3">{a.service ?? "—"}</td>
                          <td className="py-2 pr-3 max-w-[260px]">{a.customer_address}</td>
                          <td className="py-2 pr-3 whitespace-nowrap">{a.customer_cpf}</td>
                          <td className="py-2 pr-3">
                            <Select
                              value={a.status}
                              onValueChange={(v) =>
                                statusMut.mutate({ id: a.id, status: v as any })
                              }
                            >
                              <SelectTrigger className="h-8 w-[150px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                                  <SelectItem key={k} value={k}>
                                    {v}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
    </div>
  );
}
