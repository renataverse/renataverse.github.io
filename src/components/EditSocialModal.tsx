import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type EditSocialModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (socials: { instagram: string; tiktok: string; youtube: string }) => void;
  socials: { instagram: string; tiktok: string; youtube: string };
};

export const EditSocialModal: React.FC<EditSocialModalProps> = ({ isOpen, onClose, onEdit, socials }) => {
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [youtube, setYoutube] = useState('');

  useEffect(() => {
    if (socials) {
      setInstagram(socials.instagram);
      setTiktok(socials.tiktok);
      setYoutube(socials.youtube);
    }
  }, [socials]);

  if (!isOpen) return null;

  const handleSave = () => {
    onEdit({ instagram, tiktok, youtube });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] w-full max-w-md flex flex-col overflow-hidden shadow-2xl">
        <div className="pt-6 pb-4 px-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="font-bold text-[20px] text-[#ea92be]">Editar Redes Sociais</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>
        
        <div className="px-6 py-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
            <input 
              type="text" 
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#e879b6] focus:ring-1 focus:ring-[#e879b6] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
            <input 
              type="text" 
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#e879b6] focus:ring-1 focus:ring-[#e879b6] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
            <input 
              type="text" 
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#e879b6] focus:ring-1 focus:ring-[#e879b6] transition-all"
            />
          </div>
        </div>
        
        <div className="p-4 sm:px-6 sm:pb-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors w-full sm:w-auto text-center"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2.5 bg-[#ea92be] text-white rounded-xl hover:bg-[#cd3b8c] font-medium transition-colors w-full sm:w-auto text-center shadow-sm"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
