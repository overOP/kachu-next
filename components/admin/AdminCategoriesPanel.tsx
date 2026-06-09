"use client";

import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/lib/api/admin/admin-category-api";
import { parseApiError } from "@/lib/api/errors";
import { authInputClassName, authLabelClassName } from "@/components/auth/authFieldClasses";
import ImageFileField from "@/components/admin/ImageFileField";

export default function AdminCategoriesPanel() {
  const { data: categories = [], isLoading, isError } = useGetCategoriesQuery();
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);

  const busy = isAdding || isUpdating || isDeleting;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await addCategory({
        name: name.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(image.trim() ? { image: image.trim() } : {}),
      }).unwrap();
      setName("");
      setDescription("");
      setImage("");
    } catch (err) {
      setError(parseApiError(err, "Could not create category.").message);
    }
  };

  const startEdit = (
    id: string,
    currentName: string,
    desc?: string | null,
    img?: string | null,
    isActive = true
  ) => {
    setEditingId(id);
    setEditName(currentName);
    setEditDescription(desc ?? "");
    setEditImage(img ?? "");
    setEditIsActive(isActive !== false);
  };

  const saveEdit = async (id: string) => {
    setError("");
    try {
      await updateCategory({
        categoryId: id,
        updatedCategory: {
          name: editName.trim(),
          description: editDescription.trim() || undefined,
          image: editImage.trim() || undefined,
          isActive: editIsActive,
        },
      }).unwrap();
      setEditingId(null);
    } catch (err) {
      setError(parseApiError(err, "Could not update category.").message);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Delete this category? Products in this category may also be removed."
      )
    )
      return;
    setError("");
    try {
      await deleteCategory(id).unwrap();
    } catch (err) {
      setError(parseApiError(err, "Could not delete category.").message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-zinc-50">
          Categories
        </h1>
        <p className="mt-2 text-slate-600 dark:text-zinc-400">
          {isLoading ? "Loading…" : `${categories.length} categor${categories.length === 1 ? "y" : "ies"}`}
        </p>
      </header>

      {isError ? (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Could not load categories from the API.
        </p>
      ) : null}

      {error ? (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <form
        onSubmit={handleAdd}
        className="mb-8 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80"
      >
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-sky-400">
          <FiPlus className="h-4 w-4" aria-hidden />
          Add category
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="cat-name" className={authLabelClassName}>
              Name
            </label>
            <input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`mt-1.5 ${authInputClassName}`}
            />
          </div>
          <div>
            <label htmlFor="cat-desc" className={authLabelClassName}>
              Description (optional)
            </label>
            <textarea
              id="cat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={`mt-1.5 w-full resize-y ${authInputClassName}`}
            />
          </div>
          <div>
            <ImageFileField
              label="Category image (optional)"
              imageUrl={image}
              onImageUrlChange={setImage}
              kind="category"
              disabled={busy}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="mt-4 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 dark:bg-sky-600"
        >
          {isAdding ? "Adding…" : "Add category"}
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-emerald-100 bg-emerald-50/80 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-sky-400">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50 dark:divide-zinc-800">
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3">
                    {c.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400 dark:bg-zinc-800">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-emerald-950 dark:text-zinc-100">{c.name}</p>
                    {c.description ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{c.description}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{c.products?.length ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        c.isActive === false
                          ? "bg-slate-100 text-slate-500 dark:bg-zinc-800"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                      }`}
                    >
                      {c.isActive === false ? "Inactive" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === c.id ? (
                      <div className="space-y-2 text-left">
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} className={authInputClassName} placeholder="Name" />
                        <ImageFileField label="Image" imageUrl={editImage} onImageUrlChange={setEditImage} kind="category" disabled={busy} />
                        <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2} className={`w-full resize-y ${authInputClassName}`} />
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} />
                          Active
                        </label>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => saveEdit(c.id)} disabled={busy} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">Save</button>
                          <button type="button" onClick={() => setEditingId(null)} className="rounded-lg border px-3 py-1.5 text-xs font-semibold dark:border-zinc-600">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => startEdit(c.id, c.name, c.description, c.image, c.isActive)} className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold dark:border-zinc-600">Edit</button>
                        <button type="button" onClick={() => handleDelete(c.id)} disabled={busy} className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                          <FiTrash2 className="h-3.5 w-3.5" aria-hidden />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
