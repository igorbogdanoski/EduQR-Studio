import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import {
  HelpCircle,
  X,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Sparkles,
  QrCode,
  Printer,
  Compass,
  Trophy,
  Tag,
  FolderTree,
  Mic,
  Eye,
  FileText,
  ExternalLink,
  BookOpen,
  GraduationCap
} from 'lucide-react';

interface TeacherTestingGuideModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onOpenNewQr: () => void;
  onOpenScavengerHunt: () => void;
  onOpenEngagement: () => void;
  onOpenPrintModal: () => void;
  onOpenVoiceAssistant: () => void;
  onOpenTagManager: () => void;
  onOpenMathQuiz?: () => void;
}

export const TeacherTestingGuideModal: React.FC<TeacherTestingGuideModalProps> = ({
  isOpen,
  language,
  onClose,
  onOpenNewQr,
  onOpenScavengerHunt,
  onOpenEngagement,
  onOpenPrintModal,
  onOpenVoiceAssistant,
  onOpenTagManager,
  onOpenMathQuiz,
}) => {
  const t = translations[language];
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleCopyAppUrl = () => {
    const url = window.location.href.split('?')[0];
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const checklistItems = [
    {
      id: 'qr-editor',
      icon: <QrCode className="w-5 h-5 text-indigo-600" />,
      title: language === 'mk' ? '1. Уредувач на QR кодови & Мултипредметна поддршка' : '1. QR Editor & Multi-Subject Support',
      desc: language === 'mk'
        ? 'Креирајте нов код со LaTeX математички формули, задачи по физика, хемија, биологија, информатика или македонски јазик. Достапни се брзи предлози за одделенија (I-IX одд. и I-IV год. средно).'
        : 'Create codes with LaTeX math formulas, physics, chemistry, biology, CS, and languages.',
      actionText: language === 'mk' ? 'Тестирај Нов QR' : 'Test New QR',
      action: () => {
        onClose();
        onOpenNewQr();
      }
    },
    {
      id: 'student-scan',
      icon: <Eye className="w-5 h-5 text-emerald-600" />,
      title: language === 'mk' ? '2. Студентски симулатор на скенирање (Scaffolding & PIN)' : '2. Student Scan Simulator',
      desc: language === 'mk'
        ? 'Кликнете на „Скенирај како ученик“ на кој било QR код: испробајте ги скалираните чекори на Виготски за поддршка, Блумовата таксономија и отклучувањето со PIN код (на пр. 2026).'
        : 'Simulate scanning from student perspective with progressive scaffolding hints and PIN verification.'
    },
    {
      id: 'pdf-worksheet',
      icon: <Printer className="w-5 h-5 text-blue-600" />,
      title: language === 'mk' ? '3. Професионален A4 PDF извоз & Упатства за ученици' : '3. A4 PDF Worksheet Export & Instructions',
      desc: language === 'mk'
        ? 'Отворете „Печати наставен лист“: изберете од 5 распореди (1x1 голема станица, 2x2 картички, 3x3, 4x4 налепници или класичен работен лист), приспособете ги инструкциите и преземете чист PDF документ.'
        : 'Export differentiated A4 worksheets with custom instructions and clean typography.',
      actionText: language === 'mk' ? 'Отвори PDF Печатач' : 'Open PDF Print',
      action: () => {
        onClose();
        onOpenPrintModal();
      }
    },
    {
      id: 'scavenger-hunt',
      icon: <Compass className="w-5 h-5 text-amber-600" />,
      title: language === 'mk' ? '4. 1-Клик Генератор: QR Лов на информации (Станици)' : '4. 1-Click QR Scavenger Hunt',
      desc: language === 'mk'
        ? 'Со еден клик генерирајте комплетна серија од 4-5 последователни училишни станици со траги, решенија и клучеви за Математика, Физика, Хемија, Информатика или Географија.'
        : 'Generate a 4-5 classroom station series with sequential clues and Bloom progression.',
      actionText: language === 'mk' ? 'Генерирај Лов' : 'Generate Hunt',
      action: () => {
        onClose();
        onOpenScavengerHunt();
      }
    },
    {
      id: 'math-quiz',
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      title: language === 'mk' ? '5. Математички Квиз & Клуч со Решенија (Answer Key QR)' : '5. Math Quiz & Answer Key QR Generator',
      desc: language === 'mk'
        ? 'Генерирајте сет од LaTeX математички задачи (линеарни, квадратни равенки, Питагора, дропки) и автоматски соодветен QR код со клуч за проверка заштитен со PIN.'
        : 'Generate LaTeX math problem sets with matching PIN-protected Answer Key QR code for instant grading.',
      actionText: language === 'mk' ? 'Креирај Квиз' : 'Create Quiz',
      action: () => {
        onClose();
        if (onOpenMathQuiz) onOpenMathQuiz();
      }
    },
    {
      id: 'engagement',
      icon: <Trophy className="w-5 h-5 text-orange-600" />,
      title: language === 'mk' ? '6. Лидерска табла на студентска ангажираност' : '6. Student Engagement Leaderboard',
      desc: language === 'mk'
        ? 'Следете кои QR кодови се најчесто скенирани од учениците, видете најактивен наставен предмет и филтрирајте по предмети од основно и средно образование.'
        : 'Monitor scan metrics, find most engaging materials, and filter by subject.',
      actionText: language === 'mk' ? 'Види Лидерска Табла' : 'View Leaderboard',
      action: () => {
        onClose();
        onOpenEngagement();
      }
    },
    {
      id: 'tags-manager',
      icon: <Tag className="w-5 h-5 text-purple-600" />,
      title: language === 'mk' ? '6. Колор-кодирани тагови & Глобален менаџер' : '6. Color-Coded Tags & Tag Manager',
      desc: language === 'mk'
        ? 'Доделувајте свои обоени ознаки во уредувачот (на пр. #лабораторија, #испит), а преку страничната лента за тагови преименувајте ги или избришете ги глобално на сите материјали.'
        : 'Assign colored tags and globally rename or delete them across all materials.',
      actionText: language === 'mk' ? 'Отвори Таг Менаџер' : 'Open Tag Manager',
      action: () => {
        onClose();
        onOpenTagManager();
      }
    },
    {
      id: 'voice-ai',
      icon: <Mic className="w-5 h-5 text-indigo-600" />,
      title: language === 'mk' ? '7. Двонасочен гласовен асистент со AI модел' : '7. Two-Way Voice Dialogue AI',
      desc: language === 'mk'
        ? 'Зборувајте со AI моделот за да диктирате и генерирате диференцирани задачи за ученици само со глас.'
        : 'Talk directly with the AI model to create differentiated pedagogical exercises by voice.',
      actionText: language === 'mk' ? 'Пробај Говор' : 'Test Voice',
      action: () => {
        onClose();
        onOpenVoiceAssistant();
      }
    },
    {
      id: 'collaboration',
      icon: <FolderTree className="w-5 h-5 text-teal-600" />,
      title: language === 'mk' ? '8. Споделување папки со колеги (ID размена)' : '8. Shared Folders with Colleagues',
      desc: language === 'mk'
        ? 'Организирајте ги кодовите во папки и споделете го нивниот уникатен ID со колегите за брз увид во вашите подготвени часови.'
        : 'Organize into thematic folders and share the unique ID with colleagues.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Хедер */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {language === 'mk' ? 'Водич за тестирање & Подготвеност за споделување' : 'Testing Guide & Sharing Readiness'}
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {language === 'mk' ? '100% Спремно' : 'Ready'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'mk'
                  ? 'Сè што треба да знаете пред да ја споделите апликацијата со вашите наставнички колеги'
                  : 'Everything you need to test before sharing with fellow teachers and colleagues'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Инфо лента за брзо споделување линк */}
        <div className="bg-indigo-50 border-b border-indigo-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-indigo-900">
            <Share2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              {language === 'mk'
                ? 'Апликацијата е хостирана и подготвена за директно отворање од кој било прелистувач, компјутер, телефон или таблет.'
                : 'The application is deployed and ready to open on any browser, desktop, phone, or tablet.'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyAppUrl}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-xs transition cursor-pointer shrink-0 ${
              copiedLink
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4" />
                <span>{language === 'mk' ? 'Линкот е копиран!' : 'Link Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{language === 'mk' ? 'Копирај линк за колегите' : 'Copy Share Link'}</span>
              </>
            )}
          </button>
        </div>

        {/* Листа на функционалности за тестирање */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 grow max-h-[60vh]">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">
              {language === 'mk' ? 'Чеклиста на функционалности за првично тестирање:' : 'Feature Checklist for Pilot Testing:'}
            </h3>
            <span className="text-xs font-bold text-indigo-600">
              8/8 {language === 'mk' ? 'модули тестирани и активни' : 'modules verified'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 hover:border-indigo-300 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                      {item.icon}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-1">
                    {item.desc}
                  </p>
                </div>

                {item.action && (
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={item.action}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>{item.actionText}</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Статус картички за подготвеност */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 mt-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'mk' ? 'Техничка и педагошка подготвеност за настава:' : 'Pedagogical & Technical Readiness:'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-emerald-800">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Локално зачувување (Offline Safe)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Мултијазичност (MK / SQ / EN)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>PDF & ZIP Извоз со висока резолуција</span>
              </div>
            </div>
          </div>
        </div>

        {/* Футер */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            {language === 'mk' ? 'ЕдуQR Студио • Подготвено за тестирање во наставнички тимови' : 'EduQR Studio • Ready for team pilot testing'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer"
          >
            {language === 'mk' ? 'Разбрав, да започнеме!' : 'Got it, let’s start!'}
          </button>
        </div>
      </div>
    </div>
  );
};
