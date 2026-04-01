import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

type EditBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (book: { title: string; author: string; cover: string; link: string }) => void;
  book: { title: string; author: string; cover: string; link: string } | null;
};

export const EditBookModal: React.FC<EditBookModalProps> = ({ isOpen, onClose, onEdit, book }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [cover, setCover] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author || '');
      setCover(book.cover);
      setLink(book.link || '');
    }
  }, [book]);

  if (!isOpen || !book) return null;

  const handleSave = () => {
    if (!title) return;
    onEdit({
      title,
      author,
      cover,
      link
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="pt-6 pb-4 px-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="font-bold text-[20px] text-[#ea92be]">Editar Livro</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>
        
        <div className="px-6 pt-4 pb-6 flex-grow overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título do Livro *</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#ea92be] focus:ring-1 focus:ring-[#ea92be] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
            <input 
              type="text" 
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#ea92be] focus:ring-1 focus:ring-[#ea92be] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL da Capa</label>
            <input 
              type="text" 
              value={cover}
              onChange={(e) => setCover(e.target.value)}
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
        
        <div className="p-4 sm:px-6 sm:pb-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors w-full sm:w-auto text-center"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!title}
            className="px-4 py-2.5 bg-[#ea92be] text-white rounded-xl hover:bg-[#cd3b8c] font-medium transition-colors w-full sm:w-auto text-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
