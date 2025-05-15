# FastReader - Hızlı Okuma Uygulaması

FastReader, metinlerinizi istediğiniz hızda kelime kelime okuyarak hızlı okuma pratiği yapmanızı sağlayan bir web uygulamasıdır.

## Özellikler

- **Hızlı Okuma:** Metinlerinizi kelime kelime, istediğiniz hızda (kelime/dakika cinsinden) okuyabilirsiniz
- **PDF ve Diğer Dosya Türleri:** TXT, PDF ve DOCX dosyalarını yükleyip hızlı okuma için kullanabilirsiniz
- **Çoklu Dil Desteği:** Türkçe, İngilizce, Almanca, Fransızca, Çince, Japonca ve İspanyolca dil seçenekleri
- **Karanlık/Aydınlık Tema:** Göz yorgunluğunu azaltmak için tema seçenekleri
- **Tam Ekran Modu:** Dikkat dağıtıcı unsurları ortadan kaldırmak için tam ekran okuma modu
- **Okuma İstatistikleri:** İlerlemenizi, okuma hızınızı ve tahmini bitirme sürenizi takip edin
- **Mobil Uyumlu:** Tüm cihazlarda sorunsuz çalışacak şekilde tasarlanmıştır

## Başlangıç

Uygulamayı yerel ortamınızda çalıştırmak için:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görüntüleyebilirsiniz.

## Nasıl Kullanılır

1. Metin alanına hızlı okumak istediğiniz metni girin veya bir dosya yükleyin
2. İstediğiniz okuma hızını ayarlayın (kelime/dakika cinsinden)
3. "Oynat" düğmesine tıklayarak okumaya başlayın
4. İlerleme çubuğu ve istatistikler, okuma sürecinizi takip etmenize yardımcı olacaktır

## Teknolojiler

Bu proje aşağıdaki teknolojiler kullanılarak geliştirilmiştir:

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI kütüphanesi
- [TypeScript](https://www.typescriptlang.org/) - Tip güvenliği
- [Tailwind CSS](https://tailwindcss.com/) - Stil kütüphanesi
- [Mammoth.js](https://github.com/mwilliamson/mammoth.js) - DOCX dönüştürme
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF dönüştürme

## Katkıda Bulunma

1. Bu projeyi fork edin
2. Özellik dalı oluşturun (`git checkout -b yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Dalınıza push edin (`git push origin yeni-ozellik`)
5. Bir Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
