"use client";

import { Chrome } from "lucide-react";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // Memanggil route backend Hono kamu
    window.location.href = "http://localhost:3000/auth/login-google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-emerald-600">P</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Selamat Datang</h1>
          <p className="text-slate-500 mt-2">
            Kelola stok pangan kamu dengan mudah
          </p>
        </div>

        {/* Tombol Login Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 py-3.5 px-4 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-emerald-200 transition-all active:scale-[0.98]"
        >
          <Chrome className="text-emerald-500" size={20} />
          Masuk dengan Google
        </button>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
            PanganKU SaaS System
          </p>
        </div>
      </div>
    </div>
  );
}
