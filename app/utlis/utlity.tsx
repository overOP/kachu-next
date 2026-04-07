// src/utils/features.tsx
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlineFactory, MdOutlineLock } from "react-icons/md";
import { AiOutlineMessage } from "react-icons/ai";
import React from 'react';

export interface Feature {
  id: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export const FEATURE_DATA: Feature[] = [
  {
    id: 1,
    icon: <TbTruckDelivery size={24} />,
    title: "Fast Bulk Delivery",
    desc: "Efficient logistics and optimized shipping lanes for large-scale enterprise orders."
  },
  {
    id: 2,
    icon: <MdOutlineFactory size={24} />,
    title: "Direct Factory Pricing",
    desc: "Cut out the middleman and maximize your margins with direct manufacturer sourcing."
  },
  {
    id: 3,
    icon: <AiOutlineMessage size={24} />,
    title: "Easy Negotiation",
    desc: "Direct communication channels for custom wholesale deals and volume discounts."
  },
  {
    id: 4,
    icon: <MdOutlineLock size={24} />,
    title: "Secure Payments",
    desc: "Industry-standard encryption and protected escrow transactions for complete peace of mind."
  }
];

export const slides=[
  
    {
    img: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=1400&q=85',
    tag: 'Featured Drop',
    title: 'Maximum Taste\nNo Sugar',
    sub: 'Discover the boldest flavors from top beverage brands worldwide.',
    cta: 'Shop Now',
  },
  {
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=85',
    tag: 'Direct from Source',
    title: 'Fresh from\nthe Factory',
    sub: 'Straight from manufacturers to your doorstep. No middlemen.',
    cta: 'Explore',
  },
  {
    img: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1400&q=85',
    tag: 'Wholesale Deals',
    title: 'Shop Smarter\nwith Kart',
    sub: 'Your one-stop wholesale marketplace for every need.',
    cta: 'Get Started',
  },
    ];

 export const factories = [
      { name: 'PepsiCo', country: 'USA', products: 340, img: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&q=80' },
      { name: 'Nestlé', country: 'Switzerland', products: 210, img: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80' },
      { name: 'Unilever', country: 'Netherlands', products: 180, img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80' },
      { name: 'Coca-Cola', country: 'USA', products: 290, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80' },
    ];
    
    
