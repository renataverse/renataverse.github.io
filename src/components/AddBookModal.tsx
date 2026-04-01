import React, { useState } from 'react';
import { X, Search, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

type AddBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (book: { title: string; author: string; cover: string; link: string }) => void;
};

export const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'manual'>('search');
  
  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  
  // Manual state
  const [manualTitle, setManualTitle] = useState('');
  const [manualAuthor, setManualAuthor] = useState('');
  const [manualCover, setManualCover] = useState('');
  
  // Shared state
  const [customLink, setCustomLink] = useState('');

  if (!isOpen) return null;

  const translateTitles = async (books: any[]) => {
    if (books.length === 0) return books;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY não encontrada, pulando tradução.");
      return books;
    }

    setTranslating(true);
    try {
      console.log("Traduzindo títulos para português...");
      const ai = new GoogleGenAI({ apiKey });
      const titlesToTranslate = books.map(b => b.volumeInfo.title).join('\n');
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Traduza os seguintes títulos de livros para o português do Brasil. Se o título já estiver em português ou for um nome próprio que não deve ser traduzido, mantenha-o como está. Retorne apenas os títulos traduzidos, um por linha, na mesma ordem:\n\n${titlesToTranslate}`,
      });

      const translatedText = response.text;
      if (translatedText) {
        const translatedLines = translatedText.split('\n').filter(line => line.trim() !== '');
        console.log("Tradução concluída.");
        return books.map((book, index) => ({
          ...book,
          volumeInfo: {
            ...book.volumeInfo,
            title: translatedLines[index] || book.volumeInfo.title
          }
        }));
      }
    } catch (error) {
      console.error("Erro ao traduzir títulos:", error);
    } finally {
      setTranslating(false);
    }
    return books;
  };

  const getEnrichedQuery = async (userQuery: string) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY não encontrada, usando busca simples.");
      return userQuery;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `O usuário está buscando um livro com o título: "${userQuery}". 
        Se este título estiver em português, retorne o título original (geralmente em inglês) e o título em português. 
        Se já estiver no original ou for um título global, retorne apenas o título original. 
        Retorne APENAS o texto da busca otimizado para APIs de livros, sem aspas ou explicações.`,
      });
      const enriched = response.text?.trim();
      console.log("Busca enriquecida:", enriched);
      return enriched || userQuery;
    } catch (error) {
      console.error("Erro ao enriquecer busca:", error);
      return userQuery;
    }
  };

  const searchBooks = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]); // Limpa resultados anteriores
    
    try {
      console.log("Iniciando busca para:", query);
      const enrichedQuery = await getEnrichedQuery(query);
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(enrichedQuery)}&limit=10`;
      
      console.log("Chamando Open Library API:", url);
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Resultados da Open Library:", data.docs?.length || 0);
      
      const mappedResults = (data.docs || []).map((doc: any) => ({
        id: doc.key,
        volumeInfo: {
          title: doc.title,
          authors: doc.author_name || [],
          imageLinks: {
            thumbnail: doc.cover_i 
              ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` 
              : doc.isbn?.[0] 
                ? `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-M.jpg`
                : null
          }
        }
      }));
      
      if (mappedResults.length > 0) {
        const translatedResults = await translateTitles(mappedResults);
        setResults(translatedResults);
      } else {
        console.log("Nenhum resultado encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar livros na Open Library:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (activeTab === 'search') {
      if (!selectedBook) return;
      const volumeInfo = selectedBook.volumeInfo;
      const cover = volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://picsum.photos/seed/book/200/300';
      const author = volumeInfo.authors ? volumeInfo.authors.join(', ') : '';
      
      onAdd({
        title: volumeInfo.title,
        author: author,
        cover: cover,
        link: customLink
      });
    } else {
      if (!manualTitle) return;
      onAdd({
        title: manualTitle,
        author: manualAuthor,
        cover: manualCover || 'https://picsum.photos/seed/book/200/300',
        link: customLink
      });
    }
    
    // Reset state
    setQuery('');
    setResults([]);
    setSelectedBook(null);
    setManualTitle('');
    setManualAuthor('');
    setManualCover('');
    setCustomLink('');
    setActiveTab('search');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="pt-6 pb-4 px-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="font-bold text-[20px] text-[#ea92be]">Adicionar Livro</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>
        
        <div className="flex border-b border-gray-100">
          <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'search' ? 'text-[#ea92be] border-b-2 border-[#ea92be]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('search')}
          >
            Buscar na API
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'manual' ? 'text-[#ea92be] border-b-2 border-[#ea92be]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('manual')}
          >
            Adicionar Manualmente
          </button>
        </div>
        
        <div className="px-6 pt-4 pb-6 flex-grow overflow-y-auto">
          {activeTab === 'search' ? (
            !selectedBook ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchBooks()}
                    placeholder="Nome do livro..."
                    className="flex-grow border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#ea92be] focus:ring-1 focus:ring-[#ea92be] transition-all"
                  />
                  <button 
                    onClick={searchBooks}
                    disabled={loading || translating}
                    className="bg-[#ea92be] text-white px-4 py-2.5 rounded-xl hover:bg-[#cd3b8c] transition-colors flex items-center justify-center min-w-[52px]"
                  >
                    {loading || translating ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                  </button>
                </div>
                
                {translating && (
                  <div className="flex items-center gap-2 text-[#ea92be] text-xs font-medium animate-pulse">
                    <Loader2 size={14} className="animate-spin" />
                    Traduzindo títulos para português...
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {results.length > 0 ? (
                    results.map((book) => {
                      const info = book.volumeInfo;
                      const cover = info.imageLinks?.thumbnail?.replace('http:', 'https:');
                      return (
                        <div 
                          key={book.id} 
                          onClick={() => setSelectedBook(book)}
                          className="flex gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#ea92be] cursor-pointer transition-colors"
                        >
                          {cover ? (
                            <img src={cover} alt={info.title} className="w-16 h-24 object-cover rounded shadow-sm shrink-0" />
                          ) : (
                            <div className="w-16 h-24 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400 text-center p-1 shrink-0">Sem capa</div>
                          )}
                          <div className="flex flex-col justify-center">
                            <h4 className="font-bold text-sm line-clamp-2">{info.title}</h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{info.authors?.join(', ')}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    !loading && query && (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        Nenhum livro encontrado para "{query}".
                        <br />
                        Tente buscar por outro termo ou adicione manualmente.
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  {selectedBook.volumeInfo.imageLinks?.thumbnail ? (
                    <img src={selectedBook.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:')} alt={selectedBook.volumeInfo.title} className="w-20 h-32 sm:w-24 sm:h-36 object-cover rounded shadow-md shrink-0" />
                  ) : (
                    <div className="w-20 h-32 sm:w-24 sm:h-36 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-400 shrink-0">Sem capa</div>
                  )}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-lg leading-tight line-clamp-3">{selectedBook.volumeInfo.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{selectedBook.volumeInfo.authors?.join(', ')}</p>
                    <button 
                      onClick={() => setSelectedBook(null)}
                      className="text-sm text-[#ea92be] hover:underline mt-2 inline-block"
                    >
                      Voltar para resultados
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link de Afiliado / Compra (Opcional)
                  </label>
                  <input 
                    type="text" 
                    value={customLink}
                    onChange={(e) => setCustomLink(e.target.value)}
                    placeholder="https://amazon.com.br/..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#ea92be] focus:ring-1 focus:ring-[#ea92be] transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Este link será aberto quando clicarem no card do livro.</p>
                </div>
              </div>
            )
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título do Livro *</label>
                <input 
                  type="text" 
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#ea92be] focus:ring-1 focus:ring-[#ea92be] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                <input 
                  type="text" 
                  value={manualAuthor}
                  onChange={(e) => setManualAuthor(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#ea92be] focus:ring-1 focus:ring-[#ea92be] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL da Capa</label>
                <input 
                  type="text" 
                  value={manualCover}
                  onChange={(e) => setManualCover(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#ea92be] focus:ring-1 focus:ring-[#ea92be] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link de Afiliado / Compra</label>
                <input 
                  type="text" 
                  value={customLink}
                  onChange={(e) => setCustomLink(e.target.value)}
                  placeholder="https://amazon.com.br/..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-[15px] focus:outline-none focus:border-[#ea92be] focus:ring-1 focus:ring-[#ea92be] transition-all"
                />
              </div>
            </div>
          )}
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
            disabled={activeTab === 'search' ? !selectedBook : !manualTitle}
            className="px-4 py-2.5 bg-[#ea92be] text-white rounded-xl hover:bg-[#cd3b8c] font-medium transition-colors w-full sm:w-auto text-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
