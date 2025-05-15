'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'tr' | 'en' | 'de' | 'fr' | 'zh' | 'ja' | 'es';

type Translations = {
  [key: string]: {
    tr: string;
    en: string;
    de: string;
    fr: string;
    zh: string;
    ja: string;
    es: string;
  };
};

// Tüm uygulamada kullanılacak çeviriler
const translations: Translations = {
  // Genel
  appTitle: {
    tr: 'TURBOREADER',
    en: 'TURBOREADER',
    de: 'TURBOREADER',
    fr: 'TURBOREADER',
    zh: 'TURBOREADER',
    ja: 'TURBOREADER',
    es: 'TURBOREADER',
  },
  appDescription: {
    tr: 'Metninizi girin ve istediğiniz hızda kelime kelime okuyun. Okuma hızınızı geliştirmek için mükemmel bir araç!',
    en: 'Enter your text and read word by word at your desired speed. A perfect tool to improve your reading speed!',
    de: 'Geben Sie Ihren Text ein und lesen Sie Wort für Wort in Ihrer gewünschten Geschwindigkeit. Ein perfektes Werkzeug, um Ihre Lesegeschwindigkeit zu verbessern!',
    fr: 'Entrez votre texte et lisez mot par mot à la vitesse souhaitée. Un outil parfait pour améliorer votre vitesse de lecture!',
    zh: '输入您的文本，按照您想要的速度逐字阅读。提高阅读速度的完美工具！',
    ja: 'テキストを入力し、希望の速度で単語ごとに読むことができます。読む速度を向上させるための完璧なツールです！',
    es: 'Ingrese su texto y lea palabra por palabra a la velocidad deseada. ¡Una herramienta perfecta para mejorar su velocidad de lectura!',
  },
  
  // Tema
  lightTheme: {
    tr: 'Açık temaya geç',
    en: 'Switch to light theme',
    de: 'Zum hellen Thema wechseln',
    fr: 'Passer au thème clair',
    zh: '切换到亮色主题',
    ja: 'ライトテーマに切り替え',
    es: 'Cambiar a tema claro',
  },
  darkTheme: {
    tr: 'Koyu temaya geç',
    en: 'Switch to dark theme',
    de: 'Zum dunklen Thema wechseln',
    fr: 'Passer au thème sombre',
    zh: '切换到暗色主题',
    ja: 'ダークテーマに切り替え',
    es: 'Cambiar a tema oscuro',
  },
  
  // Language Names
  languageName: {
    tr: 'Türkçe',
    en: 'English',
    de: 'Deutsch',
    fr: 'Français',
    zh: '中文',
    ja: '日本語',
    es: 'Español',
  },
  
  // SpeedReader bileşeni
  enterText: {
    tr: 'Metninizi girin:',
    en: 'Enter your text:',
    de: 'Geben Sie Ihren Text ein:',
    fr: 'Entrez votre texte:',
    zh: '输入您的文本:',
    ja: 'テキストを入力:',
    es: 'Ingrese su texto:',
  },
  uploadFile: {
    tr: 'Dosya Yükle',
    en: 'Upload File',
    de: 'Datei hochladen',
    fr: 'Télécharger un fichier',
    zh: '上传文件',
    ja: 'ファイルをアップロード',
    es: 'Subir archivo',
  },
  uploading: {
    tr: 'Yükleniyor...',
    en: 'Uploading...',
    de: 'Hochladen...',
    fr: 'Téléchargement...',
    zh: '上传中...',
    ja: 'アップロード中...',
    es: 'Subiendo...',
  },
  removeFile: {
    tr: 'Dosyayı Kaldır',
    en: 'Remove File',
    de: 'Datei entfernen',
    fr: 'Supprimer le fichier',
    zh: '删除文件',
    ja: 'ファイルを削除',
    es: 'Eliminar archivo',
  },
  textareaPlaceholder: {
    tr: 'Buraya hızlı okumak istediğiniz metni girin veya dosya yükleyin...',
    en: 'Enter the text you want to speed read here or upload a file...',
    de: 'Geben Sie hier den Text ein, den Sie schnell lesen möchten, oder laden Sie eine Datei hoch...',
    fr: 'Entrez le texte que vous souhaitez lire rapidement ici ou téléchargez un fichier...',
    zh: '在此处输入您想要快速阅读的文本或上传文件...',
    ja: 'ここに速読したいテキストを入力するか、ファイルをアップロードしてください...',
    es: 'Ingrese el texto que desea leer rápidamente aquí o suba un archivo...',
  },
  fileUploading: {
    tr: 'Dosya yükleniyor, lütfen bekleyin...',
    en: 'File uploading, please wait...',
    de: 'Datei wird hochgeladen, bitte warten...',
    fr: 'Téléchargement du fichier, veuillez patienter...',
    zh: '文件上传中，请稍候...',
    ja: 'ファイルをアップロード中、お待ちください...',
    es: 'Archivo subiendo, por favor espere...',
  },
  pdfReadError: {
    tr: 'PDF dosyası okunamadı. Lütfen metni manuel olarak girin.',
    en: 'Could not read PDF file. Please enter the text manually.',
    de: 'PDF-Datei konnte nicht gelesen werden. Bitte geben Sie den Text manuell ein.',
    fr: 'Impossible de lire le fichier PDF. Veuillez saisir le texte manuellement.',
    zh: '无法读取PDF文件。请手动输入文本。',
    ja: 'PDFファイルを読み取れませんでした。手動でテキストを入力してください。',
    es: 'No se pudo leer el archivo PDF. Por favor, introduzca el texto manualmente.',
  },
  unsupportedFormat: {
    tr: 'Bu dosya formatı desteklenmiyor. Lütfen metninizi yapıştırın.',
    en: 'This file format is not supported. Please paste your text.',
    de: 'Dieses Dateiformat wird nicht unterstützt. Bitte fügen Sie Ihren Text ein.',
    fr: 'Ce format de fichier n\'est pas pris en charge. Veuillez coller votre texte.',
    zh: '不支持此文件格式。请粘贴您的文本。',
    ja: 'このファイル形式はサポートされていません。テキストを貼り付けてください。',
    es: 'Este formato de archivo no es compatible. Por favor, pegue su texto.',
  },
  fileUploadError: {
    tr: 'Dosya yüklenirken bir hata oluştu. Lütfen metni manuel olarak girin.',
    en: 'An error occurred while uploading the file. Please enter the text manually.',
    de: 'Beim Hochladen der Datei ist ein Fehler aufgetreten. Bitte geben Sie den Text manuell ein.',
    fr: 'Une erreur s\'est produite lors du téléchargement du fichier. Veuillez saisir le texte manuellement.',
    zh: '上传文件时发生错误。请手动输入文本。',
    ja: 'ファイルのアップロード中にエラーが発生しました。手動でテキストを入力してください。',
    es: 'Se produjo un error al subir el archivo. Por favor, introduzca el texto manualmente.',
  },
  wordsWillAppear: {
    tr: 'Kelimeler burada görünecek',
    en: 'Words will appear here',
    de: 'Wörter werden hier erscheinen',
    fr: 'Les mots apparaîtront ici',
    zh: '单词将在此处显示',
    ja: '単語がここに表示されます',
    es: 'Las palabras aparecerán aquí',
  },
  previous: {
    tr: 'Önceki',
    en: 'Previous',
    de: 'Zurück',
    fr: 'Précédent',
    zh: '上一个',
    ja: '前へ',
    es: 'Anterior',
  },
  pause: {
    tr: 'Duraklat',
    en: 'Pause',
    de: 'Pause',
    fr: 'Pause',
    zh: '暂停',
    ja: '一時停止',
    es: 'Pausa',
  },
  play: {
    tr: 'Oynat',
    en: 'Play',
    de: 'Abspielen',
    fr: 'Lecture',
    zh: '播放',
    ja: '再生',
    es: 'Reproducir',
  },
  next: {
    tr: 'Sonraki',
    en: 'Next',
    de: 'Weiter',
    fr: 'Suivant',
    zh: '下一个',
    ja: '次へ',
    es: 'Siguiente',
  },
  reset: {
    tr: 'Sıfırla',
    en: 'Reset',
    de: 'Zurücksetzen',
    fr: 'Réinitialiser',
    zh: '重置',
    ja: 'リセット',
    es: 'Reiniciar',
  },
  fullscreen: {
    tr: 'Tam ekran yap',
    en: 'Make fullscreen',
    de: 'Vollbild',
    fr: 'Plein écran',
    zh: '全屏显示',
    ja: '全画面表示',
    es: 'Pantalla completa',
  },
  exitFullscreen: {
    tr: 'Tam ekrandan çık',
    en: 'Exit fullscreen',
    de: 'Vollbild beenden',
    fr: 'Quitter le plein écran',
    zh: '退出全屏',
    ja: '全画面を終了',
    es: 'Salir de pantalla completa',
  },
  decreaseSpeed: {
    tr: 'Hızı azalt',
    en: 'Decrease speed',
    de: 'Geschwindigkeit verringern',
    fr: 'Diminuer la vitesse',
    zh: '降低速度',
    ja: '速度を下げる',
    es: 'Disminuir velocidad',
  },
  increaseSpeed: {
    tr: 'Hızı artır',
    en: 'Increase speed',
    de: 'Geschwindigkeit erhöhen',
    fr: 'Augmenter la vitesse',
    zh: '提高速度',
    ja: '速度を上げる',
    es: 'Aumentar velocidad',
  },
  speedLabel: {
    tr: 'Okuma hızı (kelime/dakika)',
    en: 'Reading speed (words per minute)',
    de: 'Lesegeschwindigkeit (Wörter pro Minute)',
    fr: 'Vitesse de lecture (mots par minute)',
    zh: '阅读速度（每分钟字数）',
    ja: '読書速度（1分あたりの単語数）',
    es: 'Velocidad de lectura (palabras por minuto)',
  },
  speedTitle: {
    tr: 'İstediğiniz okuma hızını girebilirsiniz (0 dahil)',
    en: 'You can enter any reading speed you want (including 0)',
    de: 'Sie können eine beliebige Lesegeschwindigkeit eingeben (einschließlich 0)',
    fr: 'Vous pouvez entrer la vitesse de lecture souhaitée (y compris 0)',
    zh: '您可以输入任何您想要的阅读速度（包括0）',
    ja: '希望する読書速度を入力できます（0を含む）',
    es: 'Puede ingresar cualquier velocidad de lectura que desee (incluido 0)',
  },
  wordsPerMinute: {
    tr: 'kelime/dk',
    en: 'words/min',
    de: 'Wörter/Min',
    fr: 'mots/min',
    zh: '字/分钟',
    ja: '語/分',
    es: 'palabras/min',
  },
  progressText: {
    tr: 'kelime',
    en: 'words',
    de: 'Wörter',
    fr: 'mots',
    zh: '单词',
    ja: '単語',
    es: 'palabras',
  },
  loadAndStart: {
    tr: 'Metin yükleyin ve okumaya başlayın',
    en: 'Load text and start reading',
    de: 'Text laden und mit dem Lesen beginnen',
    fr: 'Charger le texte et commencer à lire',
    zh: '加载文本并开始阅读',
    ja: 'テキストを読み込んで読み始める',
    es: 'Cargar texto y comenzar a leer',
  },
  selectLanguage: {
    tr: 'Dil seçin',
    en: 'Select language',
    de: 'Sprache auswählen',
    fr: 'Choisir la langue',
    zh: '选择语言',
    ja: '言語を選択',
    es: 'Seleccionar idioma',
  },
  
  // StatsPanel bileşeni için çeviriler
  readingStats: {
    tr: 'Okuma İstatistikleri',
    en: 'Reading Statistics',
    de: 'Lesestatistiken',
    fr: 'Statistiques de lecture',
    zh: '阅读统计',
    ja: '読書統計',
    es: 'Estadísticas de lectura',
  },
  progress: {
    tr: 'İlerleme',
    en: 'Progress',
    de: 'Fortschritt',
    fr: 'Progrès',
    zh: '进度',
    ja: '進捗',
    es: 'Progreso',
  },
  currentSpeed: {
    tr: 'Şu anki hız',
    en: 'Current speed',
    de: 'Aktuelle Geschwindigkeit',
    fr: 'Vitesse actuelle',
    zh: '当前速度',
    ja: '現在の速度',
    es: 'Velocidad actual',
  },
  wpm: {
    tr: 'KDK',
    en: 'WPM',
    de: 'WPM',
    fr: 'MPM',
    zh: '每分钟字数',
    ja: 'WPM',
    es: 'PPM',
  },
  wordsRead: {
    tr: 'Okunan kelimeler',
    en: 'Words read',
    de: 'Gelesene Wörter',
    fr: 'Mots lus',
    zh: '已读单词',
    ja: '読んだ単語',
    es: 'Palabras leídas',
  },
  wordsRemaining: {
    tr: 'Kalan kelimeler',
    en: 'Words remaining',
    de: 'Verbleibende Wörter',
    fr: 'Mots restants',
    zh: '剩余单词',
    ja: '残りの単語',
    es: 'Palabras restantes',
  },
  elapsedTime: {
    tr: 'Geçen süre',
    en: 'Elapsed time',
    de: 'Verstrichene Zeit',
    fr: 'Temps écoulé',
    zh: '已用时间',
    ja: '経過時間',
    es: 'Tiempo transcurrido',
  },
  estimatedTimeLeft: {
    tr: 'Tahmini kalan süre',
    en: 'Estimated time left',
    de: 'Geschätzte verbleibende Zeit',
    fr: 'Temps restant estimé',
    zh: '预计剩余时间',
    ja: '推定残り時間',
    es: 'Tiempo restante estimado',
  },
  sessionStats: {
    tr: 'Oturum istatistikleri',
    en: 'Session stats',
    de: 'Sitzungsstatistiken',
    fr: 'Statistiques de session',
    zh: '会话统计',
    ja: 'セッション統計',
    es: 'Estadísticas de sesión',
  },
  wordsTotal: {
    tr: 'toplam kelime',
    en: 'words total',
    de: 'Wörter insgesamt',
    fr: 'mots au total',
    zh: '总字数',
    ja: '単語合計',
    es: 'palabras en total',
  },
  tip: {
    tr: 'Öneri',
    en: 'Tip',
    de: 'Tipp',
    fr: 'Conseil',
    zh: '提示',
    ja: 'ヒント',
    es: 'Consejo',
  },
  tipSlowReader: {
    tr: 'Okuma hızını yükseltmek için, kelimeler arasında daha az duraklamaya çalışın.',
    en: 'To increase your reading speed, try to pause less between words.',
    de: 'Um Ihre Lesegeschwindigkeit zu erhöhen, versuchen Sie, weniger zwischen den Wörtern zu pausieren.',
    fr: 'Pour augmenter votre vitesse de lecture, essayez de faire moins de pauses entre les mots.',
    zh: '要提高阅读速度，尝试在单词之间减少停顿。',
    ja: '読書速度を上げるには、単語間の停止を少なくしてみてください。',
    es: 'Para aumentar su velocidad de lectura, trate de pausar menos entre palabras.',
  },
  tipAverageReader: {
    tr: 'İyi bir hızla ilerliyorsunuz! Dikkatinizi dağıtmadan rahat okuma hızınızı bulun.',
    en: 'You are progressing at a good pace! Find your comfortable reading speed without losing focus.',
    de: 'Sie machen ein gutes Tempo! Finden Sie Ihre angenehme Lesegeschwindigkeit, ohne die Konzentration zu verlieren.',
    fr: 'Vous progressez à un bon rythme ! Trouvez votre vitesse de lecture confortable sans perdre votre concentration.',
    zh: '您正在以良好的速度前进！找到您舒适的阅读速度，而不会失去注意力。',
    ja: 'あなたは良いペースで進んでいます！集中力を失わずに、快適な読書速度を見つけてください。',
    es: '¡Está progresando a un buen ritmo! Encuentre su velocidad de lectura cómoda sin perder el enfoque.',
  },
  tipFastReader: {
    tr: 'Etkileyici bir okuma hızına sahipsiniz! Metni anladığınızdan emin olun.',
    en: 'You have an impressive reading speed! Make sure you still comprehend the text.',
    de: 'Sie haben eine beeindruckende Lesegeschwindigkeit! Stellen Sie sicher, dass Sie den Text immer noch verstehen.',
    fr: 'Vous avez une vitesse de lecture impressionnante ! Assurez-vous de toujours comprendre le texte.',
    zh: '您的阅读速度令人印象深刻！请确保您仍然理解文本。',
    ja: 'あなたの読書速度は印象的です！テキストをまだ理解していることを確認してください。',
    es: '¡Tiene una velocidad de lectura impresionante! Asegúrese de seguir comprendiendo el texto.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('tr');
  const [mounted, setMounted] = useState(false);
  const availableLanguages: Language[] = ['tr', 'en', 'de', 'fr', 'zh', 'ja', 'es'];

  // localStorage'dan dil tercihini al
  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && availableLanguages.includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Dil değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('language', language);
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  // Çeviri fonksiyonu
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 