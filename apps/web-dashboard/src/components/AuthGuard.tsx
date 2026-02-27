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
      try {
        console.log("🔍 AuthGuard checking path:", pathname);

        // Auth routes yang tidak perlu proteksi
        const authRoutes = ["/login", "/signup", "/callback", "/setup-toko"];
        const isAuthRoute = authRoutes.some((route) =>
          pathname.startsWith(route),
        );

        if (isAuthRoute) {
          console.log("✅ Auth route, allowing access");
          setAuthenticated(true);
          setLoading(false);
          return;
        }

        // Check localStorage untuk user data
        const userData = localStorage.getItem("user");

        if (!userData) {
          console.log("❌ No user data, redirecting to login");
          setAuthenticated(false);
          setLoading(false);
          router.push("/login");
          return;
        }

        try {
          const parsed = JSON.parse(userData);
          const hasValidToken =
            parsed.token || parsed.access_token || parsed.data?.token;

          if (hasValidToken) {
            console.log("✅ Valid token found");
            setAuthenticated(true);
          } else {
            console.log("❌ Invalid token, redirecting to login");
            localStorage.removeItem("user");
            setAuthenticated(false);
            router.push("/login");
          }
        } catch (parseError) {
          console.error("❌ Error parsing user data:", parseError);
          localStorage.removeItem("user");
          setAuthenticated(false);
          router.push("/login");
        }
      } catch (error) {
        console.error("❌ Auth check error:", error);
        setAuthenticated(false);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated for protected routes
  if (!authenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Render children for authenticated users or auth routes
  return <>{children}</>;
}
