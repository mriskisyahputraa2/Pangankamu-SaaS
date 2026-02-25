"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("Menyiapkan Sesi...");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const finalizeLogin = async () => {
      // 1. CEK APAKAH ADA DATA DARI LOGIN EMAIL (sessionStorage)
      const pendingAuth = sessionStorage.getItem("pending_auth");
      if (pendingAuth) {
        const authData = JSON.parse(pendingAuth);
        completeAuth(authData);
        sessionStorage.removeItem("pending_auth");
        return;
      }

      // 2. JIKA TIDAK ADA, CEK SESI DARI GOOGLE (Supabase)
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        syncGoogleToLocalStorage(session);
      } else {
        // Tunggu jika hash URL sedang diproses
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session) {
            syncGoogleToLocalStorage(session);
            subscription.unsubscribe();
          }
        });
      }
    };

    const syncGoogleToLocalStorage = (session: any) => {
      const userData = {
        token: session.access_token,
        refresh_token: session.refresh_token,
        user: {
          id: session.user.id,
          email: session.user.email,
          ...session.user.user_metadata,
        },
      };
      completeAuth(userData);
    };

    const completeAuth = (userData: any) => {
      localStorage.setItem("user", JSON.stringify(userData));
      setIsSuccess(true);
      setStatus("Login Berhasil!");

      setTimeout(() => {
        window.location.replace("/"); // Redirect ke Dashboard Utama
      }, 1500);
    };

    finalizeLogin();
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white font-jakarta">
      <div className="flex flex-col items-center gap-6">
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
