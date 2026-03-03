"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import {
  Store,
  Loader2,
  ArrowRight,
  LayoutGrid,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { authService } from "@/features/auth";

export default function SetupTokoPage() {
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = storeName.toLowerCase().replace(/\s+/g, "-");

      // 1. Kirim ke backend (Controller-Service-Repository flow)
      const res = await api.post("/auth/setup-store", {
        store_name: storeName,
        slug,
      });

      if (res.data.status === "success") {
        toast.success("Ruko Digital Berhasil Dibuat!");

        // 2. Refresh session untuk mengunci store_id ke metadata
        await authService.refreshAndGetSession();

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6 font-jakarta relative overflow-hidden">
      <Toaster position="top-center" richColors />

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />

      <div className="max-w-4xl w-full grid lg:grid-cols-2 bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 border border-white relative z-10 overflow-hidden">
        {/* Sisi Kiri: Branding & Preview */}
        <div className="bg-emerald-600 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,transparent_100%)]" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                <LayoutGrid size={24} className="text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">
                PanganKU
              </span>
            </div>

            <h2 className="text-4xl font-extrabold leading-tight mb-6">
              Satu langkah lagi menuju{" "}
              <span className="text-emerald-200">Digitalisasi.</span>
            </h2>

            <ul className="space-y-4">
              {[
                "Manajemen stok real-time",
                "Laporan profit otomatis",
                "Integrasi WhatsApp & Midtrans",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-emerald-50 font-medium"
                >
                  <CheckCircle2 size={18} className="text-emerald-300" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Live Preview Card */}
          <div className="relative z-10 mt-12 p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200 font-bold mb-3">
              Live Preview Toko
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600">
                <Store size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg truncate max-w-[180px]">
                  {storeName || "Nama Toko Anda"}
                </h3>
                <p className="text-xs text-emerald-100 italic">
                  pangankamu.com/
                  {storeName.toLowerCase().replace(/\s+/g, "-") || "slug-toko"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Form Input */}
        <div className="p-10 lg:p-14 flex flex-col justify-center">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold mb-4">
              <Sparkles size={14} /> SaaS Onboarding
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Identitas Bisnis
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Nama ini akan tampil di katalog publik dan struk belanja pelanggan
              Anda.
            </p>
          </div>

          <form onSubmit={handleSetup} className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-end px-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Nama Toko Pangan
                </label>
                <span
                  className={`text-[10px] font-bold ${storeName.length > 20 ? "text-orange-500" : "text-slate-400"}`}
                >
                  {storeName.length}/30
                </span>
              </div>
              <div className="relative group">
                <input
                  required
                  maxLength={30}
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[20px] focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-900 text-lg placeholder:text-slate-300"
                  placeholder="Contoh: Berkah Sayur Jaya"
                />
                <Store
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"
                  size={24}
                />
              </div>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              <p className="text-[11px] text-blue-600 font-medium leading-relaxed">
                <strong>Tips:</strong> Gunakan nama yang mudah diingat agar
                pelanggan Anda bisa mencari ruko digital Anda dengan mudah.
              </p>
            </div>

            <button
              disabled={loading || storeName.length < 3}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white py-5 rounded-[20px] font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 transition-all active:scale-95 transition-all"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Aktifkan Ruko Digital <ArrowRight size={22} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
