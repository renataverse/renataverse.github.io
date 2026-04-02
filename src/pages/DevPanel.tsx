import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useData, AppData } from '../context/DataContext';
import { Save, Loader2, Key } from 'lucide-react';

export const DevPanel: React.FC = () => {
  const { data, updateData, saveToGitHub } = useData();
  const [localData, setLocalData] = useState<AppData>(data);
  const [isSaving, setIsSaving] = useState(false);
  const [githubToken, setGithubToken] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) setGithubToken(savedToken);
  }, []);

  const handleSave = async () => {
    if (!githubToken) {
      alert('Por favor, insira seu Token do GitHub para salvar permanentemente.');
      return;
    }

    setIsSaving(true);
    try {
      localStorage.setItem('github_token', githubToken);
      updateData(localData);
      await saveToGitHub(localData, githubToken);
      alert('Alterações salvas com sucesso no GitHub! O site será atualizado em alguns minutos.');
    } catch (error: any) {
      alert('Erro ao salvar no GitHub: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSection = <K extends keyof AppData>(key: K, value: AppData[K]) => {
    setLocalData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 py-8 max-w-4xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="font-serif text-2xl font-bold text-magenta">
          Painel de Edição
        </h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="password"
              placeholder="GitHub Token"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-magenta focus:outline-none"
            />
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-magenta text-white px-6 py-2 rounded-full hover:bg-magenta-dark transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{isSaving ? 'Salvando...' : 'Salvar no GitHub'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Settings Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Configurações Gerais ✏️</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contato</label>
              <input 
                type="email" 
                value={localData.settings.email}
                onChange={(e) => updateSection('settings', { ...localData.settings, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-magenta"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem de Perfil (Mídia Kit)</label>
              <input 
                type="text" 
                value={localData.settings.profileImage}
                onChange={(e) => updateSection('settings', { ...localData.settings, profileImage: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-magenta"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biografia</label>
              <textarea 
                value={localData.settings.bio}
                onChange={(e) => updateSection('settings', { ...localData.settings, bio: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-magenta"
                rows={4}
              />
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">Botões da Home</h3>
            <button 
              onClick={() => {
                const newBtn = { id: Date.now(), label: 'Novo Botão', icon: 'link', link: '/' };
                updateSection('buttons', [...localData.buttons, newBtn]);
              }}
              className="text-magenta hover:text-magenta-dark p-2 text-xl"
              title="Adicionar"
            >
              ➕
            </button>
          </div>
          <div className="space-y-4">
            {localData.buttons.map((btn, idx) => (
              <div key={btn.id} className="flex items-center gap-4 border border-gray-100 p-4 rounded-xl relative">
                <div className="flex-grow space-y-2">
                  <input 
                    type="text" 
                    value={btn.label}
                    onChange={(e) => {
                      const newBtns = [...localData.buttons];
                      newBtns[idx].label = e.target.value;
                      updateSection('buttons', newBtns);
                    }}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Label"
                  />
                  <input 
                    type="text" 
                    value={btn.link}
                    onChange={(e) => {
                      const newBtns = [...localData.buttons];
                      newBtns[idx].link = e.target.value;
                      updateSection('buttons', newBtns);
                    }}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Link"
                  />
                  <input 
                    type="text" 
                    value={btn.icon}
                    onChange={(e) => {
                      const newBtns = [...localData.buttons];
                      newBtns[idx].icon = e.target.value;
                      updateSection('buttons', newBtns);
                    }}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Icon (book, tablet, heart, trophy)"
                  />
                </div>
                <button 
                  onClick={() => {
                    updateSection('buttons', localData.buttons.filter(b => b.id !== btn.id));
                  }}
                  className="text-red-500 hover:text-red-700 p-2 text-xl"
                  title="Excluir"
                >
                  🗑️
                </button>
                <div className="absolute -top-2 -left-2 bg-white rounded-full shadow-sm p-1 text-xs">✏️</div>
              </div>
            ))}
          </div>
        </section>

        {/* Books Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">Livros</h3>
            <button 
              onClick={() => {
                const newBook = { id: Date.now(), title: 'Novo Livro', author: '', cover: 'https://picsum.photos/seed/newbook/200/300', link: '' };
                updateSection('books', [...localData.books, newBook]);
              }}
              className="text-magenta hover:text-magenta-dark p-2 text-xl"
              title="Adicionar Manualmente"
            >
              ➕
            </button>
          </div>
          <div className="space-y-4">
            {localData.books.map((book, idx) => (
              <div key={book.id} className="flex items-center gap-4 border border-gray-100 p-4 rounded-xl relative">
                <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded" />
                <div className="flex-grow space-y-2">
                  <input 
                    type="text" 
                    value={book.title}
                    onChange={(e) => {
                      const newBooks = [...localData.books];
                      newBooks[idx].title = e.target.value;
                      updateSection('books', newBooks);
                    }}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Título"
                  />
                  <input 
                    type="text" 
                    value={book.author}
                    onChange={(e) => {
                      const newBooks = [...localData.books];
                      newBooks[idx].author = e.target.value;
                      updateSection('books', newBooks);
                    }}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Autor"
                  />
                  <input 
                    type="text" 
                    value={book.cover}
                    onChange={(e) => {
                      const newBooks = [...localData.books];
                      newBooks[idx].cover = e.target.value;
                      updateSection('books', newBooks);
                    }}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="URL da Capa"
                  />
                </div>
                <button 
                  onClick={() => {
                    updateSection('books', localData.books.filter(b => b.id !== book.id));
                  }}
                  className="text-red-500 hover:text-red-700 p-2 text-xl"
                  title="Excluir"
                >
                  🗑️
                </button>
                <div className="absolute -top-2 -left-2 bg-white rounded-full shadow-sm p-1 text-xs">✏️</div>
              </div>
            ))}
          </div>
        </section>

        {/* Accessories Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">Acessórios</h3>
            <button 
              onClick={() => {
                const newItem = { id: Date.now(), name: 'Novo Acessório', image: 'https://picsum.photos/seed/newacc/200/200', link: '' };
                updateSection('accessories', [...localData.accessories, newItem]);
              }}
              className="text-magenta hover:text-magenta-dark p-2 text-xl"
              title="Adicionar"
            >
              ➕
            </button>
          </div>
          <div className="space-y-4">
            {localData.accessories.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-4 border border-gray-100 p-4 rounded-xl relative">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-grow space-y-2">
                  <input 
                    type="text" 
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...localData.accessories];
                      newItems[idx].name = e.target.value;
                      updateSection('accessories', newItems);
                    }}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Nome"
                  />
                  <input 
                    type="text" 
                    value={item.image}
                    onChange={(e) => {
                      const newItems = [...localData.accessories];
                      newItems[idx].image = e.target.value;
                      updateSection('accessories', newItems);
                    }}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="URL da Imagem"
                  />
                </div>
                <button 
                  onClick={() => {
                    updateSection('accessories', localData.accessories.filter(i => i.id !== item.id));
                  }}
                  className="text-red-500 hover:text-red-700 p-2 text-xl"
                  title="Excluir"
                >
                  🗑️
                </button>
                <div className="absolute -top-2 -left-2 bg-white rounded-full shadow-sm p-1 text-xs">✏️</div>
              </div>
            ))}
          </div>
        </section>

        {/* Ranking Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">Ranking Literário</h3>
            <button 
              onClick={() => {
                const newItem = { id: Date.now(), name: 'Novo Livro no Ranking', link: '' };
                updateSection('ranking', [...localData.ranking, newItem]);
              }}
              className="text-magenta hover:text-magenta-dark p-2 text-xl"
              title="Adicionar"
            >
              ➕
            </button>
          </div>
          <div className="space-y-4">
            {localData.ranking.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-4 border border-gray-100 p-4 rounded-xl relative">
                <div className="flex-grow space-y-2">
                  <input 
                    type="text" 
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...localData.ranking];
                      newItems[idx].name = e.target.value;
                      updateSection('ranking', newItems);
                    }}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Nome do Livro"
                  />
                </div>
                <button 
                  onClick={() => {
                    updateSection('ranking', localData.ranking.filter(i => i.id !== item.id));
                  }}
                  className="text-red-500 hover:text-red-700 p-2 text-xl"
                  title="Excluir"
                >
                  🗑️
                </button>
                <div className="absolute -top-2 -left-2 bg-white rounded-full shadow-sm p-1 text-xs">✏️</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};
