-- Migration 10: Create system_logs table
-- Log teknis untuk Super-Admin: error, payment log, AI Engine status

CREATE TYPE public.log_level AS ENUM ('info', 'warning', 'error', 'critical');
CREATE TYPE public.log_source AS ENUM ('api_gateway', 'ai_engine', 'midtrans', 'whatsapp', 'system');

CREATE TABLE public.system_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id    UUID REFERENCES public.stores(id) ON DELETE SET NULL, -- NULL = log level sistem (bukan per toko)
  level       public.log_level NOT NULL DEFAULT 'info',
  source      public.log_source NOT NULL DEFAULT 'system',
  message     TEXT NOT NULL,
  metadata    JSONB DEFAULT NULL,   -- detail teknis (stack trace, request payload, dll)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX idx_system_logs_level ON public.system_logs(level);
CREATE INDEX idx_system_logs_source ON public.system_logs(source);
CREATE INDEX idx_system_logs_store_id ON public.system_logs(store_id);
CREATE INDEX idx_system_logs_created_at ON public.system_logs(created_at DESC);

COMMENT ON TABLE public.system_logs IS 'Black box log untuk Super-Admin. Mencatat error API, log Midtrans, status AI Engine, dan aktivitas sistem.';
COMMENT ON COLUMN public.system_logs.store_id IS 'NULL = log level platform (bukan per toko). Diisi = log terkait toko tertentu.';
COMMENT ON COLUMN public.system_logs.metadata IS 'Detail teknis dalam JSON: stack trace, request body, response, dll.';
