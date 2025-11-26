import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../ui/button';
import { ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Optimized transforms with GPU acceleration
  const scaleImg = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacityImg = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[140vh] bg-[#f0f4f8]">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        
        {/* Top Visual - Parallax with GPU acceleration */}
        <motion.div 
          style={{ scale: scaleImg, opacity: opacityImg, willChange: 'transform, opacity' }}
          className="absolute inset-0 z-0 flex items-center justify-center"
        >
          <div className="relative w-full h-[60vh] max-w-5xl mx-auto mt-20 px-4">
            <img 
              src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80" 
              alt="Money Plant" 
              loading="eager"
              className="w-full h-full object-cover rounded-[3rem] shadow-[inset_0_0_40px_rgba(0,0,0,0.1)]"
            />
            {/* Floating Clay Elements - CSS animations for performance */}
            <div className="absolute top-10 -left-10 w-32 h-32 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
            <div className="absolute bottom-10 -right-10 w-40 h-40 bg-lime-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-delayed" />
          </div>
        </motion.div>

        {/* Bottom Sticky Text */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-8 pb-20 md:pb-32 bg-gradient-to-t from-[#f0f4f8] via-[#f0f4f8]/90 to-transparent pt-32">
          <motion.div 
            className="max-w-4xl mx-auto text-center space-y-6"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <h1 className="text-5xl md:text-8xl font-heading font-extrabold text-slate-800 leading-tight">
              Uang Habis <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-500">Tanpa Permisi?</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto">
              Catatan Pengeluaran (CAPE) bantu kamu lacak kemana perginya gaji. 
              Ga perlu pusing, ga perlu nangis di pojokan. 🚀
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button size="lg" className="rounded-full text-lg px-10">
                Coba Gratis Sekarang
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Arrow indicator */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-slate-400"
        >
          <ArrowDown size={32} />
        </motion.div>
      </div>
    </div>
  );
};