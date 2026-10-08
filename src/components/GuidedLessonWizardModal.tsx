import React, { useState } from 'react';
import { EducationalQRCode, EducationalFolder, Language, QRCodeType, BloomLevel, GardnerIntelligence, ScaffoldingStep } from '../types';
import { translations } from '../i18n/translations';
import { LatexRenderer } from './LatexRenderer';
import { LatexToolbar } from './LatexToolbar';
import { QRCodePreview } from './QRCodePreview';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Brain, 
  HelpCircle, 
  Palette, 
  Lock, 
  FileText, 
  Printer, 
  Eye, 
  Compass, 
  GraduationCap, 
  Lightbulb, 
  Check,
  AlertTriangle,
  Folder
} from 'lucide-react';

interface GuidedLessonWizardModalProps {
  language: Language;
  folders?: EducationalFolder[];
  onSave: (item: EducationalQRCode) => void;
  onClose: () => void;
  onOpenPrintSheet?: (item: EducationalQRCode) => void;
  onSimulateScan?: (item: EducationalQRCode) => void;
}

export const GuidedLessonWizardModal: React.FC<GuidedLessonWizardModalProps> = ({
  language,
  folders = [],
  onSave,
  onClose,
  onOpenPrintSheet,
  onSimulateScan
}) => {
  const t = translations[language];
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Состојба за новиот наставен QR код
  const [wizardData, setWizardData] = useState<EducationalQRCode>(() => {
    const slug = 'chas' + Math.floor(100 + Math.random() * 900);
    return {
      id: `wizard-${Date.now()}`,
      shortCode: slug,
      title: 'Питагорова теорема во секојдневниот живот',
      description: 'Диференцирана наставна активност за часот по геометрија со скалирана помош по Виготски.',
      type: 'vygotsky_scaffold',
      createdAt: new Date().toISOString().split('T')[0],
      subject: 'Математика (Геометрија)',
      targetGrade: '8-мо одделение',
      latexContent: 'Скалила со должина $c = 5\\text{ m}$ се потпрени на ѕид. Долниот крај на скалилата е оддалечен $a = 3\\text{ m}$ од ѕидот. На која висина $b$ скалилата го допираат ѕидот?',
      solutionLatex: 'Примена на Питагорова теорема во правоаголен триаголник:\n$$a^2 + b^2 = c^2$$\nЗамена на познатите вредности:\n$$3^2 + b^2 = 5^2 \\implies 9 + b^2 = 25$$\n$$b^2 = 25 - 9 = 16$$\n$$b = \\sqrt{16} = 4\\text{ m}$$\nОдговор: Скалилата го допираат ѕидот на висина од $4\\text{ m}$.',
      scaffoldingSteps: [
        {
          id: 'step-1',
          stepNumber: 1,
          title: 'Насока 1: Нацртај скица и идентификувај го правиот агол',
          contentWithLatex: 'Ѕидот и подот зафаќаат прав агол од $90^\\circ$. Скалилата ја претставуваат хипотенузата $c = 5\\text{ m}$.',
          revealedByDefault: false
        },
        {
          id: 'step-2',
          stepNumber: 2,
          title: 'Насока 2: Постави ја формулата за непозната катета',
          contentWithLatex: 'Формулата за непознатата катета $b$ гласи: $$b^2 = c^2 - a^2$$ Пресметај $5^2 - 3^2$.',
          revealedByDefault: false
        }
      ],
      bloomLevel: 'apply',
      bloomObjectives: 'Примена на Питагорова теорема во реални текстуални контексти.',
      gardnerIntelligence: 'logical_mathematical',
      gardnerActivityType: 'Геометриско моделирање на реален проблем',
      targetUrl: '',
      style: {
        fgColor: '#1e3a8a',
        bgColor: '#ffffff',
        errorCorrectionLevel: 'Q',
        iconType: 'math',
        margin: 2,
        size: 250
      },
      scanCount: 0,
      requiresPin: false,
      pinCode: ''
    };
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      onSave(wizardData);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleInsertSnippet = (snippet: string) => {
    setWizardData(prev => ({
      ...prev,
      latexContent: prev.latexContent ? `${prev.latexContent} ${snippet}` : snippet
    }));
  };

  // Чекори со наслови и опис
  const stepMeta = [
    { num: 1, title: '1. Цел & Педагогија', desc: 'Што сакате да постигнете на часот?' },
    { num: 2, title: '2. Задача & LaTeX', desc: 'Формули и поставка на задачата' },
    { num: 3, title: '3. ZPD Скалирање', desc: 'Чекори на помош по Виготски' },
    { num: 4, title: '4. Бои & Безбедност', desc: 'Училишно брендирање и PIN' },
    { num: 5, title: '5. Завршеток & Печатење', desc: 'Преземи или отпечати за часот' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[95vh]">
        {/* Заглавие на водичот */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-md">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  {language === 'mk' ? 'Интерактивен Педагошки Водич за Наставници' : 'Guided Pedagogical Lesson Wizard'}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/30 text-indigo-300 rounded-md border border-indigo-400/30">
                  Чекор {currentStep} од {totalSteps}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'mk' 
                  ? 'Ве водиме низ секој чекор за подготовка на совршен образовен QR код за вашиот час' 
                  : 'Step-by-step assistant for preparing classroom educational QR codes'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Напредок низ чекорите (Step Indicator Bar) */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
          <div className="grid grid-cols-5 gap-2">
            {stepMeta.map((s) => {
              const isPassed = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setCurrentStep(s.num)}
                  className={`text-left p-2 rounded-xl transition border flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-200 shadow-2xs'
                      : isPassed
                      ? 'bg-indigo-50/70 border-indigo-200 text-slate-700'
                      : 'bg-slate-100/70 border-slate-200 text-slate-400 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-[10px] font-bold ${isCurrent ? 'text-indigo-700' : isPassed ? 'text-indigo-600' : 'text-slate-500'}`}>
                      Чекор {s.num}
                    </span>
                    {isPassed && <Check className="w-3 h-3 text-indigo-600" />}
                  </div>
                  <div className={`text-xs font-bold truncate ${isCurrent ? 'text-slate-900' : 'text-slate-700'}`}>
                    {s.title.split('. ')[1]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Содржина на активниот чекор */}
        <div className="p-6 overflow-y-auto space-y-5 grow">
          {/* ЧЕКОР 1: Избор на цел и педагогија */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-indigo-950 font-bold block mb-0.5">Педагошки совет за почеток:</strong>
                  QR кодот во училницата служи како дигитална алатка за поддршка. Прво дефинирајте за кој предмет и одделение е задачата, и која образовна рамка ќе ја користите.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Наслов на наставната содржина / задача: *
                  </label>
                  <input
                    type="text"
                    value={wizardData.title}
                    onChange={(e) => setWizardData({ ...wizardData, title: e.target.value })}
                    placeholder="на пр. Питагорова теорема во секојдневниот живот"
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Уникатен код (Slug):
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-[10px] font-mono text-slate-400">edu://</span>
                    <input
                      type="text"
                      value={wizardData.shortCode}
                      onChange={(e) => setWizardData({ ...wizardData, shortCode: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                      className="w-full text-xs font-mono font-bold pl-12 pr-3 py-2 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Наставен предмет:
                  </label>
                  <input
                    type="text"
                    value={wizardData.subject}
                    onChange={(e) => setWizardData({ ...wizardData, subject: e.target.value })}
                    placeholder="Математика, Алгебра, Геометрија"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Одделение / Клас:
                  </label>
                  <input
                    type="text"
                    value={wizardData.targetGrade}
                    onChange={(e) => setWizardData({ ...wizardData, targetGrade: e.target.value })}
                    placeholder="8-мо одделение, I година гимназија"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Folder className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Папка / Проект:</span>
                  </label>
                  <select
                    value={wizardData.folderId || ''}
                    onChange={(e) => setWizardData({ ...wizardData, folderId: e.target.value || undefined })}
                    className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Без папка (Општо)</option>
                    {(folders || []).map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.icon || '📁'} {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Изберете го типот на интеракција за учениците:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setWizardData({ ...wizardData, type: 'vygotsky_scaffold' })}
                    className={`p-3 rounded-2xl border text-left transition ${
                      wizardData.type === 'vygotsky_scaffold'
                        ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-300 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-900">Виготски Скалирање (ZPD)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Помош чекор-по-чекор. Учениците сами отклучуваат насоки ако заглават.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWizardData({ ...wizardData, type: 'bloom_taxonomy' })}
                    className={`p-3 rounded-2xl border text-left transition ${
                      wizardData.type === 'bloom_taxonomy'
                        ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-300 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-slate-900">Блумова Таксономија</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Задача означена со когнитивно ниво (Помнење, Примена, Анализа итн.).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWizardData({ ...wizardData, type: 'math_latex' })}
                    className={`p-3 rounded-2xl border text-left transition ${
                      wizardData.type === 'math_latex'
                        ? 'bg-purple-50 border-purple-600 ring-2 ring-purple-300 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-bold text-slate-900">Математичка LaTeX Задача</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Чиста математичка задача со формула и официјално чекорно решение.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ЧЕКОР 2: Математичка задача со LaTeX */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-indigo-950 font-bold block mb-0.5">Како да внесувате LaTeX формули:</strong>
                  Користете единечни долари <code className="bg-white px-1 py-0.5 rounded font-mono text-indigo-700">$c^2 = a^2 + b^2$</code> за формули во текстот или двојни долари <code className="bg-white px-1 py-0.5 rounded font-mono text-indigo-700">$$x = \frac&#123;-b&#125;&#123;2a&#125;$$</code> за издвоен ред. Користете ги копчињата подолу за еден клик!
                </div>
              </div>

              {/* Лента со брзи формули */}
              <LatexToolbar onInsert={handleInsertSnippet} language={language} />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Текст на задачата со математички формули: *
                </label>
                <textarea
                  rows={3}
                  value={wizardData.latexContent}
                  onChange={(e) => setWizardData({ ...wizardData, latexContent: e.target.value })}
                  className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Инстантен приказ со KaTeX */}
              {wizardData.latexContent && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                    Како ќе ја видат задачата учениците на екранот:
                  </span>
                  <div className="text-xs text-slate-800">
                    <LatexRenderer content={wizardData.latexContent} />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Официјално чекор-по-чекор решение (со LaTeX):
                </label>
                <textarea
                  rows={3}
                  value={wizardData.solutionLatex || ''}
                  onChange={(e) => setWizardData({ ...wizardData, solutionLatex: e.target.value })}
                  placeholder="$$c = \sqrt{a^2 + b^2} = ...$$"
                  className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* ЧЕКОР 3: Педагошко скалирање по Виготски (ZPD) */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3">
                <Layers className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-indigo-950 font-bold block mb-0.5">Што е Зона на нареден развој (ZPD)?</strong>
                  Кога ученикот решава самостојно и ќе се сопне, не треба веднаш да му се даде готовото решение. Додадете 2 насоки: првата го насочува кон почетниот чекор, а втората му ја дава формулата за пресметка.
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Чекори за помош (Scaffolding Steps):
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const nextNum = (wizardData.scaffoldingSteps?.length || 0) + 1;
                      const newStep: ScaffoldingStep = {
                        id: `step-${Date.now()}`,
                        stepNumber: nextNum,
                        title: `Насока ${nextNum}: Дополнителна помош`,
                        contentWithLatex: '',
                        revealedByDefault: false
                      };
                      setWizardData({
                        ...wizardData,
                        scaffoldingSteps: [...(wizardData.scaffoldingSteps || []), newStep]
                      });
                    }}
                    className="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition"
                  >
                    + Додади насока
                  </button>
                </div>

                {(wizardData.scaffoldingSteps || []).map((step, idx) => (
                  <div key={step.id} className="p-3 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-800 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                        Насока #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (wizardData.scaffoldingSteps || []).filter(s => s.id !== step.id);
                          setWizardData({ ...wizardData, scaffoldingSteps: updated });
                        }}
                        className="text-[11px] text-rose-600 hover:underline"
                      >
                        Отстрани
                      </button>
                    </div>

                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const updated = (wizardData.scaffoldingSteps || []).map(s => s.id === step.id ? { ...s, title: e.target.value } : s);
                        setWizardData({ ...wizardData, scaffoldingSteps: updated });
                      }}
                      className="w-full text-xs font-semibold px-2.5 py-1.5 border border-slate-200 rounded-lg"
                      placeholder="Наслов на помошната насока"
                    />

                    <textarea
                      rows={2}
                      value={step.contentWithLatex}
                      onChange={(e) => {
                        const updated = (wizardData.scaffoldingSteps || []).map(s => s.id === step.id ? { ...s, contentWithLatex: e.target.value } : s);
                        setWizardData({ ...wizardData, scaffoldingSteps: updated });
                      }}
                      className="w-full text-xs font-mono px-2.5 py-1.5 border border-slate-200 rounded-lg"
                      placeholder="Текст на насоката со LaTeX ($...$)"
                    />
                  </div>
                ))}
              </div>

              {/* Избор на ниво на Блум */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ниво на сложеност според Блумовата таксономија:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-xs">
                  {(['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'] as BloomLevel[]).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setWizardData({ ...wizardData, bloomLevel: lvl })}
                      className={`p-2 rounded-xl border text-center transition font-semibold ${
                        wizardData.bloomLevel === lvl
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {t.bloomShort[lvl]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ЧЕКОР 4: Училишно брендирање, бои и заштита */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3">
                <Palette className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-indigo-950 font-bold block mb-0.5">Училишни бои и висока читливост:</strong>
                  Изберете боја што одговара на вашето училиште. Системот автоматски проверува дали има доволен контраст за камерите на телефоните да го скенираат QR кодот без застој.
                </div>
              </div>

              {/* Брзи палети */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Изберете образовна палета:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { name: 'Кралско Сина', fg: '#1e3a8a', bg: '#ffffff' },
                    { name: 'STEM Зелена', fg: '#047857', bg: '#ffffff' },
                    { name: 'Бордо Црвена', fg: '#991b1b', bg: '#ffffff' },
                    { name: 'Виолетова', fg: '#581c87', bg: '#ffffff' },
                    { name: 'Максимален Контраст', fg: '#000000', bg: '#ffffff' },
                    { name: 'Топла Хартија', fg: '#1e293b', bg: '#fefce8' },
                    { name: 'Океанска Теал', fg: '#0f766e', bg: '#f0fdfa' },
                    { name: 'Темно Сива', fg: '#0f172a', bg: '#f1f5f9' },
                  ].map((pal, idx) => {
                    const isSelected = wizardData.style?.fgColor === pal.fg && wizardData.style?.bgColor === pal.bg;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setWizardData({
                          ...wizardData,
                          style: { ...wizardData.style, fgColor: pal.fg, bgColor: pal.bg }
                        })}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2 transition ${
                          isSelected
                            ? 'bg-white border-indigo-600 ring-2 ring-indigo-300 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full border border-slate-300 flex overflow-hidden shrink-0">
                          <span className="w-1/2 h-full" style={{ backgroundColor: pal.fg }} />
                          <span className="w-1/2 h-full" style={{ backgroundColor: pal.bg }} />
                        </div>
                        <span className="text-xs truncate">{pal.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Заштита со PIN код */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Заштити со PIN код за учениците</h4>
                    <p className="text-[11px] text-slate-500">Учениците ќе можат да ја отворат задачата само откако ќе им го кажете PIN-от на часот.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="wizardPinCheck"
                    checked={wizardData.requiresPin || false}
                    onChange={(e) => setWizardData({ ...wizardData, requiresPin: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  {wizardData.requiresPin && (
                    <input
                      type="text"
                      maxLength={6}
                      value={wizardData.pinCode || ''}
                      onChange={(e) => setWizardData({ ...wizardData, pinCode: e.target.value })}
                      placeholder="PIN (на пр. 2026)"
                      className="w-28 text-xs font-mono font-bold text-center px-2 py-1.5 bg-white border border-slate-300 rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ЧЕКОР 5: Преглед, Тестирање и Подготовка за часот */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 uppercase">Честитки! Вашиот образовен QR код е подготвен за часот.</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Можете веднаш да го тестирате како ученик, да го преземете или да го отпечатите на работен лист за училницата.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                {/* QR преглед во живо со мени за преземање */}
                <div className="flex flex-col items-center p-4 bg-slate-50 border border-slate-200 rounded-3xl">
                  <QRCodePreview
                    item={wizardData}
                    language={language}
                    showActions={true}
                    onSimulateScan={() => onSimulateScan?.(wizardData)}
                  />
                </div>

                {/* Резиме на задачата */}
                <div className="space-y-3 text-xs">
                  <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-2">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase">Резиме на содржината:</span>
                    <h3 className="font-bold text-sm text-slate-900">{wizardData.title}</h3>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md text-[10px]">
                        {wizardData.subject}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px]">
                        {wizardData.targetGrade}
                      </span>
                      {wizardData.bloomLevel && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-md text-[10px]">
                          Блум: {t.bloomShort[wizardData.bloomLevel]}
                        </span>
                      )}
                    </div>
                    {wizardData.scaffoldingSteps && wizardData.scaffoldingSteps.length > 0 && (
                      <p className="text-[11px] text-indigo-700 font-medium pt-1">
                        ✓ Вклучува {wizardData.scaffoldingSteps.length} скалирани чекори на помош (Виготски ZPD).
                      </p>
                    )}
                  </div>

                  {/* Брзи копчиња за акција */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onSimulateScan?.(wizardData)}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl border border-indigo-200 transition"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Тестирај како ученик</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenPrintSheet?.(wizardData)}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-300 transition"
                    >
                      <Printer className="w-4 h-4 text-slate-600" />
                      <span>Печати А4 лист</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Футер со копчиња за навигација (Претходно / Следно / Зачувај) */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : handlePrev}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-white text-slate-700 font-semibold text-xs rounded-xl transition"
          >
            {currentStep === 1 ? (
              <span>Откажи</span>
            ) : (
              <>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Претходен чекор</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <span>{currentStep === totalSteps ? 'Зачувај и заврши' : 'Следен чекор'}</span>
            {currentStep < totalSteps && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
