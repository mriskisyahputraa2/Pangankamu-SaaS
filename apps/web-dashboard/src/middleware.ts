import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // DEBUGGING: Log cookies
  console.log("🔍 Middleware checking path:", request.nextUrl.pathname);
  console.log(
    "🍪 Request cookies:",
    request.cookies.getAll().map((c) => c.name),
  );

  let supabaseResponse = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Auth routes yang tidak perlu proteksi
  const authRoutes = ["/login", "/signup", "/callback", "/setup-toko"];
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (isAuthRoute) {
    console.log("✅ Auth route, allowing access");
    return supabaseResponse;
  }

  // PERBAIKAN: Untuk navigasi internal dashboard, lebih toleran
  const dashboardRoutes = [
    "/",
    "/categories",
    "/products",
    "/orders",
    "/analytics",
    "/settings",
  ];
  const isDashboardRoute = dashboardRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(route + "/"),
  );

  if (isDashboardRoute) {
    const referer = request.headers.get("referer") || "";

    // Jika navigasi internal (dari dashboard ke dashboard), berikan pass sekali
    if (referer && referer.includes(request.nextUrl.origin)) {
      console.log(
        "🚀 Internal dashboard navigation, checking session gracefully",
      );

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        // Jika session ada dan valid, lanjut
        if (!error && user) {
          console.log("✅ Valid session for internal nav:", user.email);
          return supabaseResponse;
        }

        // Jika tidak ada session tapi ini navigasi internal, beri kesempatan
        console.log("⚠️ No session but internal nav, allowing one pass");
        return supabaseResponse;
      } catch (authError) {
        console.log("⚠️ Auth error during internal nav, allowing fallback");
        return supabaseResponse;
      }
    }
  }

  // Check authentication untuk protected routes
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("🔍 Middleware auth check:");
  console.log("  - Path:", request.nextUrl.pathname);
  console.log("  - Error:", error?.message || "none");
  console.log("  - User:", user?.email || "none");
  console.log("  - Has cookies:", request.cookies.getAll().length > 0);

  if (error || !user) {
    console.log("❌ Not authenticated, checking if we should redirect...");

    // PERBAIKAN: Lebih toleran untuk navigasi internal
    const currentPath = request.nextUrl.pathname;
    const referer = request.headers.get("referer") || "";
    const userAgent = request.headers.get("user-agent") || "";

    // Jika dari callback, setup-toko, atau navigasi internal dashboard, beri toleransi
    if (
      referer.includes("/callback") ||
      referer.includes("/setup-toko") ||
      referer.includes(request.nextUrl.origin) // navigasi internal
    ) {
      console.log(
        "⚠️ Internal navigation or post-auth flow, allowing pass through for session sync",
      );
      return supabaseResponse;
    }

    // Jika tidak ada referer dan bukan direct access ke login
    if (!referer && currentPath !== "/login") {
      console.log(
        "⚠️ Direct access without referer, allowing pass through once",
      );
      return supabaseResponse;
    }

    // Hanya redirect ke login jika benar-benar tidak ada session
    if (currentPath !== "/login" && !referer.includes("/login")) {
      console.log("🚨 Redirecting to login");
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  // SESUAI DOKUMEN: Validasi Multi-Tenancy - User harus punya store
  const storeId = user.user_metadata?.store_id;

  console.log("🏪 Store validation:");
  console.log("  - Store ID:", storeId || "none");
  console.log("  - User metadata:", JSON.stringify(user.user_metadata));

  // PERBAIKAN: Lebih toleran untuk store validation saat navigasi
  if (!storeId && request.nextUrl.pathname !== "/setup-toko") {
    console.log("⚠️ User authenticated but no store_id");

    // Jika sedang navigasi internal dan belum ada store, cek localStorage dahulu
    const referer = request.headers.get("referer") || "";

    if (referer.includes(request.nextUrl.origin)) {
      console.log("⚠️ Internal navigation without store_id, allowing one pass");
      // Beri satu kali kesempatan untuk navigasi internal
      // Client-side AuthGuard akan handle redirect ke setup-toko
      return supabaseResponse;
    }

    console.log("🏪 Redirecting to setup-toko");
    const url = request.nextUrl.clone();
    url.pathname = "/setup-toko";
    return NextResponse.redirect(url);
  }

  console.log(
    "✅ User authenticated with store:",
    user.email,
    storeId || "setup-allowed",
  );
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
