-- Migration 9: Create ai_predictions table
-- Hasil prediksi stok dari AI Engine (Python + Prophet Forecasting)

CREATE TABLE public.ai_predictions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id        UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id      UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name    TEXT NOT NULL,            -- snapshot nama produk saat prediksi dilakukan
  predicted_date  DATE NOT NULL,            -- tanggal kapan prediksi berlaku
  predicted_qty   NUMERIC(10, 2) NOT NULL,  -- prediksi jumlah kebutuhan stok
  confidence      NUMERIC(5, 2) DEFAULT NULL, -- tingkat kepercayaan prediksi (0-100%)
  generated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX idx_ai_predictions_store_id ON public.ai_predictions(store_id);
CREATE INDEX idx_ai_predictions_product_id ON public.ai_predictions(product_id);
CREATE INDEX idx_ai_predictions_date ON public.ai_predictions(predicted_date);

COMMENT ON TABLE public.ai_predictions IS 'Hasil prediksi kebutuhan stok dari AI Engine (Python Prophet). Digunakan untuk fitur AI Insights di dashboard vendor.';
COMMENT ON COLUMN public.ai_predictions.confidence IS 'Tingkat kepercayaan model prediksi dalam persen (0-100).';
