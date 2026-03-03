import { useState, useEffect, useCallback } from "react";
import { categoryService } from "../services/categoryService";
import { Category } from "../types/category.types";
import { toast } from "sonner";

export function useCategoryData() {
  // Data States
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Categories Function
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoryService.getCategories(
        currentPage,
        parseInt(limit),
        searchTerm,
      );

      if (res.status === "success") {
        setCategories(res.data || []);
        setTotalData(res.meta?.total_data || 0);
        setTotalPages(res.meta?.total_pages || 1);
      }
    } catch (err) {
      toast.error("Gagal memuat daftar kategori");
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, searchTerm]);

  // Refresh and Reset to Page 1
  const refreshAndResetPage = useCallback(async () => {
    setCurrentPage(1);
    setLoading(true);

    try {
      const res = await categoryService.getCategories(
        1,
        parseInt(limit),
        searchTerm,
      );

      if (res.status === "success") {
        setCategories(res.data || []);
        setTotalData(res.meta?.total_data || 0);
        setTotalPages(res.meta?.total_pages || 1);
      }
    } catch (err) {
      toast.error("Gagal memuat daftar kategori");
    } finally {
      setLoading(false);
    }
  }, [limit, searchTerm]);

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
    fetchCategories();
  }, [fetchCategories]);

  return {
    // Data
    categories,
    loading,
    // Pagination
    currentPage,
    setCurrentPage,
    limit,
    totalData,
    totalPages,
    searchTerm,
    // Actions
    fetchCategories,
    refreshAndResetPage,
    handleSearch,
    handleLimitChange,
  };
}
