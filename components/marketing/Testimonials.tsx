import React from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../ui/clay-card';

const testimonials = [
  {
    name: "Budi Santoso",
    role: "Anak Kos Pro",
    text: "Sejak pake CAPE, gue jadi tau kalo 70% duit gue abis buat kopi susu gula aren. Menohok, tapi bermanfaat.",
    img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    color: "white" as const
  },
  {
    name: "Siti Aminah",
    role: "Ibu Rumah Tangga",
    text: "Fitur WA Bot-nya ngebantu banget! Lagi di pasar tinggal chat 'Beli Ikan 50rb', langsung kecatet. Mantap!",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    color: "green" as const
  },
  {
    name: "Dedi Corbuzier KW",
    role: "Content Creator",
    text: "10 Ribu doang bisa punya asisten keuangan? Worth it parah sih. Daripada duitnya ilang gatau kemana.",
    img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80",
    color: "lime" as const
  },
  {
    name: "Rina Nose",
    role: "Freelancer",
    text: "Aplikasi ini kaya temen yang jujur banget. 'Woy duit lu abis!' tapi pake font lucu jadi ga sakit hati.",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    color: "white" as const
  },
  {
    name: "Joko Anwar",
    role: "Mahasiswa Abadi",
    text: "Tampilan 'Soft Clay'-nya bikin mata adem pas liat saldo yang panas. UI/UX nya juara!",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    color: "green" as const
  },
  {
    name: "Sarah Sechan",
    role: "Manager",
    text: "Finally, tracker keuangan yang ga ngebosenin. Kaya main game, tapi yang dipertaruhkan masa depan.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    color: "lime" as const
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="relative py-40 bg-gradient-to-b from-[#f0f4f8] to-emerald-50/50 overflow-hidden">
       <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-lime-200/30 rounded-full blur-3xl" />
       </div>

       <div className="max-w-7xl mx-auto px-6 relative z-10">
         <div className="text-center mb-20">
            <h2 className="text-4xl font-heading font-bold text-slate-800">
                Apa Kata Mereka? <br/>
                <span className="text-emerald-500 text-xl font-normal">(Yang sudah tobat boros)</span>
            </h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div className="space-y-8 flex flex-col mt-0 lg:mt-10">
                {[testimonials[0], testimonials[3]].map((t, i) => (
                    <TestimonialCard key={i} data={t} delay={i * 0.2} />
                ))}
            </div>
            
            {/* Column 2 */}
            <div className="space-y-8 flex flex-col">
                 {[testimonials[1], testimonials[4]].map((t, i) => (
                    <TestimonialCard key={i} data={t} delay={0.3 + i * 0.2} />
                ))}
            </div>

            {/* Column 3 */}
             <div className="space-y-8 flex flex-col mt-0 lg:mt-20">
                 {[testimonials[2], testimonials[5]].map((t, i) => (
                    <TestimonialCard key={i} data={t} delay={0.6 + i * 0.2} />
                ))}
            </div>
         </div>
       </div>
    </section>
  );
};

const TestimonialCard = ({ data, delay }: { data: any, delay: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -10, rotate: 1 }}
        >
            <ClayCard color={data.color} className="p-6 flex flex-col gap-4 h-full justify-between">
                <div>
                    <p className="text-slate-600 italic mb-6 text-lg leading-relaxed">"{data.text}"</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <img src={data.img} alt={data.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">{data.name}</h4>
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">{data.role}</span>
                    </div>
                </div>
            </ClayCard>
        </motion.div>
    )
}
