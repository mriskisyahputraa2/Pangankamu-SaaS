"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Tentukan rute yang tidak perlu proteksi
      const authRoutes = ["/login", "/signup", "/callback"];
      const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route),
      );

      if (isAuthRoute) {
        setAuthenticated(true);
        setLoading(false);
        return;
      }

      // 2. Validasi sesi langsung ke Supabase (bukan hanya cek localStorage)
      //    Ini memastikan user yang dihapus/token expired langsung di-redirect ke login
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        // Sesi tidak valid → bersihkan localStorage dan redirect ke login
        localStorage.removeItem("user");
        setAuthenticated(false);
        setLoading(false);
        router.replace("/login");
        return;
      }

      // 3. Sesi valid → cek data localStorage untuk logika SaaS (store_id, dll)
      const userData = localStorage.getItem("user");

      if (!userData) {
        // Session ada di Supabase tapi localStorage kosong → sync ulang
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }

      try {
        const parsedData = JSON.parse(userData);
        const user = parsedData.user;
        const storeId = user?.store_id;

        // 4. Logic Proteksi Khusus SaaS Pangankamu
        if (pathname === "/setup-toko") {
          if (storeId) {
            // Jika sudah punya toko tapi maksa ke setup-toko, lempar ke dashboard
            router.replace("/dashboard");
            return;
          }
        } else {
          if (!storeId) {
            // Jika masuk ke dashboard/produk tapi belum punya toko, lempar ke setup
            router.replace("/setup-toko");
            return;
          }
        }

        setAuthenticated(true);
        setLoading(false);
      } catch (error) {
        localStorage.removeItem("user");
        router.replace("/login");
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Memeriksa akses...</p>
        </div>
      </div>
    );
  }

  return authenticated ? <>{children}</> : null;
}
//