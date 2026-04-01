import React from 'react';
import { useData } from '../context/DataContext';

export const Footer: React.FC = () => {
  const { data } = useData();

  return (
    <footer className="bg-[#cd3b8c] text-white py-4 px-6 text-center mt-auto w-full">
      <p className="text-[11px] font-medium">
        Contato profissional: {data.settings.email}
      </p>
    </footer>
  );
};
