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
    image: "/products/mini-tiller-55hp.png",
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
    image: "/products/tarpaulin-plastic.png",
    isActive: true,
  },
];

export const localProducts: Product[] = [
  {
    id: "mini-tiller-55hp",
    name: "Mini Tiller (5.5 HP)",
    price: 85000,
    description:
      "Compact power tiller suited for small landholdings; used for soil preparation, ploughing, and weeding on smallholder farms. Supplied to Benighat Rorang RM under agri-equipment contract.\n\nFeatures: 5.5 HP engine, lightweight walk-behind frame, adjustable tilling width, pneumatic tires for easy transport.\nAdvantages: Affordable entry point for smallholders, easy to maneuver in tight plots, low fuel consumption, minimal maintenance.\nDisadvantages: Limited power for hard or compacted soil, narrower tilling width means more passes on larger plots.",
    minimumOrder: 1,
    stock: 10,
    images: ["/products/mini-tiller-55hp.png"],
    categoryId: "agricultural-machinery",
    isActive: true,
  },
  {
    id: "mini-tiller-7hp",
    name: "Mini Tiller (7 HP)",
    price: 105000,
    description:
      "Higher-capacity tiller for medium plot tilling and faster field turnaround, supplied alongside the 5.5 HP model to municipal agriculture programs.\n\nFeatures: 7 HP engine, wider tilling width, reinforced gearbox, higher ground clearance.\nAdvantages: Faster field turnaround, handles tougher soil than the 5.5 HP model, suited for medium-sized municipal programs.\nDisadvantages: Heavier and harder to maneuver in very small plots, higher fuel consumption and upfront cost.",
    minimumOrder: 1,
    stock: 8,
    images: ["/products/mini-tiller-7hp.png"],
    categoryId: "agricultural-machinery",
    isActive: true,
  },
  {
    id: "electrical-chaff-cutter",
    name: "Electrical Chaff Cutter",
    price: 45000,
    description:
      "Motorized fodder-cutting machine used to chop crop residue and forage into feed-ready sizes for livestock, reducing manual labor.\n\nFeatures: Motorized flywheel cutting blade, hopper feed tray, mobile stand with wheels.\nAdvantages: Cuts large volumes of fodder quickly, reduces manual labor and injury risk from hand-cutting, consistent feed-ready sizes.\nDisadvantages: Requires stable electricity supply, blade needs periodic sharpening, moving parts need safety guarding around livestock or children.",
    minimumOrder: 1,
    stock: 12,
    images: ["/products/electrical-chaff-cutter.png"],
    categoryId: "agricultural-machinery",
    isActive: true,
  },
  {
    id: "oil-mill-machinery",
    name: "Oil Mill Machinery & Equipment",
    price: 320000,
    description:
      "Oil press/expeller unit, filter unit, filling machine, and storage tank package for small-scale edible oil production. Currently under bid for FAO ITB 2026/FANEP/FANEP/137712 (Bardiya).\n\nFeatures: Oil press/expeller, filter unit, filling machine, and storage tank — a full production line package.\nAdvantages: Enables small-scale edible oil production on-site, covers pressing through filling and storage, reduces reliance on outside processors.\nDisadvantages: High upfront investment, needs a trained operator and regular maintenance, output limited to small-scale batches.",
    minimumOrder: 1,
    stock: 3,
    images: ["/products/oil-mill-machinery.png"],
    categoryId: "agricultural-machinery",
    isActive: true,
  },
  {
    id: "vegetable-washing-machine",
    name: "Vegetable Washing Machine",
    price: 150000,
    description:
      "Batch washing unit for cleaning harvested vegetables before market sale or processing, improving hygiene and shelf life.\n\nFeatures: Rotating drum/bubble wash chamber, water recirculation, batch-load capacity.\nAdvantages: Improves hygiene and shelf life before market sale, reduces manual washing labor, handles bulk batches efficiently.\nDisadvantages: Uses significant water per cycle, needs drainage and water supply infrastructure, not suited for very delicate produce.",
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
      "Mechanical cutter for slicing/dicing root vegetables (potato, radish, etc.) for processing or bulk kitchen use.\n\nFeatures: Interchangeable cutting blades, hopper feed, motorized cutting disc.\nAdvantages: Speeds up slicing/dicing for bulk kitchen or processing use, consistent cut sizes, handles multiple root vegetable types.\nDisadvantages: Blade changeovers take setup time, not suited for very soft or irregular-shaped produce, requires regular blade sharpening.",
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
      "Controlled-heat drying unit for vegetables, grains, or other produce, used to extend shelf life and reduce post-harvest loss.\n\nFeatures: Controlled-heat drying chamber, adjustable temperature and timer, multi-tray loading.\nAdvantages: Extends shelf life of produce and grains, reduces post-harvest loss, works independent of weather unlike sun-drying.\nDisadvantages: Electricity running cost for long drying cycles, tray capacity limits batch size, uneven drying possible without regular tray rotation.",
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
      "Continuous heat-sealing machine for packaging processed food products in plastic pouches.\n\nFeatures: Continuous heat-sealing conveyor, adjustable temperature control, batch/date coding option.\nAdvantages: Fast continuous sealing for high packaging volumes, consistent airtight seals, works with various pouch materials.\nDisadvantages: Needs stable power and warm-up time, seal quality depends on correct temperature and speed settings, limited to pouch-style packaging.",
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
      "Grinding machine that reduces grains, spices, or dried produce to fine powder for processing or packaging.\n\nFeatures: High-speed hammer mill grinding chamber, cyclone discharge, dust-collecting unit.\nAdvantages: Produces fine powder from grains, spices, or dried produce, continuous operation, handles multiple raw materials.\nDisadvantages: Generates noise and dust requiring ventilation and PPE, hammers wear down and need periodic replacement.",
    minimumOrder: 1,
    stock: 9,
    images: ["/products/impact-pulverizer.png"],
    categoryId: "agro-processing-equipment",
    isActive: true,
  },
  {
    id: "sewing-machine",
    name: "Sewing Machine",
    price: 22000,
    description:
      "Industrial sewing unit supplied for bag-closing/stitching applications in agro-processing and packaging lines.\n\nFeatures: Portable bag-closer design, thread-lock stitch, corded electric motor.\nAdvantages: Fast bag closing and stitching for packaging lines, lightweight and hand-operable, works on jute, woven, and paper bags.\nDisadvantages: Manual operation (not automated), thread supply must be monitored, not designed for general garment sewing.",
    minimumOrder: 1,
    stock: 20,
    images: ["/products/sewing-machine.webp"],
    categoryId: "agro-processing-equipment",
    isActive: true,
  },
  {
    id: "burdizzo-castrator",
    name: "Burdizzo Castrator",
    price: 3500,
    description:
      "Bloodless castration tool for livestock, used in veterinary and animal husbandry programs.\n\nFeatures: Stainless steel bloodless-clamp design, spring-assisted handles, multiple size options.\nAdvantages: Bloodless method reduces infection risk versus surgical castration, reusable with no consumables, straightforward veterinary use.\nDisadvantages: Requires trained handling for correct clamp placement, incorrect use can cause incomplete castration.",
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
      "Manual/backpack agricultural sprayer for pesticide, herbicide, or fertilizer application on farm plots.\n\nFeatures: Backpack-mounted tank, manual pump lever, adjustable nozzle lance.\nAdvantages: Portable and doesn't need electricity or fuel, low-cost application of pesticide, herbicide, or fertilizer, easy to operate and maintain.\nDisadvantages: Manual pumping is physically tiring for large plots, tank capacity limits coverage per fill.",
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
      "Heavy-duty waterproof sheeting used for crop drying, storage covering, and general farm protection.\n\nFeatures: Heavy-duty waterproof woven sheeting, reinforced edges/eyelets, UV-treated finish.\nAdvantages: Versatile for crop drying, storage covering, and general protection, durable against tearing and weather, affordable per unit.\nDisadvantages: Degrades under prolonged UV exposure without treatment, heavy and bulky to move at larger sizes.",
    minimumOrder: 5,
    stock: 100,
    images: ["/products/tarpaulin-plastic.png"],
    categoryId: "plastics-packaging",
    isActive: true,
  },
  {
    id: "tunnel-plastic",
    name: "Tunnel Plastic",
    price: 3200,
    description:
      "UV-resistant sheeting used to construct low tunnels/greenhouses for season extension and crop protection.\n\nFeatures: UV-resistant polyethylene sheeting, designed for low-tunnel/greenhouse frames.\nAdvantages: Extends growing season and protects crops from pests and weather, improves early yield, reusable across seasons.\nDisadvantages: Needs a supporting frame structure sold separately, can overheat crops in high sun without ventilation.",
    minimumOrder: 5,
    stock: 80,
    images: ["/products/tunnel-plastic.png"],
    categoryId: "plastics-packaging",
    isActive: true,
  },
  {
    id: "plastic-bottles-batta",
    name: "Plastic Bottles / Plastic Batta",
    price: 15,
    description:
      "Plastic containers/bottles supplied under government contract (Singhadurbar Vaidyakhana Vikash Samiti) for institutional packaging use.\n\nFeatures: Food-grade HDPE/PET construction, standard institutional packaging sizes, screw-cap sealing.\nAdvantages: Lightweight and shatterproof versus glass, cost-effective for bulk institutional supply, customizable sizes and labeling.\nDisadvantages: Less eco-friendly than reusable or glass containers, not ideal for very hot-fill liquids without heat-rated plastic.",
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
      "Packaging supplies for institutional and NGO programs; currently bidding on UNDP-NPL-00691 for the RERAS project.\n\nFeatures: Mixed cardboard boxes, paper bags, and protective packaging supplies.\nAdvantages: Covers varied institutional and NGO packaging needs, recyclable/biodegradable options available, supports program-specific customization.\nDisadvantages: Less durable than plastic in wet conditions, bulk storage requires more space.",
    minimumOrder: 100,
    stock: 5000,
    images: ["/products/general-packaging-materials.jpg"],
    categoryId: "plastics-packaging",
    isActive: true,
  },
];
