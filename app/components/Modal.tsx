"use client";

import { useState, useRef, useCallback, ReactNode } from "react";
import { X, ImagePlus, ChevronDown, Trash2 } from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = ["Electronics", "Clothing", "Food & Beverage", "Furniture", "Toys", "Other"];
const FACTORIES = ["Factory A", "Factory B", "Factory C", "Factory D"];

// ── Types ─────────────────────────────────────────────────────────────────────
export type ModalType = "product" | "factory";

export interface ProductData {
  id: string;
  name: string;
  price: string;
  image: string;
}

interface Props {
  type: ModalType;
  editProduct?: ProductData;
  onClose?: () => void;
  onSave?: (name: string, price: string) => void;
}

interface ProductFormState {
  name: string;
  price: string;
  category: string;
  factory: string;
  minOrderQty: string;
  deliveryTimeline: string;
  description: string;
}

interface FactoryFormState {
  name: string;
  description: string;
  location: string;
  established: string;
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputCls =
  "px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 hover:border-green-300 transition-all w-full";

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

// ── useImageUpload hook ───────────────────────────────────────────────────────
function useImageUpload() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const addImages = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const remaining = 4 - images.length;
      if (remaining <= 0) return;
      const newFiles = Array.from(files).slice(0, remaining);
      setImages((prev) => [...prev, ...newFiles]);
      setPreviews((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))]);
    },
    [images.length],
  );

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(previews[idx]);
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  return { previews, addImages, removeImage };
}

// ── SelectField ───────────────────────────────────────────────────────────────
function SelectField({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Field label={label}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all"
        >
          <span className={value ? "text-gray-800" : ""}>{value || placeholder}</span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <ul className="absolute z-50 w-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-green-50 hover:text-green-700 transition-colors ${
                  value === opt ? "bg-green-50 text-green-700 font-medium" : "text-gray-700"
                }`}
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Field>
  );
}

// ── ImageUpload ───────────────────────────────────────────────────────────────
function ImageUpload({
  previews,
  onAdd,
  onRemove,
  label = "Product Images (Multiple upload)",
}: {
  previews: string[];
  label?: string;
  onAdd: (files: FileList | null) => void;
  onRemove: (idx: number) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <Field label={label}>
      <>
        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-2">
            {previews.map((src, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        {previews.length < 4 && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); onAdd(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl px-6 py-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
              dragOver
                ? "border-green-400 bg-green-50"
                : "border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50"
            }`}
          >
            <ImagePlus size={28} className="text-gray-400" />
            <p className="text-sm text-gray-500">Click to upload or drag and drop images</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onAdd(e.target.files)}
            />
          </div>
        )}
        <p className="text-xs text-gray-400">Maximum 4 images</p>
      </>
    </Field>
  );
}

// ── ProductForm ───────────────────────────────────────────────────────────────
function ProductForm({
  onClose,
  onSave,
  initialData,
}: {
  onClose?: () => void;
  onSave?: (name: string, price: string) => void;
  initialData?: ProductData;
}) {
  const [form, setForm] = useState<ProductFormState>({
    name: initialData?.name ?? "",
    price: initialData?.price ?? "",
    category: "",
    factory: "",
    minOrderQty: "",
    deliveryTimeline: "",
    description: "",
  });
  const { previews, addImages, removeImage } = useImageUpload();

  const set = (key: keyof ProductFormState, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.name || !form.price) {
      alert("Please fill in: Name and Price");
      return;
    }
    onSave?.(form.name, form.price);
    onClose?.();
  };

  return (
    <div className="px-6 py-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Product Name">
          <input type="text" placeholder="Enter product name" value={form.name}
            onChange={(e) => set("name", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Price per piece">
          <input type="text" placeholder="Enter Price" value={form.price}
            onChange={(e) => set("price", e.target.value)} className={inputCls} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField label="Category" value={form.category} options={CATEGORIES}
          placeholder="Category" onChange={(v) => set("category", v)} />
        <SelectField label="Factory" value={form.factory} options={FACTORIES}
          placeholder="Factory" onChange={(v) => set("factory", v)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Minimum Order Quantity">
          <input type="number" placeholder="Enter Minimum Order Quantity" value={form.minOrderQty}
            onChange={(e) => set("minOrderQty", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Delivery Timeline">
          <input type="text" placeholder="Enter Delivery Timeline" value={form.deliveryTimeline}
            onChange={(e) => set("deliveryTimeline", e.target.value)} className={inputCls} />
        </Field>
      </div>

      <Field label="Description">
        <textarea placeholder="Enter Description" rows={4} value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className={`${inputCls} resize-none`} />
      </Field>

      <ImageUpload previews={previews} onAdd={addImages} onRemove={removeImage} />

      <button type="button" onClick={handleSubmit}
        className="w-full py-3.5 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
        {initialData ? "Save Changes" : "Add Product"}
      </button>
    </div>
  );
}

// ── FactoryForm ───────────────────────────────────────────────────────────────
function FactoryForm({ onClose }: { onClose?: () => void }) {
  const [form, setForm] = useState<FactoryFormState>({
    name: "",
    description: "",
    location: "",
    established: "",
  });
  const { previews, addImages, removeImage } = useImageUpload();

  const set = (key: keyof FactoryFormState, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.name || !form.location) {
      alert("Please fill in: Factory Name and Location");
      return;
    }
    onClose?.();
  };

  return (
    <div className="px-6 py-5 space-y-4">
      <Field label="Factory Name">
        <input type="text" placeholder="Enter factory name" value={form.name}
          onChange={(e) => set("name", e.target.value)} className={inputCls} />
      </Field>

      <Field label="Description">
        <textarea placeholder="Enter Description" rows={5} value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className={`${inputCls} resize-none`} />
      </Field>

      <Field label="Location">
        <input type="text" placeholder="Enter Location" value={form.location}
          onChange={(e) => set("location", e.target.value)} className={inputCls} />
      </Field>

      <Field label="Established">
        <input type="text" placeholder="Enter Established Date" value={form.established}
          onChange={(e) => set("established", e.target.value)} className={inputCls} />
      </Field>

      <ImageUpload previews={previews} onAdd={addImages} onRemove={removeImage} label="Factory Images" />

      <button type="button" onClick={handleSubmit}
        className="w-full py-3.5 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
        Add Factory
      </button>
    </div>
  );
}

// ── Modal shell ───────────────────────────────────────────────────────────────
export default function Modal({ type, editProduct, onClose, onSave }: Props) {
  const title =
    type === "product"
      ? editProduct ? "Edit Product" : "Let's add your new products"
      : "Let's add your new factory";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-center text-xl font-semibold text-gray-800 tracking-tight">{title}</h2>
          <button onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        {type === "product" ? (
          <ProductForm onClose={onClose} onSave={onSave} initialData={editProduct} />
        ) : (
          <FactoryForm onClose={onClose} />
        )}
      </div>
    </div>
  );
}
