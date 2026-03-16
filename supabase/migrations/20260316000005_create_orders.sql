-- Migration 5: Create orders table
-- Pesanan customer dengan sistem soft-booking 30 menit

CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'cancelled', 'expired');

CREATE TABLE public.orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id        UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,             -- nomor WhatsApp customer
  total_amount    NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status          public.order_status NOT NULL DEFAULT 'pending',
  payment_method  TEXT DEFAULT NULL,         -- 'qris', 'bank_transfer', 'gopay', dll
  payment_token   TEXT DEFAULT NULL,         -- token dari Midtrans
  expires_at      TIMESTAMPTZ DEFAULT NULL,  -- soft-booking: kadaluarsa 30 menit dari created_at
  paid_at         TIMESTAMPTZ DEFAULT NULL,  -- timestamp saat pesanan lunas
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ DEFAULT NULL   -- soft delete (data transaksi tidak boleh hilang)
);

-- Index
CREATE INDEX idx_orders_store_id ON public.orders(store_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_expires_at ON public.orders(expires_at);
CREATE INDEX idx_orders_deleted_at ON public.orders(deleted_at);

COMMENT ON TABLE public.orders IS 'Pesanan customer. Soft-booking: stok dikunci 30 menit (expires_at). Auto-rollback jika expired.';
COMMENT ON COLUMN public.orders.expires_at IS 'Soft-booking deadline. Jika melewati waktu ini dan status masih pending, stok otomatis dikembalikan.';
COMMENT ON COLUMN public.orders.payment_token IS 'Token transaksi dari Midtrans untuk tracking pembayaran.';
