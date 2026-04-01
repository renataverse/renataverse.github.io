import React, { useState } from 'react';
import { X } from 'lucide-react';

type AddAcessorioModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: { name: string; image: string; link: string }) => void;
};

export const AddAcessorioModal: React.FC<AddAcessorioModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name) return;
    onAdd({
      name,
      image: image || 'https://picsum.photos/seed/acc/200/200',
      link
    });
    
    // Reset state
    setName('');
    setImage('');
    setLink('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="pt-6 pb-4 px-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="font-bold text-[20px] text-[#ea92be]">Adicionar Acessório</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>
        
        <div className="px-6 pt-6 pb-6 flex-grow overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Acessório *</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#ea92be] focus:ring-1 focus:ring-[#ea92be] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
              <input 
                type="text" 
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#ea92be] focus:ring-1 focus:ring-[#ea92be] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link de Afiliado / Compra</label>
              <input 
                type="text" 
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://amazon.com.br/..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#ea92be] focus:ring-1 focus:ring-[#ea92be] transition-all"
              />
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
            disabled={!name}
            className="px-4 py-2.5 bg-[#ea92be] text-white rounded-xl hover:bg-[#cd3b8c] font-medium transition-colors w-full sm:w-auto text-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
