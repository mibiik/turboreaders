'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { GoogleInContentAd } from '../../components/GoogleAd';

export default function ContactPage() {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{success: boolean; message: string} | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);
    
    // Form gönderme simülasyonu - gerçek uygulamada API'ye istek yapılacak
    try {
      // Simüle edilmiş form gönderme gecikmesi
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Başarılı yanıt simülasyonu
      setSubmitResult({
        success: true,
        message: 'Mesajınız başarıyla gönderildi. En kısa sürede size geri dönüş yapacağız.'
      });
      
      // Formu temizle
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitResult({
        success: false,
        message: 'Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <Link href="/" className="inline-block">
            <Image 
              src="/images/turbo-logo.png" 
              alt="TurboReader Logo" 
              width={300} 
              height={90} 
              className="w-auto h-16 md:h-20 object-contain mx-auto turbo-logo mb-4"
            />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">İletişim</h1>
          <p className="text-gray-400">Sorularınız ve geri bildirimleriniz için bizimle iletişime geçin</p>
        </header>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Bize Ulaşın</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-1">İsim Soyisim</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-1">E-posta Adresiniz</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-gray-300 mb-1">Konu</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Lütfen bir konu seçin</option>
                    <option value="destek">Teknik Destek</option>
                    <option value="oneri">Öneri / Geri Bildirim</option>
                    <option value="isbirligi">İş Birliği Teklifi</option>
                    <option value="diger">Diğer</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-300 mb-1">Mesajınız</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                    isSubmitting 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                </button>
                
                {submitResult && (
                  <div className={`mt-4 p-3 rounded ${
                    submitResult.success ? 'bg-green-800/50 text-green-200' : 'bg-red-800/50 text-red-200'
                  }`}>
                    {submitResult.message}
                  </div>
                )}
              </form>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">İletişim Bilgileri</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300">E-posta</p>
                    <a href="mailto:info@turboreader.com" className="text-white hover:text-blue-400 transition-colors">info@turboreader.com</a>
                  </div>
                </div>
                
                <GoogleInContentAd />
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-300">Web Sitesi</p>
                    <a href="https://turboreader.com" className="text-white hover:text-blue-400 transition-colors">www.turboreader.com</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Sık Sorulan Sorular</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white">TurboReader ücretsiz mi?</h3>
                  <p className="text-gray-300">Evet, TurboReader'ın temel özellikleri tamamen ücretsiz olarak kullanılabilir.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white">Hangi dosya formatları destekleniyor?</h3>
                  <p className="text-gray-300">TurboReader şu anda metin (.txt), PDF ve Word (.docx, .doc) dosyalarını desteklemektedir.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white">Verilerim güvende mi?</h3>
                  <p className="text-gray-300">Yüklediğiniz metinler sunucularımızda saklanmaz, sadece tarayıcınızda işlenir ve gösterilir.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <div className="container mx-auto px-4">
            <div className="mb-4">
              <Link href="/gizlilik-politikasi" className="mx-2 hover:text-gray-300 transition-colors">Gizlilik Politikası</Link>
              <Link href="/kullanim-sartlari" className="mx-2 hover:text-gray-300 transition-colors">Kullanım Şartları</Link>
              <Link href="/iletisim" className="mx-2 hover:text-gray-300 transition-colors">İletişim</Link>
            </div>
            <p className="mb-2">
              &copy; {new Date().getFullYear()} TurboReader. Tüm hakları saklıdır.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
} 