'use client';

import { SpeedReader } from '../components/SpeedReader';
import { LanguageToggle } from '../components/LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';
import { TopBanner, BottomBanner, SideAd, MobileAd, InContentAd } from '../components/AdsenseAd';

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <div className="flex min-h-screen flex-col relative bg-gray-900">
      {/* Kontrol butonları */}
      <div className="fixed top-2 sm:top-4 right-2 sm:right-4 z-20 flex gap-2 bg-gray-800/40 p-1.5 sm:p-2 rounded-full backdrop-blur-md shadow-lg border border-gray-700/40">
        <LanguageToggle />
      </div>
      
      {/* Ana içerik */}
      <main className="flex flex-grow min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <div className="w-full max-w-lg mb-8 animate-fadeIn">
          <Image 
            src="/images/turbo-logo.png" 
            alt="TurboReader Logo" 
            width={600} 
            height={180} 
            priority
            className="w-full h-auto object-contain mx-auto turbo-logo"
          />
        </div>
        <p className="text-base md:text-xl text-center mb-6 md:mb-8 max-w-2xl px-2 text-gray-300">
          {t('appDescription')}
        </p>
        
        <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-8 justify-center">
          {/* Sol yan reklam */}
          <SideAd />
          
          <div className="flex-1 max-w-3xl">
            {/* Üst reklam - sadece masaüstünde görünür */}
            <TopBanner />
            
            <SpeedReader />
            
            {/* İçerik içi reklam */}
            <InContentAd />
            
            {/* Alt banner reklam */}
            <BottomBanner />
          </div>
          
          {/* Sağ yan reklam */}
          <SideAd />
        </div>
        
        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 w-full">
          <div className="container mx-auto px-4">
            <div className="mb-4">
              <a href="/gizlilik-politikasi" className="mx-2 hover:text-gray-300 transition-colors">Gizlilik Politikası</a>
              <a href="/kullanim-sartlari" className="mx-2 hover:text-gray-300 transition-colors">Kullanım Şartları</a>
              <a href="/iletisim" className="mx-2 hover:text-gray-300 transition-colors">İletişim</a>
            </div>
            <p className="mb-2">
              &copy; {new Date().getFullYear()} TurboReader. Tüm hakları saklıdır.
            </p>
            <p className="text-xs text-gray-600">
              Bu site çerezleri kullanmaktadır. Siteyi kullanmaya devam ederek çerezlerin kullanımını kabul etmiş sayılırsınız.
            </p>
          </div>
        </footer>
        
        {/* Mobil reklam */}
        <MobileAd />
      </main>
    </div>
  );
}
