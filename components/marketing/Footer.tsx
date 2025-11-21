import React from 'react';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-20 pb-10 px-6 rounded-t-[4rem] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-800 mb-6">
          Siap Mengatur Uangmu?
        </h2>
        <p className="text-slate-500 mb-10 max-w-lg mx-auto">
          Jangan biarkan dompetmu menangis lagi. Gabung sekarang, gratis kok (kecuali yang bayar).
        </p>

        <div className="relative max-w-lg mx-auto mb-20 group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-lime-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative flex items-center bg-[#f0f4f8] rounded-full p-2 shadow-inner border border-white">
                <input 
                    type="email" 
                    placeholder="Masukan email kamu..." 
                    className="flex-1 bg-transparent border-none outline-none px-6 text-slate-700 placeholder:text-slate-400"
                />
                <Button size="md" className="rounded-full aspect-square p-0 w-12 h-12">
                    <Send size={20} />
                </Button>
            </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-slate-100 text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} Catatan Pengeluaran. Made with ☕ & 💸.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-emerald-500">Privacy</a>
            <a href="#" className="hover:text-emerald-500">Terms</a>
            <a href="#" className="hover:text-emerald-500">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};