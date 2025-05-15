'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import DisableAds from './DisableAds';

// AdSense için client-side bileşen
export default function ClientAdSense() {
  useEffect(() => {
    // AdSense hatalarını yakalayıp bastırmak için global hata yakalayıcısı
    if (typeof window !== 'undefined') {
      const originalErrorHandler = window.onerror;
      
      window.onerror = function(message, source, lineno, colno, error) {
        // AdSense ile ilgili TagError hatalarını yakala ve bastır
        if (
          typeof source === 'string' && 
          source.includes('adsbygoogle') && 
          typeof message === 'string' && 
          (message.includes('TagError') || message.includes('adsbygoogle'))
        ) {
          console.warn('AdSense hatası yakalandı ve bastırıldı:', message);
          return true; // Hatayı bastır
        }
        
        // Diğer hatalara dokunma, orijinal işleyiciye devret
        if (originalErrorHandler) {
          return originalErrorHandler.apply(this, arguments as any);
        }
        
        return false;
      };
      
      // Console error metodu da override edilebilir (opsiyonel)
      const originalConsoleError = console.error;
      console.error = function(...args) {
        const errorMsg = args.map(arg => String(arg)).join(' ');
        if (errorMsg.includes('adsbygoogle') || errorMsg.includes('TagError')) {
          console.warn('AdSense console hatası bastırıldı:', ...args);
          return;
        }
        originalConsoleError.apply(console, args);
      };
      
      return () => {
        window.onerror = originalErrorHandler;
        console.error = originalConsoleError;
      };
    }
  }, []);

  return (
    <>
      {/* Reklam devre dışı bırakma seçeneği */}
      <DisableAds />
      
      {/* AdSense kodları */}
      <Script
        id="adsbygoogle-init"
        strategy="beforeInteractive"
      >
        {`
          (function() {
            try {
              // Kullanıcı reklamları devre dışı bırakmışsa, hiç yükleme
              if (localStorage.getItem('adsDisabled') === 'true') {
                console.log('Reklamlar kullanıcı tarafından devre dışı bırakıldı');
                return;
              }
              
              window.adsbygoogle = window.adsbygoogle || [];
              window.adsbygoogle.pauseAdRequests = 1;
            } catch (e) {
              console.error('AdSense başlatılamadı:', e);
            }
          })();
        `}
      </Script>
      
      <Script
        id="adsbygoogle-script"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        crossOrigin="anonymous"
        onError={(e) => {
          console.warn('AdSense yüklenirken hata oluştu:', e);
        }}
      />
      
      <Script
        id="adsbygoogle-resume"
        strategy="afterInteractive"
      >
        {`
          (function() {
            try {
              // Kullanıcı reklamları devre dışı bırakmışsa, aktifleştirme
              if (localStorage.getItem('adsDisabled') === 'true') return;
              
              // Sayfa tamamen yüklendikten sonra
              window.addEventListener('load', function() {
                setTimeout(function() {
                  if (window.adsbygoogle) {
                    window.adsbygoogle.pauseAdRequests = 0;
                    console.log('AdSense aktifleştirildi');
                  }
                }, 500); // Gecikme ekleyerek daha güvenli yükleme
              });
            } catch (e) {
              console.error('AdSense resume hatası:', e);
            }
          })();
        `}
      </Script>
    </>
  );
} 