import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'motion/react';
import { Instagram, Youtube, Play } from 'lucide-react';
import { useData } from '../context/DataContext';

const INSTAGRAM_ACCESS_TOKEN = "IGAAX3WGOV96ZABZAFlpRzRPQlZAaakNmSGJSQmFfVHkyWDVjemZAVWHB4MU5OR2N0bGtFQXB1QXBSNWZAUazFCRjZAUaFlrUHVNZA3BPOEd5T1Nva25GT3NkUUIyY3UzXy02VWdUSWdYamNCWl90Y2tpaWpHNDhXRkNMNjg1NHhTZADBhcwZDZD";

const REELS_DATA = [
  { 
    id: 1, 
    img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop',
    link: 'https://www.instagram.com/renataverso/reels/'
  },
  { 
    id: 2, 
    img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop',
    link: 'https://www.instagram.com/renataverso/reels/'
  },
  { 
    id: 3, 
    img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&auto=format&fit=crop',
    link: 'https://www.instagram.com/renataverso/reels/'
  },
  { 
    id: 4, 
    img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400&auto=format&fit=crop',
    link: 'https://www.instagram.com/renataverso/reels/'
  },
  { 
    id: 5, 
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop',
    link: 'https://www.instagram.com/renataverso/reels/'
  },
  { 
    id: 6, 
    img: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=400&auto=format&fit=crop',
    link: 'https://www.instagram.com/renataverso/reels/'
  }
];

const TikTokIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const MediaKit: React.FC = () => {
  const { data } = useData();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [liveReels, setLiveReels] = useState(REELS_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInstagramFeed = async () => {
      if (!INSTAGRAM_ACCESS_TOKEN) {
        setLiveReels(REELS_DATA);
        setIsLoading(false);
        return;
      }

      try {
        const url = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error.message);
        }

        const reels = data.data
          .filter((post: any) => post.media_type === 'VIDEO')
          .slice(0, 6)
          .map((post: any) => ({
            id: post.id,
            img: post.thumbnail_url || post.media_url,
            link: post.permalink
          }));
        
        if (reels.length > 0) {
          setLiveReels(reels);
        } else {
          setLiveReels(REELS_DATA);
        }
      } catch (error) {
        console.error("Erro ao carregar o feed do Instagram:", error);
        setLiveReels(REELS_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstagramFeed();
  }, []);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const scrolled = latest > 30;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    });
  }, [scrollY]);
  const [stats] = useState({
    followers: 250,
    reach: 12500,
    interactions: 43200,
    engagementRate: 19.8
  });

  const demographicData = {
    gender: [
      { label: 'Mulher', percentage: 85, icon: '♀' },
      { label: 'Homem', percentage: 15, icon: '♂' }
    ],
    age: [
      { label: '25-35', percentage: 45 },
      { label: '18-24', percentage: 35 },
      { label: '35-44', percentage: 20 }
    ]
  };

  const statCards = [
    { value: '250', label: 'Média de\nSeguidores' },
    { value: '12.5K', label: 'Média de\nalcance' },
    { value: '43.2K', label: 'Média de\nInterações' },
    { value: '19.8%', label: 'Média de\nEngajamento' }
  ];



  return (
    <div className="relative z-10">
      {/* Fixed Text Behind Content */}
      <div className="fixed top-[300px] left-0 w-full text-center z-0 flex flex-col items-center">
        <h1 className="font-serif font-bold text-[#cd3b8c] text-4xl mb-1">Renata Lugon</h1>
        <p className="text-[#cd3b8c] font-medium mb-4">Vídeos literários</p>
        <div className="flex gap-4 relative group">
          <a href={data.settings.instagram} target="_blank" rel="noopener noreferrer" className="text-[#cd3b8c] hover:text-[#cd3b8c] transition-colors"><Instagram size={24} /></a>
          <a href={data.settings.tiktok} target="_blank" rel="noopener noreferrer" className="text-[#cd3b8c] hover:text-[#cd3b8c] transition-colors"><TikTokIcon size={24} /></a>
          <a href={data.settings.youtube} target="_blank" rel="noopener noreferrer" className="text-[#cd3b8c] hover:text-[#cd3b8c] transition-colors"><Youtube size={24} /></a>
        </div>
      </div>

      {/* Transparent Spacer - allows fixed text behind to be visible */}
      <div 
        className="transition-all duration-300 ease-in-out" 
        style={{ height: isScrolled ? '260px' : '480px' }} 
      />
      
      {/* Content with Background - covers the fixed text as it scrolls up */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full bg-[#fcf7f9] min-h-screen relative z-10"
      >
        {/* Main Content */}
        <div className="px-6 pb-12 max-w-6xl mx-auto">
        
        {/* About Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl p-8 border border-magenta/20 shadow-sm">
            <h3 className="font-bold text-magenta text-2xl mb-4">Sobre mim</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Criadora de conteúdo literário que compartilha leituras, indicações e unboxings de forma autêntica, criativa e apaixonada.
            </p>
          </div>
        </motion.div>

        {/* Demographic Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-serif text-3xl font-bold text-magenta mb-8">Audiência demográfica</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Gender */}
            <div className="bg-white rounded-2xl p-8 border border-magenta/20">
              <h3 className="font-bold text-magenta text-xl mb-6">Gênero</h3>
              <div className="flex items-center justify-around">
                {demographicData.gender.map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <div className="text-3xl font-bold text-magenta mb-1">{item.percentage}%</div>
                    <div className="text-sm text-gray-600">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Age */}
            <div className="bg-white rounded-2xl p-8 border border-magenta/20">
              <h3 className="font-bold text-magenta text-xl mb-6">Idade</h3>
              <div className="space-y-4">
                {demographicData.age.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-700 w-12">{item.label}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: 0.8 + idx * 0.1, duration: 0.8 }}
                        className="h-full bg-magenta rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {statCards.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + idx * 0.1 }}
              className="bg-white rounded-2xl p-6 border-2 border-magenta text-center"
            >
              <div className="text-3xl font-bold text-magenta mb-2">{stat.value}</div>
              <div className="text-xs text-gray-600 whitespace-pre-line leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Portfolio Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mb-12"
        >
          <h2 className="font-serif text-3xl font-bold text-magenta mb-6">Portfólio</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#fcf7f9]/80 z-10 min-h-[200px]">
                <div className="w-8 h-8 border-4 border-[#cd3b8c] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {liveReels.map((reel, idx) => (
              <motion.a 
                key={reel.id}
                href={reel.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 + idx * 0.05 }}
                className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all hover:scale-[1.02] relative group border-2 border-magenta/20"
              >
                <img 
                  src={reel.img} 
                  alt={`Portfolio ${idx + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="text-white w-10 h-10 fill-white" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-2xl p-8 border border-magenta/20 text-center mb-8"
        >
          <h2 className="font-serif text-3xl font-bold text-magenta mb-8">Contatos</h2>
          <div className="space-y-4">
            <a 
              href="mailto:renataverso13@gmail.com"
              className="flex items-center justify-center gap-3 text-magenta hover:text-magenta/80 transition-colors"
            >
              <span className="text-2xl">✉</span>
              <span className="font-semibold">renataverso13@gmail.com</span>
            </a>
            <a 
              href="https://instagram.com/renataverso"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 text-magenta hover:text-magenta/80 transition-colors"
            >
              <span className="text-2xl">📱</span>
              <span className="font-semibold">@renataverso</span>
            </a>
          </div>
        </motion.div>
        </div>
      </motion.div>
    </div>
  );
};