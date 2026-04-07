"use client";

import { useLenis } from "./hooks/useLenis";
import Navbar from "./components/Navbar";
import HeroSlider from "./components/HeroSlider";
import AboutSection from "./components/AboutSection";
import ProductsSection from "./components/ProductsSection";
import FactoriesSection from "./components/FactoriesSection";
import Footer from "./components/Footer";
import ShopBy from "./components/Shopby";
import ChooseUs from "./components/ChooseUs";

export default function Home() {
  useLenis();

  return (
    <main className="grain">
      <Navbar />
      <div className="pt-16">
        <HeroSlider />
        <AboutSection />
        <ShopBy />
        <ProductsSection />
        <ChooseUs />
        <FactoriesSection />
        <Footer />
      </div>
    </main>
  );
}
