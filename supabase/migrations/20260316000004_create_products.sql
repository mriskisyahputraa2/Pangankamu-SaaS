-- Migration 4: Create products table
-- Produk per toko dengan harga modal & jual untuk laporan keuangan

CREATE TABLE public.products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id      UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  category_id   UUID REFERENCES public.categories(id) ON DELETE SET NULL,  -- kategori dihapus, produk tetap ada
  name          TEXT NOT NULL,
  price_base    NUMERIC(12, 2) NOT NULL DEFAULT 0,   -- harga modal (HPP)
  price_sell    NUMERIC(12, 2) NOT NULL,              -- harga jual
  stock         INTEGER NOT NULL DEFAULT 0,
  unit          TEXT NOT NULL DEFAULT 'pcs',          -- satuan: pcs, kg, liter, dll
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ DEFAULT NULL  -- soft delete
);

-- Index
CREATE INDEX idx_products_store_id ON public.products(store_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_deleted_at ON public.products(deleted_at);

COMMENT ON TABLE public.products IS 'Produk per toko. Soft delete tersedia untuk menjaga histori laporan.';
COMMENT ON COLUMN public.products.price_base IS 'Harga modal/HPP — digunakan untuk hitung profit';
COMMENT ON COLUMN public.products.price_sell IS 'Harga jual ke customer';
