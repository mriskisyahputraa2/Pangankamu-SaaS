import { useState, useEffect, useCallback } from "react";
import { getProducts } from "../services/productService";
import { categoryService } from "@/features/categories";
import { toast } from "sonner";

export function useProductData() {
  // Data States
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStoreId, setActiveStoreId] = useState<string>("");

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Get store ID from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      const storeId =
        parsed.data?.user?.store_id || parsed.user?.store_id || parsed.store_id;
      if (storeId) setActiveStoreId(storeId);
    }
  }, []);

  // Fetch Products Function
  const fetchProducts = useCallback(async () => {
    if (!activeStoreId) return;
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        getProducts(activeStoreId, currentPage, parseInt(limit), searchTerm),
        categoryService.getCategories(1, 100, ""),
      ]);

      if (prodRes.status === "success") {
        setProducts(prodRes.data || []);
        setTotalData(prodRes.meta?.total_data || 0);
        setTotalPages(prodRes.meta?.total_pages || 1);
      }

      if (catRes.status === "success") {
        setCategories(catRes.data || []);
      }
    } catch (err) {
      toast.error("Gagal memuat daftar produk");
    } finally {
      setLoading(false);
    }
  }, [activeStoreId, currentPage, limit, searchTerm]);

  // Refresh and Reset to Page 1
  const refreshAndResetPage = useCallback(async () => {
    if (!activeStoreId) return;
    setCurrentPage(1);
    setLoading(true);

    try {
      const [prodRes, catRes] = await Promise.all([
        getProducts(activeStoreId, 1, parseInt(limit), searchTerm),
        categoryService.getCategories(1, 100, ""),
      ]);

      if (prodRes.status === "success") {
        setProducts(prodRes.data || []);
        setTotalData(prodRes.meta?.total_data || 0);
        setTotalPages(prodRes.meta?.total_pages || 1);
      }

      if (catRes.status === "success") {
        setCategories(catRes.data || []);
      }
    } catch (err) {
      toast.error("Gagal memuat daftar produk");
    } finally {
      setLoading(false);
    }
  }, [activeStoreId, limit, searchTerm]);

  // Handle Search
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  // Handle Limit Change
  const handleLimitChange = useCallback((value: string) => {
    setLimit(value);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    // Data
    products,
    categories,
    loading,
    activeStoreId,
    // Pagination
    currentPage,
    setCurrentPage,
    limit,
    totalData,
    totalPages,
    searchTerm,
    // Actions
    fetchProducts,
    refreshAndResetPage,
    handleSearch,
    handleLimitChange,
  };
}
