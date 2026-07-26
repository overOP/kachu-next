import type { Category, Product } from "@/lib/types/api";

/**
 * Offline fallback catalog sourced from GST Trading's product catalog PDF.
 * Used when the backend API is unreachable so the storefront still has real content.
 */
export const localCategories: Category[] = [
  {
    id: "agricultural-machinery",
    name: "Agricultural Machinery",
    description: "Tillers, chaff cutters, and oil mill equipment for smallholder and municipal farm programs.",
    image: "/products/mini-tiller-55hp.jpg",
    isActive: true,
  },
  {
    id: "agro-processing-equipment",
    name: "Agro-Processing Equipment",
    description: "Washing, cutting, drying, sealing, and grinding machinery for post-harvest processing.",
    image: "/products/vegetable-washing-machine.jpg",
    isActive: true,
  },
  {
    id: "livestock-farm-support",
    name: "Livestock & Farm Support Equipment",
    description: "Veterinary tools and sprayers for animal husbandry and crop protection.",
    image: "/products/sprayer.jpg",
    isActive: true,
  },
  {
    id: "plastics-packaging",
    name: "Plastics & Packaging Materials",
    description: "Tarpaulin, tunnel plastic, bottles, and general packaging supplies for institutional contracts.",
    image: "/products/tarpaulin-plastic.jpg",
    isActive: true,
  },
];

export const localProducts: Product[] = [
  {
    id: "mini-tiller-55hp",
    name: "Mini Tiller (5.5 HP)",
    price: 85000,
    description:
      "Compact power tiller suited for small landholdings; used for soil preparation, ploughing, and weeding on smallholder farms. Supplied to Benighat Rorang RM under agri-equipment contract.",
    minimumOrder: 1,
    stock: 10,
    images: ["/products/mini-tiller-55hp.jpg"],
    categoryId: "agricultural-machinery",
    isActive: true,
  },
  {
    id: "mini-tiller-7hp",
    name: "Mini Tiller (7 HP)",
    price: 105000,
    description:
      "Higher-capacity tiller for medium plot tilling and faster field turnaround, supplied alongside the 5.5 HP model to municipal agriculture programs.",
    minimumOrder: 1,
    stock: 8,
    images: ["/products/mini-tiller-7hp.jpg"],
    categoryId: "agricultural-machinery",
    isActive: true,
  },
  {
    id: "electrical-chaff-cutter",
    name: "Electrical Chaff Cutter",
    price: 45000,
    description:
      "Motorized fodder-cutting machine used to chop crop residue and forage into feed-ready sizes for livestock, reducing manual labor.",
    minimumOrder: 1,
    stock: 12,
    images: ["/products/electrical-chaff-cutter.jpg"],
    categoryId: "agricultural-machinery",
    isActive: true,
  },
  {
    id: "oil-mill-machinery",
    name: "Oil Mill Machinery & Equipment",
    price: 320000,
    description:
      "Oil press/expeller unit, filter unit, filling machine, and storage tank package for small-scale edible oil production. Currently under bid for FAO ITB 2026/FANEP/FANEP/137712 (Bardiya).",
    minimumOrder: 1,
    stock: 3,
    images: ["/products/oil-mill-machinery.jpg"],
    categoryId: "agricultural-machinery",
    isActive: true,
  },
  {
    id: "vegetable-washing-machine",
    name: "Vegetable Washing Machine",
    price: 150000,
    description:
      "Batch washing unit for cleaning harvested vegetables before market sale or processing, improving hygiene and shelf life.",
    minimumOrder: 1,
    stock: 6,
    images: ["/products/vegetable-washing-machine.jpg"],
    categoryId: "agro-processing-equipment",
    isActive: true,
  },
  {
    id: "root-vegetable-cutter",
    name: "Root Vegetable Cutter",
    price: 65000,
    description:
      "Mechanical cutter for slicing/dicing root vegetables (potato, radish, etc.) for processing or bulk kitchen use.",
    minimumOrder: 1,
    stock: 10,
    images: ["/products/root-vegetable-cutter.jpg"],
    categoryId: "agro-processing-equipment",
    isActive: true,
  },
  {
    id: "electric-dryer",
    name: "Electric Dryer",
    price: 95000,
    description:
      "Controlled-heat drying unit for vegetables, grains, or other produce, used to extend shelf life and reduce post-harvest loss.",
    minimumOrder: 1,
    stock: 7,
    images: ["/products/electric-dryer.jpg"],
    categoryId: "agro-processing-equipment",
    isActive: true,
  },
  {
    id: "band-sealer",
    name: "Band Sealer",
    price: 38000,
    description:
      "Continuous heat-sealing machine for packaging processed food products in plastic pouches.",
    minimumOrder: 1,
    stock: 15,
    images: ["/products/band-sealer.jpg"],
    categoryId: "agro-processing-equipment",
    isActive: true,
  },
  {
    id: "impact-pulverizer",
    name: "Impact Pulverizer",
    price: 78000,
    description:
      "Grinding machine that reduces grains, spices, or dried produce to fine powder for processing or packaging.",
    minimumOrder: 1,
    stock: 9,
    images: ["/products/impact-pulverizer.jpg"],
    categoryId: "agro-processing-equipment",
    isActive: true,
  },
  {
    id: "sewing-machine",
    name: "Sewing Machine",
    price: 22000,
    description:
      "Industrial sewing unit supplied for bag-closing/stitching applications in agro-processing and packaging lines.",
    minimumOrder: 1,
    stock: 20,
    images: ["/products/sewing-machine.png"],
    categoryId: "agro-processing-equipment",
    isActive: true,
  },
  {
    id: "burdizzo-castrator",
    name: "Burdizzo Castrator",
    price: 3500,
    description:
      "Bloodless castration tool for livestock, used in veterinary and animal husbandry programs.",
    minimumOrder: 1,
    stock: 30,
    images: ["/products/burdizzo-castrator.jpg"],
    categoryId: "livestock-farm-support",
    isActive: true,
  },
  {
    id: "sprayer",
    name: "Sprayer",
    price: 4500,
    description:
      "Manual/backpack agricultural sprayer for pesticide, herbicide, or fertilizer application on farm plots.",
    minimumOrder: 1,
    stock: 40,
    images: ["/products/sprayer.jpg"],
    categoryId: "livestock-farm-support",
    isActive: true,
  },
  {
    id: "tarpaulin-plastic",
    name: "Tarpaulin Plastic",
    price: 2500,
    description:
      "Heavy-duty waterproof sheeting used for crop drying, storage covering, and general farm protection.",
    minimumOrder: 5,
    stock: 100,
    images: ["/products/tarpaulin-plastic.jpg"],
    categoryId: "plastics-packaging",
    isActive: true,
  },
  {
    id: "tunnel-plastic",
    name: "Tunnel Plastic",
    price: 3200,
    description:
      "UV-resistant sheeting used to construct low tunnels/greenhouses for season extension and crop protection.",
    minimumOrder: 5,
    stock: 80,
    images: ["/products/tunnel-plastic.jpg"],
    categoryId: "plastics-packaging",
    isActive: true,
  },
  {
    id: "plastic-bottles-batta",
    name: "Plastic Bottles / Plastic Batta",
    price: 15,
    description:
      "Plastic containers/bottles supplied under government contract (Singhadurbar Vaidyakhana Vikash Samiti) for institutional packaging use.",
    minimumOrder: 500,
    stock: 20000,
    images: ["/products/plastic-bottles-batta.jpg"],
    categoryId: "plastics-packaging",
    isActive: true,
  },
  {
    id: "general-packaging-materials",
    name: "General Packaging Materials",
    price: 50,
    description:
      "Packaging supplies for institutional and NGO programs; currently bidding on UNDP-NPL-00691 for the RERAS project.",
    minimumOrder: 100,
    stock: 5000,
    images: ["/products/general-packaging-materials.jpg"],
    categoryId: "plastics-packaging",
    isActive: true,
  },
];
