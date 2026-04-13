"use client";

import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";

type ProductCardProps = {
  name: string;
  price: string;
  image: string;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProductCard({ name, price, image, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      {/* Product Image */}
      <div className="bg-indigo-100 rounded-xl overflow-hidden aspect-video mb-4">
        <Image
          src={image}
          alt={name}
          width={600}
          height={400}
          className="w-full h-full object-cover"
          sizes="(max-width: 768px) 100vw, 420px"
        />
      </div>

      <h3 className="font-bold text-slate-800 text-sm">{name}</h3>
      <p className="text-xs text-slate-400 mt-1">Price</p>

      <div className="flex justify-between items-center mt-1">
        <span className="font-bold text-slate-900">{price}</span>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-green-500 hover:bg-green-50 p-1 rounded">
            <Edit size={18} />
          </button>
          <button onClick={onDelete} className="text-red-500 hover:bg-red-50 p-1 rounded">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
