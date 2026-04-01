import React, { useState, useEffect } from 'react';
import { X, BookOpen, Tablet, Heart, Trophy, Link as LinkIcon } from 'lucide-react';

type EditButtonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (button: { label: string; icon: string; link: string }) => void;
  button: { label: string; icon: string; link: string } | null;
};

const ICONS = [
  { name: 'book', icon: BookOpen },
  { name: 'tablet', icon: Tablet },
  { name: 'heart', icon: Heart },
  { name: 'trophy', icon: Trophy },
  { name: 'link', icon: LinkIcon },
];

export const EditButtonModal: React.FC<EditButtonModalProps> = ({ isOpen, onClose, onEdit, button }) => {
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState('link');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (button) {
      setLabel(button.label);
      setIcon(button.icon);
      setLink(button.link);
    }
  }, [button]);

  if (!isOpen || !button) return null;

  const handleSave = () => {
    if (!label || !link) return;
    onEdit({ label, icon, link });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] w-full max-w-md flex flex-col overflow-hidden shadow-2xl">
        <div className="pt-6 pb-4 px-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="font-bold text-[20px] text-[#ea92be]">Editar Botão</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>
        
        <div className="px-6 py-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Texto do Botão *</label>
            <input 
              type="text" 
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#e879b6] focus:ring-1 focus:ring-[#e879b6] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link *</label>
            <input 
              type="text" 
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://... ou /rota"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#e879b6] focus:ring-1 focus:ring-[#e879b6] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ícone</label>
            <div className="flex gap-3">
              {ICONS.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setIcon(item.name)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    icon === item.name 
                      ? 'border-[#ea92be] bg-[#ea92be]/10 text-[#ea92be]' 
                      : 'border-gray-100 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <item.icon size={20} />
                </button>
              ))}
            </div>
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
            disabled={!label || !link}
            className="px-4 py-2.5 bg-[#ea92be] text-white rounded-xl hover:bg-[#cd3b8c] font-medium transition-colors w-full sm:w-auto text-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
