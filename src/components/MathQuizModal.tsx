import React, { useState } from 'react';
import { EducationalQRCode, EducationalFolder, Language, BloomLevel, MathQuizQuestion } from '../types';
import { translations } from '../i18n/translations';
import { LatexRenderer } from './LatexRenderer';
import {
  FileQuestion,
  X,
  Sparkles,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  Printer,
  Plus,
  Trash2,
  Edit3,
  Check,
  RefreshCw,
  FolderPlus,
  Layers,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Flame,
  Brain,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MathQuizModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onSaveQuiz: (newCodes: EducationalQRCode[], newFolder: EducationalFolder) => void;
  onPrintQuizDirectly?: (codes: EducationalQRCode[]) => void;
}

interface QuizCurriculumPreset {
  id: string;
  emoji: string;
  title: string;
  subject: string;
  grade: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  folderColor: string;
  questions: MathQuizQuestion[];
}

const QUIZ_PRESETS: QuizCurriculumPreset[] = [
  {
    id: 'linear_equations',
    emoji: '📐',
    title: 'Линеарни равенки со една непозната',
    subject: 'Математика (Алгебра)',
    grade: '8-мо одделение',
    difficulty: 'medium',
    description: 'Основни и средни равенки со загради и дропки, идеални за 20-минутен контролен квиз.',
    folderColor: '#4f46e5',
    questions: [
      {
        id: 'q-1',
        questionNumber: 1,
        questionLatex: 'Реши ја линеарната равенка: $$4x - 9 = 23$$ Пресметај ја вредноста за $x$.',
        solutionLatex: '$$4x = 23 + 9$$\n$$4x = 32$$\n$$x = \\frac{32}{4} = 8$$',
        correctAnswerText: 'x = 8',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        id: 'q-2',
        questionNumber: 2,
        questionLatex: 'Определи ја вредноста на $x$: $$5(x - 3) = 2x + 6$$',
        solutionLatex: '$$5x - 15 = 2x + 6$$\n$$5x - 2x = 6 + 15$$\n$$3x = 21$$\n$$x = 7$$',
        correctAnswerText: 'x = 7',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        id: 'q-3',
        questionNumber: 3,
        questionLatex: 'Реши ја дробната равенка: $$\\frac{3x + 1}{4} = 4$$',
        solutionLatex: '$$3x + 1 = 4 \\cdot 4 = 16$$\n$$3x = 15$$\n$$x = 5$$',
        correctAnswerText: 'x = 5',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        id: 'q-4',
        questionNumber: 4,
        questionLatex: 'Реши ја равенката: $$7 - 2(3x - 1) = 21$$',
        solutionLatex: '$$7 - 6x + 2 = 21$$\n$$9 - 6x = 21$$\n$$-6x = 12$$\n$$x = -2$$',
        correctAnswerText: 'x = -2',
        points: 3,
        bloomLevel: 'analyze'
      },
      {
        id: 'q-5',
        questionNumber: 5,
        questionLatex: 'Збирот на три последователни цели броеви е $72$. Состави равенка и најди го најголемиот од нив.',
        solutionLatex: 'Нека броевите се $n, n+1, n+2$.\n$$n + (n+1) + (n+2) = 72 \\implies 3n + 3 = 72 \\implies 3n = 69 \\implies n = 23$$\nБроевите се 23, 24, 25. Најголемиот број е $25$.',
        correctAnswerText: '25 (броевите се 23, 24, 25)',
        points: 3,
        bloomLevel: 'analyze'
      }
    ]
  },
  {
    id: 'pythagoras_geometry',
    emoji: '⚡',
    title: 'Питагорова теорема & Правоаголен триаголник',
    subject: 'Математика (Геометрија)',
    grade: '7-мо / 8-мо одделение',
    difficulty: 'medium',
    description: 'Пресметка на хипотенуза, катета, плоштина и дијагонали со KaTeX формула.',
    folderColor: '#059669',
    questions: [
      {
        id: 'q-1',
        questionNumber: 1,
        questionLatex: 'Во правоаголен триаголник катетите се $a = 6\\text{ cm}$ и $b = 8\\text{ cm}$. Пресметај ја должината на хипотенузата $c$.',
        solutionLatex: '$$c = \\sqrt{a^2 + b^2} = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10\\text{ cm}$$',
        correctAnswerText: 'c = 10 cm',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        id: 'q-2',
        questionNumber: 2,
        questionLatex: 'Хипотенузата на правоаголен триаголник е $c = 13\\text{ cm}$, а едната катета е $a = 5\\text{ cm}$. Одреди ја втората катета $b$.',
        solutionLatex: '$$b = \\sqrt{c^2 - a^2} = \\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12\\text{ cm}$$',
        correctAnswerText: 'b = 12 cm',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        id: 'q-3',
        questionNumber: 3,
        questionLatex: 'Пресметај ја плоштината на правоаголен триаголник со катети $a = 12\\text{ cm}$ и $b = 9\\text{ cm}$.',
        solutionLatex: '$$P = \\frac{a \\cdot b}{2} = \\frac{12 \\cdot 9}{2} = \\frac{108}{2} = 54\\text{ cm}^2$$',
        correctAnswerText: 'P = 54 cm²',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        id: 'q-4',
        questionNumber: 4,
        questionLatex: 'Дијагоналата на правоаголник е $d = 25\\text{ cm}$, а едната страна е $a = 24\\text{ cm}$. Пресметај го периметарот $L$.',
        solutionLatex: '$$b = \\sqrt{25^2 - 24^2} = \\sqrt{625 - 576} = \\sqrt{49} = 7\\text{ cm}$$\n$$L = 2(a + b) = 2(24 + 7) = 2(31) = 62\\text{ cm}$$',
        correctAnswerText: 'L = 62 cm (b = 7 cm)',
        points: 3,
        bloomLevel: 'analyze'
      },
      {
        id: 'q-5',
        questionNumber: 5,
        questionLatex: 'Рамнокрак триаголник има основа $a = 16\\text{ cm}$ и крак $b = 10\\text{ cm}$. Пресметај ја висината $h_a$ спуштена кон основата.',
        solutionLatex: 'Висината ја дели основата на половина: $\\frac{a}{2} = 8\\text{ cm}$.\n$$h_a = \\sqrt{b^2 - (a/2)^2} = \\sqrt{10^2 - 8^2} = \\sqrt{100 - 64} = 6\\text{ cm}$$',
        correctAnswerText: 'h_a = 6 cm',
        points: 3,
        bloomLevel: 'analyze'
      }
    ]
  },
  {
    id: 'quadratic_equations',
    emoji: '🔬',
    title: 'Квадратни равенки & Дискриминанта',
    subject: 'Математика (Алгебра)',
    grade: 'I година средно',
    difficulty: 'hard',
    description: 'Квадратни равенки, дискриминанта $D = b^2 - 4ac$ и решенија во реално поле.',
    folderColor: '#9333ea',
    questions: [
      {
        id: 'q-1',
        questionNumber: 1,
        questionLatex: 'Реши ја квадратната равенка: $$x^2 - 7x + 12 = 0$$',
        solutionLatex: '$$(x - 3)(x - 4) = 0 \\implies x_1 = 3, \\quad x_2 = 4$$',
        correctAnswerText: 'x₁ = 3, x₂ = 4',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        id: 'q-2',
        questionNumber: 2,
        questionLatex: 'Пресметај ја дискриминантата $D$ и најди ги решенијата на: $$2x^2 - 5x - 3 = 0$$',
        solutionLatex: '$$D = (-5)^2 - 4(2)(-3) = 25 + 24 = 49$$\n$$x = \\frac{5 \\pm \\sqrt{49}}{4} = \\frac{5 \\pm 7}{4} \\implies x_1 = 3, \\quad x_2 = -\\frac{1}{2}$$',
        correctAnswerText: 'D = 49; x₁ = 3, x₂ = -0.5',
        points: 3,
        bloomLevel: 'analyze'
      },
      {
        id: 'q-3',
        questionNumber: 3,
        questionLatex: 'Реши ја нецелосната квадратна равенка: $$3x^2 - 27 = 0$$',
        solutionLatex: '$$3x^2 = 27 \\implies x^2 = 9 \\implies x = \\pm 3$$',
        correctAnswerText: 'x = ±3',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        id: 'q-4',
        questionNumber: 4,
        questionLatex: 'Одреди ја природата на корените за: $$x^2 - 6x + 9 = 0$$',
        solutionLatex: '$$D = (-6)^2 - 4(1)(9) = 36 - 36 = 0$$\n$$x_1 = x_2 = 3$$ (двократен реален корен)',
        correctAnswerText: 'x = 3 (двократен корен)',
        points: 2,
        bloomLevel: 'understand'
      }
    ]
  },
  {
    id: 'fractions_percentages',
    emoji: '🍕',
    title: 'Дропки, скратување & Проценти',
    subject: 'Математика (Аритметика)',
    grade: '6-то / 7-мо одделение',
    difficulty: 'easy',
    description: 'Основни аритметички операции со дропки, пресметка на проценти и попусти.',
    folderColor: '#ea580c',
    questions: [
      {
        id: 'q-1',
        questionNumber: 1,
        questionLatex: 'Пресметај ја вредноста на бројниот израз: $$\\frac{3}{5} + \\frac{1}{4} - \\frac{3}{10}$$',
        solutionLatex: 'НЗС(5, 4, 10) = 20:\n$$\\frac{12 + 5 - 6}{20} = \\frac{11}{20}$$',
        correctAnswerText: '11/20 (0.55)',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        id: 'q-2',
        questionNumber: 2,
        questionLatex: 'Пресметај го производот и скрати до нескратлива дропка: $$\\frac{7}{12} \\cdot \\frac{8}{21}$$',
        solutionLatex: 'По скратување 7 со 21 (1 и 3) и 8 со 12 (2 и 3):\n$$\\frac{1 \\cdot 2}{3 \\cdot 3} = \\frac{2}{9}$$',
        correctAnswerText: '2/9',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        id: 'q-3',
        questionNumber: 3,
        questionLatex: 'Пресметај $15\\%$ од сумата од $2400\\text{ денари}$.',
        solutionLatex: '$$2400 \\cdot \\frac{15}{100} = 24 \\cdot 15 = 360\\text{ денари}$$',
        correctAnswerText: '360 денари',
        points: 2,
        bloomLevel: 'understand'
      },
      {
        id: 'q-4',
        questionNumber: 4,
        questionLatex: 'Еден учебник од $1600\\text{ ден.}$ е намален за $20\\%$. Колку изнесува новата цена?',
        solutionLatex: 'Попуст: $1600 \\cdot 0.20 = 320\\text{ ден.}$\nНова цена: $1600 - 320 = 1280\\text{ денари}$',
        correctAnswerText: '1280 денари',
        points: 2,
        bloomLevel: 'apply'
      }
    ]
  }
];

export const MathQuizModal: React.FC<MathQuizModalProps> = ({
  isOpen,
  language,
  onClose,
  onSaveQuiz,
  onPrintQuizDirectly
}) => {
  const t = translations[language];

  // Активен шаблон или прилагодена конфигурација
  const [selectedPresetId, setSelectedPresetId] = useState<string>('linear_equations');
  const [quizTitle, setQuizTitle] = useState('Линеарни равенки со една непозната');
  const [targetSubject, setTargetSubject] = useState('Математика');
  const [targetGrade, setTargetGrade] = useState('8-мо одделение');
  const [customTopicPrompt, setCustomTopicPrompt] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questions, setQuestions] = useState<MathQuizQuestion[]>(QUIZ_PRESETS[0].questions);

  // Безбедност на Клучот со решенија
  const [isPinProtected, setIsPinProtected] = useState<boolean>(true);
  const [pinCode, setPinCode] = useState<string>('1234');

  // Состојби за вчитување и уредување
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'configure' | 'preview'>('configure');

  if (!isOpen) return null;

  // Избор на предефиниран квиз
  const handleSelectPreset = (preset: QuizCurriculumPreset) => {
    setSelectedPresetId(preset.id);
    setQuizTitle(preset.title);
    setTargetSubject(preset.subject);
    setTargetGrade(preset.grade);
    setDifficulty(preset.difficulty);
    setQuestions(preset.questions);
    setQuestionCount(preset.questions.length);
  };

  // Генерирање со вештачка интелигенција или локален курикулум
  const handleGenerateAiQuiz = async () => {
    setIsLoadingAi(true);
    try {
      const topic = customTopicPrompt.trim() || quizTitle;
      const res = await fetch('/api/ai/math-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          grade: targetGrade,
          questionCount,
          difficulty,
          language
        })
      });

      if (!res.ok) {
        throw new Error('Server error');
      }

      const data = await res.json();
      if (data && Array.isArray(data.questions) && data.questions.length > 0) {
        const formatted: MathQuizQuestion[] = data.questions.map((q: any, idx: number) => ({
          id: `q-${Date.now()}-${idx}`,
          questionNumber: idx + 1,
          questionLatex: q.questionLatex || q.latexContent || 'Реши ја задачата.',
          solutionLatex: q.solutionLatex || 'Постапка.',
          correctAnswerText: q.correctAnswerText || 'Точен одговор.',
          points: q.points || 2,
          bloomLevel: q.bloomLevel || 'apply'
        }));

        setQuizTitle(data.title || quizTitle);
        if (data.subject) setTargetSubject(data.subject);
        setQuestions(formatted);
        setActiveTab('preview');
      }
    } catch (err) {
      console.error('Failed to generate AI quiz:', err);
      // Fallback на локален курикулум
      const matched = QUIZ_PRESETS.find(p => p.id === selectedPresetId) || QUIZ_PRESETS[0];
      setQuestions(matched.questions);
      setActiveTab('preview');
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Ажурирање на прашање во едиторот
  const handleUpdateQuestion = (id: string, updates: Partial<MathQuizQuestion>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length <= 1) {
      alert(language === 'mk' ? 'Квизот мора да има барем една задача.' : 'Quiz must have at least one question.');
      return;
    }
    const filtered = questions.filter(q => q.id !== id).map((q, idx) => ({
      ...q,
      questionNumber: idx + 1
    }));
    setQuestions(filtered);
    if (editingQuestionId === id) setEditingQuestionId(null);
  };

  const handleAddNewQuestion = () => {
    const newQ: MathQuizQuestion = {
      id: `q-${Date.now()}`,
      questionNumber: questions.length + 1,
      questionLatex: 'Реши ја равенката: $$2x + 10 = 24$$ Пресметај го $x$.',
      solutionLatex: '$$2x = 24 - 10 = 14 \\implies x = 7$$',
      correctAnswerText: 'x = 7',
      points: 2,
      bloomLevel: 'apply'
    };
    setQuestions(prev => [...prev, newQ]);
    setEditingQuestionId(newQ.id);
  };

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 2), 0);

  // Финално генерирање на сетот QR кодови и Клучот со решенија
  const handleFinalCreateQuiz = (shouldPrintDirectly = false) => {
    const timestamp = Date.now();
    const folderId = `folder-quiz-${timestamp}`;

    // 1. Создај папка за квизот
    const newFolder: EducationalFolder = {
      id: folderId,
      name: `Квиз: ${quizTitle}`,
      description: `Математички квиз со ${questions.length} задачи (${totalPoints} бодови) и QR Клуч со решенија.`,
      categoryType: 'subject',
      color: '#4f46e5',
      icon: '📐',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const newCodes: EducationalQRCode[] = [];

    // 2. Создај поединечни QR кодови за секоја задача (Станици за решавање)
    questions.forEach((q, idx) => {
      const qCode: EducationalQRCode = {
        id: `qr-quiz-q-${timestamp}-${idx}`,
        shortCode: `q${idx + 1}_${Math.floor(100 + Math.random() * 900)}`,
        title: `Задача ${q.questionNumber}: ${quizTitle}`,
        description: `Бодови: ${q.points} • Ниво: ${q.bloomLevel || 'apply'}. Решете во работниот лист.`,
        type: 'math_latex',
        createdAt: new Date().toISOString().split('T')[0],
        subject: targetSubject,
        targetGrade,
        folderId,
        latexContent: q.questionLatex,
        solutionLatex: q.solutionLatex,
        bloomLevel: q.bloomLevel,
        style: {
          fgColor: '#1e1b4b',
          bgColor: '#ffffff',
          errorCorrectionLevel: 'Q',
          iconType: 'math',
          margin: 2,
          size: 256,
          themePreset: 'math_indigo',
          pattern: 'standard'
        },
        scanCount: 0,
        tags: ['quiz_task', 'exam_prep', targetSubject]
      };
      newCodes.push(qCode);
    });

    // 3. Создај го специјалниот "КЛУЧ СО РЕШЕНИЈА" (Answer Key) QR код
    const answerKeySummaryLatex = questions
      .map(
        q => `\\textbf{Задача ${q.questionNumber} (${q.points} бод.):} ${q.questionLatex}\n\\textbf{Точен одговор:} ${q.correctAnswerText}\n\\textbf{Постапка:}\n${q.solutionLatex}`
      )
      .join('\n\n---\n\n');

    const answerKeyCode: EducationalQRCode = {
      id: `qr-answer-key-${timestamp}`,
      shortCode: `ans_${Math.floor(100 + Math.random() * 900)}`,
      title: `🔑 Клуч со решенија: ${quizTitle}`,
      description: `Официјален клуч за оценување (${questions.length} задачи, вкупно ${totalPoints} бодови).`,
      type: 'answer_key',
      createdAt: new Date().toISOString().split('T')[0],
      subject: targetSubject,
      targetGrade,
      folderId,
      latexContent: `Официјален клуч со точни одговори и чекор-по-чекор решенија за: **${quizTitle}** (Вкупно ${totalPoints} бодови).\n\n${answerKeySummaryLatex}`,
      solutionLatex: answerKeySummaryLatex,
      bloomLevel: 'evaluate',
      requiresPin: isPinProtected,
      pinCode: isPinProtected ? (pinCode.trim() || '1234') : undefined,
      isAnswerKey: true,
      quizQuestions: questions,
      style: {
        fgColor: '#065f46', // Смарагдна боја за клучот
        bgColor: '#ffffff',
        errorCorrectionLevel: 'H',
        iconType: 'school',
        margin: 2,
        size: 280,
        themePreset: 'science_emerald',
        pattern: 'rounded'
      },
      scanCount: 0,
      tags: ['answer_key', 'exam_prep', targetSubject]
    };

    newCodes.push(answerKeyCode);

    // Изврши зачувување
    onSaveQuiz(newCodes, newFolder);
    onClose();

    if (shouldPrintDirectly && onPrintQuizDirectly) {
      onPrintQuizDirectly(newCodes);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Заглавие */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600/90 rounded-2xl shadow-inner border border-indigo-400/30">
              <FileQuestion className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {language === 'mk' ? 'Математички Квиз & Клуч со Решенија' : 'Math Quiz & Answer Key Generator'}
                </h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-black uppercase">
                  LaTeX + QR Key
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                {language === 'mk'
                  ? 'Генерирајте задачи со формули и автоматски соодветен QR код за проверка на одговорите.'
                  : 'Generate LaTeX math problem sets with matching PIN-protected Answer Key QR.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Табови: 1. Поставки & Тема | 2. Преглед & Уредување на задачи */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('configure')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'configure'
                  ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>1. Избор на тема & Параметри</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>2. Преглед на задачи & Клуч ({questions.length})</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-black">
                {totalPoints} бод.
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-500 font-semibold pr-2">
            <span>Вкупно: <strong>{questions.length}</strong> задачи</span>
            <span>•</span>
            <span><strong>{totalPoints}</strong> бодови</span>
          </div>
        </div>

        {/* СОДРЖИНА НА МОДАЛОТ */}
        <div className="p-5 sm:p-6 overflow-y-auto grow space-y-6">
          
          {/* ТАБ 1: ПОСТАВКИ И ИЗБОР НА ТЕМА */}
          {activeTab === 'configure' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Препорачани курукуларни теми (Брзи шаблони) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Препорачани наставни програми (Кликнете за готов квиз):</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">Проверени наставни сетови</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {QUIZ_PRESETS.map((preset) => {
                    const isSelected = selectedPresetId === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-4 rounded-2xl border-2 transition cursor-pointer text-left space-y-2 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                            : 'border-slate-200 hover:border-indigo-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl p-1 bg-white rounded-xl shadow-2xs">{preset.emoji}</span>
                            <div>
                              <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">{preset.title}</h4>
                              <p className="text-[11px] text-slate-500">{preset.grade} • {preset.subject}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {preset.description}
                        </p>

                        <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-indigo-700">
                          <span>{preset.questions.length} задачи</span>
                          <span>•</span>
                          <span>{preset.questions.reduce((s, q) => s + q.points, 0)} бодови</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Прилагодено генерирање со AI или сопствен наслов */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-slate-50 border border-indigo-200 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                      Генерирај прилагоден квиз со AI или курикулум
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                    Модел: Gemini 3.8 Flash
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Одделение / Клас:</label>
                    <select
                      value={targetGrade}
                      onChange={(e) => setTargetGrade(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                    >
                      <option value="6-то одделение">6-то одделение (Основно)</option>
                      <option value="7-мо одделение">7-мо одделение (Основно)</option>
                      <option value="8-мо одделение">8-мо одделение (Основно)</option>
                      <option value="9-то одделение">9-то одделение (Основно)</option>
                      <option value="I година средно">I година (Средно)</option>
                      <option value="II година средно">II година (Средно)</option>
                      <option value="III година средно">III година (Средно)</option>
                      <option value="IV година средно">IV година (Средно)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Број на задачи:</label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                    >
                      <option value={3}>3 задачи (Брза проверка)</option>
                      <option value={4}>4 задачи (Краток тест)</option>
                      <option value={5}>5 задачи (Стандарден квиз)</option>
                      <option value={6}>6 задачи (Тематски тест)</option>
                      <option value={8}>8 задачи (Контролна вежба)</option>
                      <option value={10}>10 задачи (Сеопфатен испит)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Сложеност:</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                    >
                      <option value="easy">Основно (Почетно)</option>
                      <option value="medium">Стандардно (Наставна програма)</option>
                      <option value="hard">Напредно (Натпреварувачко)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Тема или специфични барања за задачите (Опционално):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTopicPrompt}
                      onChange={(e) => setCustomTopicPrompt(e.target.value)}
                      placeholder="на пр. 'Системи равенки со два непознати' или 'Плоштина на рамнокрак трапез'"
                      className="grow px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateAiQuiz}
                      disabled={isLoadingAi}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {isLoadingAi ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Се генерира...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Генерирај со AI</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Поставки за Клучот со решенија (Answer Key Security) */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                      Безбедност на Клучот со решенија (Answer Key QR)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-full">
                    {isPinProtected ? 'Заштитено со PIN' : 'Јавен пристап'}
                  </span>
                </div>

                <p className="text-xs text-emerald-800 leading-relaxed">
                  Апликацијата автоматски ќе креира посебен <strong>QR код со клуч за проверка</strong>. Учениците можат да го скенираат за да ги проверат своите решенија откако ќе заврши времето на тестот.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPinProtected}
                      onChange={(e) => setIsPinProtected(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>Заштити го QR кодот со PIN код за наставникот</span>
                  </label>

                  {isPinProtected && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 font-medium">PIN код:</span>
                      <input
                        type="text"
                        maxLength={6}
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        placeholder="1234"
                        className="w-20 px-2.5 py-1 text-xs font-mono font-bold bg-white border border-emerald-300 rounded-lg text-center focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                      <span className="text-[11px] text-emerald-700 italic">(кажете им го на учениците кога ќе завршат)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Копче за премин кон преглед */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Прегледај ги задачите и клучот</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ТАБ 2: ПРЕГЛЕД И УРЕДУВАЊЕ НА ЗАДАЧИТЕ & КЛУЧОТ */}
          {activeTab === 'preview' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Главно заглавие на квизот (Уредливо) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="grow w-full">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Наслов на квизот:</label>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm font-extrabold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-xl font-bold">
                    {questions.length} задачи
                  </span>
                  <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1.5 rounded-xl font-bold">
                    {totalPoints} бодови вкупно
                  </span>
                </div>
              </div>

              {/* Картичка: Изглед на Клучот со решенија (Answer Key QR Preview) */}
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
                    🔑
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-xs sm:text-sm text-emerald-950">
                        Автоматски поврзан QR Код: Клуч со решенија
                      </h4>
                      <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.2 rounded font-black uppercase">
                        Answer Key
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Ќе содржи <strong>сите {questions.length} точни одговори</strong>, чекор-по-чекор постапка и бодување.
                      {isPinProtected ? ` Заштитено со PIN: ${pinCode}` : ' Достапно за директно скенирање.'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-200/70 px-2.5 py-1 rounded-lg">
                    edu://ans_key
                  </span>
                </div>
              </div>

              {/* Листа на задачи во квизот */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Задачи во квизот ({questions.length}):</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddNewQuestion}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Додај задача</span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  {questions.map((q, idx) => {
                    const isEditing = editingQuestionId === q.id;

                    return (
                      <div
                        key={q.id}
                        className="bg-white border-2 border-slate-200 hover:border-indigo-200 rounded-2xl p-4 space-y-3 transition shadow-2xs"
                      >
                        {/* Горна лента на задачата */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                              #{q.questionNumber}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                              Задача {q.questionNumber}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {q.points} {q.points === 1 ? 'бод' : 'бода'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingQuestionId(isEditing ? null : q.id)}
                              className="px-2.5 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>{isEditing ? 'Затвори уредување' : 'Уреди'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Избриши задача"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Форма за уредување на задачата */}
                        {isEditing ? (
                          <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 animate-fade-in text-xs">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Поставка со LaTeX ($...$ или $$...$$):</label>
                              <textarea
                                rows={2}
                                value={q.questionLatex}
                                onChange={(e) => handleUpdateQuestion(q.id, { questionLatex: e.target.value })}
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block font-bold text-slate-700 mb-1">Точен одговор (Кратенка за клучот):</label>
                                <input
                                  type="text"
                                  value={q.correctAnswerText}
                                  onChange={(e) => handleUpdateQuestion(q.id, { correctAnswerText: e.target.value })}
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                                />
                              </div>
                              <div>
                                <label className="block font-bold text-slate-700 mb-1">Бодови:</label>
                                <input
                                  type="number"
                                  min={1}
                                  max={10}
                                  value={q.points}
                                  onChange={(e) => handleUpdateQuestion(q.id, { points: Number(e.target.value) || 2 })}
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Чекор-по-чекор решение со LaTeX:</label>
                              <textarea
                                rows={2}
                                value={q.solutionLatex}
                                onChange={(e) => handleUpdateQuestion(q.id, { solutionLatex: e.target.value })}
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                              />
                            </div>

                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => setEditingQuestionId(null)}
                                className="px-3 py-1 bg-indigo-600 text-white font-bold rounded-lg text-xs"
                              >
                                Зачувај
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Приказ со KaTeX */
                          <div className="space-y-2.5 text-xs">
                            <div className="p-3 bg-slate-50/70 rounded-xl text-slate-900 border border-slate-100">
                              <LatexRenderer content={q.questionLatex} />
                            </div>

                            {/* Клуч / Точен одговор (Истакнат за наставникот) */}
                            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-emerald-800">✅ Точен одговор:</span>
                                <span className="font-bold text-emerald-900 font-mono">{q.correctAnswerText}</span>
                              </div>
                              <span className="text-[11px] text-emerald-700 font-medium">Клуч: {q.points} бод.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Футер со главни дејства */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-bold text-slate-800">
              Вкупно: {questions.length} задачи ({totalPoints} бодови)
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">
              Вклучен QR Клуч со решенија {isPinProtected ? `(PIN: ${pinCode})` : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Откажи
            </button>

            {/* Копче: Креирај и директно отвори печатење */}
            <button
              type="button"
              onClick={() => handleFinalCreateQuiz(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Создај го квизот и веднаш отвори го дијалогот за печатење А4 работен лист"
            >
              <Printer className="w-4 h-4" />
              <span>Креирај & Печати</span>
            </button>

            {/* Копче: Креирај во папка */}
            <button
              type="button"
              onClick={() => handleFinalCreateQuiz(false)}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Зачувај Квиз & Клуч (QR)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
