import React, { useState } from 'react';
import { EducationalQRCode, Language } from '../types';
import { translations } from '../i18n/translations';
import { QRCodePreview } from './QRCodePreview';
import { LatexRenderer } from './LatexRenderer';
import { generateDirectPDF, PrintLayoutOption, PrintColorMode } from '../services/pdfWorksheetService';
import { 
  Printer, 
  X, 
  FileText, 
  Check, 
  Download, 
  Loader2, 
  LayoutGrid, 
  Scissors, 
  Sparkles,
  Droplet,
  Layers
} from 'lucide-react';

interface PrintWorksheetModalProps {
  items: EducationalQRCode[];
  language: Language;
  onClose: () => void;
}

export const PrintWorksheetModal: React.FC<PrintWorksheetModalProps> = ({
  items,
  language,
  onClose,
}) => {
  const t = translations[language];
  const [schoolName, setSchoolName] = useState('ООУ „Гоце Делчев“');
  const [teacherName, setTeacherName] = useState('Наставник');
  const [subjectTitle, setSubjectTitle] = useState('Работен лист за диференцирано учење со QR кодови');
  const [worksheetInstructions, setWorksheetInstructions] = useState<string>(
    'Скенирајте го QR кодот со камера на телефон или таблет за интерактивен приказ на задачата. Внесете ја постапката и крајното решение во предвидениот простор.'
  );
  const [selectedIds, setSelectedIds] = useState<string[]>(items.map((i) => i.id));
  const [layout, setLayout] = useState<PrintLayoutOption>('2x2');
  const [colorMode, setColorMode] = useState<PrintColorMode>('color');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number } | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedItems = items.filter((item) => selectedIds.includes(item.id));

  const handleDownloadDirectPDF = async () => {
    if (selectedItems.length === 0) return;
    setIsGeneratingPdf(true);
    setPdfProgress({ current: 0, total: selectedItems.length });

    try {
      await generateDirectPDF(selectedItems, {
        schoolName,
        teacherName,
        subjectTitle,
        instructions: worksheetInstructions,
        layout,
        colorMode,
        onProgress: (current, total) => {
          setPdfProgress({ current, total });
        },
      });
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert(language === 'mk' ? 'Грешка при генерирање на PDF датотеката.' : 'Failed to generate PDF.');
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[95vh]">
        {/* Контролен панел на врвот (се крие при печатење) */}
        <div className="print:hidden bg-slate-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-inner">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">{t.printHeaderTitle}</h3>
              <p className="text-xs text-slate-400">{t.printHeaderSubtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Директно преземање на PDF преку jsPDF */}
            <button
              type="button"
              onClick={handleDownloadDirectPDF}
              disabled={isGeneratingPdf || selectedItems.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>
                    {t.generatingPdf} ({pdfProgress?.current}/{pdfProgress?.total})
                  </span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{t.downloadPdf}</span>
                </>
              )}
            </button>

            {/* Класично печатење преку прелистувач */}
            <button
              type="button"
              onClick={handlePrint}
              disabled={selectedItems.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t.printButton}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Избор на распоред (1x1, 2x2, 3x3, 4x4, работен лист) и Режим на мастило (Боја vs. Црно-бело) */}
        <div className="print:hidden bg-slate-100/90 p-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Лево: Избор на распоред */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold mr-1">
              <LayoutGrid className="w-4 h-4 text-indigo-600" />
              <span>{t.layoutOptionTitle}:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLayout('1x1')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1 ${
                  layout === '1x1'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>📄</span>
                <span>{t.layout1x1}</span>
              </button>

              <button
                type="button"
                onClick={() => setLayout('2x2')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1 ${
                  layout === '2x2'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🪟</span>
                <span>{t.layout2x2}</span>
              </button>

              <button
                type="button"
                onClick={() => setLayout('3x3')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1 ${
                  layout === '3x3'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🏷️</span>
                <span>{t.layout3x3}</span>
              </button>

              <button
                type="button"
                onClick={() => setLayout('4x4')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1 ${
                  layout === '4x4'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Scissors className="w-3.5 h-3.5 text-rose-500" />
                <span>{t.layout4x4}</span>
              </button>

              <button
                type="button"
                onClick={() => setLayout('worksheet')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1 ${
                  layout === 'worksheet'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>📝</span>
                <span>{t.layoutWorksheet}</span>
              </button>
            </div>
          </div>

          {/* Десно: Режим на печатење - Боја vs. Црно-бело (Заштеда на мастило) */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              {language === 'mk' ? 'Мастило:' : 'Ink Mode:'}
            </span>
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setColorMode('color')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  colorMode === 'color'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🎨</span>
                <span>{language === 'mk' ? 'Во боја' : 'In Color'}</span>
              </button>

              <button
                type="button"
                onClick={() => setColorMode('grayscale')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  colorMode === 'grayscale'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={language === 'mk' ? 'Еко режим: Чист црно-бел отпечаток за заштеда на мастило и брзо фотокопирање' : 'Eco Ink Saver: Pure black and white print for photocopying and ink saving'}
              >
                <span>🖨️</span>
                <span>{language === 'mk' ? 'Црно-бело (Grayscale)' : 'Grayscale'}</span>
                <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.2 rounded font-black uppercase">
                  {language === 'mk' ? 'Еко' : 'Eco'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Поставки за училиште и наставник (се кријат при печатење) */}
        <div className="print:hidden bg-slate-50 border-b border-slate-200 p-4 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.printSchoolName}</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.printTeacherName}</label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Наслов на наставен лист / сет:</label>
              <input
                type="text"
                value={subjectTitle}
                onChange={(e) => setSubjectTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Брзи предлози за наслов по предмети (Основно & Средно) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-semibold text-slate-500 mr-1">Предложени предмети:</span>
            {[
              { label: '📐 Математика', val: 'Математика - Работен лист за диференцирано учење' },
              { label: '⚡ Физика', val: 'Физика (STEM) - Истражувачки лист со интерактивни задачи' },
              { label: '🧪 Хемија', val: 'Хемија - Лабораториски наставен лист со QR пресметки' },
              { label: '🌿 Биологија', val: 'Биологија - Клеточни структури и генетика' },
              { label: '💻 Информатика', val: 'Информатика - Алгоритми, бинарни кодови и псевдокод' },
              { label: '🌍 Географија', val: 'Географија - Картографска работилница со размери' },
              { label: '📖 Мак. јазик', val: 'Македонски јазик & Литература - Анализа на стилски фигури' }
            ].map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setSubjectTitle(s.val)}
                className={`text-[11px] px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                  subjectTitle === s.val
                    ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Инструкции за учениците (за PDF и печатење) */}
          <div className="pt-2 border-t border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.worksheetInstructionsLabel} (Се прикажува на заглавието на PDF):</span>
              </label>
              <span className="text-[11px] text-slate-400">Ќе се вклучи директно во A4 документот</span>
            </div>

            <textarea
              rows={2}
              value={worksheetInstructions}
              onChange={(e) => setWorksheetInstructions(e.target.value)}
              placeholder={t.worksheetInstructionsPlaceholder}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-xs resize-none"
            />

            {/* Брзи кликачки шаблони за упатства */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">{t.suggestedInstructions}</span>
              <button
                type="button"
                onClick={() => setWorksheetInstructions(t.instructionOption1)}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-medium transition cursor-pointer"
              >
                🎯 Самостојно решавање
              </button>
              <button
                type="button"
                onClick={() => setWorksheetInstructions(t.instructionOption2)}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium transition cursor-pointer"
              >
                👥 Групна работа / Станици
              </button>
              <button
                type="button"
                onClick={() => setWorksheetInstructions(t.instructionOption3)}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-medium transition cursor-pointer"
              >
                💡 Со поддршка (Scaffolding)
              </button>
              <button
                type="button"
                onClick={() => setWorksheetInstructions(t.instructionOption4)}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-medium transition cursor-pointer"
              >
                🔍 Лов на информации
              </button>
              <button
                type="button"
                onClick={() => setWorksheetInstructions('Решете ги математичките задачи со детална постапка. На крајот од часот, скенирајте го QR кодот „Клуч со решенија“ за проверка на резултатите и самооценување.')}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-medium transition cursor-pointer"
              >
                🔑 Квиз со QR Клуч
              </button>
            </div>
          </div>
        </div>

        {/* Селектор на QR кодови за печатење (се крие при печатење) */}
        <div className="print:hidden px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 font-bold rounded-lg text-slate-700 transition"
          >
            {selectedIds.length === items.length ? t.deselectAll : t.selectAll} ({selectedItems.length}/{items.length})
          </button>
          <span className="text-slate-400">|</span>
          {items.map((i) => {
            const isChecked = selectedIds.includes(i.id);
            return (
              <button
                key={i.id}
                type="button"
                onClick={() => toggleSelect(i.id)}
                className={`px-2.5 py-1 rounded-full border transition flex items-center gap-1 cursor-pointer ${
                  isChecked
                    ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isChecked && <Check className="w-3 h-3" />}
                <span className="truncate max-w-[140px]">{i.title}</span>
              </button>
            );
          })}
        </div>

        {/* САМИОТ А4 НАСТАВЕН ЛИСТ ЗА ПЕЧАТЕЊЕ И ДИРЕКТЕН PREVIEW */}
        <div className={`p-6 sm:p-10 overflow-y-auto bg-white print:p-0 print:m-0 print:overflow-visible grow ${colorMode === 'grayscale' ? 'print-grayscale grayscale contrast-125' : ''}`}>
          
          {/* Информативен банер за заштеда на мастило */}
          {colorMode === 'grayscale' && (
            <div className="print:hidden mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center justify-between gap-3 animate-fade-in shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🌱</span>
                <div>
                  <div className="font-bold">
                    {language === 'mk' ? 'Активиран е еко режим за заштеда на мастило (Grayscale)' : 'Eco Ink-Saving Mode Active (Grayscale)'}
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">
                    {language === 'mk' 
                      ? 'QR кодовите се прикажани со остар црно-бел контраст. Ова спречува трошење на боја и е оптимизирано за училишни фотокопири.'
                      : 'QR codes are rendered in sharp black-and-white. Saves toner and ink, optimized for classroom photocopiers.'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-1 bg-emerald-600 text-white rounded-lg shrink-0">
                {language === 'mk' ? 'Заштеда на мастило' : 'Ink-Saver'}
              </span>
            </div>
          )}

          {/* Официјално заглавие на работниот лист */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex justify-between items-start text-xs text-slate-700 mb-2">
              <span className="font-bold uppercase tracking-wider">{schoolName}</span>
              <span>{t.printDate} {new Date().toLocaleDateString('mk-MK')}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 text-center uppercase tracking-wide">
              {subjectTitle}
            </h1>
            <div className="flex justify-between items-center text-xs text-slate-700 mt-3 pt-2 border-t border-slate-300">
              <span>{t.printTeacherName} <strong>{teacherName}</strong></span>
              <span>Ученик: _________________________________ (Клас: _____)</span>
            </div>
          </div>

          {/* Инструкции за учениците */}
          <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 mb-6 text-xs text-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold">
                QR
              </div>
              <p className="leading-relaxed">
                {worksheetInstructions || t.printInstructions}
              </p>
            </div>
            {(layout === '2x2' || layout === '3x3' || layout === '4x4') && (
              <span className="text-[11px] text-slate-500 italic shrink-0 hidden md:inline">
                ✂️ {t.cutGuidesNotice}
              </span>
            )}
          </div>

          {/* ДИНАМИЧЕН ПРИКАЗ ВО ЗАВИСНОСТ ОД РАСПОРЕДОТ */}

          {/* РАСПОРЕД 1x1: 1 ГОЛЕМА СТАНИЦА ПО СТРАНИЦА */}
          {layout === '1x1' && (
            <div className="space-y-8">
              {selectedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="border-2 border-indigo-200 rounded-3xl p-6 flex flex-col items-center gap-5 page-break-inside-avoid bg-white shadow-2xs"
                >
                  <div className="w-full flex items-center justify-between border-b border-indigo-100 pb-3">
                    <span className="text-sm font-extrabold text-indigo-900 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-xl">
                      Станица #{index + 1}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 text-center truncate max-w-md">
                      {item.title}
                    </h2>
                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                      edu://{item.shortCode}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-6 w-full pt-2">
                    <div className="shrink-0 flex flex-col items-center">
                      <QRCodePreview item={item} language={language} showActions={false} colorMode={colorMode} />
                    </div>

                    <div className="grow space-y-3 w-full">
                      {item.latexContent && (
                        <div className="text-slate-900 text-base p-4 bg-slate-50 rounded-2xl border border-slate-200">
                          <LatexRenderer content={item.latexContent} displayMode={true} />
                        </div>
                      )}

                      {item.scaffoldingSteps && item.scaffoldingSteps.length > 0 && (
                        <div className="text-xs text-indigo-700 bg-indigo-50 p-2.5 rounded-xl border border-indigo-100 font-medium">
                          💡 <strong>ZPD Скејфолдинг:</strong> Овој QR код нуди {item.scaffoldingSteps.length} чекори на помош при скенирање.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Голем простор за одговор */}
                  <div className="w-full pt-3">
                    <span className="text-xs font-semibold text-slate-600 block mb-1.5">
                      Простор за постапка и конечно решение на ученикот:
                    </span>
                    <div className="w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* РАСПОРЕД 2x2: 4 СТАНИЦИ ПО А4 СТРАНИЦА */}
          {layout === '2x2' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {selectedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col justify-between bg-white relative page-break-inside-avoid"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      #{index + 1}
                    </span>
                    <h3 className="font-bold text-xs text-slate-900 truncate max-w-[160px]">
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500">
                      {item.shortCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 my-2">
                    <div className="shrink-0 scale-90 origin-left">
                      <QRCodePreview item={item} language={language} showActions={false} colorMode={colorMode} />
                    </div>
                    <div className="text-xs text-slate-800 grow overflow-hidden">
                      {item.latexContent ? (
                        <div className="line-clamp-4">
                          <LatexRenderer content={item.latexContent} />
                        </div>
                      ) : (
                        <p className="line-clamp-3 text-slate-500">{item.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Рамка за одговор */}
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-500 block mb-1">Решение / Одговор:</span>
                    <div className="w-full h-12 border border-dashed border-slate-300 rounded-lg bg-slate-50/50" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* РАСПОРЕД 3x3: 9 НАСТАВНИ КАРТИЧКИ */}
          {layout === '3x3' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {selectedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="border border-dashed border-slate-400 rounded-xl p-3 flex flex-col items-center justify-between text-center bg-white page-break-inside-avoid"
                >
                  <div className="w-full flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                    <span>#{index + 1}</span>
                    <span className="font-mono text-indigo-600">{item.shortCode}</span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1 mb-1">
                    {item.title}
                  </h4>

                  <div className="my-1 scale-75 origin-center">
                    <QRCodePreview item={item} language={language} showActions={false} colorMode={colorMode} />
                  </div>

                  {item.latexContent && (
                    <div className="text-[11px] text-slate-800 line-clamp-2 mt-1">
                      <LatexRenderer content={item.latexContent} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* РАСПОРЕД 4x4: 16 МИНИ НАЛЕПНИЦИ / КАРТИЧКИ ЗА СЕЧЕЊЕ */}
          {layout === '4x4' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {selectedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="border border-dashed border-slate-400 rounded-lg p-2 flex flex-col items-center justify-between text-center bg-white page-break-inside-avoid"
                >
                  <div className="w-full flex items-center justify-between text-[10px] font-bold text-slate-600">
                    <span>#{index + 1}</span>
                    <span className="font-mono text-[9px] text-indigo-600">{item.shortCode}</span>
                  </div>

                  <div className="my-1 scale-60 origin-center -my-3">
                    <QRCodePreview item={item} language={language} showActions={false} colorMode={colorMode} />
                  </div>

                  <h5 className="font-bold text-[10px] text-slate-800 line-clamp-1 mt-1">
                    {item.title}
                  </h5>
                  <span className="text-[9px] text-slate-500 uppercase">{item.subject}</span>
                </div>
              ))}
            </div>
          )}

          {/* РАСПОРЕД WORKSHEET: КЛАСИЧЕН РЕДОСЛЕД НА РАБОТЕН ЛИСТ */}
          {layout === 'worksheet' && (
            <div className="space-y-6">
              {selectedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="border-2 border-slate-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 page-break-inside-avoid bg-white"
                >
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Станица #{index + 1}
                    </div>
                    <QRCodePreview item={item} language={language} showActions={false} colorMode={colorMode} />
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      Код: {item.shortCode}
                    </div>
                  </div>

                  <div className="grow space-y-2.5 w-full">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <h3 className="font-bold text-base text-slate-900">
                        Задача {index + 1}: {item.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                          {item.subject}
                        </span>
                        {item.bloomLevel && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded">
                            {t.bloomShort[item.bloomLevel]}
                          </span>
                        )}
                      </div>
                    </div>

                    {item.latexContent && (
                      <div className="text-slate-800 text-sm py-1">
                        <LatexRenderer content={item.latexContent} />
                      </div>
                    )}

                    {item.scaffoldingSteps && item.scaffoldingSteps.length > 0 && (
                      <div className="text-[11px] text-indigo-700 bg-indigo-50/60 p-2 rounded-lg border border-indigo-100">
                        💡 <strong>Виготски поддршка:</strong> Овој QR код содржи {item.scaffoldingSteps.length} последователни чекори на помош при скенирање.
                      </div>
                    )}

                    <div className="pt-2">
                      <span className="text-[10px] text-slate-600 block mb-1">
                        Простор за постапка и решение на ученикот:
                      </span>
                      <div className="w-full h-16 border border-dashed border-slate-300 rounded-lg bg-slate-50/50" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Заглавие на крајот на страницата */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-600">
            Креирано преку ЕдуQR Студио • Платформа за наставници по математика • Поддржано со LaTeX & Педагошки Рамки
          </div>
        </div>
      </div>
    </div>
  );
};
