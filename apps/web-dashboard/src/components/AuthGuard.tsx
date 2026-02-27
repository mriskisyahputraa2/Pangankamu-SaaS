"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Auth routes yang tidak perlu proteksi
      const authRoutes = ["/login", "/signup", "/callback"];
      const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route),
      );

      // Jika auth route, langsung allow
      if (isAuthRoute) {
        setAuthenticated(true);
        setLoading(false);
        return;
      }

      // SEMUA HALAMAN LAIN HARUS TERPROTEKSI
      // Check localStorage untuk user data
      const userData = localStorage.getItem("user");

      if (!userData) {
        // Tidak ada user data = belum login = redirect ke login
        setAuthenticated(false);
        setLoading(false);
        router.replace("/login");
        return;
      }

      let parsedUser;
      try {
        parsedUser = JSON.parse(userData);
      } catch (parseError) {
        // Invalid JSON = clear dan redirect ke login
        localStorage.removeItem("user");
        setAuthenticated(false);
        setLoading(false);
        router.replace("/login");
        return;
      }

      const hasValidToken =
        parsedUser.token || parsedUser.access_token || parsedUser.data?.token;
      const hasValidUser = parsedUser.user || parsedUser.data?.user;

      if (!hasValidToken || !hasValidUser) {
        // Token atau user tidak valid = clear dan redirect ke login
        localStorage.removeItem("user");
        setAuthenticated(false);
        setLoading(false);
        router.replace("/login");
        return;
      }

      // User sudah login dengan valid token
      setAuthenticated(true);

      // LOGIC SETUP-TOKO: Cek apakah user punya store
      const user = parsedUser.user || parsedUser.data?.user;
      const storeId = user.store_id;

      if (pathname === "/setup-toko") {
        // Jika di halaman setup-toko
        if (storeId) {
          // User sudah punya toko = redirect ke dashboard
          router.replace("/");
          return;
        }
        // User belum punya toko = boleh akses setup-toko
      } else {
        // Jika di halaman lain (dashboard, products, categories, dll)
        if (!storeId) {
          // User belum punya toko = harus setup dulu
          router.replace("/setup-toko");
          return;
        }
        // User sudah punya toko = boleh akses halaman lain
      }

      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - akan redirect di useEffect
  if (!authenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Mengarahkan ke login...</p>
        </div>
      </div>
    );
  }

  // Render children for authenticated users
  return <>{children}</>;
}
