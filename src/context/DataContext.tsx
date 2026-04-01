import React, { createContext, useContext, useState, useEffect } from 'react';

export type ButtonData = {
  id: number;
  label: string;
  icon: string;
  link: string;
};

export type BookData = {
  id: number;
  title: string;
  author: string;
  cover: string;
  link: string;
};

export type AccessoryData = {
  id: number;
  name: string;
  image: string;
  link: string;
};

export type RankingData = {
  id: number;
  name: string;
  link: string;
};

export type SettingsData = {
  email: string;
  bio: string;
  profileImage: string;
  instagram: string;
  tiktok: string;
  youtube: string;
};

export type AppData = {
  buttons: ButtonData[];
  books: BookData[];
  accessories: AccessoryData[];
  ranking: RankingData[];
  settings: SettingsData;
};

const initialData: AppData = {
  buttons: [
    { id: 1, label: "Livros que recomendo", icon: "book", link: "/livros" },
    { id: 2, "label": "Acessórios para o Kindle", icon: "tablet", link: "/acessorios" },
    { id: 3, label: "Lista de desejos Amazon", icon: "heart", link: "https://amazon.com" },
    { id: 4, label: "Ranking literário", icon: "trophy", link: "/ranking" }
  ],
  books: [
    { id: 1, title: "Alchemised", author: "", cover: "https://picsum.photos/seed/alchemised/200/300", link: "" },
    { id: 2, title: "Reino de Cinzas", author: "Sarah J. Maas", cover: "https://picsum.photos/seed/reinodecinzas/200/300", link: "" },
    { id: 3, title: "A Serpente e as Asas Feitas de Noite", author: "", cover: "https://picsum.photos/seed/serpente/200/300", link: "" },
    { id: 4, title: "Tempestade de Ônix", author: "", cover: "https://picsum.photos/seed/tempestade/200/300", link: "" }
  ],
  accessories: [
    { id: 1, name: "Laço rosa", image: "https://picsum.photos/seed/laco/200/200", link: "" },
    { id: 2, name: "Capinha magsafe", image: "https://picsum.photos/seed/capinha/200/200", link: "" },
    { id: 3, name: "Popsocket moranguinho", image: "https://picsum.photos/seed/popsocket/200/200", link: "" },
    { id: 4, name: "Necessaire", image: "https://picsum.photos/seed/necessaire/200/200", link: "" }
  ],
  ranking: [
    { id: 1, name: "Corte de Névoa e Fúria", link: "" },
    { id: 2, "name": "Quarta Asa", link: "" },
    { id: 3, name: "Corte de Chamas Prateadas", link: "" },
    { id: 4, name: "Rainha das sombras", link: "" },
    { id: 5, name: "A Lâmina da Assassina", link: "" }
  ],
  settings: {
    email: "renataverso13@gmail.com",
    bio: "Criadora de conteúdo literário que compartilha leituras, indicações e unboxings de forma autêntica, criativa e apaixonada.",
    profileImage: "https://i.imgur.com/IbxasWS.jpeg",
    instagram: "https://instagram.com/renataverso",
    tiktok: "https://www.tiktok.com/@renataverso?_r=1&_t=ZS-95AS7y6QBs4",
    youtube: "https://youtube.com/@renataslugon?si=Ldph3mIg7CIbTcf_"
  }
};

type DataContextType = {
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('renataverso_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with initialData to ensure new fields like profileImage are included
        return {
          ...initialData,
          ...parsed,
          settings: {
            ...initialData.settings,
            ...(parsed.settings || {})
          }
        };
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem('renataverso_data', JSON.stringify(data));
  }, [data]);

  const updateData = (newData: Partial<AppData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
