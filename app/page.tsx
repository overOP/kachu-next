import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
import ProductsSection from "./components/ProductsSection";
import FactoriesSection from "./components/FactoriesSection";
import Footer from "./components/Footer";
import ChooseUs from "./components/ChooseUs";

const HeroSlider = dynamic(() => import("./components/HeroSlider"));
const ShopBy = dynamic(() => import("./components/Shopby"));

export const revalidate = 3600; // Revalidate every hour for ISR

export default function Home() {
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
