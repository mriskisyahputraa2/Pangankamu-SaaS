-- Migration 3: Create categories table
-- Kategori produk per toko, dihapus otomatis jika toko dihapus

CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id    UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ DEFAULT NULL,  -- soft delete

  -- Nama kategori unik per toko (bukan global)
  UNIQUE(store_id, name)
);

-- Index
CREATE INDEX idx_categories_store_id ON public.categories(store_id);
CREATE INDEX idx_categories_deleted_at ON public.categories(deleted_at);

COMMENT ON TABLE public.categories IS 'Kategori produk per toko. Soft delete tersedia.';
