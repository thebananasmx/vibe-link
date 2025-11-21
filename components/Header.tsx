import React from 'react';
import { LogIn, LogOut } from 'lucide-react';
import type firebase from 'firebase/compat/app';


interface HeaderProps {
  user: firebase.User | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin, onLogout }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4 bg-transparent">
      <div className="container mx-auto flex justify-between items-center max-w-7xl">
        <a href="/" className="text-2xl font-bold text-black">VibeLink</a>
        {user ? (
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-black font-bold text-md rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] active:shadow-[1px_1px_0px_#000] transform active:translate-x-[1px] active:translate-y-[1px] transition-all duration-200"
            >
              Log Out <LogOut size={18} />
            </button>
        ) : (
            <button
              onClick={onLogin}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-black font-bold text-md rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] active:shadow-[1px_1px_0px_#000] transform active:translate-x-[1px] active:translate-y-[1px] transition-all duration-200"
            >
              Log In <LogIn size={18} />
            </button>
        )}
      </div>
    </header>
  );
};

export default Header;
