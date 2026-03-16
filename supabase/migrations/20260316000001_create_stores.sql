-- Migration 1: Create stores table
-- Toko milik vendor, berelasi ke auth.users dengan CASCADE DELETE

CREATE TABLE public.stores (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ DEFAULT NULL  -- soft delete
);

-- Index untuk query berdasarkan owner
CREATE INDEX idx_stores_owner_id ON public.stores(owner_id);
CREATE INDEX idx_stores_slug ON public.stores(slug);
CREATE INDEX idx_stores_deleted_at ON public.stores(deleted_at);

-- Comment
COMMENT ON TABLE public.stores IS 'Toko milik vendor. Dihapus otomatis jika user dihapus (CASCADE).';
COMMENT ON COLUMN public.stores.deleted_at IS 'Soft delete: NULL = aktif, diisi = sudah dihapus';
