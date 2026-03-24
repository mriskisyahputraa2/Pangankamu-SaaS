-- Migration 11: Supabase RPC Functions untuk manajemen stok pesanan
-- Fungsi ini dipanggil dari orderRepository untuk atomically update stok

-- RPC: Kurangi stok produk (dipanggil saat order dibuat / soft-booking)
CREATE OR REPLACE FUNCTION decrease_product_stock(
  p_product_id UUID,
  p_store_id   UUID,
  p_qty        INTEGER
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.products
  SET
    stock      = stock - p_qty,
    updated_at = NOW()
  WHERE
    id         = p_product_id
    AND store_id = p_store_id
    AND stock  >= p_qty       -- pastikan stok cukup sebelum dikurangi
    AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Stok tidak cukup atau produk tidak ditemukan';
  END IF;
END;
$$;

-- RPC: Kembalikan stok produk (dipanggil saat order dibatalkan / expired)
CREATE OR REPLACE FUNCTION restore_product_stock(
  p_product_id UUID,
  p_store_id   UUID,
  p_qty        INTEGER
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.products
  SET
    stock      = stock + p_qty,
    updated_at = NOW()
  WHERE
    id         = p_product_id
    AND store_id = p_store_id
    AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Produk tidak ditemukan';
  END IF;
END;
$$;
