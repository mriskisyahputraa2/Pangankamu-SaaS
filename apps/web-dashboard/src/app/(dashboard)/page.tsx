"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBasket,
  AlertTriangle,
  Wallet,
  ArrowUpRight,
  Package,
} from "lucide-react";
import { getProducts } from "@/services/product-service";

// Komponen Kartu Statistik yang Minimalis
const StatCard = ({ title, value, icon: Icon, color, detail }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-emerald-100 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">
        Live Data
      </span>
    </div>
    <div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {detail && (
          <span className="text-xs text-slate-400 font-medium">{detail}</span>
        )}
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalValue: 0,
  });
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Mengambil data dari backend Hono yang sudah modular
        const res = await getProducts(1, 100);
        if (res.status === "success") {
          const items = res.data;

          // Logika Perhitungan Statistik
          const totalProducts = items.length;
          const lowStock = items.filter((p: any) => p.stock < 10).length;
          const totalValue = items.reduce(
            (acc: number, curr: any) => acc + curr.price * curr.stock,
            0,
          );

          setStats({ totalProducts, lowStock, totalValue });
          setRecentItems(items.slice(0, 5)); // Ambil 5 produk terbaru saja
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 w-full">
      {/* Header Dashboard */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Halo, Riski! 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Berikut adalah ringkasan stok pangan kamu hari ini.
        </p>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Produk"
          value={stats.totalProducts}
          icon={Package}
          color="bg-blue-500"
          detail="Jenis bahan"
        />
        <StatCard
          title="Stok Menipis"
          value={stats.lowStock}
          icon={AlertTriangle}
          color="bg-orange-500"
          detail="Perlu restock"
        />
        <StatCard
          title="Nilai Inventaris"
          value={`Rp ${stats.totalValue.toLocaleString("id-ID")}`}
          icon={Wallet}
          color="bg-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daftar Produk Terbaru */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-900">Produk Terbaru</h2>
            <button className="text-emerald-600 text-xs font-bold hover:underline">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <p className="text-center py-10 text-slate-400 text-sm italic">
                Menghubungkan ke server...
              </p>
            ) : recentItems.length === 0 ? (
              <p className="text-center py-10 text-slate-400 text-sm italic">
                Belum ada data produk.
              </p>
            ) : (
              recentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-emerald-600">
                      <ShoppingBasket size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">
                        {item.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {item.stock}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Tersisa
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info Box / Pengumuman Minimalis */}
        <div className="bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-3">
              Analisis AI <br /> Segera Hadir!
            </h2>
            <p className="text-emerald-100/70 text-sm leading-relaxed max-w-[200px]">
              Pantau tren harga ayam dan daging secara otomatis dengan bantuan
              kecerdasan buatan.
            </p>
          </div>
          <div className="relative z-10">
            <button className="bg-emerald-400 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white transition-colors">
              Pelajari Fitur <ArrowUpRight size={18} />
            </button>
          </div>

          {/* Dekorasi Flat Minimalis */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -right-5 top-5 w-24 h-24 border-4 border-emerald-800/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
