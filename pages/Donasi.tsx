import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Copy, QrCode, Building2, ArrowLeft, Check } from 'lucide-react';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/marketing/Footer';
import { Button } from '../components/ui/button';

const BANK_INFO = {
  bankName: 'Bank Jago',
  accountNumber: '105424938922',
  accountHolder: 'Fachrio Raditya',
};

export const Donasi: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BANK_INFO.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="font-sans bg-[#f0f4f8] min-h-screen selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />
      
      <main className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 mb-6">
              <Heart size={40} className="text-rose-500" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-800 mb-4">
              Dukung CAPE Tetap Gratis ❤️
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Kalau CAPE bantu kamu hemat receh, bantu kami juga biar bisa terus develop fitur keren! Seikhlasnya aja~ 🙏
            </p>
          </motion.div>

          {/* Payment Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Bank Transfer Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#f0f4f8] p-8 rounded-[2rem] shadow-clay border border-white/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <Building2 size={24} className="text-emerald-600" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-slate-700">Transfer Bank 🏦</h2>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-white/60 rounded-2xl p-4 shadow-inner">
                  <p className="text-sm text-slate-400 mb-1">Bank</p>
                  <p className="text-lg font-semibold text-slate-700">{BANK_INFO.bankName}</p>
                </div>
                <div className="bg-white/60 rounded-2xl p-4 shadow-inner">
                  <p className="text-sm text-slate-400 mb-1">Nomor Rekening</p>
                  <p className="text-2xl font-bold text-emerald-600 font-mono tracking-wider">
                    {BANK_INFO.accountNumber}
                  </p>
                </div>
                <div className="bg-white/60 rounded-2xl p-4 shadow-inner">
                  <p className="text-sm text-slate-400 mb-1">Atas Nama</p>
                  <p className="text-lg font-semibold text-slate-700">{BANK_INFO.accountHolder}</p>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleCopyAccount}
              >
                {copied ? (
                  <>
                    <Check size={18} strokeWidth={1.5} />
                    Berhasil Dicopy! ✨
                  </>
                ) : (
                  <>
                    <Copy size={18} strokeWidth={1.5} />
                    Copy Nomor Rekening 📋
                  </>
                )}
              </Button>
            </motion.div>

            {/* QRIS Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#f0f4f8] p-8 rounded-[2rem] shadow-clay border border-white/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center">
                  <QrCode size={24} className="text-lime-600" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-slate-700">Scan QRIS 📱</h2>
              </div>

              <div className="flex flex-col items-center">
                {/* QRIS Placeholder */}
                <div className="w-[250px] h-[250px] bg-white rounded-2xl shadow-inner flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
                  <div className="text-center p-4">
                    <QrCode size={64} className="text-slate-300 mx-auto mb-3" strokeWidth={1} />
                    <p className="text-sm text-slate-400">QRIS Coming Soon</p>
                    <p className="text-xs text-slate-300 mt-1">Placeholder</p>
                  </div>
                </div>
                <p className="text-center text-slate-500">
                  Buka aplikasi e-wallet favoritmu, scan, done! ✨
                </p>
              </div>
            </motion.div>
          </div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <div className="bg-emerald-50 rounded-[2rem] p-8 shadow-[inset_3px_3px_6px_#a7f3d0,inset_-3px_-3px_6px_#ffffff] border border-emerald-100 mb-8">
              <p className="text-lg text-emerald-700 font-medium">
                Makasih udah jadi bagian dari CAPE! 🚀
              </p>
              <p className="text-emerald-600/80 mt-2">
                Setiap donasi bikin kami makin semangat coding sampe subuh. ☕
              </p>
            </div>

            <Link to="/">
              <Button variant="secondary" className="shadow-none border border-slate-200">
                <ArrowLeft size={18} strokeWidth={1.5} />
                Balik ke Beranda
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
