import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

export const Pricing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax: Pro card rises as you scroll (optimized with GPU acceleration)
  const yPro = useTransform(scrollYProgress, [0, 0.5, 1], [80, -40, 80]);

  return (
    <section id="pricing" ref={containerRef} className="py-32 px-6 bg-[#f0f4f8] overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-slate-800">
            Investasi Receh, <span className="text-emerald-500">Hasil Gede</span>
          </h2>
          <p className="text-xl text-slate-500 mt-4">Pilih yang sesuai dompet (dan niat) kamu.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#f0f4f8] p-8 rounded-[3rem] shadow-clay border border-white/50 relative z-0"
          >
            <h3 className="text-2xl font-bold text-slate-700">Si Hemat</h3>
            <div className="my-6">
               <span className="text-5xl font-heading font-extrabold text-slate-800">Rp 0</span>
               <span className="text-slate-400">/selamanya</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-600">
                <CheckCircle size={20} className="text-green-500" />
                <span>Catat Pengeluaran Unlimited</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <CheckCircle size={20} className="text-green-500" />
                <span>Lihat Kategori Terboros</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <CheckCircle size={20} className="text-green-500" />
                <span>Akses Website Full</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <XCircle size={20} />
                <span>AI Smart Input</span>
              </li>
            </ul>
            <Button variant="secondary" className="w-full shadow-none border border-slate-200">
              Daftar Gratis
            </Button>
          </motion.div>

          {/* Paid Plan - Parallax Effect */}
          <motion.div 
            style={{ y: yPro, willChange: 'transform' }}
            whileHover={{ scale: 1.02 }}
            className="bg-emerald-50 p-8 rounded-[3rem] shadow-[20px_20px_60px_#a7f3d0,-20px_-20px_60px_#ffffff] border border-emerald-100 relative z-10"
          >
            <div className="absolute -top-4 right-10 bg-lime-400 text-emerald-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                POPULAR 🚀
            </div>
            <h3 className="text-2xl font-bold text-emerald-800">Si Sultan</h3>
            <div className="my-6">
               <span className="text-5xl font-heading font-extrabold text-emerald-600">{formatPrice(10000)}</span>
               <span className="text-emerald-400">/bulan</span>
            </div>
            <p className="text-sm text-emerald-600/80 mb-6">Harga seblak doang, dapet asisten AI pribadi. 🤖</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle size={20} className="text-emerald-500" />
                <span><b>Semua Fitur Gratis</b></span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle size={20} className="text-emerald-500" />
                <span><b>AI Smart Input</b> - Ketik natural, AI parsing otomatis</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle size={20} className="text-emerald-500" />
                <span>Insight Keuangan AI-Powered</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle size={20} className="text-emerald-500" />
                <span>Support Prioritas (Kalau kami bangun)</span>
              </li>
            </ul>
            <Button variant="primary" className="w-full">
              Beli Sekarang
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};