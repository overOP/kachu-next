"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight, FiExternalLink } from "react-icons/fi";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  img: string;
  rate: string;
  quantity: string;
  logo: string;
  Description: string;
}

const PRODUCTS_DATA: Record<string, Product[]> = {
  coco: [
    {
      id: 1,
      name: "Coco Powder",
      brand: "Coco",
      price: "NPR 13,641",
      img: "https://5.imimg.com/data5/SELLER/Default/2023/5/308328905/KB/KA/VP/798985/cocoa-powder-1-kg-1000x1000.jpg",
      rate: "4.5(1k reviews)",
      quantity: "MOQ: 50 units",
      logo: "https://i.pinimg.com/originals/1e/c1/d2/1ec1d2ce366d1f603b1bde70ae508063.png",
      Description: "High-quality cocoa powder perfect for baking and beverages.",
    },
    {
      id: 2,
      name: "Dark Chocolate",
      brand: "Coco",
      price: "NPR 1,500",
      img: "https://tse1.mm.bing.net/th/id/OIP.VeVdBK9dzHdUR6Lcadl1fwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      rate: "4.5(1k reviews)",
      quantity: "MOQ: 50 units",
      logo: "https://i.pinimg.com/originals/1e/c1/d2/1ec1d2ce366d1f603b1bde70ae508063.png",
      Description: "Rich and delicious dark chocolate for desserts and snacks.",
    },
  ],
  kraft: [
    {
      id: 3,
      name: "Kraft Cheese",
      brand: "Kraft",
      price: "NPR 800",
      img: "https://kraftnaturalcheese.com/wp-content/uploads/2022/07/shredded_sharp-cheddar_fine_8oz.jpg",
      rate: "4.5(1k reviews)",
      quantity: "MOQ: 50 units",
      logo: "https://logos-world.net/wp-content/uploads/2023/03/Kraft-Foods-Logo-1960-500x281.png",
      Description: "Creamy and flavorful cheese for your meals.",
    },
  ],
  pepsi: [
    {
      id: 5,
      name: "Pepsi Can",
      brand: "Pepsi",
      price: "NPR 200",
      img: "https://www.pizzaboxbanksiagrove.com.au/wp-content/uploads/2023/02/Can-Pepsi.jpg",
      rate: "4.5(1k reviews)",
      quantity: "MOQ: 50 units",
      logo: "https://1000logos.net/wp-content/uploads/2017/05/Pepsi-Logo-1969-2048x1152.png",
      Description: "Refreshing and carbonated soft drink in a can.",
    },
  ],
  nestle: [
    {
      id: 7,
      name: "Nestle Milk",
      brand: "Nestle",
      price: "NPR 500",
      img: "https://pbs.twimg.com/media/E4pfDxPWEAQ7aGb.jpg",
      rate: "4.5(1k reviews)",
      quantity: "MOQ: 50 units",
      logo: "https://logoeps.com/wp-content/uploads/2013/04/nestle-deserts-vector-logo.png",
      Description: "Fresh and nutritious milk for your family.",
    },
  ],
};

const Products: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Memoize data to prevent unnecessary re-calculations
  const allProducts = useMemo(() => Object.values(PRODUCTS_DATA).flat(), []);
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = allProducts.slice(startIndex, startIndex + itemsPerPage);

  const sendWhatsApp = (item: Product) => {
    const phoneNumber ="9779857043288";
    const message = `Hello! I'm interested in the following product:\n\n*Product:* ${item.name}\n*Brand:* ${item.brand}\n*Price:* ${item.price}\n*MOQ:* ${item.quantity}\n\nCould you please provide more details?`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-16 bg-white text-slate-900 selection:bg-emerald-100">
      {/* Header */}
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-5xl font-light tracking-tight text-slate-900">
            Popular <span className="font-semibold text-emerald-900">Products</span>
          </h1>
          <p className="text-slate-400 mt-4 font-medium uppercase tracking-[0.2em] text-[10px]">
            Displaying {startIndex + 1} — {startIndex + currentProducts.length} of {allProducts.length} Results
          </p>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
        {currentProducts.map((item) => (
          <div
            key={item.id}
            onClick={() => router.push(`/product/${item.id}`)}
            className="group cursor-pointer flex flex-col"
          >
            {/* Image Pedestal */}
            <div className="relative aspect-[4/5] bg-[#FAFAFA] rounded-xl overflow-hidden transition-all duration-500 group-hover:bg-[#F4F4F4]">
              <Image
                src={item.img}
                alt={item.name}
                fill
                className="object-contain p-10 mix-blend-multiply transition-all duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              
              {/* Floating Brand Logo */}
              <div className="absolute top-5 left-5 bg-white/60 backdrop-blur-md p-1.5 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Image src={item.logo} alt="brand" width={24} height={24} className="object-contain opacity-80" />
              </div>

              {/* View Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                 <div className="bg-slate-900 text-white p-4 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <FiExternalLink size={18} />
                 </div>
              </div>
            </div>

            {/* Meta Data */}
            <div className="mt-6">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                  {item.name}
                </h3>
                <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                  {item.rate.split('(')[0]} ★
                </span>
              </div>
              
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                {item.quantity}
              </p>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
                <p className="text-lg font-bold text-slate-900 tracking-tight">
                  {item.price}
                </p>

                {/* WhatsApp Trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sendWhatsApp(item);
                  }}
                  className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-800 transition-all border-b-2 border-emerald-600/10 hover:border-emerald-600 pb-0.5"
                >
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <footer className="mt-24 pt-12 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-black hover:text-black disabled:opacity-60 transition-all group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Previous
        </button>
        
        <div className="flex gap-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`text-[10px] font-black transition-all ${
                page === currentPage ? "text-emerald-700 scale-150" : "text-slate-300 hover:text-slate-500"
              }`}
            >
              {page.toString().padStart(2, '0')}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-black hover:text-black disabled:opacity-60 transition-all group"
        >
          Next <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </footer>
    </div>
  );
};

export default Products;