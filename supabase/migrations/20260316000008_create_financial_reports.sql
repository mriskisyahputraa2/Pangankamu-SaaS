-- Migration 8: Create financial_reports table
-- Snapshot laporan keuangan harian per toko untuk dashboard finansial

CREATE TABLE public.financial_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id        UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  report_date     DATE NOT NULL,          -- tanggal laporan (1 row per hari per toko)
  total_revenue   NUMERIC(12, 2) NOT NULL DEFAULT 0,  -- total omzet (sum price_sell)
  total_hpp       NUMERIC(12, 2) NOT NULL DEFAULT 0,  -- total harga modal (sum price_base)
  total_profit    NUMERIC(12, 2) NOT NULL DEFAULT 0,  -- profit bersih (revenue - hpp)
  total_orders    INTEGER NOT NULL DEFAULT 0,          -- jumlah pesanan lunas
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Pastikan hanya ada 1 laporan per hari per toko
  UNIQUE(store_id, report_date)
);

-- Index
CREATE INDEX idx_financial_reports_store_id ON public.financial_reports(store_id);
CREATE INDEX idx_financial_reports_date ON public.financial_reports(report_date);

COMMENT ON TABLE public.financial_reports IS 'Snapshot harian laporan keuangan per toko. Di-generate otomatis agar grafik dashboard cepat tanpa query berat.';
COMMENT ON COLUMN public.financial_reports.total_profit IS 'Profit bersih = total_revenue - total_hpp';
