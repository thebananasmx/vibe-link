import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface InputScreenProps {
  onGenerate: (handle: string) => void;
}

const InputScreen: React.FC<InputScreenProps> = ({ onGenerate }) => {
  const [handle, setHandle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle.trim()) {
      onGenerate(handle);
    }
  };

  return (
    <div className="flex items-center justify-center w-full p-4 flex-grow">
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Your Link-in-bio is boring. <br/> Fix it.</h1>
        <p className="text-lg md:text-xl text-black/80 mb-8">
          Stop using lists. Generate a page that reflects your true vibe.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder={'Paste your Instagram or describe yourself (e.g., "Gym, Crypto, Techno")'}
            className="w-full sm:w-auto flex-grow text-lg px-6 py-4 rounded-xl border-2 border-black bg-transparent focus:outline-none focus:ring-4 focus:ring-[#FB8500] transition-all duration-300"
            aria-label="Social media handle or description"
          />
          <button
            type="submit"
            disabled={!handle.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#FFB703] text-black font-bold text-lg rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000] transform active:translate-x-[2px] active:translate-y-[2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
          >
            Generate Vibe <Sparkles size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputScreen;
