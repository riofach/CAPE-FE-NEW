import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import { ClayCard } from '../components/ui/clay-card';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ClayCard className="p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">
                    Welcome back! 👋
                  </h1>
                  <p className="text-slate-500 text-sm">{user?.email}</p>
                </div>
              </div>
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
                Sign Out
              </Button>
            </div>
          </ClayCard>

          <ClayCard className="p-8 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Dashboard Coming Soon!
            </h2>
            <p className="text-slate-500">
              We're building something awesome. Stay tuned! 🚀
            </p>
          </ClayCard>
        </motion.div>
      </div>
    </div>
  );
};
