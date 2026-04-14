import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlineFactory, MdOutlineLock } from "react-icons/md";
import { AiOutlineMessage } from "react-icons/ai";
import type React from "react";

export interface ChooseUsFeature {
  id: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export const CHOOSE_US_FEATURES: ChooseUsFeature[] = [
  {
    id: 1,
    icon: <TbTruckDelivery size={24} />,
    title: "Fast Bulk Delivery",
    desc: "Efficient logistics and optimized shipping lanes for large-scale enterprise orders.",
  },
  {
    id: 2,
    icon: <MdOutlineFactory size={24} />,
    title: "Direct Factory Pricing",
    desc: "Cut out the middleman and maximize your margins with direct manufacturer sourcing.",
  },
  {
    id: 3,
    icon: <AiOutlineMessage size={24} />,
    title: "Easy Negotiation",
    desc: "Direct communication channels for custom wholesale deals and volume discounts.",
  },
  {
    id: 4,
    icon: <MdOutlineLock size={24} />,
    title: "Secure Payments",
    desc: "Industry-standard encryption and protected escrow transactions for complete peace of mind.",
  },
];
