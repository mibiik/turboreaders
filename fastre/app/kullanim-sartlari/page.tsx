'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../contexts/LanguageContext';
import { GoogleInContentAd } from '../../components/GoogleAd';

export default function TermsPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Kullanım Şartları</h1>
          <p className="text-gray-400">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
        </header>
        
        <main className="prose prose-lg max-w-4xl mx-auto text-gray-300 prose-headings:text-white prose-strong:text-white prose-a:text-blue-400">
          <p>
            TurboReader uygulamasını kullanarak, aşağıdaki kullanım şartlarını kabul etmiş olursunuz. Bu şartları kabul etmiyorsanız, lütfen uygulamayı kullanmayın.
          </p>
          
          <h2>Kullanım Koşulları</h2>
          <p>
            TurboReader, metin ve dokümanları hızlı okuma teknolojisi ile görüntülemenizi sağlayan bir web uygulamasıdır. Bu uygulamayı kullanırken aşağıdaki kurallara uymayı kabul etmiş sayılırsınız:
          </p>
          <ul>
            <li>Uygulamayı yalnızca yasal amaçlar için kullanacağınızı</li>
            <li>Başkalarının haklarını ihlal etmeyeceğinizi</li>
            <li>Uygulamanın güvenliğini tehlikeye atacak faaliyetlerde bulunmayacağınızı</li>
            <li>Uygulamayı yasa dışı içerikleri görüntülemek için kullanmayacağınızı</li>
          </ul>
          
          <GoogleInContentAd />
          
          <h2>Fikri Mülkiyet Hakları</h2>
          <p>
            TurboReader uygulaması ve ilgili tüm içerikler (logolar, tasarımlar, metinler, grafikler vb.), fikri mülkiyet hakları ile korunmaktadır. Bu içerikleri izinsiz kopyalamak, değiştirmek veya dağıtmak yasaktır.
          </p>
          
          <h2>Sorumluluk Reddi</h2>
          <p>
            TurboReader uygulaması "olduğu gibi" sunulmaktadır. Uygulama ile ilgili açık veya zımni hiçbir garanti verilmemektedir. Uygulamanın kesintisiz veya hatasız çalışacağı garanti edilmemektedir.
          </p>
          <p>
            TurboReader, uygulamanın kullanımından kaynaklanan doğrudan veya dolaylı hiçbir zarar için sorumlu tutulamaz. Bu, veri kaybı, iş kaybı veya diğer mali kayıpları da içerir.
          </p>
          
          <h2>Kullanıcı İçeriği</h2>
          <p>
            TurboReader'a yüklediğiniz veya girdiğiniz metinlerden siz sorumlusunuz. Başkalarının telif haklarını, ticari sırlarını veya diğer mülkiyet haklarını ihlal eden içerikleri yüklememelisiniz.
          </p>
          
          <GoogleInContentAd />
          
          <h2>Değişiklikler</h2>
          <p>
            TurboReader, bu kullanım şartlarını herhangi bir zamanda değiştirme hakkını saklı tutar. Değişiklikler, bu sayfada yayınlandıktan sonra yürürlüğe girer. Uygulamayı kullanmaya devam ederek, güncellenmiş şartları kabul etmiş sayılırsınız.
          </p>
          
          <h2>Hesap Güvenliği</h2>
          <p>
            Gelecekte uygulamaya hesap oluşturma özelliği eklendiğinde, hesap bilgilerinizin güvenliğinden siz sorumlu olacaksınız. Şifrenizin güvenliğini sağlamak ve hesabınızdaki herhangi bir şüpheli aktiviteyi bildirmek sizin sorumluluğunuzdadır.
          </p>
          
          <h2>Uyuşmazlık Çözümü</h2>
          <p>
            Bu kullanım şartlarından doğan herhangi bir uyuşmazlık, Türkiye Cumhuriyeti yasalarına göre çözümlenecektir.
          </p>
          
          <h2>İletişim</h2>
          <p>
            Kullanım şartları ile ilgili sorularınız veya endişeleriniz varsa, <Link href="/iletisim" className="text-blue-400 hover:text-blue-300">İletişim</Link> sayfamızdan bize ulaşabilirsiniz.
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