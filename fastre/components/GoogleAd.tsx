'use client';

import { useEffect, useState, useRef } from 'react';

type AdProps = {
  adSlot: string;
  adFormat?: 'auto' | 'horizontal' | 'vertical' | 'rectangle' | 'interstitial';
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
};

// AdSense tipi için global tanımlama
declare global {
  interface Window {
    adsbygoogle: Array<any> & {
      pauseAdRequests?: number;
      push: (...args: any[]) => void;
    };
  }
}

// Güvenli bir şekilde adsbygoogle.push çağırma
const safeAdPush = () => {
  return new Promise<boolean>((resolve) => {
    try {
      if (typeof window === 'undefined') {
        resolve(false);
        return;
      }
      
      // AdSense henüz yüklenmedi
      if (!window.adsbygoogle) {
        resolve(false);
        return;
      }

      // Zamanlayıcı ile güvenli push
      setTimeout(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          resolve(true);
        } catch (error) {
          console.error("AdSense push hatası:", error);
          resolve(false);
        }
      }, 100);
    } catch (e) {
      console.error("AdSense erişim hatası:", e);
      resolve(false);
    }
  });
};

export function GoogleAd({ adSlot, adFormat = 'auto', style, className, responsive = true }: AdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [adError, setAdError] = useState<string | null>(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [pushAttempts, setPushAttempts] = useState(0);

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const loadAd = async () => {
      if (!mounted) return;
      
      // AdSense hazır mı diye bekle
      if (pushAttempts === 0) {
        setPushAttempts(prev => prev + 1);
        
        // Güvenli bir zaman bekle
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      try {
        // Güvenli push işlemi
        const success = await safeAdPush();
        
        if (success) {
          if (mounted) {
            setIsAdLoaded(true);
            setAdError(null);
          }
        } else if (retryCount < maxRetries && mounted) {
          retryCount++;
          // Her denemede daha uzun bekle
          setTimeout(loadAd, retryCount * 1000);
        } else if (mounted) {
          setAdError('Reklam yüklenemedi');
        }
      } catch (err) {
        console.error('AdSense error:', err);
        if (mounted) {
          setAdError('Reklam yüklenirken bir hata oluştu');
        }
      }
    };

    // Ertelemeli olarak başlat
    const timeoutId = setTimeout(loadAd, 1500);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [pushAttempts]);

  return (
    <div className={`ad-container ${className || ''}`} style={style} ref={adRef}>
      {adError ? (
        <div className="text-xs text-gray-400 text-center py-2">
          {adError}
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            textAlign: 'center',
            ...style,
          }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      )}
    </div>
  );
}

// Farklı reklam boyutları için hazır bileşenler
export function GoogleTopBanner() {
  return (
    <div className="w-full max-w-3xl mx-auto my-3 sm:my-4 hidden sm:block">
      <GoogleAd adSlot="1234567890" adFormat="horizontal" className="mt-2 mb-3" />
    </div>
  );
}

export function GoogleBottomBanner() {
  return (
    <div className="w-full max-w-3xl mx-auto my-3 sm:my-4">
      <GoogleAd adSlot="0987654321" adFormat="horizontal" className="mt-3 mb-2" />
    </div>
  );
}

export function GoogleSideAd() {
  return (
    <div className="hidden lg:block sticky top-20 h-[600px]">
      <GoogleAd
        adSlot="1122334455"
        adFormat="vertical"
        className="h-full"
        style={{ width: '160px', height: '600px' }}
      />
    </div>
  );
}

export function GoogleMobileAd() {
  return (
    <div className="block sm:hidden w-full my-2">
      <GoogleAd
        adSlot="6677889900"
        adFormat="rectangle"
        className="mx-auto"
        style={{ maxWidth: '336px', height: '280px' }}
      />
    </div>
  );
}

export function GoogleInContentAd() {
  return (
    <div className="my-6 mx-auto max-w-[336px]">
      <GoogleAd adSlot="5566778899" adFormat="rectangle" className="my-2" />
    </div>
  );
}

// Tam ekran reklam bileşeni
export function GoogleInterstitialAd() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  
  useEffect(() => {
    // Çerezleri kontrol et
    const adShown = localStorage.getItem('interstitialAdShown');
    
    // Son 24 saat içinde gösterilmişse tekrar gösterme
    if (adShown && (new Date().getTime() - parseInt(adShown)) < 24 * 60 * 60 * 1000) {
      setHasBeenShown(true);
      return;
    }
    
    // AdSense hazır olduğunda göster - daha güvenli yaklaşım
    const checkAdSense = async () => {
      try {
        if (typeof window === 'undefined') return null;
        
        if (window && window.adsbygoogle) {
          setIsAdLoaded(true);
          
          // Sayfa yüklendiğinde 5 saniye sonra göster
          const timer = setTimeout(() => {
            setIsVisible(true);
            // Gösterilme zamanını kaydet
            localStorage.setItem('interstitialAdShown', new Date().getTime().toString());
            setHasBeenShown(true);
          }, 5000);
          
          return timer;
        }
      } catch (err) {
        console.error('AdSense interstitial error:', err);
      }
      return null;
    };
    
    // Tarayıcıda çalıştığından emin ol
    if (typeof window === 'undefined') return;
    
    let mounted = true;
    
    // İlk kontrol
    let timer: ReturnType<typeof setTimeout> | null = null;
    
    // Sayfa tamamen yüklendikten sonra AdSense'i kontrol et
    window.addEventListener('load', () => {
      if (!mounted) return;
      
      setTimeout(async () => {
        if (!mounted) return;
        timer = await checkAdSense();
      }, 2000);
    });
    
    // AdSense henüz yüklenmediyse, tekrar dene
    if (!timer) {
      const interval = setInterval(async () => {
        if (!mounted) {
          clearInterval(interval);
          return;
        }
        
        timer = await checkAdSense();
        if (timer) {
          clearInterval(interval);
        }
      }, 1000);
      
      // En fazla 10 saniye deneyelim
      const maxWaitTimer = setTimeout(() => {
        clearInterval(interval);
      }, 10000);
      
      return () => {
        mounted = false;
        clearInterval(interval);
        clearTimeout(maxWaitTimer);
        if (timer) clearTimeout(timer);
      };
    }
    
    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, []);
  
  if (hasBeenShown && !isVisible) return null;
  
  return isVisible ? (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg p-4 relative max-w-lg w-full">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-3 -right-3 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center"
          aria-label="Reklamı kapat"
        >
          ✕
        </button>
        
        <div className="text-center mb-2 text-white text-sm">Reklam</div>
        
        <div className="mx-auto my-2" style={{ maxWidth: '336px', height: '280px' }}>
          {isAdLoaded && (
            <div id="interstitial-ad-container">
              <ins
                className="adsbygoogle"
                style={{ display: 'block', maxWidth: '336px', height: '280px' }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot="5566778899"
                data-ad-format="rectangle"
                data-full-width-responsive="false"
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    try {
                      (window.adsbygoogle = window.adsbygoogle || []).push({});
                    } catch (e) {
                      console.error('Interstitial ad error:', e);
                    }
                  `
                }}
              />
            </div>
          )}
        </div>
        
        <div className="text-center mt-4">
          <button 
            onClick={() => setIsVisible(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Devam Et
          </button>
        </div>
      </div>
    </div>
  ) : null;
} 