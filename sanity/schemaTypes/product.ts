import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Click \"Generate\" — don't type this by hand, it becomes the product's URL.",
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
    defineField({ name: "price", title: "Price", type: "number", validation: (r) => r.required().positive() }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 10,
      description: 'Plain text. Use "- " at the start of a line for bullet points (e.g. under a "Features:" line).',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "minimumOrder",
      title: "Minimum Order",
      type: "number",
      initialValue: 1,
      validation: (r) => r.required().positive(),
    }),
    defineField({ name: "stock", title: "Stock", type: "number" }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "isActive", title: "Active", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "name", subtitle: "price", media: "images.0" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ? `Rs. ${subtitle}` : undefined,
      media,
    }),
  },
});
