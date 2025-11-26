import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '../ui/button';
import { User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const { user } = useAuth();

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
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/capev2-logo.png" 
            alt="CAPE Logo" 
            className="w-10 h-10"
          />
          <span className="font-heading font-bold text-xl text-slate-700">CAPE</span>
        </Link>

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

{user ? (
          <Link to="/dashboard">
            <Button size="sm" className="rounded-xl">
              <User className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button size="sm" className="rounded-xl">
              Get Started 🚀
            </Button>
          </Link>
        )}
      </div>
    </motion.nav>
  );
};