"use client";

import { useProductData } from "@/features/products/hooks/useProductData";
import { useProductModals } from "@/features/products/hooks/useProductModals";
import { AddProductModal } from "@/features/products/components/modals/add-product-modal";
import { EditProductModal } from "@/features/products/components/modals/edit-product-modal";
import { ProductFilters } from "@/features/products/components/ProductFilters";
import { ProductTable } from "@/features/products/components/ProductTable";
import { ProductPagination } from "@/features/products/components/ProductPagination";

export default function ProductsPage() {
  // Custom Hooks
  const {
    products,
    categories,
    loading,
    activeStoreId,
    currentPage,
    setCurrentPage,
    limit,
    totalData,
    totalPages,
    searchTerm,
    fetchProducts,
    refreshAndResetPage,
    handleSearch,
    handleLimitChange,
  } = useProductData();

  const { selectedProduct, isEditOpen, openEditModal, closeEditModal } =
    useProductModals();

  return (
    <div className="w-full space-y-4 md:space-y-6 font-jakarta px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            Inventaris Produk
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Kelola stok dan harga jual produk Anda
          </p>
        </div>
        <div className="shrink-0">
          <AddProductModal
            onSuccess={refreshAndResetPage}
            activeStoreId={activeStoreId}
          />
        </div>
      </div>

      {/* Search and Filter */}
      <ProductFilters
        searchTerm={searchTerm}
        limit={limit}
        onSearchChange={handleSearch}
        onLimitChange={handleLimitChange}
      />

      {/* Table */}
      <ProductTable
        products={products}
        categories={categories}
        loading={loading}
        currentPage={currentPage}
        limit={parseInt(limit)}
        storeId={activeStoreId}
        onEdit={openEditModal}
        onRefresh={fetchProducts}
      />

      {/* Pagination */}
      {!loading && (
        <ProductPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalData={totalData}
          displayedCount={products.length}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Edit Modal */}
      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          isOpen={isEditOpen}
          onClose={closeEditModal}
          onSuccess={fetchProducts}
          storeId={activeStoreId}
        />
      )}
    </div>
  );
}
