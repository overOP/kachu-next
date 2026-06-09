"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import type { Category } from "@/lib/types/api";
import { useAddCategoryMutation } from "@/lib/api/admin/admin-category-api";
import { parseApiError } from "@/lib/api/errors";
import { authInputClassName, authLabelClassName } from "@/components/auth/authFieldClasses";

type QuickAddCategoryFieldProps = {
  categories?: Category[];
  onCreated: (categoryId: string) => void;
  disabled?: boolean;
};

function findCategoryByName(categories: Category[], name: string): Category | undefined {
  const needle = name.trim().toLowerCase();
  return categories.find((c) => c.name.trim().toLowerCase() === needle);
}

export default function QuickAddCategoryField({
  categories = [],
  onCreated,
  disabled = false,
}: QuickAddCategoryFieldProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [addCategory, { isLoading }] = useAddCategoryMutation();

  const selectExisting = (category: Category) => {
    setName("");
    setError("");
    setOpen(false);
    onCreated(category.id);
  };

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter a category name.");
      return;
    }

    const existing = findCategoryByName(categories, trimmed);
    if (existing) {
      selectExisting(existing);
      return;
    }

    setError("");
    try {
      const created = await addCategory({ name: trimmed }).unwrap();
      selectExisting(created);
    } catch (err) {
      const message = parseApiError(err, "Could not create category.").message;
      const duplicate = findCategoryByName(categories, trimmed);
      if (duplicate && /already exists/i.test(message)) {
        selectExisting(duplicate);
        return;
      }
      setError(message);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:underline disabled:opacity-60 dark:text-sky-300"
      >
        <FiPlus className="h-4 w-4" aria-hidden />
        New category
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 dark:border-zinc-700 dark:bg-zinc-800/40">
      <label htmlFor="quick-cat-name" className={authLabelClassName}>
        New category name
      </label>
      <div className="mt-1.5 flex flex-wrap gap-2">
        <input
          id="quick-cat-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={disabled || isLoading}
          placeholder="e.g. Spices"
          className={`min-w-0 flex-1 ${authInputClassName}`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void handleCreate();
            }
          }}
        />
        <button
          type="button"
          onClick={() => void handleCreate()}
          disabled={disabled || isLoading}
          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60 dark:bg-sky-600"
        >
          {isLoading ? "Adding…" : "Add"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setName("");
            setError("");
          }}
          disabled={isLoading}
          className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold dark:border-zinc-600"
        >
          Cancel
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-xs text-red-700 dark:text-red-300">{error}</p>
      ) : null}
    </div>
  );
}
