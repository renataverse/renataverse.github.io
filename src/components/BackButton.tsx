import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const BackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Wait for the smooth scroll to finish (approx 500ms) before navigating
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  return (
    <div className="px-6 mt-4 mb-8">
      <button 
        onClick={handleBack}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-[#e879b6] text-[#e879b6] rounded-xl font-bold hover:bg-pink-50 transition-colors shadow-sm"
      >
        <ArrowLeft size={20} />
        Voltar ao Início
      </button>
    </div>
  );
};
