'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Ekran genişliğini kontrol et
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // İlk yükleme ve ekran boyutu değişiminde kontrol et
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Menü dışına tıklandığında menüyü kapat
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Animasyon için CSS ekle
    const style = document.createElement('style');
    style.textContent = `
      @keyframes popScale {
        0% {
          opacity: 0;
          transform: scale(0.4) translateX(-10px);
        }
        60% {
          opacity: 1;
          transform: scale(1.1) translateX(0);
        }
        100% {
          transform: scale(1) translateX(0);
        }
      }
      .animate-popScale {
        animation: popScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }
      
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
        }
        70% {
          box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
        }
      }
      .animate-pulse-blue {
        animation: pulse 1.5s infinite;
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fadeIn {
        animation: fadeIn 0.25s ease forwards;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', checkMobile);
      document.head.removeChild(style);
    };
  }, []);

  // Dil değiştirme ve animasyon
  const changeLanguage = (newLang: string) => {
    if (newLang === language) {
      setIsOpen(false);
      return;
    }
    
    setIsAnimating(true);
    setIsOpen(false);
    
    setTimeout(() => {
      setLanguage(newLang as any);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 150);
  };

  // Menüyü aç/kapat
  const toggleMenu = () => {
    if (!isAnimating) {
      setIsOpen(!isOpen);
    }
  };

  // Sadece bayrak göster (mobil için)
  const renderFlagOnly = (lang: string) => {
    switch(lang) {
      case 'tr':
        return (
          <div className="w-full h-full rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-[#E30A17]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%">
              <g transform="translate(0.4,0.4) scale(0.95)">
                <circle cx="8" cy="8" r="4" fill="#ffffff"/>
                <circle cx="9" cy="8" r="3.2" fill="#E30A17"/>
                <polygon points="10.5,8 13,9.2 11.4,6.5 11.4,9.5 13,6.8" fill="#ffffff"/>
              </g>
            </svg>
          </div>
        );
      case 'en':
        return (
          <div className="w-full h-full rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-[#012169]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%">
              <g transform="translate(0.8,0.8) scale(0.9)">
                <path d="M0,0 L16,0 L16,16 L0,16 Z" fill="#012169"/>
                <path d="M0,0 L16,16 M16,0 L0,16" stroke="#fff" strokeWidth="3"/>
                <path d="M8,0 V16 M0,8 H16" stroke="#fff" strokeWidth="5"/>
                <path d="M8,0 V16 M0,8 H16" stroke="#C8102E" strokeWidth="3"/>
                <path d="M0,0 L16,16 M16,0 L0,16" stroke="#C8102E" strokeWidth="2"/>
              </g>
            </svg>
          </div>
        );
      case 'de':
        return (
          <div className="w-full h-full rounded-full overflow-hidden flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%">
              <rect width="16" height="5.33" y="0" x="0" fill="#000"/>
              <rect width="16" height="5.33" y="5.33" x="0" fill="#DD0000"/>
              <rect width="16" height="5.33" y="10.67" x="0" fill="#FFCE00"/>
            </svg>
          </div>
        );
      case 'fr':
        return (
          <div className="w-full h-full rounded-full overflow-hidden flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%">
              <rect width="5.33" height="16" x="0" fill="#002395"/>
              <rect width="5.33" height="16" x="5.33" fill="#FFFFFF"/>
              <rect width="5.33" height="16" x="10.67" fill="#ED2939"/>
            </svg>
          </div>
        );
      case 'zh':
        return (
          <div className="w-full h-full rounded-full overflow-hidden flex-shrink-0 bg-[#DE2910] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%">
              <g transform="translate(2.8, 2.8) scale(0.65)">
                <path d="M3,2 L4.5,6 L8.5,6 L5.25,8.5 L6.5,13 L3,10.25 L-0.5,13 L0.75,8.5 L-2.5,6 L1.5,6 Z" fill="#FFDE00"/>
                <g transform="translate(8, -0.7) scale(0.3)">
                  <path d="M3,2 L4.5,6 L8.5,6 L5.25,8.5 L6.5,13 L3,10.25 L-0.5,13 L0.75,8.5 L-2.5,6 L1.5,6 Z" fill="#FFDE00"/>
                </g>
                <g transform="translate(10, 3) scale(0.3)">
                  <path d="M3,2 L4.5,6 L8.5,6 L5.25,8.5 L6.5,13 L3,10.25 L-0.5,13 L0.75,8.5 L-2.5,6 L1.5,6 Z" fill="#FFDE00"/>
                </g>
                <g transform="translate(9, 8) scale(0.3)">
                  <path d="M3,2 L4.5,6 L8.5,6 L5.25,8.5 L6.5,13 L3,10.25 L-0.5,13 L0.75,8.5 L-2.5,6 L1.5,6 Z" fill="#FFDE00"/>
                </g>
                <g transform="translate(5, 10) scale(0.3)">
                  <path d="M3,2 L4.5,6 L8.5,6 L5.25,8.5 L6.5,13 L3,10.25 L-0.5,13 L0.75,8.5 L-2.5,6 L1.5,6 Z" fill="#FFDE00"/>
                </g>
              </g>
            </svg>
          </div>
        );
      case 'ja':
        return (
          <div className="w-full h-full rounded-full overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%">
              <circle fill="#bc002d" cx="8" cy="8" r="4.8"/>
            </svg>
          </div>
        );
      case 'es':
        return (
          <div className="w-full h-full rounded-full overflow-hidden flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%">
              <rect width="16" height="16" fill="#AA151B"/>
              <rect width="16" height="8" fill="#F1BF00" y="4"/>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  // Dile göre bayrak ve isim gösterme
  const renderFlag = (lang: string) => {
    switch(lang) {
      case 'tr':
        return (
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-[#E30A17]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%">
                <g transform="translate(0.4,0.4) scale(0.95)">
                  <circle cx="8" cy="8" r="4" fill="#ffffff"/>
                  <circle cx="9" cy="8" r="3.2" fill="#E30A17"/>
                  <polygon points="10.5,8 13,9.2 11.4,6.5 11.4,9.5 13,6.8" fill="#ffffff"/>
                </g>
              </svg>
            </div>
            <span className="font-medium text-sm whitespace-nowrap sm:inline hidden">Türkçe</span>
          </div>
        );
      case 'en':
        return (
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-[#012169]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%">
                <g transform="translate(0.8,0.8) scale(0.9)">
                  <path d="M0,0 L16,0 L16,16 L0,16 Z" fill="#012169"/>
                  <path d="M0,0 L16,16 M16,0 L0,16" stroke="#fff" strokeWidth="3"/>
                  <path d="M8,0 V16 M0,8 H16" stroke="#fff" strokeWidth="5"/>
                  <path d="M8,0 V16 M0,8 H16" stroke="#C8102E" strokeWidth="3"/>
                  <path d="M0,0 L16,16 M16,0 L0,16" stroke="#C8102E" strokeWidth="2"/>
                </g>
              </svg>
            </div>
            <span className="font-medium text-sm whitespace-nowrap sm:inline hidden">English</span>
          </div>
        );
      case 'de':
        return (
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%">
                <rect width="16" height="5.33" y="0" x="0" fill="#000"/>
                <rect width="16" height="5.33" y="5.33" x="0" fill="#DD0000"/>
                <rect width="16" height="5.33" y="10.67" x="0" fill="#FFCE00"/>
              </svg>
            </div>
            <span className="font-medium text-sm whitespace-nowrap sm:inline hidden">Deutsch</span>
          </div>
        );
      case 'fr':
        return (
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%">
                <rect width="5.33" height="16" x="0" fill="#002395"/>
                <rect width="5.33" height="16" x="5.33" fill="#FFFFFF"/>
                <rect width="5.33" height="16" x="10.67" fill="#ED2939"/>
              </svg>
            </div>
            <span className="font-medium text-sm whitespace-nowrap sm:inline hidden">Français</span>
          </div>
        );
      case 'zh':
        return (
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-[#DE2910] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%">
                <g transform="translate(2.8, 2.8) scale(0.65)">
                  <path d="M3,2 L4.5,6 L8.5,6 L5.25,8.5 L6.5,13 L3,10.25 L-0.5,13 L0.75,8.5 L-2.5,6 L1.5,6 Z" fill="#FFDE00"/>
                  <g transform="translate(8, -0.7) scale(0.3)">
                    <path d="M3,2 L4.5,6 L8.5,6 L5.25,8.5 L6.5,13 L3,10.25 L-0.5,13 L0.75,8.5 L-2.5,6 L1.5,6 Z" fill="#FFDE00"/>
                  </g>
                  <g transform="translate(10, 3) scale(0.3)">
                    <path d="M3,2 L4.5,6 L8.5,6 L5.25,8.5 L6.5,13 L3,10.25 L-0.5,13 L0.75,8.5 L-2.5,6 L1.5,6 Z" fill="#FFDE00"/>
                  </g>
                  <g transform="translate(9, 8) scale(0.3)">
                    <path d="M3,2 L4.5,6 L8.5,6 L5.25,8.5 L6.5,13 L3,10.25 L-0.5,13 L0.75,8.5 L-2.5,6 L1.5,6 Z" fill="#FFDE00"/>
                  </g>
                  <g transform="translate(5, 10) scale(0.3)">
                    <path d="M3,2 L4.5,6 L8.5,6 L5.25,8.5 L6.5,13 L3,10.25 L-0.5,13 L0.75,8.5 L-2.5,6 L1.5,6 Z" fill="#FFDE00"/>
                  </g>
                </g>
              </svg>
            </div>
            <span className="font-medium text-sm whitespace-nowrap sm:inline hidden">中文</span>
          </div>
        );
      case 'ja':
        return (
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%">
                <circle fill="#bc002d" cx="8" cy="8" r="4.8"/>
              </svg>
            </div>
            <span className="font-medium text-sm whitespace-nowrap sm:inline hidden">日本語</span>
          </div>
        );
      case 'es':
        return (
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%">
                <rect width="16" height="16" fill="#AA151B"/>
                <rect width="16" height="8" fill="#F1BF00" y="4"/>
              </svg>
            </div>
            <span className="font-medium text-sm whitespace-nowrap sm:inline hidden">Español</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Hydration hatalarını önlemek için
  if (!isMounted) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className={`flex items-center justify-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white p-2 rounded-full transition-all duration-300 relative overflow-hidden ${isAnimating ? 'scale-90' : 'scale-100'} shadow-lg hover:shadow-xl`}
        title={t('selectLanguage')}
        aria-label={t('selectLanguage')}
        disabled={isAnimating}
      >
        <div className={`transform transition-all duration-300 ${isAnimating ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
          {renderFlag(language)}
        </div>
        
        {/* Animasyon sırasında gösterilecek yer tutucu */}
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-gray-500 dark:border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </button>
      
      {/* Dil seçim menüsü */}
      {isOpen && (
        <div className={`absolute ${isMobile 
          ? 'top-0 right-full mr-3 flex flex-row-reverse items-center' 
          : 'top-full right-0 mt-2 w-[250px] backdrop-blur-md bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3'} z-50 max-h-[350px] overflow-y-auto`}>
          {isMobile ? (
            <div className="flex flex-row-reverse gap-3">
              {availableLanguages.map((lang, index) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`flex items-center justify-center rounded-full shadow-lg transition-all duration-300 w-9 h-9 overflow-hidden
                    ${lang === language 
                      ? 'ring-2 ring-blue-500 dark:ring-blue-400 animate-pulse-blue' 
                      : 'hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-600 hover:scale-110'}
                    animate-popScale`}
                  style={{
                    animationDelay: `${index * 0.08}s`,
                  }}
                  title={
                    lang === 'tr' ? 'Türkçe' :
                    lang === 'en' ? 'English' :
                    lang === 'de' ? 'Deutsch' :
                    lang === 'fr' ? 'Français' :
                    lang === 'zh' ? '中文' :
                    lang === 'ja' ? '日本語' :
                    lang === 'es' ? 'Español' : lang
                  }
                >
                  {renderFlagOnly(lang)}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col space-y-0.5">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">{t('selectLanguage')}</h3>
              {availableLanguages.map((lang, index) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`flex items-center w-full p-2.5 rounded-lg text-left transition-all duration-200 animate-fadeIn ${
                    lang === language 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-medium' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-3 rounded-full overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                        {renderFlagOnly(lang)}
                      </div>
                      <span className="font-medium">{
                        lang === 'tr' ? 'Türkçe' :
                        lang === 'en' ? 'English' :
                        lang === 'de' ? 'Deutsch' :
                        lang === 'fr' ? 'Français' :
                        lang === 'zh' ? '中文' :
                        lang === 'ja' ? '日本語' :
                        lang === 'es' ? 'Español' : lang
                      }</span>
                    </div>
                    {lang === language && (
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 