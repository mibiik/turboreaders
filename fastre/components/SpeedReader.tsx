'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import mammoth from 'mammoth';
import { extractTextFromPdf } from './PdfReader';
import { useLanguage } from '../contexts/LanguageContext';
import { GoogleMobileAd } from './GoogleAd';

export function SpeedReader() {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(200); // WPM (Words Per Minute)
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wordDisplayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Metni kelimelere ayırma
  const parseText = (inputText: string) => {
    const parsedWords = inputText
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0);
    setWords(parsedWords);
    setCurrentWordIndex(0);
    setIsPlaying(false);
  };

  // Text değiştiğinde otomatik olarak metni yükleme
  useEffect(() => {
    if (text.trim().length > 0) {
      parseText(text);
    }
  }, [text]);

  // Hız kontrolü - bir dakikadaki kelime sayısını milisaniyeye çevirme
  const calculateDelay = () => {
    return 60000 / speed; // 60.000 ms (1 dakika) / kelime sayısı = ms cinsinden gecikme
  };

  // Oynatma/duraklatma kontrolü
  const togglePlay = () => {
    if (words.length === 0) return;
    
    setIsPlaying(prev => !prev);
  };

  // Tam ekran kontrolü
  const toggleFullscreen = () => {
    if (!wordDisplayRef.current) return;

    if (!isFullscreen) {
      if (wordDisplayRef.current.requestFullscreen) {
        wordDisplayRef.current.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error('Tam ekran moduna geçilemedi:', err));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error('Tam ekran modundan çıkılamadı:', err));
      }
    }
  };

  // Tüm okuma işlemini sıfırlama
  const handleReset = () => {
    setCurrentWordIndex(0);
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Word dosyasını oku
  const readWordFile = async (file: File) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setText(result.value);
      setIsLoading(false);
    } catch (error) {
      console.error('Word dosyası okuma hatası:', error);
      setErrorMessage(t('pdfReadError'));
      setText('');
      setIsLoading(false);
    }
  };

  // Dosya yükleme
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Dosya türüne göre işlem yap
      if (file.type === 'text/plain') {
        // Metin dosyası
        const text = await file.text();
        setText(text);
      } 
      else if (file.type === 'application/pdf') {
        // PDF dosyası
        try {
          const pdfText = await extractTextFromPdf(file);
          setText(pdfText);
        } catch (error) {
          setErrorMessage(t('pdfReadError'));
          setText('');
        }
      }
      else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        file.type === 'application/msword'
      ) {
        // Word dosyası
        await readWordFile(file);
      }
      else {
        // Diğer dosya türleri
        try {
          const text = await file.text();
          setText(text);
        } catch (error) {
          setErrorMessage(t('unsupportedFormat'));
          setText('');
          console.error('Dosya yüklenirken hata:', error);
        }
      }
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      setErrorMessage(t('fileUploadError'));
      setText('');
    } finally {
      setIsLoading(false);
    }
  };

  // Dosya seçimini tetikleme
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Tam ekran değişikliklerini dinleme
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Klavye kısayollarını dinleme
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Eğer bir input veya textarea alanı aktifse, kısayolları işleme
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Boşluk tuşu: Oynat/Duraklat
      if (e.code === 'Space') {
        e.preventDefault(); // Sayfanın aşağı kaymasını engelle
        togglePlay();
      }
      // Sol ok: Önceki kelime
      else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
      // Sağ ok: Sonraki kelime
      else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
      // ESC tuşu: Tam ekrandan çık
      else if (e.code === 'Escape' && isFullscreen) {
        document.exitFullscreen().catch(err => console.error('Tam ekrandan çıkılamadı:', err));
      }
      // R tuşu: Sıfırla
      else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      }
      // F tuşu: Tam ekran
      else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, words, currentWordIndex]);

  // Oynatma durumu değiştiğinde zamanlayıcıyı başlatma/durdurma
  useEffect(() => {
    if (isPlaying && words.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentWordIndex(prevIndex => {
          if (prevIndex >= words.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prevIndex + 1;
        });
      }, calculateDelay());
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, words, speed]);

  // İlerletme ve gerileme
  const handleNext = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1);
    }
  };

  // Hızı artırma/azaltma
  const increaseSpeed = () => {
    setSpeed(prev => prev + 100);
  };

  const decreaseSpeed = () => {
    setSpeed(prev => Math.max(0, prev - 100));
  };

  // Manuel hız ayarlama
  const handleSpeedChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Boş giriş için
    if (newValue === '') {
      setSpeed(0);
      return;
    }
    
    const newSpeed = parseInt(newValue);
    
    // Geçerli bir sayı ise
    if (!isNaN(newSpeed)) {
      // 0 veya daha büyük herhangi bir sayıya izin ver
      if (newSpeed >= 0) {
        setSpeed(newSpeed);
      } else {
        setSpeed(0); // Minimum 0 wpm
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 sm:gap-6">
      {/* Metin giriş alanı */}
      <div className="w-full">
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <label htmlFor="text-input" className="block text-lg font-medium">
            {t('enterText')}
          </label>
          <div className="flex flex-wrap gap-2 ml-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.docx,.doc,.pdf,.rtf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={triggerFileInput}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-1 px-3 rounded transition-colors text-sm"
              title={t('uploadFile')}
              disabled={isLoading}
            >
              {isLoading ? t('uploading') : t('uploadFile')}
            </button>
            {fileName && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 ml-2 py-1">
                <span className="mr-2 truncate max-w-[150px]">{fileName}</span>
                <button
                  onClick={() => {
                    setFileName(null);
                    setText('');
                    setWords([]);
                    setCurrentWordIndex(0);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors flex-shrink-0"
                  title={t('removeFile')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        <textarea
          id="text-input"
          className="w-full h-32 sm:h-40 p-3 sm:p-4 text-base border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-white"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('textareaPlaceholder')}
          disabled={isLoading}
        />
        {isLoading && (
          <div className="w-full mt-2 text-center text-blue-600 dark:text-blue-400">
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></div>
            {t('fileUploading')}
          </div>
        )}
        {errorMessage && (
          <div className="w-full mt-2 text-center text-red-600 dark:text-red-400">
            {errorMessage}
          </div>
        )}
        
        {/* Mobil reklam - metin alanının altında */}
        <div className="block sm:hidden w-full my-3">
          <GoogleMobileAd />
        </div>
      </div>

      {/* Kelime görüntüleme alanı */}
      <div 
        ref={wordDisplayRef}
        className={`bg-gray-800 p-6 sm:p-8 rounded-lg flex flex-col items-center justify-center relative ${
          isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : 'min-h-32 sm:min-h-36'
        }`}
      >
        <span className={`text-3xl sm:text-4xl font-medium text-center text-white ${isFullscreen ? 'text-5xl sm:text-6xl' : ''}`}>
          {words.length > 0 && currentWordIndex < words.length
            ? words[currentWordIndex]
            : t('wordsWillAppear')}
        </span>
        
        {isFullscreen && (
          <div className="absolute bottom-8 flex gap-4">
            <button
              onClick={handlePrev}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors"
              disabled={currentWordIndex === 0 || words.length === 0}
            >
              {t('previous')}
            </button>
            <button
              onClick={togglePlay}
              className={`${
                isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              } text-white font-medium py-2 px-4 rounded transition-colors`}
              disabled={words.length === 0}
            >
              {isPlaying ? t('pause') : t('play')}
            </button>
            <button
              onClick={handleNext}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors"
              disabled={currentWordIndex === words.length - 1 || words.length === 0}
            >
              {t('next')}
            </button>
          </div>
        )}
        
        <button
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-full transition-colors"
          title={isFullscreen ? t('exitFullscreen') : t('fullscreen')}
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
            </svg>
          )}
        </button>
      </div>

      {/* İlerleme göstergesi */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{
            width: words.length > 0 ? `${(currentWordIndex / (words.length - 1)) * 100}%` : '0%',
          }}
        ></div>
      </div>

      {/* Kontrol paneli */}
      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
        <div className="flex flex-wrap justify-center gap-2 mx-auto">
          <button
            onClick={handlePrev}
            className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-3 min-w-[70px] sm:min-w-[80px] rounded-full transition-colors shadow-md flex items-center justify-center text-xs sm:text-sm"
            disabled={currentWordIndex === 0 || words.length === 0}
          >
            <span>{t('previous')}</span>
          </button>
          <button
            onClick={togglePlay}
            className={`${
              isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            } text-white font-medium py-2 px-3 min-w-[70px] sm:min-w-[80px] rounded-full transition-colors shadow-md flex items-center justify-center text-xs sm:text-sm`}
            disabled={words.length === 0}
          >
            <span>{isPlaying ? t('pause') : t('play')}</span>
          </button>
          <button
            onClick={handleNext}
            className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-3 min-w-[70px] sm:min-w-[80px] rounded-full transition-colors shadow-md flex items-center justify-center text-xs sm:text-sm"
            disabled={currentWordIndex === words.length - 1 || words.length === 0}
          >
            <span>{t('next')}</span>
          </button>
          <button
            onClick={handleReset}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-3 min-w-[70px] sm:min-w-[80px] rounded-full transition-colors shadow-md flex items-center justify-center text-xs sm:text-sm"
            disabled={words.length === 0}
          >
            <span>{t('reset')}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 mt-3 sm:mt-0 w-full sm:w-auto justify-center">
          <div className="flex items-center bg-gray-900 rounded-full p-1 shadow-lg border border-gray-700 w-[240px] sm:w-[280px]">
            <button
              onClick={decreaseSpeed}
              className="h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              aria-label={t('decreaseSpeed')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
              </svg>
            </button>
            
            <div className="relative px-2 flex-1 min-w-[90px]">
              <input
                type="number"
                value={speed}
                onChange={handleSpeedChange}
                min="0"
                className="bg-transparent text-center text-xl sm:text-2xl font-bold text-white w-full focus:outline-none"
                aria-label={t('speedLabel')}
                title={t('speedTitle')}
                style={{ textAlign: 'center' }}
              />
              <div className="text-center -mt-1">
                <span className="text-xs font-medium text-gray-400">{t('wordsPerMinute')}</span>
              </div>
            </div>
            
            <button
              onClick={increaseSpeed}
              className="h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              aria-label={t('increaseSpeed')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* İlerleme bilgisi */}
      <div className="text-center text-gray-400 text-sm">
        {words.length > 0 ? (
          <>
            {currentWordIndex + 1} / {words.length} {t('progressText')}
          </>
        ) : (
          t('loadAndStart')
        )}
      </div>
    </div>
  );
} 