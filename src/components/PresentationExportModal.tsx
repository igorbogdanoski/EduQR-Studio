import React, { useState, useEffect } from 'react';
import { EducationalQRCode, Language } from '../types';
import { translations } from '../i18n/translations';
import {
  downloadSinglePng,
  downloadSingleSvg,
  copyPngToClipboard,
  copySvgToClipboard,
  exportQRCodesToSvgZip
} from '../services/imageExportService';
import { exportQRCodesToZip, renderQRCodeToBlob } from '../services/zipExportService';
import {
  X,
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  Sparkles,
  FileCode,
  Archive,
  Layers,
  Monitor,
  Printer,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink
} from 'lucide-react';

interface PresentationExportModalProps {
  isOpen: boolean;
  selectedCodes: EducationalQRCode[];
  language: Language;
  onClose: () => void;
}

export const PresentationExportModal: React.FC<PresentationExportModalProps> = ({
  isOpen,
  selectedCodes,
  language,
  onClose
}) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'png' | 'svg'>('png');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Keep index in bounds
  useEffect(() => {
    if (currentIndex >= selectedCodes.length) {
      setCurrentIndex(Math.max(0, selectedCodes.length - 1));
    }
  }, [selectedCodes.length, currentIndex]);

  const activeItem = selectedCodes[currentIndex] || selectedCodes[0];

  // Generate preview image
  useEffect(() => {
    let active = true;
    if (!activeItem) return;

    renderQRCodeToBlob(activeItem)
      .then((blob) => {
        if (active) {
          const url = URL.createObjectURL(blob);
          setPreviewBlobUrl(url);
        }
      })
      .catch((err) => console.error('Failed to preview QR image', err));

    return () => {
      active = false;
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
    };
  }, [activeItem]);

  if (!isOpen || selectedCodes.length === 0) return null;

  const handleCopyCurrent = async () => {
    if (!activeItem) return;
    if (activeTab === 'png') {
      const ok = await copyPngToClipboard(activeItem);
      if (ok) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500);
      } else {
        alert(
          language === 'mk'
            ? 'Прелистувачот не дозволи директно копирање во таблата со исечоци. Ве молиме користете го копчето "Преземи PNG".'
            : 'Clipboard access denied. Please use the Download button.'
        );
      }
    } else {
      const ok = await copySvgToClipboard(activeItem);
      if (ok) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500);
      }
    }
  };

  const handleDownloadCurrent = async () => {
    if (!activeItem) return;
    if (activeTab === 'png') {
      await downloadSinglePng(activeItem);
    } else {
      await downloadSingleSvg(activeItem);
    }
  };

  const handleExportAllZip = async (format: 'png' | 'svg') => {
    setIsExportingZip(true);
    try {
      if (format === 'png') {
        await exportQRCodesToZip(
          selectedCodes,
          `EduQR_${selectedCodes.length}_Codes_PNG.zip`
        );
      } else {
        await exportQRCodesToSvgZip(
          selectedCodes,
          `EduQR_${selectedCodes.length}_Codes_SVG.zip`
        );
      }
    } catch (err) {
      console.error('Batch export failed', err);
      alert(language === 'mk' ? 'Грешка при пакување на архивата.' : 'Export failed.');
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-auto animate-scale-in">
        
        {/* Заглавие */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-100">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {language === 'mk'
                    ? 'Извоз за PowerPoint & Google Slides'
                    : language === 'sq'
                    ? 'Eksporto për PowerPoint & Google Slides'
                    : 'Export for PowerPoint & Google Slides'}
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                  PNG & SVG
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'mk'
                  ? 'Копирајте или преземете во висока резолуција за лесно вметнување во вашите училишни слајдови и презентации.'
                  : 'Copy or download high-res images to easily paste into your classroom slides.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Избор меѓу PNG (Растерски HD) и SVG (Векторски) */}
        <div className="flex items-center justify-between gap-3 bg-slate-100 p-1.5 rounded-2xl">
          <div className="grid grid-cols-2 gap-1.5 w-full">
            <button
              type="button"
              onClick={() => setActiveTab('png')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                activeTab === 'png'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              <span>PNG Слика (HD 1024x1024)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('svg')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                activeTab === 'svg'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-4 h-4 text-purple-600" />
              <span>SVG Векторска Графика</span>
            </button>
          </div>
        </div>

        {/* Преглед на тековниот QR код */}
        {activeItem && (
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-40 h-40 shrink-0 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center relative">
              {previewBlobUrl ? (
                <img
                  src={previewBlobUrl}
                  alt={activeItem.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              )}
            </div>

            <div className="space-y-2 grow text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md">
                  {activeItem.subject || 'Математика'}
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {activeItem.targetGrade || 'Сите одделенија'}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  #{activeItem.shortCode}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base truncate">
                {activeItem.title}
              </h3>

              <p className="text-xs text-slate-500 line-clamp-2">
                {activeItem.description ||
                  (language === 'mk'
                    ? 'Овој код е оптимизиран за директно скенирање од екран или проектор во училницата.'
                    : 'Optimized for direct scanning from projector or digital screens.')}
              </p>

              {/* Навигација ако се избрани повеќе кодови */}
              {selectedCodes.length > 1 && (
                <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-600">
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold">
                    {currentIndex + 1} од {selectedCodes.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => Math.min(selectedCodes.length - 1, prev + 1))}
                    disabled={currentIndex === selectedCodes.length - 1}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Главно копче за копирање (PowerPoint / Slides) + Преземање */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleCopyCurrent}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
              copySuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {copySuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>
                  {language === 'mk'
                    ? 'Копирано! Залепете со Ctrl+V'
                    : 'Copied! Paste with Ctrl+V'}
                </span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>
                  {language === 'mk'
                    ? activeTab === 'png'
                      ? 'Копирај за PowerPoint (Ctrl+V)'
                      : 'Копирај SVG код во таблата'
                    : activeTab === 'png'
                    ? 'Copy for PowerPoint (Ctrl+V)'
                    : 'Copy SVG Markup'}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadCurrent}
            className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>
              {language === 'mk'
                ? `Преземи како .${activeTab.toUpperCase()}`
                : `Download as .${activeTab.toUpperCase()}`}
            </span>
          </button>
        </div>

        {/* Групни опции ако има повеќе од 1 избран код */}
        {selectedCodes.length > 1 && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-600 block">
              {language === 'mk'
                ? `Групен извоз за сите ${selectedCodes.length} избрани кодови:`
                : `Batch export all ${selectedCodes.length} selected codes:`}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleExportAllZip('png')}
                disabled={isExportingZip}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isExportingZip ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Archive className="w-3.5 h-3.5 text-indigo-400" />
                )}
                <span>{language === 'mk' ? 'Преземи сите во PNG ZIP' : 'Download all in PNG ZIP'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleExportAllZip('svg')}
                disabled={isExportingZip}
                className="py-2.5 px-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isExportingZip ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Archive className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span>{language === 'mk' ? 'Преземи сите во SVG ZIP' : 'Download all in SVG ZIP'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Педагошки совет за наставниците */}
        <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-950">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {language === 'mk' ? '💡 Совет за презентации во училница:' : '💡 Classroom Presentation Tip:'}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800">
            {language === 'mk'
              ? '• Користете PNG за брзо копирање и лепење со Ctrl+V на слајдовите. • Користете SVG за максимална векторска острина на големи училишни проектори и интерактивни паметни табли (Smart Board).'
              : '• Use PNG for quick copy & paste with Ctrl+V into slides. • Use SVG for lossless vector sharpness on large smart boards and classroom projectors.'}
          </p>
        </div>

        {/* Долно затворање */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};
