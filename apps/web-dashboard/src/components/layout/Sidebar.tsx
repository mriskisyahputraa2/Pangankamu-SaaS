"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Shapes, // Ikon baru untuk Kategori
  ShoppingBasket,
  ClipboardList,
  BarChart3,
  Settings,
  Store,
  Menu,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

// Konfigurasi Menu Navigasi
const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Kategori", href: "/categories", icon: Shapes }, // Ikon Shapes lebih cocok untuk pengelompokan
  { name: "Produk", href: "/products", icon: ShoppingBasket },
  { name: "Pesanan", href: "/orders", icon: ClipboardList },
  { name: "Analisis AI", href: "/analytics", icon: BarChart3 },
];

// Komponen Isi Sidebar
const SidebarContent = ({ setOpen }: { setOpen?: (open: boolean) => void }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Sign out dari Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase logout error:", error);
      }

      // 2. Clear localStorage
      localStorage.removeItem("user");
      localStorage.clear(); // Clear semua untuk memastikan

      // 3. Redirect ke login dengan force reload
      window.location.href = "/login";
    } catch (error) {
      console.error("Gagal logout:", error);
      // Tetap clear localStorage dan redirect meskipun error
      localStorage.removeItem("user");
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Brand Section */}
      <div className="flex h-16 items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <Store size={20} className="text-emerald-600" />
          <span className="text-sm font-bold tracking-tight text-slate-900 uppercase italic">
            Pangan<span className="text-emerald-600">Kamu</span>
          </span>
        </div>
      </div>

      {/* Navigasi Utama */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen?.(false)}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors relative",
                isActive
                  ? "text-emerald-600 bg-emerald-50/50 rounded-md"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-md",
              )}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
              {isActive && (
                <div className="absolute left-0 w-1 h-4 bg-emerald-600 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bagian Bawah */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <Link
          href="/settings"
          onClick={() => setOpen?.(false)}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Settings size={18} />
          <span>Pengaturan</span>
        </Link>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-md transition-all active:scale-95"
        >
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-screen w-60 flex-col border-r border-slate-100 bg-white sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile & Tablet Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-100 flex items-center px-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-md">
              <Menu size={20} />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-64 border-r border-slate-100"
          >
            <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
            <SidebarContent setOpen={setOpen} />
          </SheetContent>
        </Sheet>
        <span className="ml-3 font-bold text-slate-900 text-sm tracking-wider uppercase italic">
          Pangan<span className="text-emerald-600">Kamu</span>
        </span>
      </div>
    </>
  );
}
