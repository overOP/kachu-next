import type { Category, Product } from "@/lib/types/api";

/**
 * Offline fallback catalog sourced from GST Trading's product catalog PDF.
 * Used when the backend API is unreachable so the storefront still has real content.
 *
 * Description format: intro line, then "Label:" section headers followed by
 * "- " bullet lines. ProductDetail renders "- " lines as list items.
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
      "Compact power tiller suited for small landholdings; used for soil preparation, ploughing, and weeding on smallholder farms. Supplied to Benighat Rorang RM under agri-equipment contract.\n\nFeatures:\n- 5.5 HP engine\n- Lightweight walk-behind frame\n- Adjustable tilling width\n- Pneumatic tires for easy transport\n\nAdvantages:\n- Affordable entry point for smallholders\n- Easy to maneuver in tight plots\n- Low fuel consumption\n- Minimal maintenance\n\nDisadvantages:\n- Limited power for hard or compacted soil\n- Narrower tilling width means more passes on larger plots",
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
      "Higher-capacity tiller for medium plot tilling and faster field turnaround, supplied alongside the 5.5 HP model to municipal agriculture programs.\n\nFeatures:\n- 7 HP engine\n- Wider tilling width\n- Reinforced gearbox\n- Higher ground clearance\n\nAdvantages:\n- Faster field turnaround\n- Handles tougher soil than the 5.5 HP model\n- Suited for medium-sized municipal programs\n\nDisadvantages:\n- Heavier and harder to maneuver in very small plots\n- Higher fuel consumption and upfront cost",
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
      "Motorized fodder-cutting machine used to chop crop residue and forage into feed-ready sizes for livestock, reducing manual labor.\n\nFeatures:\n- Motorized flywheel cutting blade\n- Hopper feed tray\n- Mobile stand with wheels\n\nAdvantages:\n- Cuts large volumes of fodder quickly\n- Reduces manual labor and injury risk from hand-cutting\n- Consistent feed-ready sizes\n\nDisadvantages:\n- Requires stable electricity supply\n- Blade needs periodic sharpening\n- Moving parts need safety guarding around livestock or children",
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
      "Oil press/expeller unit, filter unit, filling machine, and storage tank package for small-scale edible oil production. Currently under bid for FAO ITB 2026/FANEP/FANEP/137712 (Bardiya).\n\nFeatures:\n- Oil press/expeller unit\n- Filter unit\n- Filling machine\n- Storage tank — a full production line package\n\nAdvantages:\n- Enables small-scale edible oil production on-site\n- Covers pressing through filling and storage\n- Reduces reliance on outside processors\n\nDisadvantages:\n- High upfront investment\n- Needs a trained operator and regular maintenance\n- Output limited to small-scale batches",
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
      "Batch washing unit for cleaning harvested vegetables before market sale or processing, improving hygiene and shelf life.\n\nFeatures:\n- Rotating drum/bubble wash chamber\n- Water recirculation\n- Batch-load capacity\n\nAdvantages:\n- Improves hygiene and shelf life before market sale\n- Reduces manual washing labor\n- Handles bulk batches efficiently\n\nDisadvantages:\n- Uses significant water per cycle\n- Needs drainage and water supply infrastructure\n- Not suited for very delicate produce",
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
      "Mechanical cutter for slicing/dicing root vegetables (potato, radish, etc.) for processing or bulk kitchen use.\n\nFeatures:\n- Interchangeable cutting blades\n- Hopper feed\n- Motorized cutting disc\n\nAdvantages:\n- Speeds up slicing/dicing for bulk kitchen or processing use\n- Consistent cut sizes\n- Handles multiple root vegetable types\n\nDisadvantages:\n- Blade changeovers take setup time\n- Not suited for very soft or irregular-shaped produce\n- Requires regular blade sharpening",
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
      "Controlled-heat drying unit for vegetables, grains, or other produce, used to extend shelf life and reduce post-harvest loss.\n\nFeatures:\n- Controlled-heat drying chamber\n- Adjustable temperature and timer\n- Multi-tray loading\n\nAdvantages:\n- Extends shelf life of produce and grains\n- Reduces post-harvest loss\n- Works independent of weather unlike sun-drying\n\nDisadvantages:\n- Electricity running cost for long drying cycles\n- Tray capacity limits batch size\n- Uneven drying possible without regular tray rotation",
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
      "Continuous heat-sealing machine for packaging processed food products in plastic pouches.\n\nFeatures:\n- Continuous heat-sealing conveyor\n- Adjustable temperature control\n- Batch/date coding option\n\nAdvantages:\n- Fast continuous sealing for high packaging volumes\n- Consistent airtight seals\n- Works with various pouch materials\n\nDisadvantages:\n- Needs stable power and warm-up time\n- Seal quality depends on correct temperature and speed settings\n- Limited to pouch-style packaging",
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
      "Grinding machine that reduces grains, spices, or dried produce to fine powder for processing or packaging.\n\nFeatures:\n- High-speed hammer mill grinding chamber\n- Cyclone discharge\n- Dust-collecting unit\n\nAdvantages:\n- Produces fine powder from grains, spices, or dried produce\n- Continuous operation\n- Handles multiple raw materials\n\nDisadvantages:\n- Generates noise and dust requiring ventilation and PPE\n- Hammers wear down and need periodic replacement",
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
      "Industrial sewing unit supplied for bag-closing/stitching applications in agro-processing and packaging lines.\n\nFeatures:\n- Portable bag-closer design\n- Thread-lock stitch\n- Corded electric motor\n\nAdvantages:\n- Fast bag closing and stitching for packaging lines\n- Lightweight and hand-operable\n- Works on jute, woven, and paper bags\n\nDisadvantages:\n- Manual operation (not automated)\n- Thread supply must be monitored\n- Not designed for general garment sewing",
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
      "Bloodless castration tool for livestock, used in veterinary and animal husbandry programs.\n\nFeatures:\n- Stainless steel bloodless-clamp design\n- Spring-assisted handles\n- Multiple size options\n\nAdvantages:\n- Bloodless method reduces infection risk versus surgical castration\n- Reusable with no consumables\n- Straightforward veterinary use\n\nDisadvantages:\n- Requires trained handling for correct clamp placement\n- Incorrect use can cause incomplete castration",
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
      "Manual/backpack agricultural sprayer for pesticide, herbicide, or fertilizer application on farm plots.\n\nFeatures:\n- Backpack-mounted tank\n- Manual pump lever\n- Adjustable nozzle lance\n\nAdvantages:\n- Portable and doesn't need electricity or fuel\n- Low-cost application of pesticide, herbicide, or fertilizer\n- Easy to operate and maintain\n\nDisadvantages:\n- Manual pumping is physically tiring for large plots\n- Tank capacity limits coverage per fill",
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
      "Heavy-duty waterproof sheeting used for crop drying, storage covering, and general farm protection.\n\nFeatures:\n- Heavy-duty waterproof woven sheeting\n- Reinforced edges/eyelets\n- UV-treated finish\n\nAdvantages:\n- Versatile for crop drying, storage covering, and general protection\n- Durable against tearing and weather\n- Affordable per unit\n\nDisadvantages:\n- Degrades under prolonged UV exposure without treatment\n- Heavy and bulky to move at larger sizes",
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
      "UV-resistant sheeting used to construct low tunnels/greenhouses for season extension and crop protection.\n\nFeatures:\n- UV-resistant polyethylene sheeting\n- Designed for low-tunnel/greenhouse frames\n\nAdvantages:\n- Extends growing season and protects crops from pests and weather\n- Improves early yield\n- Reusable across seasons\n\nDisadvantages:\n- Needs a supporting frame structure sold separately\n- Can overheat crops in high sun without ventilation",
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
      "Plastic containers/bottles supplied under government contract (Singhadurbar Vaidyakhana Vikash Samiti) for institutional packaging use.\n\nFeatures:\n- Food-grade HDPE/PET construction\n- Standard institutional packaging sizes\n- Screw-cap sealing\n\nAdvantages:\n- Lightweight and shatterproof versus glass\n- Cost-effective for bulk institutional supply\n- Customizable sizes and labeling\n\nDisadvantages:\n- Less eco-friendly than reusable or glass containers\n- Not ideal for very hot-fill liquids without heat-rated plastic",
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
      "Packaging supplies for institutional and NGO programs; currently bidding on UNDP-NPL-00691 for the RERAS project.\n\nFeatures:\n- Mixed cardboard boxes\n- Paper bags\n- Protective packaging supplies\n\nAdvantages:\n- Covers varied institutional and NGO packaging needs\n- Recyclable/biodegradable options available\n- Supports program-specific customization\n\nDisadvantages:\n- Less durable than plastic in wet conditions\n- Bulk storage requires more space",
    minimumOrder: 100,
    stock: 5000,
    images: ["/products/general-packaging-materials.jpg"],
    categoryId: "plastics-packaging",
    isActive: true,
  },
];
