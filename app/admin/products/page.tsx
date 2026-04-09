"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/app/components/ProductCard";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";

const products = [
  { id: 1, name: "Pampers Swaddlers Diapers", price: "NPR 1200", image: "/pampers.jpg" },
  { id: 2, name: "Baby Lotion", price: "NPR 800", image: "/lotion.jpg" },
  { id: 3, name: "Baby Wipes", price: "NPR 500", image: "/wipes.jpg" },
  { id: 4, name: "Baby Shampoo", price: "NPR 700", image: "/shampoo.jpeg" },
  { id: 5, name: "Baby Bottle", price: "NPR 350", image: "/bottle.jpeg" },
  { id: 6, name: "Baby Powder", price: "NPR 600", image: "/powder.jpg" },
  { id: 7, name: "Baby Soap", price: "NPR 400", image: "/soap.webp" },
  { id: 8, name: "Baby Cream", price: "NPR 900", image: "/cream.jpeg" },
];

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const productsPerPage = 4;

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter products based on search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Handle page click
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-emerald-800">Products</h1>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
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
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-slate-500">No products found.</p>
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
              {/* Prev Button */}
              <button
                onClick={() => paginate(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Page Numbers */}
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

              {/* Next Button */}
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