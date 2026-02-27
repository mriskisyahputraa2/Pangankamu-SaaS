"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { Store, Loader2, ArrowRight, LayoutGrid } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function SetupTokoPage() {
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = storeName.toLowerCase().replace(/\s+/g, "-");

      // Mengirim ke endpoint backend yang baru kita buat [cite: 176, 177]
      const res = await api.post("/auth/setup-store", {
        store_name: storeName,
        slug,
      });

      if (res.data.status === "success") {
        toast.success("Ruko Digital Siap!");

        // Simpan data user terbaru (yang sudah punya store_id) ke localStorage
        localStorage.setItem("user", JSON.stringify(res.data.data));

        // PENTING: Refresh session di Supabase untuk sync metadata
        console.log("🔄 Refreshing Supabase session after setup...");
        try {
          const { data: refreshData, error: refreshError } =
            await supabase.auth.refreshSession();
          if (refreshError) {
            console.error("❌ Session refresh error:", refreshError);
          } else {
            console.log("✅ Session refreshed successfully");
          }
        } catch (refreshErr) {
          console.error("❌ Session refresh failed:", refreshErr);
        }

        setTimeout(() => {
          console.log("🚀 Redirecting to dashboard after setup");
          // Force reload untuk trigger AuthGuard check
          window.location.href = "/"; // Redirect ke dashboard utama
        }, 1500); // Kurangi delay
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-jakarta">
      <Toaster position="top-center" richColors />
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-1.5 bg-emerald-600 rounded-lg">
              <LayoutGrid size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              PanganKU
            </span>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 mb-6">
            <Store size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Setup Toko
          </h1>
          <p className="text-slate-500 mt-3 font-medium text-sm">
            Selamat datang, Riski! Berikan nama untuk ruko digital SaaS kamu.
            [cite: 4, 7]
          </p>
        </div>

        <form onSubmit={handleSetup} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">
              Nama Toko / UMKM Pangan
            </label>
            <input
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
              placeholder="Contoh: Berkah Pangan Makmur"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Buka Toko Sekarang <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
