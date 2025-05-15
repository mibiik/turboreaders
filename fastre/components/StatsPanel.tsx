'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface StatsPanelProps {
  currentWordIndex: number;
  totalWords: number;
  speed: number;
  startTime: number | null;
  isPlaying: boolean;
  sessionWords: number;
}

export function StatsPanel({ 
  currentWordIndex, 
  totalWords, 
  speed, 
  startTime, 
  isPlaying,
  sessionWords 
}: StatsPanelProps) {
  const { t } = useLanguage();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Geçen süreyi takip et
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isPlaying && startTime) {
      intervalId = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, startTime]);
  
  // İstatistik hesaplamaları
  const progress = totalWords > 0 ? Math.round((currentWordIndex / totalWords) * 100) : 0;
  const remainingWords = totalWords - currentWordIndex;
  const estimatedTimeRemaining = speed > 0 ? Math.ceil(remainingWords / speed * 60) : 0;
  
  // Formatlanmış zaman gösterimi
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700 text-white overflow-hidden transition-all duration-300 shadow-lg">
      <div 
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-700/50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="font-medium">{t('readingStats')}</h3>
        <button className="text-gray-400 hover:text-white">
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="px-4 py-3 border-t border-gray-700 divide-y divide-gray-700/50">
          <div className="grid grid-cols-2 gap-3 py-2">
            <div>
              <p className="text-xs text-gray-400">{t('progress')}</p>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium">{progress}%</span>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-400">{t('currentSpeed')}</p>
              <p className="text-lg font-semibold">{speed} <span className="text-xs font-normal text-gray-400">{t('wpm')}</span></p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 text-sm">
            <div>
              <p className="text-xs text-gray-400">{t('wordsRead')}</p>
              <p className="font-medium">{currentWordIndex} / {totalWords}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-400">{t('wordsRemaining')}</p>
              <p className="font-medium">{remainingWords}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-400">{t('elapsedTime')}</p>
              <p className="font-medium">{formatTime(elapsedTime)}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-400">{t('estimatedTimeLeft')}</p>
              <p className="font-medium">{formatTime(estimatedTimeRemaining)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2 text-sm">
            <div>
              <p className="text-xs text-gray-400">{t('sessionStats')}</p>
              <p className="font-medium">{sessionWords} <span className="text-xs text-gray-400">{t('wordsTotal')}</span></p>
            </div>
            
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-400">{t('tip')}</p>
              <p className="text-xs italic text-gray-300">
                {speed < 300 ? t('tipSlowReader') : 
                 speed < 600 ? t('tipAverageReader') : 
                 t('tipFastReader')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 