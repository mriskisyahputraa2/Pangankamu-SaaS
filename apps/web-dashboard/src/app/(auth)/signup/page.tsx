"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  LayoutGrid,
  Mail,
  Lock,
  Store,
  Loader2,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); // Input Nama Lengkap
  const [storeName, setStoreName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Registrasi ke Supabase Auth dengan data tambahan (Nama Lengkap)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Simpan data Toko ke tabel 'stores' (Sesuai Poin 3A Dokumen Perencanaan)
        const { error: storeError } = await supabase.from("stores").insert([
          {
            name: storeName,
            owner_id: authData.user.id,
            slug: storeName.toLowerCase().replace(/\s+/g, "-"),
          },
        ]);

        if (storeError) throw storeError;

        toast.success("Akun Berhasil Dibuat!", {
          description: "Silakan cek email untuk verifikasi.",
        });

        setTimeout(() => {
          window.location.replace("/login");
        }, 2000);
      }
    } catch (error: any) {
      toast.error("Gagal Mendaftar", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });
  };

  return (
    <div className="font-jakarta antialiased bg-white">
      <Toaster position="top-center" richColors />

      <div className="grid lg:grid-cols-5 md:grid-cols-2 items-center h-full min-h-screen">
        {/* Sisi Kiri: Branding Section */}
        <div className="max-md:order-1 lg:col-span-3 md:h-screen w-full bg-emerald-600 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.15)_0%,_transparent_50%)]" />
          <div className="relative z-10 w-full text-center">
            <img
              src="https://readymadeui.com/signin-image.webp"
              className="lg:w-2/3 w-full h-auto object-contain block mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              alt="PanganKU Registration"
            />
          </div>
        </div>

        {/* Sisi Kanan: Form Section */}
        <div className="lg:col-span-2 w-full p-8 max-w-lg mx-auto bg-white font-jakarta">
          <form onSubmit={handleSignUp}>
            <div className="mb-8 text-center lg:text-left">
              <div className="flex items-center gap-2 mb-4 justify-center lg:justify-start">
                <div className="p-1.5 bg-emerald-600 rounded-lg">
                  <LayoutGrid size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">
                  PanganKU
                </span>
              </div>
              <h1 className="text-slate-900 text-3xl font-extrabold tracking-tight">
                Daftar Toko
              </h1>
              <p className="text-[15px] mt-2 text-slate-500 font-medium">
                Mulai kelola stok cerdas dengan PanganKU.
              </p>
            </div>

            <div className="space-y-4">
              {/* Nama Lengkap */}
              <div>
                <label className="text-slate-700 text-xs font-bold mb-2 block uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <div className="relative flex items-center text-slate-400">
                  <User className="absolute left-4" size={18} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Nama Anda"
                  />
                </div>
              </div>

              {/* Nama Toko */}
              <div>
                <label className="text-slate-700 text-xs font-bold mb-2 block uppercase tracking-wider">
                  Nama Toko
                </label>
                <div className="relative flex items-center text-slate-400">
                  <Store className="absolute left-4" size={18} />
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Contoh: Berkah Pangan"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-slate-700 text-xs font-bold mb-2 block uppercase tracking-wider">
                  Email Bisnis
                </label>
                <div className="relative flex items-center text-slate-400">
                  <Mail className="absolute left-4" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                    placeholder="pemilik@toko.com"
                  />
                </div>
              </div>

              {/* Password dengan Icon Mata */}
              <div>
                <label className="text-slate-700 text-xs font-bold mb-2 block uppercase tracking-wider">
                  Kata Sandi
                </label>
                <div className="relative flex items-center text-slate-400">
                  <Lock className="absolute left-4" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Min. 6 Karakter"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-4 px-4 text-sm font-bold tracking-wide rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin text-white" size={20} />
              ) : (
                "Buat Akun Sekarang"
              )}
            </button>

            <div className="my-6 flex items-center gap-4">
              <hr className="w-full border-slate-100" />
              <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
                Atau
              </p>
              <hr className="w-full border-slate-100" />
            </div>

            <button
              onClick={handleGoogleSignUp}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 text-sm font-bold text-slate-700 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-5 h-5"
                alt="Google"
              />
              Daftar dengan Google
            </button>

            <p className="mt-8 text-center text-sm text-slate-400 font-bold tracking-tight">
              Sudah punya akun?
              <Link
                href="/login"
                className="text-emerald-600 font-black hover:underline ml-1"
              >
                Masuk di sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
