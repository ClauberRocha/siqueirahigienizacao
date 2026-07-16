CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_date date NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_cpf text NOT NULL,
  customer_address text NOT NULL,
  service text,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.appointments TO service_role;

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- No public policies: all reads/writes go through trusted server functions using the service role.
CREATE INDEX appointments_scheduled_date_idx ON public.appointments (scheduled_date);