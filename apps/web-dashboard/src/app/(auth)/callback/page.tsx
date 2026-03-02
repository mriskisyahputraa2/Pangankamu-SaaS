"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import authService from "@/services/auth-service";

export default function AuthCallbackPage() {
  const isDone = useRef(false);
  const [message, setMessage] = useState("Menghubungkan akun...");

  useEffect(() => {
    // Mencegah double eksekusi di React Strict Mode
    if (isDone.current) return;

    const handleAuth = async () => {
      try {
        setMessage("Memverifikasi session...");

        // 1. Ambil session aktif dari Supabase (baik dari Login manual maupun Google OAuth)
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          window.location.href = "/login";
          return;
        }

        // 2. Sinkronisasi session ke LocalStorage untuk API Interceptor
        setMessage("Menyinkronkan session...");
        await authService.syncLocalSession(session);

        // 3. Cek apakah user sudah memiliki ruko digital (Multi-tenancy check)
        setMessage("Memeriksa ruko digital...");
        const store = await authService.checkStoreExistence(session.user.id);

        if (store) {
          // Jika sudah punya toko, pastikan metadata store_id terupdate
          setMessage("Menyiapkan dashboard...");
          await authService.refreshAndGetSession();

          // Beri jeda 1 detik agar proses sinkronisasi sempurna
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        } else {
          // Jika belum punya toko (user Google baru), lempar ke setup
          setMessage("Mengarahkan ke setup toko...");
          window.location.href = "/setup-toko";
        }

        isDone.current = true;
      } catch (error) {
        window.location.href = "/login";
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-white font-jakarta">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-xl font-bold text-slate-900 mb-3">{message}</h2>
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span>Menyiapkan ruko digital kamu</span>
        </div>
      </div>
    </div>
  );
}
