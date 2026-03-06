"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Wallet,
  ArrowUpRight,
  Package,
  Loader2,
  Plus,
  Eye,
  Shapes,
  RotateCcw,
} from "lucide-react";
import { getProducts } from "@/features/products/services/productService";
import { getCategories } from "@/features/categories/services/categoryService";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

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
    totalCategories: 0,
    lowStock: 0,
    totalValue: 0,
  });
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    vendorName: "",
    storeName: "",
  });

  const fetchStoreInfo = async (storeId: string) => {
    try {
      // Call the new store profile API endpoint
      const response = await api.get("/auth/store-profile");

      if (response.data.status === "success" && response.data.data) {
        const storeName = response.data.data.name;
        return storeName || "Toko Anda";
      }
    } catch (error) {
      // Fallback: Generate store name from vendor name
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const vendorName =
        userData?.user?.full_name || userData?.data?.user?.full_name;

      if (vendorName) {
        const firstName = vendorName.split(" ")[0];
        const fallbackName = `Toko ${firstName}`;
        return fallbackName;
      }
    }

    return "Toko Anda";
  };

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }

      const storedData = localStorage.getItem("user");
      const parsed = storedData ? JSON.parse(storedData) : null;

      // Ambil store_id dari metadata user
      const storeId =
        parsed?.data?.user?.store_id ||
        parsed?.user?.store_id ||
        parsed?.store_id;

      // Ambil user info untuk greeting
      const userData = parsed?.data?.user || parsed?.user || {};
      const vendorName =
        userData?.full_name ||
        userData?.name ||
        userData?.email?.split("@")[0] ||
        "Pengusaha";

      if (!storeId) {
        setLoading(false);
        return;
      }

      // Fetch store name, products, and categories parallel
      const [storeNameResult, productsRes, categoriesRes] = await Promise.all([
        fetchStoreInfo(storeId),
        getProducts(storeId, 1, 100),
        getCategories(1, 100),
      ]);

      // Set user info with fetched store name
      setUserInfo({ vendorName, storeName: storeNameResult });

      let totalProducts = 0;
      let totalCategories = 0;
      let lowStock = 0;
      let totalValue = 0;

      if (productsRes.status === "success") {
        const items = productsRes.data;
        totalProducts = items.length;
        lowStock = items.filter((p: any) => p.stock < 10).length;
        // Hitung berdasarkan price_sell sesuai schema
        totalValue = items.reduce(
          (acc: number, curr: any) =>
            acc + Number(curr.price_sell) * curr.stock,
          0,
        );
        setRecentItems(items.slice(0, 5));
      }

      if (categoriesRes.status === "success") {
        totalCategories = categoriesRes.data.length;
      }

      setStats({ totalProducts, totalCategories, lowStock, totalValue });

      if (isRefresh) {
        toast.success("Data dashboard berhasil diperbarui! 🎉");
      }
    } catch (err) {
      if (isRefresh) {
        toast.error("Gagal memperbarui data dashboard. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 w-full font-jakarta">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {loading ? (
              <span className="flex items-center gap-2">
                <span>Halo</span>
                <span className="inline-block h-6 w-32 bg-slate-200 rounded animate-pulse"></span>
                <span>👋</span>
              </span>
            ) : (
              `Halo, ${userInfo.vendorName || "Pengusaha Pangan"}! 👋`
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? (
              <span className="flex items-center gap-1">
                <span>Berikut ringkasan</span>
                <span className="inline-block h-4 w-20 bg-slate-200 rounded animate-pulse"></span>
                <span>hari ini.</span>
              </span>
            ) : (
              <>
                Berikut ringkasan{" "}
                <span className="font-medium text-emerald-600">
                  {userInfo.storeName || "toko Anda"}
                </span>{" "}
                hari ini.
              </>
            )}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <RotateCcw size={16} className={refreshing ? "animate-spin" : ""} />
          <span className="hidden sm:block">
            {refreshing ? "Memperbarui..." : "Perbarui Data"}
          </span>
          <span className="sm:hidden">{refreshing ? "..." : "Refresh"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Produk"
          value={stats.totalProducts}
          icon={Package}
          color="bg-blue-500"
          detail="Jenis bahan"
        />
        <StatCard
          title="Total Kategori"
          value={stats.totalCategories}
          icon={Shapes}
          color="bg-purple-500"
          detail="Pengelompokan"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products - Expanded */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-900">Produk Terbaru</h2>
            <Link
              href="/products"
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              Lihat Semua <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-emerald-500" />
              </div>
            ) : recentItems.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500 text-sm mb-4">
                  Belum ada produk. Mulai dengan menambahkan produk pertama
                  Anda!
                </p>
                <Link
                  href="/products/add"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  <Plus size={16} />
                  Tambah Produk
                </Link>
              </div>
            ) : (
              recentItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {item.categories?.name || "Tanpa Kategori"} • Rp{" "}
                        {Number(item.price_sell).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">
                      {item.stock}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {item.stock < 10 ? "⚠️ Menipis" : "✅ Aman"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-orange-100" />
              <h3 className="font-bold text-lg">Peringatan Stok</h3>
            </div>
            <p className="text-orange-100 text-sm mb-4 leading-relaxed">
              {stats.lowStock > 0
                ? `${stats.lowStock} produk memerlukan restocking segera.`
                : "Semua stok dalam kondisi aman! 🎉"}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              <Eye size={16} />
              Cek Detail
            </Link>
          </div>

          {/* Business Summary */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Wallet size={24} className="text-emerald-100" />
              <h3 className="font-bold text-lg">Ringkasan Bisnis</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-emerald-100 text-sm">Total Produk</span>
                <span className="font-bold text-lg">{stats.totalProducts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-100 text-sm">Kategori</span>
                <span className="font-bold text-lg">
                  {stats.totalCategories}
                </span>
              </div>
              <div className="border-t border-white/20 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-100 text-sm">Nilai Total</span>
                  <span className="font-bold text-xl">
                    Rp {(stats.totalValue / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
