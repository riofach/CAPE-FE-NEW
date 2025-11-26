import React, { useEffect } from 'react';
import { Navbar } from '../components/layout/navbar';
import { Hero } from '../components/marketing/Hero';
import { About } from '../components/marketing/About';
import { Features } from '../components/marketing/Features';
import { Pricing } from '../components/marketing/Pricing';
import { Testimonials } from '../components/marketing/Testimonials';
import { Footer } from '../components/marketing/Footer';

export const Landing: React.FC = () => {
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = (this as HTMLAnchorElement).getAttribute('href');
        if(href) {
          document.querySelector(href)?.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <div className="font-sans bg-[#f0f4f8] min-h-screen selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};
