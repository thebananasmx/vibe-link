import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X } from 'lucide-react';
import type firebase from 'firebase/compat/app';
import { auth } from '../firebase';
import CircleLoader from './CircleLoader';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: AuthMode;
}

type AuthMode = 'login' | 'signup';

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess, initialMode }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode || 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        await auth.createUserWithEmailAndPassword(email, password);
      } else {
        await auth.signInWithEmailAndPassword(email, password);
      }
      onSuccess();
    } catch (err) {
      const authError = err as firebase.auth.AuthError;
      switch (authError.code) {
        case 'auth/email-already-in-use':
          setError('This email is already in use. Try logging in.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
           setError('Invalid email or password.');
           break;
        default:
          setError('An unexpected error occurred. Please try again.');
      }
      console.error(authError);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setError(null);
    setMode(prev => prev === 'login' ? 'signup' : 'login');
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, y: 50, scale: 0.9 },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className="bg-[#F5EFE6] rounded-2xl border-2 border-black p-6 w-full max-w-md"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{mode === 'signup' ? 'Sign Up to Claim' : 'Log In to Claim'}</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10 transition-colors" disabled={isLoading}>
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-lg px-4 py-2 rounded-lg border-2 border-black bg-transparent focus:outline-none focus:ring-2 focus:ring-[#FB8500] transition-all duration-300"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-lg px-4 py-2 rounded-lg border-2 border-black bg-transparent focus:outline-none focus:ring-2 focus:ring-[#FB8500] transition-all duration-300"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#8ECAE6] text-black font-bold text-lg rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000] transform active:translate-x-[2px] active:translate-y-[2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <CircleLoader /> : (mode === 'signup' ? 'Sign Up' : 'Log In')}
            </button>
          </form>
          <p className="text-center text-sm mt-4">
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
            {' '}
            <button onClick={toggleMode} className="font-bold hover:underline">
              {mode === 'signup' ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
