-- Migration 2: Create subscriptions table
-- Paket langganan vendor (Free, Pro, Enterprise)

CREATE TYPE public.subscription_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE public.subscription_status AS ENUM ('active', 'inactive', 'expired', 'cancelled');

CREATE TABLE public.subscriptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id    UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  plan        public.subscription_plan NOT NULL DEFAULT 'free',
  status      public.subscription_status NOT NULL DEFAULT 'active',
  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ DEFAULT NULL,  -- NULL = free plan (tidak expire)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX idx_subscriptions_store_id ON public.subscriptions(store_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

COMMENT ON TABLE public.subscriptions IS 'Paket langganan SaaS per toko: Free, Pro, Enterprise';
