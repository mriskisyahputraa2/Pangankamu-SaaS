"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LayoutGrid, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage("Memverifikasi akun...");

    try {
      // 1. Validasi dengan backend
      const res = await api.post("/auth/login", { email, password });

      if (res.data.status === "success") {
        setLoadingMessage("Menyinkronkan session...");

        // 2. Sinkronisasi dengan Supabase
        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (authError) {
          toast.error("Sinkronisasi session gagal");
          return;
        }

        // 3. Simpan data user
        const userData = res.data.data;
        localStorage.setItem("user", JSON.stringify(userData));

        setLoadingMessage("Mengarahkan ke dashboard...");

        // 4. Redirect ke callback untuk animasi yang konsisten
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/callback");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login gagal.");
      setLoadingMessage("");
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Langsung arahkan ke backend Hono untuk OAuth Google
    window.location.href = "http://localhost:3000/auth/login-google";
  };

  return (
    <div className="font-jakarta antialiased bg-white">
      <Toaster position="top-center" richColors />
      <div className="grid lg:grid-cols-5 md:grid-cols-2 items-center h-full min-h-screen">
        <div className="max-md:order-1 lg:col-span-3 md:h-screen w-full bg-emerald-600 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.15)_0%,_transparent_50%)]" />
          <div className="relative z-10 w-full flex flex-col items-center">
            <img
              src="https://readymadeui.com/signin-image.webp"
              className="lg:w-4/5 w-full h-auto object-contain block mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              alt="PanganKU Illustration"
            />
          </div>
        </div>

        <div className="lg:col-span-2 w-full p-8 max-w-lg mx-auto bg-white font-jakarta">
          <form onSubmit={handleEmailLogin}>
            <div className="mb-10 text-center lg:text-left">
              <div className="flex items-center gap-2 mb-4 justify-center lg:justify-start">
                <div className="p-1.5 bg-emerald-600 rounded-lg">
                  <LayoutGrid size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">
                  PanganKU
                </span>
              </div>
              <h1 className="text-slate-900 text-3xl font-extrabold tracking-tight">
                Selamat Datang
              </h1>
              <p className="text-[15px] mt-2 text-slate-500 font-medium">
                Masuk untuk mengelola stok ruko digital Anda.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-slate-700 text-sm font-bold mb-2 block uppercase tracking-wider">
                  Email Bisnis
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-900 bg-slate-50 pl-11 pr-4 py-4 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                    placeholder="nama@toko.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="text-slate-700 text-sm font-bold uppercase tracking-wider">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    className="text-emerald-600 font-bold text-xs hover:underline"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-900 bg-slate-50 pl-11 pr-12 py-4 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-4 text-sm font-bold tracking-wide rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin text-white" size={20} />
                    <span className="text-sm font-medium">
                      {loadingMessage || "Memproses..."}
                    </span>
                  </div>
                ) : (
                  "Masuk ke Dashboard"
                )}
              </button>
            </div>

            <div className="my-8 flex items-center gap-4">
              <hr className="w-full border-slate-100" />
              <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
                Atau
              </p>
              <hr className="w-full border-slate-100" />
            </div>

            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 text-sm font-bold text-slate-700 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-all"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-5 h-5"
                alt="Google"
              />
              Lanjutkan dengan Google
            </button>

            {/* Link to Signup */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Belum punya akun?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                >
                  Daftar Sekarang
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
