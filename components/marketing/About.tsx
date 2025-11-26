import React from 'react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 py-20">
      {/* Video Background Placeholder */}
      <div className="absolute inset-0 opacity-30">
         <img 
            src="https://images.unsplash.com/photo-1565514020176-db792f3b3933?auto=format&fit=crop&w=1200&q=70" 
            className="w-full h-full object-cover"
            loading="lazy"
            alt="Background"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-7xl font-heading font-bold text-white leading-tight mb-8">
            Misi Kami: <br/>
            <span className="text-emerald-400">Selamatkan Dompetmu</span> <br/>
            Dari Kepunahan.
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Kita semua pernah di sana. Awal bulan jadi Sultan 👑, akhir bulan makan mie instan 🍜.
            <br/><br/>
            CAPE hadir bukan buat nge-judge hobi jajan boba kamu, tapi buat ngasih tau realita dengan cara yang halus (dan sedikit menyakitkan). Biar kamu sadar, kalau nabung itu... mungkin ada gunanya.
          </p>
        </motion.div>
      </div>
    </section>
  );
};