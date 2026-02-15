"use client";
import { useEffect, useState } from "react";
import { getStoreData } from "@/services/product-service";

export default function DashboardPage() {
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    console.log("Memulai fetching data..."); // Tambahkan ini
    getStoreData()
      .then((res) => {
        console.log("Data diterima:", res); // Tambahkan ini
        if (res.status === "success") {
          setStore(res.data[0]);
        }
      })
      .catch((err) => console.error("Fetch gagal:", err)); // Tambahkan ini
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tes Koneksi API Pangankamu</h1>
      {store ? (
        <div className="p-4 border rounded-lg bg-green-50 border-green-200">
          <p className="text-green-700 font-medium">✅ Berhasil Terhubung!</p>
          <pre className="mt-2 bg-white p-2 rounded text-sm">
            Nama Toko: {store.name} {"\n"}
            Alamat: {store.address}
          </pre>
        </div>
      ) : (
        <p>Sedang menghubungkan ke backend...</p>
      )}
    </div>
  );
}
