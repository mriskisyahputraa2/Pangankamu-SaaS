-- Migration 7: Create notifications table
-- Notifikasi per toko: low stock alert, order masuk, dll

CREATE TYPE public.notification_type AS ENUM ('low_stock', 'new_order', 'order_paid', 'order_expired', 'system');

CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id    UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  type        public.notification_type NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  metadata    JSONB DEFAULT NULL,  -- data tambahan (misal: product_id untuk low stock)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX idx_notifications_store_id ON public.notifications(store_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_type ON public.notifications(type);

COMMENT ON TABLE public.notifications IS 'Notifikasi per toko: low stock, new order, payment, dll.';
COMMENT ON COLUMN public.notifications.metadata IS 'Data konteks tambahan dalam format JSON. Contoh: {"product_id": "xxx", "stock": 2}';
