"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("Menyiapkan Sesi...");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleAuth = async () => {
      // 1. Cek apakah ada error di URL (misal user cancel Google login)
      if (window.location.href.includes("error=")) {
        setStatus("Gagal Login via Google.");
        setTimeout(() => (window.location.href = "/login"), 2000);
        return;
      }

      // 2. Paksa Supabase untuk memproses Hash dari URL
      // Ini akan mengubah fragment #access_token menjadi session di Cookies & Memory
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        completeAuth(session);
      } else {
        // Jika getSession belum siap, kita dengarkan perubahan state
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session) {
            completeAuth(session);
            subscription.unsubscribe();
          }
        });
      }
    };

    const completeAuth = (session: any) => {
      // Sesuaikan dengan format Postman kamu: simpan dalam properti 'data'
      const userData = {
        data: {
          token: session.access_token,
          user: {
            id: session.user.id,
            email: session.user.email,
            ...session.user.user_metadata,
          },
        },
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setIsSuccess(true);
      setStatus("Login Berhasil!");

      // PENTING: Gunakan window.location.href agar Middleware membaca cookie baru
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    };

    handleAuth();
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white font-jakarta">
      <div className="flex flex-col items-center gap-6">
        {isSuccess ? (
          <CheckCircle2 size={48} className="text-emerald-600 animate-bounce" />
        ) : (
          <Loader2 size={48} className="text-emerald-600 animate-spin" />
        )}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">{status}</h2>
          <p className="text-slate-500 mt-2">
            Mengarahkan ke dashboard PanganKU...
          </p>
        </div>
      </div>
    </div>
  );
}
