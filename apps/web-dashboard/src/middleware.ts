import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/auth-logic";

export async function middleware(request: NextRequest) {
  // Panggil logika dari lib
  return await updateSession(request);
}

export const config = {
  // Matcher menentukan halaman mana saja yang akan diproses oleh middleware
  // Regex ini mengecualikan file statis (gambar, favicon, dll) agar tidak lemot
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
