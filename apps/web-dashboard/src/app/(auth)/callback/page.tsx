"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("Menghubungkan akun...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Menukar kode dari URL Google menjadi sesi aktif
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data?.session) {
          setStatus("Login Berhasil! Menyinkronkan...");
          // Jeda sebentar agar cookie benar-benar tertanam di browser
          setTimeout(() => {
            window.location.replace("/");
          }, 800);
        } else {
          setStatus("Sesi tidak ditemukan. Silakan login kembali.");
        }
      } catch (err) {
        console.error("Callback Error:", err);
        setStatus("Gagal memproses login.");
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
        <h2 className="text-xl font-bold text-slate-900">{status}</h2>
        <p className="text-sm text-slate-400 text-center px-4">
          Sedang menyiapkan dashboard PanganKU untukmu.
        </p>
      </div>
    </div>
  );
}
