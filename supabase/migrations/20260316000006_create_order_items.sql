-- Migration 6: Create order_items table
-- Detail item pesanan dengan snapshot harga saat transaksi (Historical Data Capture)

CREATE TABLE public.order_items (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id            UUID REFERENCES public.products(id) ON DELETE SET NULL,  -- produk bisa dihapus, item tetap ada
  product_name          TEXT NOT NULL,           -- snapshot nama produk saat transaksi
  price_base_snapshot   NUMERIC(12, 2) NOT NULL, -- snapshot harga modal saat transaksi
  price_sell_snapshot   NUMERIC(12, 2) NOT NULL, -- snapshot harga jual saat transaksi
  quantity              INTEGER NOT NULL DEFAULT 1,
  subtotal              NUMERIC(12, 2) NOT NULL, -- price_sell_snapshot * quantity
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

COMMENT ON TABLE public.order_items IS 'Item detail pesanan. Harga di-snapshot saat transaksi agar laporan akurat meski harga berubah.';
COMMENT ON COLUMN public.order_items.price_base_snapshot IS 'Snapshot harga modal saat transaksi. Tidak berubah meski harga produk diupdate.';
COMMENT ON COLUMN public.order_items.price_sell_snapshot IS 'Snapshot harga jual saat transaksi. Dasar perhitungan profit historis.';
COMMENT ON COLUMN public.order_items.product_name IS 'Snapshot nama produk saat transaksi. Tetap ada meski produk dihapus.';
