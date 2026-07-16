
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS customer_phone TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS time_slot TEXT NOT NULL DEFAULT 'morning';

ALTER TABLE public.appointments
  DROP CONSTRAINT IF EXISTS appointments_scheduled_date_key;

ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_time_slot_check CHECK (time_slot IN ('morning','afternoon'));

CREATE UNIQUE INDEX IF NOT EXISTS appointments_date_slot_unique
  ON public.appointments (scheduled_date, time_slot);
