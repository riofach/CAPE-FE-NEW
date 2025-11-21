import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '../ui/button';
import { Wallet } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center justify-between bg-[#f0f4f8]/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-clay-float border border-white/40 w-full max-w-4xl">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-inner">
            <Wallet size={20} />
          </div>
          <span className="font-heading font-bold text-xl text-slate-700">CAPE</span>
        </div>

        <div className="hidden md:flex gap-6 font-medium text-slate-600">
          {['Features', 'Pricing', 'Testimonials'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="hover:text-emerald-500 transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <Button size="sm" className="rounded-xl">
          Login
        </Button>
      </div>
    </motion.nav>
  );
};