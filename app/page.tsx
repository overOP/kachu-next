'use client';

import { useLenis } from './hooks/useLenis';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import AboutSection from './components/AboutSection';
import ProductsSection from './components/ProductsSection';
import Footer from './components/Footer';
import ChooseUs from './components/ChooseUs';
import OwnerMessage from './components/OwnerMessage';

export default function Home() {
  useLenis();

  return (
    <main className="grain">
      <Navbar />
      <div className="pt-16">
        <HeroSlider />
        <AboutSection />
        <ProductsSection />
        <OwnerMessage/>
        <ChooseUs/>
        <Footer />
      </div>
    </main>
  );
}
