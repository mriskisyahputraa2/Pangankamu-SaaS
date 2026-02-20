"use client";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Pastikan URL redirect ini terdaftar di dashboard Supabase
        redirectTo: `${window.location.origin}/callback`,
      },
    });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-6">
          Masuk ke PanganKU
        </h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
        >
          {/* Kamu bisa pasang SVG logo Google di sini */}
          <span>Masuk dengan Google</span>
        </button>
      </div>
    </div>
  );
}
