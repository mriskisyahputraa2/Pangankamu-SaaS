"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const isDone = useRef(false);

  useEffect(() => {
    if (isDone.current) return;

    const handleAuth = async () => {
      try {
        console.log("🚀 Starting OAuth callback handling...");

        // 1. Ambil sesi dari Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("❌ Session error:", error);
          window.location.href = "/login";
          return;
        }

        if (session) {
          console.log("✅ Session found immediately");
          return finalize(session);
        }

        console.log("⏳ Waiting for auth state change...");

        // TAMBAHAN: Check URL hash untuk manual parsing jika Supabase gagal
        const urlHash = window.location.hash;
        if (urlHash.includes("access_token=")) {
          console.log("🔍 Found tokens in URL hash, parsing manually...");
          try {
            const hashParams = new URLSearchParams(urlHash.substring(1));
            const accessToken = hashParams.get("access_token");
            const refreshToken = hashParams.get("refresh_token");

            if (accessToken) {
              console.log("🔑 Setting session manually with tokens...");
              const { data: sessionData, error: setError } =
                await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken || "",
                });

              if (setError) {
                console.error("❌ Manual session set error:", setError);
              } else if (sessionData.session) {
                console.log("✅ Manual session set successful");
                return finalize(sessionData.session);
              }
            }
          } catch (hashError) {
            console.error("❌ Hash parsing error:", hashError);
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
            console.log("🔄 Auth event:", event);
            console.log("🔄 Session object:", session);
            console.log("🔄 Session user:", session?.user);

            if (
              session &&
              session.user &&
              (event === "SIGNED_IN" || event === "INITIAL_SESSION")
            ) {
              console.log("✅ Valid session found, proceeding...");
              subscription.unsubscribe();
              resolve(session);
            } else if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
              console.log("❌ Event fired but session is invalid");
              console.log("❌ Session:", session);
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
          console.error("❌ Auth timeout or error:", err);
          console.log("🔄 Attempting fallback session check...");

          // Fallback: Last attempt to get session
          const { data: fallbackData, error: fallbackError } =
            await supabase.auth.getSession();
          if (fallbackData.session && fallbackData.session.user) {
            console.log("✅ Fallback session found!");
            await finalize(fallbackData.session);
          } else {
            console.log("❌ No fallback session, redirecting to login");
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
        console.error("❌ Invalid session passed to finalize:", session);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
        return;
      }

      isDone.current = true;

      console.log("🔍 Finalizing session for:", session.user.email);
      console.log("🔍 User metadata:", session.user.user_metadata);
      console.log("🔍 Full session:", session);

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
      console.log("🔍 Checking user store in database...");
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
          console.log("✅ Store found in database:", storeData);
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

          console.log("✅ Existing store found, redirecting to Dashboard...");
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        } else {
          console.log("🏪 No store found, redirecting to Setup Toko...");
          setTimeout(() => {
            window.location.href = "/setup-toko";
          }, 500);
        }
      } catch (dbError) {
        console.error("❌ Database check error:", dbError);
        // Fallback: redirect ke setup toko jika ada error
        setTimeout(() => {
          window.location.href = "/setup-toko";
        }, 500);
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-white font-jakarta">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-slate-900">
          Menghubungkan Akun...
        </h2>
        <p className="text-slate-500 text-sm mt-2 italic">
          Menyiapkan ruko digital kamu.
        </p>
        <p className="text-slate-400 text-xs mt-4">
          Jika terlalu lama, silakan refresh halaman
        </p>
      </div>
    </div>
  );
}
