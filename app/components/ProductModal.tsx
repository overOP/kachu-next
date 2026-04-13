"use client";

import Modal, { ProductData } from "@/app/components/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductData;
  onSave?: (name: string, price: string) => void;
}

export default function ProductModal({ isOpen, onClose, product, onSave }: Props) {
  if (!isOpen) return null;
  return <Modal type="product" editProduct={product} onClose={onClose} onSave={onSave} />;
}
