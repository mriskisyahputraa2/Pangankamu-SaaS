"use client";

import { useCategoryData } from "@/features/categories/hooks/useCategoryData";
import { useCategoryModals } from "@/features/categories/hooks/useCategoryModals";
import { AddCategoryModal } from "@/features/categories/components/modals/add-category-modal";
import { EditCategoryModal } from "@/features/categories/components/modals/edit-category-modal";
import { CategoryFilters } from "@/features/categories/components/CategoryFilters";
import { CategoryTable } from "@/features/categories/components/CategoryTable";
import { CategoryPagination } from "@/features/categories/components/CategoryPagination";

export default function CategoriesPage() {
  // Custom Hooks
  const {
    categories,
    loading,
    currentPage,
    setCurrentPage,
    limit,
    totalData,
    totalPages,
    searchTerm,
    fetchCategories,
    refreshAndResetPage,
    handleSearch,
    handleLimitChange,
  } = useCategoryData();

  const { selectedCategory, isEditOpen, openEditModal, closeEditModal } =
    useCategoryModals();

  return (
    <div className="w-full space-y-4 md:space-y-6 font-jakarta px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            Kategori Produk
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Daftar kategori untuk mengelompokkan produk Anda. Tambah, edit, atau
            hapus
          </p>
        </div>
        <div className="shrink-0">
          <AddCategoryModal onSuccess={refreshAndResetPage} />
        </div>
      </div>

      {/* Search and Filter */}
      <CategoryFilters
        searchTerm={searchTerm}
        limit={limit}
        onSearchChange={handleSearch}
        onLimitChange={handleLimitChange}
      />

      {/* Table */}
      <CategoryTable
        categories={categories}
        loading={loading}
        currentPage={currentPage}
        limit={parseInt(limit)}
        onEdit={openEditModal}
        onRefresh={fetchCategories}
      />

      {/* Pagination */}
      {!loading && (
        <CategoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalData={totalData}
          displayedCount={categories.length}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Edit Modal */}
      {selectedCategory && (
        <EditCategoryModal
          category={selectedCategory}
          isOpen={isEditOpen}
          onClose={closeEditModal}
          onSuccess={fetchCategories}
        />
      )}
    </div>
  );
}
//
