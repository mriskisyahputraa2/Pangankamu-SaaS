"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Menghubungkan akun...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase secara otomatis akan membaca token dari URL hash (#access_token=...)
        // dan menyimpannya ke dalam cookie atau local storage browser
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data.session) {
          setStatus("Login Berhasil! Mengarahkan ke Dashboard...");
          // Beri sedikit jeda agar user bisa melihat status sukses
          setTimeout(() => {
            router.push("/");
            router.refresh();
          }, 1500);
        } else {
          setStatus("Sesi tidak ditemukan. Silakan login kembali.");
        }
      } catch (err) {
        console.error("Error during callback:", err);
        setStatus("Gagal memproses login.");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Kamu bisa tambahkan spinner loading di sini */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <h2 className="text-xl font-semibold">{status}</h2>
        <p className="text-sm text-muted-foreground text-center">
          PanganKU sedang menyiapkan dashboard untukmu.
        </p>
      </div>
    </div>
  );
}
