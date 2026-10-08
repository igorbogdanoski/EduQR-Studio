import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import {
  Plus,
  Printer,
  FileCode,
  Globe,
  TrendingUp,
  Mic,
  Type,
  HelpCircle,
  Upload,
  MoreVertical,
  ChevronDown,
  FileQuestion
} from 'lucide-react';

export type FontSizeOption = 'normal' | 'large' | 'huge';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  fontSize: FontSizeOption;
  onFontSizeChange: (size: FontSizeOption) => void;
  onOpenNewModal: () => void;
  onOpenBatchPdfModal: () => void;
  onOpenPrintModal: () => void;
  onOpenArchitectureModal: () => void;
  onOpenAnalyticsModal: () => void;
  onOpenVoiceAssistant: () => void;
  onOpenTestingGuide?: () => void;
  onOpenMathQuiz?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  fontSize,
  onFontSizeChange,
  onOpenNewModal,
  onOpenBatchPdfModal,
  onOpenPrintModal,
  onOpenArchitectureModal,
  onOpenAnalyticsModal,
  onOpenVoiceAssistant,
  onOpenTestingGuide,
  onOpenMathQuiz
}) => {
  const t = translations[language];
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cycleFontSize = () => {
    if (fontSize === 'normal') onFontSizeChange('large');
    else if (fontSize === 'large') onFontSizeChange('huge');
    else onFontSizeChange('normal');
  };

  const fontSizeLabels: Record<FontSizeOption, string> = {
    normal: t.fontSizeNormal || '16px',
    large: t.fontSizeLarge || '18px',
    huge: t.fontSizeHuge || '20px'
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Лого и чист, елегантен наслов без пренатрупаност */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 ring-2 ring-indigo-50 shrink-0">
            <span className="font-serif italic font-black text-xl">∑</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                {t.appTitle}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100 hidden sm:inline-block">
                {language === 'mk' ? 'Дигитална настава' : 'Digital Teaching'}
              </span>
            </div>
          </div>
        </div>

        {/* Десни контроли - Чисти, подредени и прегледни */}
        <div className="flex items-center gap-2">
          
          {/* Главно копче за нов QR код */}
          <button
            type="button"
            onClick={onOpenNewModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs hover:shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t.newQr}</span>
            <span className="sm:hidden">Нов</span>
          </button>

          {/* Копче за групен увоз на PDF */}
          <button
            type="button"
            onClick={onOpenBatchPdfModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition cursor-pointer shadow-2xs"
            title="Групен увоз на PDF документи со авто-QR"
          >
            <Upload className="w-4 h-4 text-rose-600" />
            <span className="hidden md:inline">{t.batchPdfImportBtn || 'Увези PDF'}</span>
          </button>

          {/* Копче за печатење А4 наставен лист */}
          <button
            type="button"
            onClick={onOpenPrintModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-2xs cursor-pointer"
            title={t.printSheet}
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span className="hidden lg:inline">{t.printSheet}</span>
          </button>

          {/* Избор на јазик (MK, SQ, EN) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => onLanguageChange('mk')}
              className={`px-2 py-1 rounded-lg transition font-extrabold ${
                language === 'mk'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Македонски"
            >
              МК
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('sq')}
              className={`px-2 py-1 rounded-lg transition font-extrabold ${
                language === 'sq'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Shqip"
            >
              SQ
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded-lg transition font-extrabold ${
                language === 'en'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Паѓачко мени за дополнителни алатки (Спречува натрупување) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-2xs cursor-pointer"
              title="Дополнителни алатки за наставникот"
            >
              <span className="hidden md:inline">Алатки</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isToolsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 space-y-1 animate-scale-in text-xs font-medium">
                {/* Гласовен асистент */}
                <button
                  type="button"
                  onClick={() => {
                    setIsToolsDropdownOpen(false);
                    onOpenVoiceAssistant();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition text-left cursor-pointer font-bold"
                >
                  <Mic className="w-4 h-4 text-indigo-600" />
                  <span>{language === 'mk' ? 'Гласовен AI (Говор)' : 'Voice AI Assistant'}</span>
                </button>

                {/* Математички квиз & Клуч со решенија */}
                {onOpenMathQuiz && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsToolsDropdownOpen(false);
                      onOpenMathQuiz();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-emerald-900 bg-emerald-50/70 hover:bg-emerald-100 transition text-left cursor-pointer font-bold"
                  >
                    <FileQuestion className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'mk' ? 'Математички Квиз & Клуч' : 'Math Quiz & Answer Key'}</span>
                  </button>
                )}

                {/* Аналитика */}
                <button
                  type="button"
                  onClick={() => {
                    setIsToolsDropdownOpen(false);
                    onOpenAnalyticsModal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition text-left cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'mk' ? 'Аналитика на скенирања' : 'Scan Analytics'}</span>
                </button>

                {/* Водич за колеги */}
                {onOpenTestingGuide && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsToolsDropdownOpen(false);
                      onOpenTestingGuide();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-900 bg-amber-50/70 hover:bg-amber-100 transition text-left cursor-pointer font-bold"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>{language === 'mk' ? 'Водич за тестирање (Колеги)' : 'Colleague Testing Guide'}</span>
                  </button>
                )}

                {/* Печатење А4 за мобилни уреди */}
                <button
                  type="button"
                  onClick={() => {
                    setIsToolsDropdownOpen(false);
                    onOpenPrintModal();
                  }}
                  className="sm:hidden w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition text-left cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-emerald-600" />
                  <span>{t.printSheet}</span>
                </button>

                {/* Архитектура */}
                <button
                  type="button"
                  onClick={() => {
                    setIsToolsDropdownOpen(false);
                    onOpenArchitectureModal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition text-left cursor-pointer"
                >
                  <FileCode className="w-4 h-4 text-indigo-600" />
                  <span>{language === 'mk' ? 'Системска архитектура' : 'Architecture Docs'}</span>
                </button>

                {/* Големина на фонт */}
                <div className="pt-1 mt-1 border-t border-slate-100 flex items-center justify-between px-3 py-1.5 text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Фонт:</span>
                  </span>
                  <button
                    type="button"
                    onClick={cycleFontSize}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-indigo-100 font-bold text-slate-800 hover:text-indigo-700 transition cursor-pointer"
                  >
                    {fontSizeLabels[fontSize].split(' ')[0]}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
