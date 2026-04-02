import React, { createContext, useContext, useState, useEffect } from 'react';
import initialData from '../data.json';

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

type DataContextType = {
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  saveToGitHub: (updatedData: AppData, token: string) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const REPO_OWNER = "renataverse";
const REPO_NAME = "renataverse.github.io";
const FILE_PATH = "src/data.json";

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('renataverso_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialData,
          ...parsed,
          settings: {
            ...initialData.settings,
            ...(parsed.settings || {})
          }
        } as AppData;
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    return initialData as AppData;
  });

  useEffect(() => {
    localStorage.setItem('renataverso_data', JSON.stringify(data));
  }, [data]);

  const updateData = (newData: Partial<AppData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const saveToGitHub = async (updatedData: AppData, token: string) => {
    try {
      // 1. Get the current file to get its SHA
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!getFileResponse.ok) {
        throw new Error("Falha ao buscar arquivo no GitHub. Verifique se o token é válido.");
      }

      const fileData = await getFileResponse.json();
      const sha = fileData.sha;

      // 2. Update the file
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(updatedData, null, 2))));
      
      const updateResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Update data via Dev Panel",
            content: content,
            sha: sha,
          }),
        }
      );

      if (!updateResponse.ok) {
        const error = await updateResponse.json();
        throw new Error(error.message || "Falha ao atualizar arquivo no GitHub");
      }

      console.log("Dados salvos no GitHub com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar no GitHub:", error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{ data, updateData, saveToGitHub }}>
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
