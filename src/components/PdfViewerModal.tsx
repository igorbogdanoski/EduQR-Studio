import React, { useState, useEffect, useRef } from 'react';
import { EducationalQRCode, Language } from '../types';
import { translations } from '../i18n/translations';
import { LatexRenderer } from './LatexRenderer';
import { jsPDF } from 'jspdf';
import {
  FileText,
  X,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  Layers,
  CheckCircle2,
  Calendar,
  User,
  School,
  ExternalLink
} from 'lucide-react';

interface PdfViewerModalProps {
  isOpen: boolean;
  item: EducationalQRCode | null;
  language: Language;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  item,
  language,
  onClose
}) => {
  const t = translations[language];

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 2;
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Generate or prepare downloadable/printable PDF via jsPDF if no real dataUrl
  useEffect(() => {
    if (!item || !isOpen) return;

    if (item.fileDataUrl && item.fileDataUrl.startsWith('data:application/pdf')) {
      setPdfBlobUrl(item.fileDataUrl);
      return;
    }

    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Page 1: Наставен Лист
      doc.setFillColor(30, 27, 75);
      doc.rect(0, 0, 210, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text('EduQR Studio - Наставен Работен Лист', 15, 12);
      doc.setFontSize(10);
      doc.text(`Предмет: ${item.subject || 'Математика'} | Клас: ${item.targetGrade || '9-то одделение'}`, 15, 18);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.text(item.title || 'Работен лист со задачи', 15, 36);

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      const descLines = doc.splitTextToSize(item.description || 'Решете ги следните задачи со примена на соодветните формули.', 180);
      doc.text(descLines, 15, 44);

      // Рамка за податоци на ученикот
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, 54, 180, 18, 3, 3, 'FD');

      doc.setTextColor(51, 65, 85);
      doc.setFontSize(9);
      doc.text('Име и презиме: _________________________________', 20, 62);
      doc.text('Датум: _______________', 135, 62);
      doc.text('Паралелка: ____________________', 20, 68);
      doc.text('Оценка / Бодови: _________', 135, 68);

      // Задачи
      doc.setFontSize(11);
      doc.setTextColor(30, 27, 75);
      doc.text('Дел 1: Теориски поставки и формули', 15, 82);

      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      const mathLines = doc.splitTextToSize(
        item.latexContent ? item.latexContent.replace(/\$/g, '') : 'Формула: P = 2*pi*r*(r + H), V = pi*r^2*H',
        180
      );
      doc.text(mathLines, 15, 90);

      // Задачи за решавање
      doc.setFontSize(11);
      doc.setTextColor(30, 27, 75);
      doc.text('Дел 2: Практични задачи за самостојна работа', 15, 115);

      const tasks = [
        'Задача 1: Пресметај ја плоштината на прав цилиндер со радиус r = 4 cm и висина H = 10 cm.',
        'Задача 2: Волуменот на цилиндер е V = 500 pi cm3, а неговата висина е H = 20 cm. Најди го радиусот.',
        'Задача 3: Пресметај ја плоштината на обвивката ако оскиниот пресек е квадрат со страна 8 cm.',
        'Задача 4: Скалирана задача со насоки достапни преку скенирање на QR кодот на часот.'
      ];

      let yPos = 125;
      tasks.forEach((tStr, idx) => {
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(`${idx + 1}.`, 15, yPos);
        const taskText = doc.splitTextToSize(tStr, 170);
        doc.text(taskText, 22, yPos);

        // Простор за пишување
        doc.setDrawColor(226, 232, 240);
        doc.line(22, yPos + 8, 195, yPos + 8);
        doc.line(22, yPos + 16, 195, yPos + 16);
        yPos += 26;
      });

      // Футер
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('ЕдуQR Студио • Дигитализиран наставен ресурс за наставници • Страница 1 од 2', 15, 285);

      // Страница 2
      doc.addPage();
      doc.setFillColor(30, 27, 75);
      doc.rect(0, 0, 210, 16, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text('Дел 3: Насоки за оценување и самопроверка (Клуч на решение)', 15, 11);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.text('Рубрика за формативно оценување:', 15, 28);

      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, 34, 180, 45, 2, 2, 'FD');

      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text('• Примена на соодветна формула за плоштина/волумен:  (2 бода)', 20, 42);
      doc.text('• Точна алгебарска пресметка и средување на изразите:   (2 бода)', 20, 50);
      doc.text('• Запишување на мерни единици (cm, cm2, cm3):             (1 бод)', 20, 58);
      doc.text('• Логичко толкување на добиениот геометриски резултат:   (1 бод)', 20, 66);

      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('ЕдуQR Студио • Дигитализиран наставен ресурс за наставници • Страница 2 од 2', 15, 285);

      const generatedUrl = doc.output('datauristring');
      setPdfBlobUrl(generatedUrl);
    } catch (e) {
      console.warn('PDF generation fallback notice:', e);
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleDownload = () => {
    if (pdfBlobUrl) {
      const link = document.createElement('a');
      link.href = pdfBlobUrl;
      link.download = item.fileName || `${item.title.replace(/\s+/g, '_')}_Dokument.pdf`;
      link.click();
    }
  };

  const handlePrint = () => {
    if (pdfBlobUrl) {
      const printWindow = window.open(pdfBlobUrl);
      if (printWindow) {
        printWindow.focus();
        printWindow.print();
      } else {
        window.print();
      }
    } else {
      window.print();
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div 
        ref={containerRef}
        className={`bg-slate-900 w-full rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col transition-all duration-300 ${
          isFullscreen ? 'fixed inset-0 rounded-none z-50' : 'max-w-5xl h-[92vh]'
        }`}
      >
        {/* Горен контролен панел (PDF Toolbar) */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-white shrink-0">
          {/* Лево: Информации за документот */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">
                  {item.fileName || item.title}
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                  PDF Документ
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate flex items-center gap-2 mt-0.5">
                <span>{item.subject}</span>
                <span>•</span>
                <span>{item.targetGrade}</span>
                <span>•</span>
                <span className="text-slate-500">{item.fileSize || '1.4 MB'}</span>
              </p>
            </div>
          </div>

          {/* Центар: Контроли за навигација и зумирање */}
          <div className="flex items-center gap-1 sm:gap-2 bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs">
            {/* Страници */}
            <button
              type="button"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-700 transition cursor-pointer"
              title="Претходна страница"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-semibold text-slate-200">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-700 transition cursor-pointer"
              title="Следна страница"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-slate-700 mx-1" />

            {/* Зумирање */}
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition cursor-pointer"
              title="Намали (Zoom Out)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 py-0.5 text-slate-300 hover:text-white font-mono rounded hover:bg-slate-700 transition cursor-pointer"
              title="Ресетирај зум (100%)"
            >
              {zoomLevel}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition cursor-pointer"
              title="Зголеми (Zoom In)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-slate-700 mx-1 hidden sm:block" />

            {/* Ротирање */}
            <button
              type="button"
              onClick={handleRotate}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition cursor-pointer hidden sm:block"
              title="Ротирај за 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Десно: Печатење, преземање, целосен екран и затворање */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition cursor-pointer"
              title="Испечати наставен лист"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Печати</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              title="Преземи како PDF датотека"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Преземи</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title={isFullscreen ? 'Излези од целосен екран' : 'Целосен екран'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-rose-500/20 rounded-xl transition cursor-pointer ml-1"
              title="Затвори (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Главен простор за преглед на листот */}
        <div className="grow overflow-auto p-4 sm:p-8 flex justify-center items-start bg-slate-950/70">
          <div
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out'
            }}
            className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-300 p-8 sm:p-12 flex flex-col justify-between my-2 shrink-0 select-text"
          >
            {currentPage === 1 ? (
              /* СТРАНИЦА 1: Наставен Работен Лист */
              <div className="space-y-6">
                {/* Горно заглавие на работен лист */}
                <div className="border-b-2 border-indigo-900 pb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-950 font-black text-xl tracking-tight">
                      <School className="w-6 h-6 text-indigo-700" />
                      <span>{item.subject} • {item.targetGrade}</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mt-1">
                      {item.title}
                    </h1>
                    <p className="text-xs text-slate-600 mt-1 max-w-lg">
                      {item.description}
                    </p>
                  </div>

                  {/* Амблем / QR печат */}
                  <div className="text-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 block mb-1">
                      EduQR Дигитално
                    </span>
                    <div className="w-16 h-16 bg-indigo-900 text-white rounded-lg flex items-center justify-center font-serif text-2xl font-bold mx-auto">
                      ∑
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono block mt-1">
                      #{item.shortCode}
                    </span>
                  </div>
                </div>

                {/* Податоци за ученик и наставник */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block">Ученик: ___________________________________</span>
                    <span className="text-slate-500 mt-1 block">Паралелка / Група: __________________________</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-700 block">Датум на изработка: {item.createdAt}</span>
                    <span className="text-emerald-700 font-bold mt-1 block">Максимални бодови: 100</span>
                  </div>
                </div>

                {/* Дел 1: Теориска основа и формули со LaTeX */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Дел 1: Основни формули и дефиниции</span>
                  </div>
                  <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                    <LatexRenderer content={item.latexContent} />
                  </div>
                </div>

                {/* Дел 2: Задачи за самостојно решавање */}
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Дел 2: Задачи за решавање во училницата</span>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-sm space-y-2">
                      <div className="font-bold text-slate-800">
                        1. Примени ги формулите погоре за да ја пресметаш вредноста кога основните димензии се дадени во метри.
                      </div>
                      <div className="h-16 border-b border-dashed border-slate-300 w-full" />
                    </div>

                    <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-sm space-y-2">
                      <div className="font-bold text-slate-800">
                        2. Анализирај го односот меѓу плоштината и волуменот при удвојување на радиусот или висината.
                      </div>
                      <div className="h-16 border-b border-dashed border-slate-300 w-full" />
                    </div>

                    <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-sm space-y-2">
                      <div className="font-bold text-slate-800">
                        3. Скалирана вежба: Доколку се сопнете, скенирајте го интерактивниот QR код на наставникот за чекори на помош по Виготски.
                      </div>
                      <div className="h-16 border-b border-dashed border-slate-300 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* СТРАНИЦА 2: Рубрика за оценување и клуч на решенија */
              <div className="space-y-6">
                <div className="border-b-2 border-indigo-900 pb-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-800">
                    Страница 2 • Додаток за наставникот и ученикот
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    Клуч на решенија и рубрика за формативно оценување
                  </h2>
                </div>

                {item.solutionLatex ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-emerald-900 uppercase">
                      Официјално чекор-по-чекор решение:
                    </h4>
                    <div className="text-sm text-slate-800">
                      <LatexRenderer content={item.solutionLatex} />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-sm text-slate-600">
                    <p className="font-semibold text-slate-800">Насоки за самопроверка:</p>
                    <p>Проверете ги единиците мерки и алгебарскиот редослед на операции пред да го предадете листот.</p>
                  </div>
                )}

                {/* Скалирани чекори по Виготски */}
                {item.scaffoldingSteps && item.scaffoldingSteps.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-600" />
                      <span>Нивоа на помош (ZPD Scaffolding Hints)</span>
                    </h3>
                    <div className="space-y-2">
                      {item.scaffoldingSteps.map((step, idx) => (
                        <div key={idx} className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs">
                          <span className="font-bold text-purple-950">Чекор #{step.stepNumber}: {step.title}</span>
                          <div className="mt-1 text-slate-700">
                            <LatexRenderer content={step.contentWithLatex} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Рубрика за бодување */}
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <div className="bg-slate-100 font-bold p-3 text-slate-800 border-b border-slate-200">
                    Критериуми за оценување на наставниот лист
                  </div>
                  <div className="divide-y divide-slate-100">
                    <div className="p-3 flex justify-between">
                      <span>1. Точно поставување на геометриските равенки</span>
                      <span className="font-bold text-indigo-700">30 бода</span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span>2. Алгебарска прецизност при пресметување</span>
                      <span className="font-bold text-indigo-700">30 бода</span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span>3. Правилна употреба на мерни единици</span>
                      <span className="font-bold text-indigo-700">20 бода</span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span>4. Логичко образложение и заклучок</span>
                      <span className="font-bold text-indigo-700">20 бода</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Долно подножје на листот */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 mt-auto">
              <span>ЕдуQR Студио • Дигитализирано образовно искуство</span>
              <span>Страница {currentPage} од {totalPages}</span>
            </div>
          </div>
        </div>

        {/* Долна лента */}
        <div className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Документот е оптимизиран за A4 печатење и дигитално прикажување во училницата</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
