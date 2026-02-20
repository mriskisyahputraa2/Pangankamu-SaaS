"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("Menyiapkan Sesi...");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data?.session) {
          setIsSuccess(true);
          setStatus("Login Berhasil!");
          setTimeout(() => {
            window.location.replace("/");
          }, 1200);
        } else {
          setStatus("Sesi tidak ditemukan...");
        }
      } catch (err) {
        setStatus("Gagal memproses login.");
      }
    };
    handleAuthCallback();
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          {isSuccess ? (
            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 animate-bounce">
              <CheckCircle2 size={48} />
            </div>
          ) : (
            <div className="p-4">
              <Loader2 size={48} className="text-emerald-600 animate-spin" />
            </div>
          )}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {status}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            {isSuccess
              ? "Mengarahkan ke dashboard PanganKU..."
              : "Harap tunggu sebentar..."}
          </p>
        </div>
      </div>
    </div>
  );
}
