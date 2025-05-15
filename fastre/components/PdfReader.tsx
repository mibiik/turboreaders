'use client';

import { useState } from 'react';

interface PdfReaderProps {
  onTextExtracted: (text: string) => void;
  onError: (message: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

// CDN'den yüklenen pdf.js kullanarak PDF dosyalarından metin çıkarma
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    // PDF.js'i dinamik olarak yükle
    const pdfjsLib = await loadPdfJs();
    
    // ArrayBuffer olarak dosyayı oku
    const arrayBuffer = await file.arrayBuffer();
    
    // PDF dosyasını yükle
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    // Her sayfayı oku
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF okuma hatası:', error);
    throw new Error('PDF dosyası okunamadı. Lütfen metni manuel olarak girin.');
  }
}

// PDF.js'i CDN'den yükleyen yardımcı fonksiyon
async function loadPdfJs() {
  // Global düzeyde PDF.js zaten yüklenmişse onu kullan
  if ((window as any).pdfjsLib) {
    return (window as any).pdfjsLib;
  }

  // PDF.js script yükleme
  return new Promise<any>((resolve, reject) => {
    // Script elementi oluştur
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.8.162/build/pdf.min.js';
    script.async = true;
    
    script.onload = () => {
      // Worker dosyasını yapılandır
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.8.162/build/pdf.worker.min.js';
      resolve(pdfjsLib);
    };
    
    script.onerror = () => {
      reject(new Error('PDF.js yüklenemedi'));
    };
    
    // Scripti belgeye ekle
    document.head.appendChild(script);
  });
} 