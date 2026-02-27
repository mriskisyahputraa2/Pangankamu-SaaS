"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const isDone = useRef(false);
  const [message, setMessage] = useState("Menghubungkan akun...");

  useEffect(() => {
    if (isDone.current) return;

    const handleAuth = async () => {
      try {
        setMessage("Memverifikasi session...");

        // 1. Check jika ada session dari form login (localStorage)
        const savedUserData = localStorage.getItem("user");
        if (savedUserData) {
          try {
            const userData = JSON.parse(savedUserData);
            if (userData.token || userData.access_token) {
              setMessage("Session ditemukan dari form login...");

              // Get current Supabase session
              const {
                data: { session },
              } = await supabase.auth.getSession();
              if (session && session.user) {
                return finalize(session);
              }

              // Jika tidak ada session tapi ada localStorage, tunggu sebentar
              setMessage("Menyinkronkan session...");
              await new Promise((resolve) => setTimeout(resolve, 1000));

              const {
                data: { session: retrySession },
              } = await supabase.auth.getSession();
              if (retrySession && retrySession.user) {
                return finalize(retrySession);
              }
            }
          } catch (parseError) {
            // Continue to OAuth flow
          }
        }

        // 2. Ambil sesi dari Supabase (OAuth flow)
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          window.location.href = "/login";
          return;
        }

        if (session) {
          return finalize(session);
        }

        setMessage("Menunggu autentikasi...");

        // 3. Check URL hash untuk manual parsing jika Supabase gagal
        const urlHash = window.location.hash;
        if (urlHash.includes("access_token=")) {
          setMessage("Mengatur session...");
          try {
            const hashParams = new URLSearchParams(urlHash.substring(1));
            const accessToken = hashParams.get("access_token");
            const refreshToken = hashParams.get("refresh_token");

            if (accessToken) {
              const { data: sessionData, error: setError } =
                await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken || "",
                });

              if (setError) {
                // Continue to auth state change
              } else if (sessionData.session) {
                return finalize(sessionData.session);
              }
            }
          } catch (hashError) {
            // Continue to auth state change
          }
        }

        // 2. Jika belum ada, tunggu event SIGNED_IN dengan timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Auth timeout")), 10000),
        );

        const authPromise = new Promise((resolve, reject) => {
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((event, session) => {
            if (
              session &&
              session.user &&
              (event === "SIGNED_IN" || event === "INITIAL_SESSION")
            ) {
              subscription.unsubscribe();
              resolve(session);
            } else if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
              // Jangan reject langsung, tunggu event lain
            }
          });

          // Tambah timeout handling
          setTimeout(() => {
            subscription.unsubscribe();
            reject(new Error("No valid session after 10 seconds"));
          }, 10000);
        });

        try {
          const session = await Promise.race([authPromise, timeoutPromise]);
          await finalize(session);
        } catch (err) {
          setMessage("Mencoba ulang...");

          // Fallback: Last attempt to get session
          const { data: fallbackData, error: fallbackError } =
            await supabase.auth.getSession();
          if (fallbackData.session && fallbackData.session.user) {
            await finalize(fallbackData.session);
          } else {
            setTimeout(() => {
              window.location.href = "/login";
            }, 1000);
          }
        }
      } catch (error) {
        console.error("❌ Callback error:", error);
        window.location.href = "/login";
      }
    };

    const finalize = async (session: any) => {
      if (isDone.current) return;

      if (!session || !session.user) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
        return;
      }

      isDone.current = true;
      setMessage("Menyiapkan akun...");

      // Simpan data untuk Interceptor API
      const userData = {
        token: session.access_token,
        user: {
          id: session.user.id,
          email: session.user.email,
          ...session.user.user_metadata,
        },
      };
      localStorage.setItem("user", JSON.stringify(userData));

      // CHECK STORE dari DATABASE (bukan dari user_metadata)
      setMessage("Memeriksa toko...");
      try {
        // Query stores table untuk check apakah user punya store
        const { data: storeData, error: storeError } = await supabase
          .from("stores")
          .select("id, name, slug")
          .eq("owner_id", session.user.id)
          .single();

        if (storeError && storeError.code !== "PGRST116") {
          // Error selain "no rows returned"
          console.error("❌ Database error:", storeError);
          throw storeError;
        }

        if (storeData) {
          // Update localStorage dengan store info
          const updatedUserData = {
            ...userData,
            user: {
              ...userData.user,
              store_id: storeData.id,
              store_name: storeData.name,
              store_slug: storeData.slug,
            },
          };
          localStorage.setItem("user", JSON.stringify(updatedUserData));

          setMessage("Mengarahkan ke dashboard...");

          // Tunggu session sync sempurna dengan server
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Refresh session untuk memastikan metadata terupdate
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            // Continue anyway
          }

          // Tunggu lagi setelah refresh
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Pastikan session benar-benar ready sebelum redirect
          const { data: sessionCheck } = await supabase.auth.getSession();
          if (sessionCheck.session?.user) {
            window.location.href = "/";
          } else {
            await supabase.auth.refreshSession();
            setTimeout(() => {
              window.location.href = "/";
            }, 1000);
          }
        } else {
          setMessage("Mengarahkan ke setup toko...");

          // PERBAIKAN: Tunggu session sync untuk setup-toko juga dengan delay lebih lama
          console.log("⏳ Syncing session for setup-toko...");
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Lebih lama

          // Refresh session untuk memastikan user_metadata tersedia
          console.log("🔄 Refreshing session for setup-toko...");
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error("❌ Setup refresh error:", refreshError);
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
          window.location.href = "/setup-toko";
        }
      } catch (dbError) {
        console.error("❌ Database check error:", dbError);

        // PERBAIKAN: Better fallback handling with more retries
        console.log(
          "🔄 Attempting fallback to setup-toko with session sync...",
        );

        try {
          // Tunggu session sync dulu
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Refresh session untuk memastikan
          console.log("🔄 Refreshing session for fallback...");
          const { error: fallbackRefreshError } =
            await supabase.auth.refreshSession();
          if (fallbackRefreshError) {
            console.error("❌ Fallback refresh error:", fallbackRefreshError);
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Cek session sekali lagi
          const { data: fallbackSession } = await supabase.auth.getSession();
          if (fallbackSession.session?.user) {
            console.log("✅ Fallback session found, redirecting to setup-toko");
            window.location.href = "/setup-toko";
          } else {
            console.log("❌ No fallback session, redirecting to login");
            window.location.href = "/login";
          }
        } catch (fallbackError) {
          console.error("❌ Complete fallback failure:", fallbackError);
          window.location.href = "/login";
        }
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-white font-jakarta">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-xl font-bold text-slate-900 mb-3">{message}</h2>
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span>Menyiapkan dashboard kamu</span>
        </div>
        <p className="text-slate-400 text-xs mt-6">
          Jika terlalu lama, silakan refresh halaman
        </p>
      </div>
    </div>
  );
}
