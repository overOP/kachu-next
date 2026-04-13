"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useCreateProductMutation,
} from "@/slices/ProductSlice";
import type { Product } from "@/slices/ProductSlice";
import ProductCard from "@/app/components/ProductCard";
import ProductModal from "@/app/components/ProductModal";
import { ChevronLeft, ChevronRight, Plus, Search, Trash2 } from "lucide-react";
import { ProductData } from "@/app/components/Modal";

function toProductData(p: Product): ProductData {
  return {
    id: p._id,
    name: p.name,
    price: `NPR ${p.price}`,
    image: p.images?.[0]?.url ?? "/pampers.jpg",
  };
}

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<ProductData | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductData | undefined>(undefined);

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const { data: apiProducts = [], isLoading, error } = useGetProductsQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [createProduct] = useCreateProductMutation();

  const products = apiProducts.map(toProductData);
  const productsPerPage = 4;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEdit = (product: ProductData) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (name: string, price: string) => {
    if (!editingProduct) return;
    try {
      const numPrice = parseFloat(price.replace(/[^0-9\\.]/g, ""));
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", numPrice.toString());
      await updateProduct({ id: editingProduct.id, formData }).unwrap();
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    }
  };

  const handleAddSave = async (name: string, price: string) => {
    try {
      const numPrice = parseFloat(price.replace(/[^0-9\\.]/g, ""));
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", numPrice.toString());
      await createProduct(formData).unwrap();
    } catch (err) {
      console.error("Create error:", err);
      alert("Create failed");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct(deletingProduct.id).unwrap();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
    setDeletingProduct(undefined);
  };

  return (
    <>
      {/* Add Modal */}
      <ProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSave}
      />

      {/* Edit Modal */}
      <ProductModal
        isOpen={isEditModalOpen}
        product={editingProduct}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(undefined);
        }}
        onSave={handleEditSave}
      />

      {/* Delete Confirmation Popup */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <Trash2 size={26} className="text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 text-center">Delete Product?</h2>
            <p className="text-sm text-gray-500 text-center">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-700">{deletingProduct.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 w-full mt-1">
              <button
                onClick={() => setDeletingProduct(undefined)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-medium text-white transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-emerald-800">Products</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search & Sort */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
        <div className="flex justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search Products...."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select className="border border-slate-200 rounded-lg px-4 py-2 bg-white text-slate-600 outline-none">
            <option>Sort</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!isMounted || isLoading ? (
            <div className="col-span-full grid place-items-center py-12">
              <div className="text-slate-500">Loading products...</div>
            </div>
          ) : error ? (
            <div className="col-span-full grid place-items-center py-12 text-red-500">
              Error loading products. Please refresh.
            </div>
          ) : currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                onEdit={() => handleEdit(product)}
                onDelete={() => setDeletingProduct(product)}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-slate-500 py-12">
              No products found.
            </p>
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-4">
            <p className="text-slate-500 text-sm font-medium">
              Showing {filteredProducts.length === 0 ? 0 : indexOfFirstProduct + 1} -{" "}
              {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} Products
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`w-10 h-10 rounded-full ${
                    currentPage === number
                      ? "bg-emerald-700 text-white"
                      : "border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
