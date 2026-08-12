import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Click \"Generate\" — don't type this by hand, it becomes the category's URL param.",
      options: { source: "name" },
      validation: (r) =>
        r
          .required()
          .custom((value) =>
            !value?.current || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value.current)
              ? true
              : "Must be lowercase letters, numbers, and hyphens only (click Generate instead of typing it)."
          ),
    }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "isActive", title: "Active", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "name", media: "image" } },
});
