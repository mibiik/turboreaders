'use client';

import { useState, useEffect } from 'react';

export default function DisableAds() {
  const [adsDisabled, setAdsDisabled] = useState(false);
  
  useEffect(() => {
    // Kullanıcı tercihini localStorage'dan al
    const disabled = localStorage.getItem('adsDisabled') === 'true';
    setAdsDisabled(disabled);
    
    // Eğer kullanıcı reklamları devre dışı bırakmışsa, adsbygoogle'ı da devre dışı bırak
    if (disabled && window.adsbygoogle) {
      // @ts-ignore
      window.adsbygoogle.pauseAdRequests = 1;
      console.log('Reklamlar kullanıcı tercihi ile devre dışı bırakıldı');
    }
  }, []);
  
  const toggleAds = () => {
    const newState = !adsDisabled;
    setAdsDisabled(newState);
    localStorage.setItem('adsDisabled', newState.toString());
    
    // Sayfayı yenileme - basit bir yaklaşım
    window.location.reload();
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={toggleAds}
        className="px-3 py-2 rounded-full bg-blue-600 text-white text-xs shadow-md flex items-center space-x-1 hover:bg-blue-700 transition-colors"
        title={adsDisabled ? "Reklamları etkinleştir" : "Reklamları devre dışı bırak"}
      >
        <span className={`inline-block w-2 h-2 rounded-full ${adsDisabled ? 'bg-red-500' : 'bg-green-500'}`}></span>
        <span>{adsDisabled ? "Reklamlar devre dışı" : "Reklamlar etkin"}</span>
      </button>
    </div>
  );
} 