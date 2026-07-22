
-- 1) Colunas novas
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- 2) Trigger para manter updated_at
CREATE OR REPLACE FUNCTION public.set_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_appointments_updated_at ON public.appointments;
CREATE TRIGGER trg_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.set_appointments_updated_at();

-- 3) Constraint anti double-booking: um agendamento ATIVO por (data, turno)
DROP INDEX IF EXISTS public.uniq_appointments_slot_active;
CREATE UNIQUE INDEX uniq_appointments_slot_active
  ON public.appointments (scheduled_date, time_slot)
  WHERE status <> 'cancelled';
