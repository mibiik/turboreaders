'use client';

import { useEffect, useRef, useState } from 'react';

interface AdsenseAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

// Reklam yükleme durumunu kontrol için genel değişken
let adsenseInitialized = false;

export default function AdsenseAd({
  adSlot,
  adFormat = 'auto',
  style,
  className = '',
  responsive = true
}: AdsenseAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [shouldShowAd, setShouldShowAd] = useState(true);
  
  useEffect(() => {
    // Test: kullanıcı reklamları devre dışı bırakmış mı?
    const adsDisabled = typeof window !== 'undefined' && localStorage.getItem('adsDisabled') === 'true';
    if (adsDisabled) {
      setShouldShowAd(false);
      return;
    }
    
    // AdBlock tespiti - çok basit bir yaklaşım
    const checkAdBlocker = () => {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      document.body.appendChild(testAd);
      
      setTimeout(() => {
        const blocked = testAd.offsetHeight === 0;
        if (blocked) {
          console.log('AdBlock tespit edildi');
          setError('Reklam engelleyici nedeniyle gösterilemiyor');
        }
        document.body.removeChild(testAd);
      }, 100);
    };
    
    // Reklam eklemek için
    const injectAd = () => {
      try {
        if (!adRef.current) return;
        
        // Mevcut içeriği temizle
        while (adRef.current.firstChild) {
          adRef.current.removeChild(adRef.current.firstChild);
        }
        
        // INS elementi oluştur
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.style.textAlign = 'center';
        
        // Stil özellikleri varsa ekle
        if (style) {
          Object.entries(style).forEach(([key, value]) => {
            if (typeof value === 'string') {
              ins.style[key as any] = value;
            }
          });
        }
        
        // Reklam özellikleri ekle
        ins.setAttribute('data-ad-client', 'ca-pub-XXXXXXXXXXXXXXXX');
        ins.setAttribute('data-ad-slot', adSlot);
        ins.setAttribute('data-ad-format', adFormat);
        ins.setAttribute('data-full-width-responsive', responsive ? 'true' : 'false');
        
        // Element'i ekle
        adRef.current.appendChild(ins);
        
        // Çok kısa bir gecikme ekle
        setTimeout(() => {
          // Sadece window.adsbygoogle varsa reklam göster
          if (typeof window !== 'undefined' && window.adsbygoogle) {
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (err) {
              console.error('AdSense push error:', err);
              setError('Reklam yüklenirken bir hata oluştu');
            }
          } else {
            setError('AdSense yüklenemedi');
          }
        }, 200);
      } catch (err) {
        console.error('AdSense inject error:', err);
        setError('Reklam yerleştirilirken bir hata oluştu');
      }
    };
    
    // AdBlock kontrolü ve reklam ekleme
    checkAdBlocker();
    
    if (typeof window !== 'undefined' && shouldShowAd) {
      // Global initialization check
      if (!adsenseInitialized) {
        window.addEventListener('load', () => {
          injectAd();
        });
      } else {
        // Adsense zaten yüklenmişse doğrudan ekle
        injectAd();
      }
    }
    
    return () => {
      // Temizleme işlemi
      if (adRef.current) {
        while (adRef.current.firstChild) {
          adRef.current.removeChild(adRef.current.firstChild);
        }
      }
    };
  }, [adSlot, adFormat, responsive, style, shouldShowAd]);
  
  if (!shouldShowAd) {
    return null;
  }
  
  return (
    <div ref={adRef} className={`ad-container ${className}`}>
      {error && (
        <div className="text-xs text-gray-400 text-center py-2 h-12">
          {error}
        </div>
      )}
    </div>
  );
}

// Reklam formatları için hazır bileşenler
export function TopBanner() {
  return <AdsenseAd adSlot="1234567890" adFormat="horizontal" className="w-full max-w-3xl mx-auto my-3 h-16" />;
}

export function BottomBanner() {
  return <AdsenseAd adSlot="0987654321" adFormat="horizontal" className="w-full max-w-3xl mx-auto my-3 h-16" />;
}

export function SideAd() {
  return (
    <AdsenseAd 
      adSlot="1122334455" 
      adFormat="vertical" 
      className="hidden lg:block sticky top-20 h-[600px]" 
      style={{ width: '160px', height: '600px' }} 
    />
  );
}

export function MobileAd() {
  return (
    <AdsenseAd 
      adSlot="6677889900" 
      adFormat="rectangle" 
      className="block sm:hidden w-full my-2 mx-auto" 
      style={{ maxWidth: '336px', height: '280px' }} 
    />
  );
}

export function InContentAd() {
  return (
    <AdsenseAd 
      adSlot="5566778899" 
      adFormat="rectangle" 
      className="my-6 mx-auto" 
      style={{ maxWidth: '336px', height: '280px' }} 
    />
  );
} 