import React, { useState } from 'react';
import { EducationalQRCode, EducationalFolder, Language, QRCodeType, BloomLevel, GardnerIntelligence, ScaffoldingStep, QRThemePreset, QRPatternStyle, CustomTag } from '../types';
import { translations } from '../i18n/translations';
import { getStoredCustomTags, saveOrUpdateCustomTag } from '../services/storage';
import { LatexRenderer } from './LatexRenderer';
import { LatexToolbar } from './LatexToolbar';
import { VygotskyScaffoldingBuilder } from './VygotskyScaffoldingBuilder';
import { BloomTaxonomySelector } from './BloomTaxonomySelector';
import { GardnerIntelligencesSelector } from './GardnerIntelligencesSelector';
import { QRCodePreview } from './QRCodePreview';
import { TemplateLibraryModal } from './TemplateLibraryModal';
import { LatexTemplate } from '../data/latexTemplates';
import { EDUCATIONAL_SUBJECTS, PRIMARY_GRADE_OPTIONS, SECONDARY_GRADE_OPTIONS } from '../data/educationalSubjects';
import { 
  X, 
  Save, 
  Sparkles, 
  Lock, 
  Palette, 
  Upload, 
  FileText, 
  QrCode, 
  Layers, 
  Brain, 
  Compass, 
  Link as LinkIcon, 
  Wifi, 
  FileCheck,
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  Folder,
  Calculator,
  Circle,
  Square,
  Shapes,
  Grid,
  History,
  RotateCcw,
  Clock,
  Tag,
  PlusCircle,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2,
  Eye,
  EyeOff,
  Pipette,
  Settings
} from 'lucide-react';

interface QRCodeEditorModalProps {
  initialItem?: EducationalQRCode | null;
  folders?: EducationalFolder[];
  language: Language;
  onSave: (item: EducationalQRCode) => void;
  onClose: () => void;
  onSwitchToWizard?: () => void;
  onOpenTagManager?: () => void;
}

export const QRCodeEditorModal: React.FC<QRCodeEditorModalProps> = ({
  initialItem,
  folders = [],
  language,
  onSave,
  onClose,
  onSwitchToWizard,
  onOpenTagManager
}) => {
  const t = translations[language];

  // Основна состојба
  const [formData, setFormData] = useState<EducationalQRCode>(() => {
    if (initialItem) return JSON.parse(JSON.stringify(initialItem));
    
    // Генерирање нов примерок
    const uniqueSlug = 'math' + Math.floor(100 + Math.random() * 900);
    return {
      id: `qr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      shortCode: uniqueSlug,
      title: '',
      description: '',
      type: 'math_latex',
      createdAt: new Date().toISOString().split('T')[0],
      subject: 'Математика',
      targetGrade: '8-мо одделение',
      latexContent: 'Реши ја равенката: $$2x + 5 = 15$$ и одреди ја вредноста на $x$.',
      solutionLatex: '$$2x = 15 - 5$$\n$$2x = 10$$\n$$x = 5$$',
      scaffoldingSteps: [
        {
          id: 'step-1',
          stepNumber: 1,
          title: 'Насока 1: Пренесување на константите',
          contentWithLatex: 'Префрли го бројот $+5$ од десната страна со спротивен знак: $2x = 15 - 5$',
          revealedByDefault: false
        }
      ],
      bloomLevel: 'apply',
      bloomObjectives: 'Примена на основни алгебарски операции за решавање линеарна равенка.',
      gardnerIntelligence: 'logical_mathematical',
      gardnerActivityType: 'Логичко решавање',
      targetUrl: '',
      style: {
        fgColor: '#1e3a8a',
        bgColor: '#ffffff',
        errorCorrectionLevel: 'Q',
        iconType: 'math',
        margin: 2,
        size: 240
      },
      scanCount: 0,
      requiresPin: false,
      pinCode: ''
    };
  });

  const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(null);
  const [checkpointLabel, setCheckpointLabel] = useState('');
  const [isSavingCheckpoint, setIsSavingCheckpoint] = useState(false);
  const [revertedMessage, setRevertedMessage] = useState<string | null>(null);
  const [customTagInput, setCustomTagInput] = useState('');
  const [customTagColor, setCustomTagColor] = useState('#8b5cf6');
  const [availableCustomTags, setAvailableCustomTags] = useState<CustomTag[]>(() => getStoredCustomTags());
  const [showAddTagInput, setShowAddTagInput] = useState(false);

  const handleSelectTemplate = (template: LatexTemplate) => {
    const titleText = template.title[language] || template.title.mk;
    setFormData((prev) => ({
      ...prev,
      title: prev.title.trim() ? prev.title : titleText,
      latexContent: template.latexSnippet,
      solutionLatex: template.solutionLatex || prev.solutionLatex,
      subject: prev.subject.trim() ? prev.subject : template.subject,
      targetGrade: prev.targetGrade.trim() ? prev.targetGrade : template.targetGrade,
      bloomLevel: template.bloomLevel || prev.bloomLevel,
      gardnerIntelligence: template.gardnerIntelligence || prev.gardnerIntelligence,
      scaffoldingSteps: template.scaffoldingSteps || prev.scaffoldingSteps,
      type: template.scaffoldingSteps && template.scaffoldingSteps.length > 0 ? 'vygotsky_scaffold' : prev.type,
    }));
  };

  const handleInsertSnippet = (snippet: string) => {
    setFormData(prev => ({
      ...prev,
      latexContent: prev.latexContent ? `${prev.latexContent} ${snippet}` : snippet
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        fileType: file.type || 'application/octet-stream',
        fileDataUrl: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCheckpoint = () => {
    const newVersion = {
      id: `ver-${Date.now()}`,
      timestamp: new Date().toLocaleString(language === 'mk' ? 'mk-MK' : language === 'sq' ? 'sq-AL' : 'en-US', {
        dateStyle: 'short',
        timeStyle: 'short'
      }),
      label: checkpointLabel.trim() || (language === 'mk' ? 'Рачна контролна точка' : 'Manual Checkpoint'),
      latexContent: formData.latexContent,
      solutionLatex: formData.solutionLatex,
      scaffoldingSteps: formData.scaffoldingSteps ? JSON.parse(JSON.stringify(formData.scaffoldingSteps)) : [],
      title: formData.title,
      changeSummary: `${formData.scaffoldingSteps?.length || 0} ${language === 'mk' ? 'чекори' : 'steps'}, LaTeX: ${formData.latexContent.substring(0, 35)}...`
    };

    setFormData((prev) => ({
      ...prev,
      versionHistory: [newVersion, ...(prev.versionHistory || [])]
    }));
    setCheckpointLabel('');
    setIsSavingCheckpoint(false);
  };

  const handleRevertToVersion = (version: any, target: 'all' | 'latex' | 'scaffolding' = 'all') => {
    if (!window.confirm(t.restoreConfirm)) return;

    // Автоматски бекап од тековната состојба пред враќање
    const backupVersion = {
      id: `ver-auto-${Date.now()}`,
      timestamp: new Date().toLocaleString(language === 'mk' ? 'mk-MK' : language === 'sq' ? 'sq-AL' : 'en-US', {
        dateStyle: 'short',
        timeStyle: 'short'
      }),
      label: language === 'mk' ? 'Автоматски бекап (пред враќање)' : 'Auto-backup before revert',
      latexContent: formData.latexContent,
      solutionLatex: formData.solutionLatex,
      scaffoldingSteps: formData.scaffoldingSteps ? JSON.parse(JSON.stringify(formData.scaffoldingSteps)) : [],
      title: formData.title,
      changeSummary: language === 'mk' ? 'Состојба пред враќање на претходна верзија' : 'State before restoring earlier revision'
    };

    setFormData((prev) => {
      const next = {
        ...prev,
        versionHistory: [backupVersion, ...(prev.versionHistory || [])]
      };

      if (target === 'all' || target === 'latex') {
        next.latexContent = version.latexContent;
        next.solutionLatex = version.solutionLatex || '';
        if (version.title) next.title = version.title;
      }

      if (target === 'all' || target === 'scaffolding') {
        next.scaffoldingSteps = version.scaffoldingSteps ? JSON.parse(JSON.stringify(version.scaffoldingSteps)) : [];
      }

      return next;
    });

    const targetLabel = target === 'latex' 
      ? (language === 'mk' ? 'LaTeX формула' : language === 'sq' ? 'Formula LaTeX' : 'LaTeX content')
      : target === 'scaffolding'
      ? (language === 'mk' ? 'скалирани чекори' : language === 'sq' ? 'hapa shkallëzimi' : 'scaffolding steps')
      : (language === 'mk' ? 'LaTeX и чекори' : language === 'sq' ? 'LaTeX dhe hapa' : 'LaTeX & steps');

    setRevertedMessage(`${t.revertSuccess} [${targetLabel}] (${version.label || version.timestamp})`);
    setTimeout(() => setRevertedMessage(null), 5000);
  };

  const handleDeleteVersion = (versionId: string) => {
    if (!window.confirm(t.deleteVersionConfirm)) return;
    setFormData((prev) => ({
      ...prev,
      versionHistory: (prev.versionHistory || []).filter((v) => v.id !== versionId)
    }));
  };

  const handleAddCustomTag = () => {
    if (!customTagInput.trim()) return;
    const cleanId = customTagInput
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_а-шђјљњћџ]/gi, '');
    
    const tagId = cleanId || `tag_${Date.now()}`;
    const newTagObj: CustomTag = {
      id: tagId,
      label: customTagInput.trim(),
      color: customTagColor || '#8b5cf6',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedTags = saveOrUpdateCustomTag(newTagObj);
    setAvailableCustomTags(updatedTags);

    const existing = formData.tags || [];
    if (!existing.includes(tagId)) {
      setFormData({ ...formData, tags: [...existing, tagId] });
    }
    setCustomTagInput('');
    setShowAddTagInput(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      formData.title = language === 'mk' ? 'Математичка задача' : 'Math Task';
    }
    if (!formData.shortCode.trim()) {
      formData.shortCode = 'task' + Math.floor(100 + Math.random() * 900);
    }

    // Автоматски запис во историја на верзии ако има измени на формулата или скалирањето
    if (initialItem && (initialItem.latexContent !== formData.latexContent || JSON.stringify(initialItem.scaffoldingSteps) !== JSON.stringify(formData.scaffoldingSteps))) {
      const autoSaveVersion = {
        id: `ver-save-${Date.now()}`,
        timestamp: new Date().toLocaleString(language === 'mk' ? 'mk-MK' : language === 'sq' ? 'sq-AL' : 'en-US', {
          dateStyle: 'short',
          timeStyle: 'short'
        }),
        label: language === 'mk' ? 'Верзија пред измена' : 'Version before edit',
        latexContent: initialItem.latexContent,
        solutionLatex: initialItem.solutionLatex,
        scaffoldingSteps: initialItem.scaffoldingSteps ? JSON.parse(JSON.stringify(initialItem.scaffoldingSteps)) : [],
        title: initialItem.title,
        changeSummary: language === 'mk' ? 'Автоматски архивирана ревизија' : 'Auto-archived revision'
      };
      formData.versionHistory = [autoSaveVersion, ...(formData.versionHistory || [])];
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Хедер */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {initialItem ? t.updateQr : t.newQr}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'mk' ? 'Креирање педагошки структуриран QR код со LaTeX' : 'Creating pedagogically structured QR code with LaTeX'}
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

        {/* Интерактивна покана за водич за нови наставници */}
        {onSwitchToWizard && (
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border-b border-indigo-100 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-indigo-950 font-medium">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Првпат креирате образовен QR код за вашиот час? Сакате педагошко водство?</span>
            </div>
            <button
              type="button"
              onClick={onSwitchToWizard}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-2xs text-[11px]"
            >
              Стартувај интерактивен водич за часот →
            </button>
          </div>
        )}

        {/* Форма за внес */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Лева и средна колона: Податоци за задачата */}
            <div className="lg:col-span-2 space-y-5">
              {/* Избор на тип на QR код */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {language === 'mk' ? 'Тип на образовен QR код:' : 'Educational QR Code Type:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { type: 'math_latex', label: 'LaTeX Задача', icon: Sparkles, color: 'text-indigo-600' },
                      { type: 'vygotsky_scaffold', label: 'Виготски Скалирање', icon: Layers, color: 'text-blue-600' },
                      { type: 'bloom_taxonomy', label: 'Блумова Таксономија', icon: Brain, color: 'text-amber-600' },
                      { type: 'gardner_multiple', label: 'Гарднер Интелигенции', icon: Compass, color: 'text-emerald-600' },
                      { type: 'short_url', label: 'Скратен Линк', icon: LinkIcon, color: 'text-purple-600' },
                      { type: 'document_file', label: 'Наставен Лист/Фајл', icon: FileText, color: 'text-rose-600' },
                      { type: 'quick_text', label: 'Брз Текст', icon: FileCheck, color: 'text-slate-600' },
                      { type: 'wifi_access', label: 'WiFi Мрежа', icon: Wifi, color: 'text-teal-600' },
                    ] as const
                  ).map(opt => {
                    const isSelected = formData.type === opt.type;
                    const IconComp = opt.icon;
                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: opt.type })}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-400 font-semibold shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <IconComp className={`w-4 h-4 mb-1.5 ${opt.color}`} />
                        <span className="text-xs">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Основни податоци: Наслов, предмет, одделение */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.titleLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t.titlePlaceholder}
                    className="w-full text-xs font-medium px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.shortSlugLabel} *
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-[10px] font-mono text-slate-400">edu://</span>
                    <input
                      type="text"
                      required
                      value={formData.shortCode}
                      onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                      placeholder="geo302"
                      className="w-full text-xs font-mono font-bold pl-12 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {t.subjectLabel}
                    </label>
                  </div>
                  <input
                    type="text"
                    list="subject-suggestions"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Математика, Физика, Хемија, Биологија..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <datalist id="subject-suggestions">
                    {EDUCATIONAL_SUBJECTS.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.icon} {s.category === 'primary' ? 'Основно' : s.category === 'secondary' ? 'Средно' : 'Основно & Средно'}
                      </option>
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.gradeLabel}
                  </label>
                  <input
                    type="text"
                    list="grade-suggestions"
                    value={formData.targetGrade}
                    onChange={(e) => setFormData({ ...formData, targetGrade: e.target.value })}
                    placeholder="7-мо одделение, I година"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <datalist id="grade-suggestions">
                    {PRIMARY_GRADE_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        Основно образование
                      </option>
                    ))}
                    {SECONDARY_GRADE_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        Средно образование
                      </option>
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Folder className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Папка / Проект:</span>
                  </label>
                  <select
                    value={formData.folderId || ''}
                    onChange={(e) => setFormData({ ...formData, folderId: e.target.value || undefined })}
                    className="w-full text-xs font-medium px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
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

              {/* Брзи копчиња за предмети од основно и средно образование */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
                  <span>🎓</span>
                  <span>{t.quickPickSubject}</span>
                </span>
                {EDUCATIONAL_SUBJECTS.slice(0, 9).map((subj) => {
                  const isSelected = formData.subject === subj.name;
                  return (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          subject: subj.name,
                          style: {
                            ...prev.style,
                            fgColor: prev.style.fgColor === '#1e1b4b' || !prev.style.fgColor ? subj.defaultColor : prev.style.fgColor
                          }
                        }));
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                      }`}
                    >
                      <span>{subj.icon}</span>
                      <span>{subj.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Педагошки ознаки (Educational Tags: Exam Prep, Homework, In-class Activity) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {t.tagsTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {onOpenTagManager && (
                      <button
                        type="button"
                        onClick={onOpenTagManager}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer"
                        title={t.tagManagerTitle || 'Менаџер на ознаки'}
                      >
                        <Settings className="w-3 h-3" />
                        <span>{t.tagManagerBtn || 'Менаџер на ознаки'}</span>
                      </button>
                    )}
                    <span className="text-[10px] text-slate-500 hidden sm:inline">
                      {t.tagsSubtitle}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Стандардни системски ознаки */}
                  {[
                    { id: 'exam_prep', label: t.tagExamPrep, icon: '📝', bgActive: 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300' },
                    { id: 'homework', label: t.tagHomework, icon: '🏠', bgActive: 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-300' },
                    { id: 'in_class', label: t.tagInClass, icon: '🏫', bgActive: 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-300' },
                    { id: 'competition', label: t.tagCompetition, icon: '🏆', bgActive: 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-300' },
                    { id: 'group_work', label: t.tagGroupWork, icon: '👥', bgActive: 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-300' },
                  ].map((presetTag) => {
                    const isSelected = (formData.tags || []).includes(presetTag.id);
                    return (
                      <button
                        key={presetTag.id}
                        type="button"
                        onClick={() => {
                          const current = formData.tags || [];
                          const updated = isSelected
                            ? current.filter(tag => tag !== presetTag.id)
                            : [...current, presetTag.id];
                          setFormData({ ...formData, tags: updated });
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? presetTag.bgActive + ' shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs">{presetTag.icon}</span>
                        <span>{presetTag.label}</span>
                      </button>
                    );
                  })}

                  {/* Прилагодени сопствени ознаки (Со сопствени бои) */}
                  {(formData.tags || [])
                    .filter(tag => !['exam_prep', 'homework', 'in_class', 'competition', 'group_work'].includes(tag))
                    .map(customTagId => {
                      const tagDef = availableCustomTags.find(t => t.id === customTagId);
                      const tagColor = tagDef?.color || '#8b5cf6';
                      const tagLabel = tagDef?.label || customTagId;

                      return (
                        <span
                          key={customTagId}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border shadow-2xs"
                          style={{
                            backgroundColor: `${tagColor}15`,
                            borderColor: `${tagColor}50`,
                            color: tagColor
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: tagColor }}
                          />
                          <span>{tagLabel}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (formData.tags || []).filter(t => t !== customTagId);
                              setFormData({ ...formData, tags: updated });
                            }}
                            className="hover:opacity-75 ml-1 font-bold text-sm cursor-pointer"
                            title="Отстрани ознака"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}

                  {/* Други достапни сопствени ознаки кои сѐ уште не се избрани за оваа задача */}
                  {availableCustomTags
                    .filter(t => !(formData.tags || []).includes(t.id))
                    .map(unselectedTag => (
                      <button
                        key={unselectedTag.id}
                        type="button"
                        onClick={() => {
                          const current = formData.tags || [];
                          setFormData({ ...formData, tags: [...current, unselectedTag.id] });
                        }}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-dashed hover:border-solid transition flex items-center gap-1.5 cursor-pointer bg-white"
                        style={{
                          borderColor: `${unselectedTag.color}60`,
                          color: unselectedTag.color
                        }}
                        title="Кликни за да ја додадеш оваа ознака"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: unselectedTag.color }}
                        />
                        <span>+ {unselectedTag.label}</span>
                      </button>
                    ))}

                  {/* Копче за креирање нова сопствена ознака со избор на боја */}
                  {showAddTagInput ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 bg-white rounded-xl border border-indigo-300 shadow-xs">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                          style={{ backgroundColor: customTagColor }}
                        />
                        <input
                          type="text"
                          value={customTagInput}
                          onChange={(e) => setCustomTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomTag();
                            }
                          }}
                          placeholder={language === 'mk' ? 'назив на ознака' : 'tag name'}
                          className="px-2.5 py-1 text-xs border border-indigo-400 rounded-lg focus:outline-hidden bg-white w-32 font-medium"
                          autoFocus
                        />
                      </div>

                      {/* Палета на бои за ознаката */}
                      <div className="flex items-center gap-1">
                        {['#8b5cf6', '#0d9488', '#ea580c', '#e11d48', '#d97706', '#4f46e5', '#059669', '#0284c7'].map(color => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setCustomTagColor(color)}
                            className={`w-4 h-4 rounded-full transition cursor-pointer ${
                              customTagColor === color ? 'ring-2 ring-indigo-500 scale-125' : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handleAddCustomTag}
                          className="p-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                          title="Додај ознака"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddTagInput(false);
                            setCustomTagInput('');
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAddTagInput(true)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/50 transition flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{t.addCustomTag}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Уредувач на LaTeX со лента за брзи симболи */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    {t.latexFormulaLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsTemplateLibraryOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-[11px] font-bold rounded-lg shadow-2xs hover:shadow transition cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>{t.templateLibraryTitle}</span>
                  </button>
                </div>

                <LatexToolbar onInsert={handleInsertSnippet} language={language} />

                <textarea
                  rows={3}
                  value={formData.latexContent}
                  onChange={(e) => setFormData({ ...formData, latexContent: e.target.value })}
                  placeholder="Внесете текст и математички равенки..."
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />

                {/* Инстантен KaTeX преглед */}
                {formData.latexContent && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      {language === 'mk' ? 'Инстантен приказ на математиката (KaTeX):' : 'Instant Math Preview (KaTeX):'}
                    </span>
                    <LatexRenderer content={formData.latexContent} />
                  </div>
                )}
              </div>

              {/* Конечно решение (со LaTeX) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.solutionLabel}
                </label>
                <textarea
                  rows={2}
                  value={formData.solutionLatex || ''}
                  onChange={(e) => setFormData({ ...formData, solutionLatex: e.target.value })}
                  placeholder="Официјален чекор-по-чекор одговор за проверка..."
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Повратна порака при враќање на верзија */}
              {revertedMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{revertedMessage}</span>
                </div>
              )}

              {/* Историја на верзии (Version History Component) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="p-3.5 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-50 via-indigo-50/30 to-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                      <History className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {t.versionHistoryTitle}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-indigo-100 text-indigo-700">
                          {(formData.versionHistory || []).length} {language === 'mk' ? 'ревизии' : 'versions'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {t.versionHistorySubtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSavingCheckpoint(!isSavingCheckpoint)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-indigo-700 text-[11px] font-bold rounded-lg transition shadow-2xs cursor-pointer"
                      title={t.saveCheckpoint}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t.saveCheckpoint}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsVersionHistoryOpen(!isVersionHistoryOpen)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      aria-label="Toggle Version History"
                    >
                      {isVersionHistoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Внесување на нова контролна точка */}
                {isSavingCheckpoint && (
                  <div className="p-3 bg-indigo-50/70 border-b border-indigo-100 flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      value={checkpointLabel}
                      onChange={(e) => setCheckpointLabel(e.target.value)}
                      placeholder={language === 'mk' ? 'Опис на верзијата (на пр: Варијанта со квадратен корен)...' : 'Checkpoint note (e.g., Variant with square root)...'}
                      className="w-full text-xs px-3 py-1.5 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                    <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={handleSaveCheckpoint}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Зачувај</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsSavingCheckpoint(false)}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                      >
                        Откажи
                      </button>
                    </div>
                  </div>
                )}

                {/* Листа со претходни верзии */}
                {isVersionHistoryOpen && (
                  <div className="p-3.5 space-y-2.5 max-h-64 overflow-y-auto">
                    {(!formData.versionHistory || formData.versionHistory.length === 0) ? (
                      <div className="text-center py-4 text-xs text-slate-400 italic">
                        {t.noVersionsYet}
                      </div>
                    ) : (
                      formData.versionHistory.map((ver, idx) => {
                        const versionKey = ver.id || `ver-${idx}`;
                        const isExpanded = expandedVersionId === versionKey;
                        const isLatexDifferent = ver.latexContent !== formData.latexContent || (ver.solutionLatex || '') !== (formData.solutionLatex || '');
                        const isScaffoldingDifferent = JSON.stringify(ver.scaffoldingSteps || []) !== JSON.stringify(formData.scaffoldingSteps || []);

                        return (
                          <div
                            key={versionKey}
                            className={`bg-white border rounded-2xl transition space-y-2.5 p-3.5 shadow-2xs ${
                              isExpanded ? 'border-indigo-400 ring-2 ring-indigo-50/80' : 'border-slate-200 hover:border-indigo-300'
                            }`}
                          >
                            {/* Горна лента со информации и брзи дејства */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-[10px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                                  #{formData.versionHistory!.length - idx}
                                </span>
                                <span className="font-bold text-xs text-slate-800">
                                  {ver.label || (language === 'mk' ? 'Зачувана ревизија' : 'Saved revision')}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  • {ver.timestamp}
                                </span>

                                {/* Диф индикатори */}
                                {isLatexDifferent && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                    {t.latexDiffers}
                                  </span>
                                )}
                                {isScaffoldingDifferent && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                                    {t.scaffoldDiffers}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 ml-auto">
                                <button
                                  type="button"
                                  onClick={() => setExpandedVersionId(isExpanded ? null : versionKey)}
                                  className="flex items-center gap-1 px-2 py-1 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                                  title={isExpanded ? t.hideVersionDetails : t.previewVersionDetails}
                                >
                                  {isExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  <span className="hidden sm:inline">{isExpanded ? t.hideVersionDetails : t.previewVersionDetails}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteVersion(ver.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                  title={t.deleteVersion}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Краток преглед на LaTeX содржина */}
                            <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 text-xs text-slate-700 space-y-2">
                              <div className="font-mono text-[11px] bg-white p-2 rounded-lg border border-slate-200 overflow-hidden line-clamp-2">
                                {ver.latexContent}
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-indigo-700 flex items-center gap-1">
                                    <Layers className="w-3 h-3" />
                                    <span>{ver.scaffoldingSteps?.length || 0} {language === 'mk' ? 'чекори' : 'steps'}</span>
                                  </span>
                                  {ver.changeSummary && <span className="text-slate-400">• {ver.changeSummary}</span>}
                                </div>
                              </div>
                            </div>

                            {/* Расклопен детален приказ со KaTeX рендерирање */}
                            {isExpanded && (
                              <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/30 border border-indigo-100 rounded-xl p-3 space-y-3">
                                <div>
                                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 mb-1">
                                    {language === 'mk' ? 'LaTeX рендерирање на формулата:' : 'Formula LaTeX Render:'}
                                  </div>
                                  <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                                    <LatexRenderer content={ver.latexContent} />
                                  </div>
                                </div>

                                {ver.solutionLatex && (
                                  <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 mb-1">
                                      {language === 'mk' ? 'Чекор-по-чекор решение:' : 'Solution LaTeX:'}
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs text-xs">
                                      <LatexRenderer content={ver.solutionLatex} />
                                    </div>
                                  </div>
                                )}

                                {ver.scaffoldingSteps && ver.scaffoldingSteps.length > 0 && (
                                  <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-purple-900 mb-1.5 flex items-center gap-1">
                                      <Layers className="w-3.5 h-3.5 text-purple-600" />
                                      <span>{language === 'mk' ? `Скалирани чекори по Виготски (${ver.scaffoldingSteps.length}):` : `Vygotsky Scaffolding Steps (${ver.scaffoldingSteps.length}):`}</span>
                                    </div>
                                    <div className="space-y-1.5">
                                      {ver.scaffoldingSteps.map((s, sIdx) => (
                                        <div key={s.id || sIdx} className="bg-white p-2 rounded-lg border border-purple-100 text-xs text-slate-700">
                                          <div className="font-semibold text-purple-800 text-[11px]">
                                            #{s.stepNumber || sIdx + 1}: {s.title}
                                          </div>
                                          <div className="text-[11px] text-slate-600 mt-1">
                                            <LatexRenderer content={s.contentWithLatex} />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Копчиња за враќање наназад (Гранично враќање) */}
                            <div className="pt-1 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100">
                              <span className="text-[10px] text-slate-400 mr-auto font-medium">
                                {language === 'mk' ? 'Опции за враќање:' : 'Revert options:'}
                              </span>

                              {/* Врати само LaTeX */}
                              <button
                                type="button"
                                onClick={() => handleRevertToVersion(ver, 'latex')}
                                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                title="Врати ја само математичката LaTeX формула и решението"
                              >
                                <RotateCcw className="w-3 h-3 text-blue-600" />
                                <span>{t.revertLatexOnly}</span>
                              </button>

                              {/* Врати само чекори */}
                              <button
                                type="button"
                                onClick={() => handleRevertToVersion(ver, 'scaffolding')}
                                className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                title="Врати ги само скалираните чекори на помош (ZPD)"
                              >
                                <Layers className="w-3 h-3 text-purple-600" />
                                <span>{t.revertStepsOnly}</span>
                              </button>

                              {/* Врати сè (комплетно) */}
                              <button
                                type="button"
                                onClick={() => handleRevertToVersion(ver, 'all')}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                                title="Врати ги и формулите и сите чекори на помош"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-white" />
                                <span>{t.revertAll}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Ако е избран Виготски: Скалирање (Scaffolding Builder) */}
              {(formData.type === 'vygotsky_scaffold' || (formData.scaffoldingSteps && formData.scaffoldingSteps.length > 0)) && (
                <VygotskyScaffoldingBuilder
                  steps={formData.scaffoldingSteps || []}
                  onChange={(steps) => setFormData({ ...formData, scaffoldingSteps: steps })}
                  language={language}
                />
              )}

              {/* Ако е избрана Блумова таксономија */}
              {formData.type === 'bloom_taxonomy' && (
                <BloomTaxonomySelector
                  value={formData.bloomLevel}
                  objectives={formData.bloomObjectives}
                  onChange={(lvl, obj) => setFormData({ ...formData, bloomLevel: lvl, bloomObjectives: obj })}
                  language={language}
                />
              )}

              {/* Ако се избрани Гарднер интелигенции */}
              {formData.type === 'gardner_multiple' && (
                <GardnerIntelligencesSelector
                  value={formData.gardnerIntelligence}
                  activityType={formData.gardnerActivityType}
                  onChange={(intel, act) => setFormData({ ...formData, gardnerIntelligence: intel, gardnerActivityType: act })}
                  language={language}
                />
              )}

              {/* Ако е фајл или документ */}
              {formData.type === 'document_file' && (
                <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-rose-600" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase">
                      {t.fileUploadLabel}
                    </h4>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-600 file:text-white hover:file:bg-rose-700 cursor-pointer"
                  />
                  {formData.fileName && (
                    <div className="text-xs text-rose-900 font-medium">
                      ✓ {t.fileSelected}: <strong>{formData.fileName}</strong> ({formData.fileSize})
                    </div>
                  )}
                </div>
              )}

              {/* Ако е скратен линк или надворешна алатка */}
              {(formData.type === 'short_url' || formData.targetUrl) && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    {t.targetUrlLabel}
                  </label>
                  <input
                    type="url"
                    value={formData.targetUrl || ''}
                    onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                    placeholder="https://www.geogebra.org/... или линк до лекција"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              )}

              {/* Ако е WiFi */}
              {formData.type === 'wifi_access' && (
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">SSID Назив на мрежа:</label>
                    <input
                      type="text"
                      value={formData.wifiSsid || ''}
                      onChange={(e) => setFormData({ ...formData, wifiSsid: e.target.value })}
                      placeholder="Ucilnica_Matematika"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Лозинка за мрежа:</label>
                    <input
                      type="text"
                      value={formData.wifiPassword || ''}
                      onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
                      placeholder="Lozinka123"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Заштита со PIN код */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-800">{t.pinLabel}</span>
                    <p className="text-[11px] text-slate-500">
                      {language === 'mk' ? 'Учениците ќе мора да внесат PIN за да ја видат содржината' : 'Students must enter this PIN to unlock'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requirePinCheck"
                    checked={formData.requiresPin || false}
                    onChange={(e) => setFormData({ ...formData, requiresPin: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  {formData.requiresPin && (
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.pinCode || ''}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                      placeholder={t.pinPlaceholder}
                      className="w-24 text-xs font-mono font-bold text-center px-2 py-1 border border-slate-300 rounded-lg bg-white"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Десна колона: QR Стилови и интерактивен преглед во живо */}
            <div className="space-y-5 lg:border-l lg:border-slate-200 lg:pl-6">
              <div className="text-center">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  {language === 'mk' ? 'Преглед на QR кодот во живо' : 'Live QR Code Preview'}
                </span>

                <QRCodePreview
                  item={formData}
                  language={language}
                  showActions={true}
                />
              </div>

              {/* Поставки за дизајн на QR */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase">
                      {t.schoolBranding}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const curFg = formData.style?.fgColor || '#1e3a8a';
                      const curBg = formData.style?.bgColor || '#ffffff';
                      setFormData({
                        ...formData,
                        style: {
                          ...formData.style,
                          fgColor: curBg,
                          bgColor: curFg
                        }
                      });
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-lg transition"
                    title="Замени ги боите на предница и позадина"
                  >
                    <ArrowLeftRight className="w-3 h-3" />
                    <span>Замени бои</span>
                  </button>
                </div>

                {/* Тематски палети по наставни предмети (Subject Area Color Themes) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>{t.subjectThemes}</span>
                    <span className="text-[10px] text-indigo-600 font-semibold normal-case">
                      {language === 'mk' ? 'Разликување по предмети' : 'Subject distinction'}
                    </span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {[
                      { id: 'math_indigo', name: t.themeMath, iconEmoji: '📐', fg: '#1e1b4b', bg: '#ffffff', icon: 'math' },
                      { id: 'science_emerald', name: t.themeScience, iconEmoji: '🔬', fg: '#064e3b', bg: '#f0fdf4', icon: 'atom' },
                      { id: 'physics_cyan', name: t.themePhysics, iconEmoji: '⚛️', fg: '#083344', bg: '#ecfeff', icon: 'atom' },
                      { id: 'geometry_amber', name: t.themeGeometry, iconEmoji: '📏', fg: '#78350f', bg: '#fffbeb', icon: 'math' },
                      { id: 'chemistry_rose', name: t.themeChemistry, iconEmoji: '🧪', fg: '#881337', bg: '#fff1f2', icon: 'atom' },
                      { id: 'literature_purple', name: t.themeLiterature, iconEmoji: '📚', fg: '#581c87', bg: '#faf5ff', icon: 'book' },
                      { id: 'computer_slate', name: t.themeComputer, iconEmoji: '💻', fg: '#0f172a', bg: '#f8fafc', icon: 'lightbulb' },
                      { id: 'warm_papyrus', name: t.themePapyrus, iconEmoji: '📜', fg: '#18181b', bg: '#fefce8', icon: 'school' },
                      { id: 'high_contrast', name: t.themeContrast, iconEmoji: '🔲', fg: '#000000', bg: '#ffffff', icon: 'none' },
                    ].map((pal) => {
                      const isApplied = formData.style?.fgColor === pal.fg && formData.style?.bgColor === pal.bg;
                      return (
                        <button
                          key={pal.id}
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            style: { 
                              ...formData.style, 
                              fgColor: pal.fg, 
                              bgColor: pal.bg,
                              themePreset: pal.id as QRThemePreset,
                              iconType: pal.icon as any
                            }
                          })}
                          className={`flex items-center justify-between p-2 rounded-xl border text-left text-xs transition cursor-pointer ${
                            isApplied
                              ? 'bg-white border-indigo-500 ring-2 ring-indigo-400 font-bold shadow-2xs'
                              : 'bg-white/80 border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-sm shrink-0">{pal.iconEmoji}</span>
                            <span className="truncate text-[11px]">{pal.name}</span>
                          </div>
                          <div className="w-4 h-4 rounded-full border border-slate-300 flex overflow-hidden shrink-0 ml-1.5 shadow-2xs">
                            <span className="w-1/2 h-full" style={{ backgroundColor: pal.fg }} />
                            <span className="w-1/2 h-full" style={{ backgroundColor: pal.bg }} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Стил на QR матрицата (QR Pattern Style) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.qrPatternStyle}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {[
                      { id: 'standard', name: t.patternStandard, icon: Square, desc: '90°' },
                      { id: 'dots', name: t.patternDots, icon: Circle, desc: '● Dots' },
                      { id: 'rounded', name: t.patternRounded, icon: Shapes, desc: '▢ Soft' },
                      { id: 'classy', name: t.patternClassy, icon: Sparkles, desc: '◆ Diamond' },
                      { id: 'mosaic', name: t.patternMosaic, icon: Grid, desc: '▤ Mosaic' },
                    ].map((pat) => {
                      const isSelected = (formData.style?.pattern || 'standard') === pat.id;
                      const IconComp = pat.icon;
                      return (
                        <button
                          key={pat.id}
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            style: { ...formData.style, pattern: pat.id as QRPatternStyle }
                          })}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs transition cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-400 font-bold text-indigo-900 shadow-2xs'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <IconComp className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                          <div className="truncate">
                            <div className="text-[11px] font-semibold truncate">{pat.name}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Интерактивен Избирач на бои (School & Classroom Color Picker) */}
                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Pipette className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{language === 'mk' ? 'Избирач на бои & Училишно брендирање' : 'Color Picker & School Branding'}</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">HEX & Swatches</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* 1. Боја на предница (Foreground / QR елементи) */}
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-800 font-bold flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: formData.style?.fgColor || '#1e3a8a' }} />
                          <span>{t.fgColor}</span>
                        </label>
                        <span className="font-mono text-[10px] text-slate-400">QR Матрица</span>
                      </div>

                      {/* Input со Eyedropper и Hex код */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-indigo-500">
                        <input
                          type="color"
                          value={formData.style?.fgColor || '#1e3a8a'}
                          onChange={(e) => setFormData({
                            ...formData,
                            style: { ...formData.style, fgColor: e.target.value }
                          })}
                          className="w-7 h-7 rounded-md cursor-pointer border border-slate-300 shrink-0 shadow-2xs"
                          title="Кликни за визуелен избирач на боја"
                        />
                        <input
                          type="text"
                          maxLength={7}
                          value={formData.style?.fgColor || '#1e3a8a'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData({
                              ...formData,
                              style: { ...formData.style, fgColor: val }
                            });
                          }}
                          className="w-full font-mono text-xs font-bold text-slate-800 uppercase focus:outline-hidden"
                          placeholder="#1E3A8A"
                        />
                      </div>

                      {/* Препорачани училишни бои за предница (School Swatches) */}
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block mb-1">
                          {language === 'mk' ? 'Училишни бои:' : 'School Swatches:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { color: '#000000', label: 'Црна' },
                            { color: '#1e1b4b', label: 'Оксфорд' },
                            { color: '#1e3a8a', label: 'Тегет' },
                            { color: '#0369a1', label: 'Кобалт' },
                            { color: '#065f46', label: 'Смарагд' },
                            { color: '#047857', label: 'Шумска' },
                            { color: '#831843', label: 'Бордо' },
                            { color: '#991b1b', label: 'Црвена' },
                            { color: '#78350f', label: 'Бронза' },
                            { color: '#6b21a8', label: 'Виолетова' },
                            { color: '#0f172a', label: 'Јаглен' },
                          ].map(s => {
                            const isActive = (formData.style?.fgColor || '').toLowerCase() === s.color.toLowerCase();
                            return (
                              <button
                                key={s.color}
                                type="button"
                                onClick={() => setFormData({
                                  ...formData,
                                  style: { ...formData.style, fgColor: s.color }
                                })}
                                className={`w-5 h-5 rounded-md border transition cursor-pointer shrink-0 ${
                                  isActive ? 'ring-2 ring-indigo-500 scale-110 border-white shadow-xs' : 'border-slate-300 hover:scale-105'
                                }`}
                                style={{ backgroundColor: s.color }}
                                title={`${s.label} (${s.color})`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* 2. Боја на позадина (Background / Површина) */}
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-800 font-bold flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: formData.style?.bgColor || '#ffffff' }} />
                          <span>{t.bgColor}</span>
                        </label>
                        <span className="font-mono text-[10px] text-slate-400">Позадина</span>
                      </div>

                      {/* Input со Eyedropper и Hex код */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-indigo-500">
                        <input
                          type="color"
                          value={formData.style?.bgColor || '#ffffff'}
                          onChange={(e) => setFormData({
                            ...formData,
                            style: { ...formData.style, bgColor: e.target.value }
                          })}
                          className="w-7 h-7 rounded-md cursor-pointer border border-slate-300 shrink-0 shadow-2xs"
                          title="Кликни за визуелен избирач на позадина"
                        />
                        <input
                          type="text"
                          maxLength={7}
                          value={formData.style?.bgColor || '#ffffff'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData({
                              ...formData,
                              style: { ...formData.style, bgColor: val }
                            });
                          }}
                          className="w-full font-mono text-xs font-bold text-slate-800 uppercase focus:outline-hidden"
                          placeholder="#FFFFFF"
                        />
                      </div>

                      {/* Препорачани училишни бои за позадина (Classroom Paper Swatches) */}
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block mb-1">
                          {language === 'mk' ? 'Училишна хартија:' : 'Classroom Paper:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { color: '#ffffff', label: 'Бела' },
                            { color: '#f8fafc', label: 'Светлосива' },
                            { color: '#fefce8', label: 'Папирус' },
                            { color: '#fffbeb', label: 'Крем' },
                            { color: '#f0fdf4', label: 'Мента' },
                            { color: '#ecfeff', label: 'Светлосина' },
                            { color: '#fff1f2', label: 'Розова' },
                            { color: '#faf5ff', label: 'Лаванда' },
                          ].map(s => {
                            const isActive = (formData.style?.bgColor || '').toLowerCase() === s.color.toLowerCase();
                            return (
                              <button
                                key={s.color}
                                type="button"
                                onClick={() => setFormData({
                                  ...formData,
                                  style: { ...formData.style, bgColor: s.color }
                                })}
                                className={`w-5 h-5 rounded-md border transition cursor-pointer shrink-0 ${
                                  isActive ? 'ring-2 ring-indigo-500 scale-110 border-indigo-400 shadow-xs' : 'border-slate-300 hover:scale-105'
                                }`}
                                style={{ backgroundColor: s.color }}
                                title={`${s.label} (${s.color})`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Индикатор за читливост и контраст (Readability / Contrast Ratio) */}
                {(() => {
                  const getLum = (hex: string) => {
                    let clean = (hex || '').replace('#', '');
                    if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
                    const num = parseInt(clean, 16);
                    if (isNaN(num)) return 0.5;
                    const r = ((num >> 16) & 255) / 255;
                    const g = ((num >> 8) & 255) / 255;
                    const b = (num & 255) / 255;
                    const [lr, lg, lb] = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
                    return lr * 0.2126 + lg * 0.7152 + lb * 0.0722;
                  };
                  const l1 = getLum(formData.style?.fgColor || '#1e3a8a');
                  const l2 = getLum(formData.style?.bgColor || '#ffffff');
                  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
                  const isGood = ratio >= 4.0;

                  return (
                    <div className={`p-2.5 rounded-xl border text-[11px] flex items-start gap-2 ${
                      isGood
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}>
                      {isGood ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{isGood ? 'Одличен контраст' : 'Низок контраст'}</span>
                          <span className="font-mono text-[10px] px-1.5 py-0.2 bg-white/80 rounded border border-current">
                            {ratio.toFixed(1)}:1
                          </span>
                        </div>
                        <p className="text-[10px] opacity-90 mt-0.5">
                          {isGood ? t.contrastGood : t.contrastLow}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Ниво на корекција на грешки */}
                <div>
                  <label className="block text-xs text-slate-600 mb-1">{t.correctionLevel}</label>
                  <select
                    value={formData.style?.errorCorrectionLevel || 'Q'}
                    onChange={(e) => setFormData({
                      ...formData,
                      style: { ...formData.style, errorCorrectionLevel: e.target.value as any }
                    })}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="L">Ниско (L - 7%) - Најчиста матрица</option>
                    <option value="M">Средно (M - 15%) - Стандардно</option>
                    <option value="Q">Високо (Q - 25%) - Препорачано со икона</option>
                    <option value="H">Највисоко (H - 30%) - Најбезбедно за печатење</option>
                  </select>
                </div>

                {/* Вградена образовна икона */}
                <div>
                  <label className="block text-xs text-slate-600 mb-1">{t.centerIcon}</label>
                  <select
                    value={formData.style?.iconType || 'math'}
                    onChange={(e) => setFormData({
                      ...formData,
                      style: { ...formData.style, iconType: e.target.value as any }
                    })}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="math">∑ Математички симбол (Сума)</option>
                    <option value="atom">⚛ Атом (Природни науки)</option>
                    <option value="book">📖 Книга (Лекција)</option>
                    <option value="lightbulb">💡 Сијалица (Идеја / Насока)</option>
                    <option value="school">🎓 Капа (Училиште)</option>
                    <option value="none">Без централна икона</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Копчиња за зачувување */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>{initialItem ? t.updateQr : t.saveQr}</span>
            </button>
          </div>
        </form>
      </div>

      {isTemplateLibraryOpen && (
        <TemplateLibraryModal
          isOpen={isTemplateLibraryOpen}
          language={language}
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setIsTemplateLibraryOpen(false)}
        />
      )}
    </div>
  );
};
