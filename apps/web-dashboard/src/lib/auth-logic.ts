import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Skip callback processing completely
  if (request.nextUrl.pathname === "/callback") {
    console.log("Middleware - Skipping callback page");
    return response;
  }

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
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("=== MIDDLEWARE ===");
  console.log("Path:", request.nextUrl.pathname);
  console.log("User:", user?.email || "No user");
  console.log("Has cookies:", request.cookies.getAll().length > 0);

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isProtectedRoute = !isAuthPage;

  // Redirect logic
  if (!user && isProtectedRoute) {
    console.log("❌ Redirecting to login - no user found");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && isAuthPage) {
    console.log("✅ Redirecting to dashboard - user found");
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log("✅ Middleware passed");
  return response;
}
