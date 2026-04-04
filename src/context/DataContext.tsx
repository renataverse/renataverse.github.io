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
  version?: number;
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
const STORAGE_KEY = 'renataverso_data';
const STORAGE_VERSION_KEY = 'renataverso_data_version';

// Versão embutida no bundle no momento do build
const BUNDLE_VERSION = (initialData as AppData).version ?? 0;

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => {
    // Verifica se o localStorage tem dados de uma versão mais antiga que o bundle atual
    try {
      const savedVersionStr = localStorage.getItem(STORAGE_VERSION_KEY);
      const savedVersion = savedVersionStr ? parseInt(savedVersionStr, 10) : -1;

      // Se o bundle é mais novo que o que está salvo, descarta o localStorage
      if (BUNDLE_VERSION > savedVersion) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_VERSION_KEY, String(BUNDLE_VERSION));
        return initialData as AppData;
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialData,
          ...parsed,
          settings: {
            ...initialData.settings,
            ...(parsed.settings || {})
          }
        } as AppData;
      }
    } catch (e) {
      console.error("Falha ao ler dados salvos:", e);
    }
    return initialData as AppData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(STORAGE_VERSION_KEY, String(data.version ?? BUNDLE_VERSION));
  }, [data]);

  const updateData = (newData: Partial<AppData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const saveToGitHub = async (updatedData: AppData, token: string) => {
    try {
      if (!token || token.trim() === '') {
        throw new Error("Token do GitHub não foi fornecido. Insira o token na engrenagem (canto superior esquerdo) e tente novamente.");
      }

      // Incrementa a versão a cada salvamento para invalidar o localStorage de todos os usuários
      const newVersion = (updatedData.version ?? BUNDLE_VERSION) + 1;
      const dataWithVersion: AppData = { ...updatedData, version: newVersion };

      console.log(`[DEBUG] Iniciando salvamento. Versão atual: ${updatedData.version}, nova versão: ${newVersion}`);

      // 1. Busca o arquivo atual para obter o SHA
      console.log(`[DEBUG] Buscando arquivo ${FILE_PATH} do repositório...`);
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
        const errorData = await getFileResponse.json();
        console.error(`[DEBUG] Erro ao buscar arquivo:`, errorData);
        if (getFileResponse.status === 401 || getFileResponse.status === 403) {
          throw new Error("Token do GitHub inválido ou expirado. Verifique o token e tente novamente.");
        }
        throw new Error(`Falha ao buscar arquivo no GitHub (${getFileResponse.status}): ${errorData.message || 'Erro desconhecido'}`);
      }

      const fileData = await getFileResponse.json();
      const sha = fileData.sha;
      console.log(`[DEBUG] SHA obtido: ${sha}`);

      // 2. Atualiza o arquivo com a nova versão
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(dataWithVersion, null, 2))));
      console.log(`[DEBUG] Enviando atualização para o GitHub...`);
      
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
            message: `chore: update site data (v${newVersion})`,
            content: content,
            sha: sha,
          }),
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.error(`[DEBUG] Erro ao atualizar arquivo:`, errorData);
        throw new Error(`Falha ao atualizar arquivo no GitHub (${updateResponse.status}): ${errorData.message || 'Erro desconhecido'}`);
      }

      console.log(`[DEBUG] Arquivo atualizado com sucesso no GitHub!`);

      // Atualiza o estado local com a nova versão também
      setData(dataWithVersion);
      localStorage.setItem(STORAGE_VERSION_KEY, String(newVersion));

      console.log(`✅ Dados salvos no GitHub com sucesso! Versão: ${newVersion}. O site será atualizado em até 1 minuto.`);
    } catch (error) {
      console.error("❌ Erro ao salvar no GitHub:", error);
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
