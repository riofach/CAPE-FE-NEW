import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { PieChart, Sparkles, Zap, TrendingUp } from 'lucide-react';

const features = [
  {
    id: 'track',
    title: 'Auto Track',
    desc: 'Catat pengeluaran secepat kilat. Tinggal klik, ketik, beres. Ga pake ribet.',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-600',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=70'
  },
  {
    id: 'analytics',
    title: 'Visual Analytics',
    desc: 'Liat grafik pengeluaran yang aesthetic. Jadi tau deh duit abis buat apa aja (Spoiler: Makanan).',
    icon: PieChart,
    color: 'bg-emerald-100 text-emerald-600',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=70'
  },
  {
    id: 'ai-input',
    title: 'AI Smart Input',
    desc: 'Ketik aja "Beli kopi 25rb" terus AI langsung paham kategori dan jumlahnya. Kayak punya asisten pribadi yang ngerti bahasa kamu! 🤖',
    icon: Sparkles,
    color: 'bg-violet-100 text-violet-600',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=70' 
  },
  {
    id: 'history',
    title: 'History Check',
    desc: 'Flashback ke masa lalu liat dosa-dosa finansialmu di bulan kemarin. Buat introspeksi diri.',
    icon: TrendingUp,
    color: 'bg-purple-100 text-purple-600',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=70'
  }
];

export const Features: React.FC = () => {
  const [activeTab, setActiveTab] = useState(features[0]);

  return (
    <section id="features" className="py-24 px-6 bg-[#f0f4f8]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <span className="bg-emerald-100 text-emerald-600 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">Fitur Unggulan</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-800 mt-6">Ga Cuma Catetan Biasa</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Tabs */}
          <div className="lg:col-span-5 space-y-4">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                onClick={() => setActiveTab(feature)}
                className={cn(
                  "cursor-pointer p-6 rounded-3xl transition-all duration-300 border-2",
                  activeTab.id === feature.id 
                    ? "bg-white border-emerald-200 shadow-clay scale-105" 
                    : "bg-transparent border-transparent hover:bg-white/50 opacity-70 hover:opacity-100"
                )}
                whileHover={{ x: 10 }}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-2xl", feature.color)}>
                    <feature.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{feature.title}</h3>
                    {activeTab.id === feature.id && (
                       <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-slate-500 mt-2 text-sm leading-relaxed"
                       >
                         {feature.desc}
                       </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Screenshot Area */}
          <div className="lg:col-span-7 h-[500px] relative">
            <div className="absolute inset-0 bg-white/40 rounded-[3rem] shadow-[inset_10px_10px_20px_rgba(0,0,0,0.05)] border border-white/60 backdrop-blur-sm p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl"
                >
                  <img 
                    src={activeTab.image} 
                    alt={activeTab.title} 
                    className="w-full h-full object-cover"
                  />
                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                      <p className="text-white font-medium text-lg">{activeTab.desc}</p>
                   </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};