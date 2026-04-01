import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SettingsData } from '../context/DataContext';

type EditSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (settings: SettingsData) => void;
  settings: SettingsData;
};

export const EditSettingsModal: React.FC<EditSettingsModalProps> = ({ isOpen, onClose, onEdit, settings }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (settings) {
      setName(settings.name);
      setBio(settings.bio);
      setProfileImage(settings.profileImage);
      setEmail(settings.email);
    }
  }, [settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onEdit({ name, bio, profileImage, email });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] w-full max-w-md flex flex-col overflow-hidden shadow-2xl">
        <div className="pt-6 pb-4 px-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="font-bold text-[20px] text-[#e879b6]">Editar Perfil</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>
        
        <div className="px-6 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#e879b6] focus:ring-1 focus:ring-[#e879b6] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#e879b6] focus:ring-1 focus:ring-[#e879b6] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL da Foto de Perfil</label>
            <input 
              type="text" 
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#e879b6] focus:ring-1 focus:ring-[#e879b6] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Biografia</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
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
            className="px-4 py-2.5 bg-[#e879b6] text-white rounded-xl hover:bg-[#d84088] font-medium transition-colors w-full sm:w-auto text-center shadow-sm"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
