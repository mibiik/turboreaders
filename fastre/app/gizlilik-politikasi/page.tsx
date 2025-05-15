'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../contexts/LanguageContext';
import { GoogleInContentAd } from '../../components/GoogleAd';

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();
  
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Gizlilik Politikası</h1>
          <p className="text-gray-400">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
        </header>
        
        <main className="prose prose-lg max-w-4xl mx-auto text-gray-300 prose-headings:text-white prose-strong:text-white prose-a:text-blue-400">
          <p>
            Bu Gizlilik Politikası, TurboReader platformunu kullanımınız sırasında toplanan, işlenen ve saklanan kişisel verileriniz hakkında bilgi vermek amacıyla hazırlanmıştır.
          </p>
          
          <h2>Toplanan Veriler</h2>
          <p>
            TurboReader uygulamasını kullanırken aşağıdaki veriler toplanabilir:
          </p>
          <ul>
            <li>Cihaz bilgileri (işletim sistemi, tarayıcı türü, ekran çözünürlüğü vb.)</li>
            <li>Kullanım istatistikleri (okuma hızı, kullanım süresi vb.)</li>
            <li>IP adresi ve konum bilgisi</li>
            <li>Çerezler ve benzer teknolojiler aracılığıyla elde edilen bilgiler</li>
          </ul>
          
          <GoogleInContentAd />
          
          <h2>Verilerin Kullanımı</h2>
          <p>
            Toplanan veriler aşağıdaki amaçlarla kullanılmaktadır:
          </p>
          <ul>
            <li>Hizmetlerimizi sunmak ve geliştirmek</li>
            <li>Kişiselleştirilmiş içerik ve öneriler sunmak</li>
            <li>Kullanıcı deneyimini iyileştirmek</li>
            <li>Teknik sorunları tespit etmek ve çözmek</li>
            <li>Analiz ve istatistik amaçlı kullanım</li>
          </ul>
          
          <h2>Çerezler</h2>
          <p>
            TurboReader, çerezler ve benzer teknolojiler kullanmaktadır. Çerezler, bilgisayarınızda veya mobil cihazınızda saklanan küçük metin dosyalarıdır. Çerezleri tarayıcı ayarlarınızdan kontrol edebilir veya devre dışı bırakabilirsiniz.
          </p>
          
          <h2>Üçüncü Taraf Hizmetleri</h2>
          <p>
            TurboReader, Google Analytics ve Google AdSense gibi üçüncü taraf hizmetleri kullanmaktadır. Bu hizmetler kendi çerezlerini kullanabilir ve verilerinizi kendi gizlilik politikaları doğrultusunda işleyebilir.
          </p>
          
          <GoogleInContentAd />
          
          <h2>Veri Güvenliği</h2>
          <p>
            Kişisel verilerinizin güvenliğini sağlamak için uygun teknik ve organizasyonel önlemler alınmaktadır. Ancak, internet üzerinden hiçbir veri iletiminin %100 güvenli olmadığını lütfen unutmayın.
          </p>
          
          <h2>Veri Saklama</h2>
          <p>
            Kişisel verileriniz, hizmetlerimizi sunmak için gerekli olduğu sürece saklanacaktır. Yasal yükümlülüklerimiz gereği daha uzun süre saklamamız gerekmedikçe, verilerinizi sadece gerekli olduğu süre boyunca saklayacağız.
          </p>
          
          <h2>Haklarınız</h2>
          <p>
            Kişisel verilerinizle ilgili olarak aşağıdaki haklara sahipsiniz:
          </p>
          <ul>
            <li>Verilerinize erişim hakkı</li>
            <li>Verilerinizin düzeltilmesini talep etme hakkı</li>
            <li>Verilerinizin silinmesini talep etme hakkı</li>
            <li>Verilerinizin işlenmesini kısıtlama hakkı</li>
            <li>Veri taşınabilirliği hakkı</li>
            <li>İtiraz etme hakkı</li>
          </ul>
          
          <h2>Politika Değişiklikleri</h2>
          <p>
            Bu Gizlilik Politikası zaman zaman güncellenebilir. Politika değişiklikleri bu sayfada yayınlanacaktır. Değişikliklerin yürürlüğe girdiği tarih, sayfanın üst kısmında belirtilecektir.
          </p>
          
          <h2>İletişim</h2>
          <p>
            Gizlilik Politikası ile ilgili sorularınız veya talepleriniz için <Link href="/iletisim" className="text-blue-400 hover:text-blue-300">İletişim</Link> sayfamızdan bize ulaşabilirsiniz.
          </p>
        </main>
        
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