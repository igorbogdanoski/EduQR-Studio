import React, { useState, useEffect, useMemo } from 'react';
import { EducationalQRCode, EducationalFolder, Language, QRCodeType, BloomLevel, CustomTag } from './types';
import { translations } from './i18n/translations';
import { 
  getStoredQRCodes, 
  saveStoredQRCodes, 
  recordScan, 
  getStoredFolders, 
  saveStoredFolders,
  getStoredCustomTags,
  saveStoredCustomTags,
  renameTagGlobally,
  deleteTagGlobally,
  saveOrUpdateCustomTag
} from './services/storage';
import { Navbar, FontSizeOption } from './components/Navbar';
import { QRCodePreview } from './components/QRCodePreview';
import { LatexRenderer } from './components/LatexRenderer';
import { QRCodeEditorModal } from './components/QRCodeEditorModal';
import { StudentScanModal } from './components/StudentScanModal';
import { PrintWorksheetModal } from './components/PrintWorksheetModal';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { GuidedLessonWizardModal } from './components/GuidedLessonWizardModal';
import { FolderManager } from './components/FolderManager';
import { FolderEditorModal } from './components/FolderEditorModal';
import { SharedFolderModal } from './components/SharedFolderModal';
import { BloomTaxonomySummary } from './components/BloomTaxonomySummary';
import { BulkRenameModal } from './components/BulkRenameModal';
import { exportQRCodesToZip } from './services/zipExportService';
import { copyPngToClipboard } from './services/imageExportService';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { StudentEngagementView } from './components/StudentEngagementView';
import { TagManagerSidebar } from './components/TagManagerSidebar';
import { ScavengerHuntModal } from './components/ScavengerHuntModal';
import { MathQuizModal } from './components/MathQuizModal';
import { TeacherTestingGuideModal } from './components/TeacherTestingGuideModal';
import { BatchPdfImportModal } from './components/BatchPdfImportModal';
import { PresentationExportModal } from './components/PresentationExportModal';
import { EDUCATIONAL_SUBJECTS } from './data/educationalSubjects';
import { 
  Search, 
  Filter, 
  Layers, 
  Brain, 
  Compass, 
  Sparkles, 
  Zap, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  GraduationCap, 
  TrendingUp, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  Share2, 
  ArrowUpRight,
  Folder,
  FolderInput,
  Archive,
  CheckSquare,
  Square,
  Printer,
  Loader2,
  XCircle,
  Tag,
  X,
  Mic,
  SlidersHorizontal,
  LayoutGrid,
  BarChart3,
  FolderTree,
  RotateCcw,
  Trophy,
  Settings,
  Award,
  Monitor,
  Upload,
  ChevronUp,
  ChevronDown,
  Copy,
  FileQuestion,
  Key
} from 'lucide-react';

const PRESET_TAG_DEFINITIONS = [
  { id: 'exam_prep', labelKey: 'tagExamPrep', icon: '📝', color: 'bg-blue-50 text-blue-700 border-blue-200', activeColor: 'bg-blue-600 text-white border-blue-600' },
  { id: 'homework', labelKey: 'tagHomework', icon: '🏠', color: 'bg-amber-50 text-amber-800 border-amber-200', activeColor: 'bg-amber-600 text-white border-amber-600' },
  { id: 'in_class', labelKey: 'tagInClass', icon: '🏫', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', activeColor: 'bg-emerald-600 text-white border-emerald-600' },
  { id: 'competition', labelKey: 'tagCompetition', icon: '🏆', color: 'bg-purple-50 text-purple-800 border-purple-200', activeColor: 'bg-purple-600 text-white border-purple-600' },
  { id: 'group_work', labelKey: 'tagGroupWork', icon: '👥', color: 'bg-indigo-50 text-indigo-800 border-indigo-200', activeColor: 'bg-indigo-600 text-white border-indigo-600' },
];

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('edu_qr_lang') as Language) || 'mk';
  });

  const [qrCodes, setQrCodes] = useState<EducationalQRCode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [bloomFilter, setBloomFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  // Папки и категории
  const [folders, setFolders] = useState<EducationalFolder[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [isFolderEditorOpen, setIsFolderEditorOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<EducationalFolder | null>(null);
  const [movingQrItem, setMovingQrItem] = useState<EducationalQRCode | null>(null);

  // Модални дијалози
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationalQRCode | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [activeStudentItem, setActiveStudentItem] = useState<EducationalQRCode | null>(null);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSharedFolderModalOpen, setIsSharedFolderModalOpen] = useState(false);
  const [isBulkRenameOpen, setIsBulkRenameOpen] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'materials' | 'bloom' | 'folders' | 'engagement'>('materials');
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isFilterPanelExpanded, setIsFilterPanelExpanded] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [pdfViewerItem, setPdfViewerItem] = useState<EducationalQRCode | null>(null);

  // Таг менаџер и QR Лов на информации
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [isScavengerHuntOpen, setIsScavengerHuntOpen] = useState(false);
  const [isMathQuizOpen, setIsMathQuizOpen] = useState(false);
  const [isTestingGuideOpen, setIsTestingGuideOpen] = useState(false);
  const [customTags, setCustomTags] = useState<CustomTag[]>(() => getStoredCustomTags());

  // Големина на фонт и типографија за наставници (Зачувано во localStorage)
  const [fontSize, setFontSize] = useState<FontSizeOption>(() => {
    return (localStorage.getItem('eduqr_fontSize_pref') as FontSizeOption) || 'normal';
  });

  // Режим на работа за наставници (Едноставен vs. Педагошко студио)
  const [teacherMode, setTeacherMode] = useState<'simple' | 'advanced'>(() => {
    return (localStorage.getItem('eduqr_teacher_mode') as 'simple' | 'advanced') || 'simple';
  });

  useEffect(() => {
    document.documentElement.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-huge');
    document.documentElement.classList.add(`font-scale-${fontSize}`);
    localStorage.setItem('eduqr_fontSize_pref', fontSize);
  }, [fontSize]);

  const handleTeacherModeChange = (mode: 'simple' | 'advanced') => {
    setTeacherMode(mode);
    localStorage.setItem('eduqr_teacher_mode', mode);
  };

  // Селекција и групен извоз во ZIP / Презентација
  const [selectedCodeIds, setSelectedCodeIds] = useState<string[]>([]);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState<{ completed: number; total: number } | null>(null);

  // Групно увоз на PDF и Презентациски извоз
  const [isBatchPdfImportOpen, setIsBatchPdfImportOpen] = useState(false);
  const [isPresentationExportOpen, setIsPresentationExportOpen] = useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('eduqr_header_collapsed') === 'true';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleHeaderCollapse = () => {
    setIsHeaderCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('eduqr_header_collapsed', String(next));
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const t = translations[language];

  // Вчитување на кодовите и папките при старт
  useEffect(() => {
    const loaded = getStoredQRCodes();
    setQrCodes(loaded);

    const loadedFolders = getStoredFolders();
    setFolders(loadedFolders);

    const loadedTags = getStoredCustomTags();
    setCustomTags(loadedTags);

    // Проверка дали страницата е отворена од скенирање со ?task=slug или ?folder=id
    const urlParams = new URLSearchParams(window.location.search);
    const taskSlug = urlParams.get('task');
    if (taskSlug) {
      const match = recordScan(taskSlug);
      if (match) {
        setActiveStudentItem(match);
        setIsStudentModalOpen(true);
      }
    }

    const folderParam = urlParams.get('folder');
    if (folderParam) {
      setActiveFolderId(folderParam);
    }
  }, []);

  const handleSaveNewTag = (tag: CustomTag) => {
    const updated = saveOrUpdateCustomTag(tag);
    setCustomTags(updated);
  };

  const handleRenameTag = (oldTagId: string, newTagId: string, newLabel?: string, newColor?: string) => {
    const result = renameTagGlobally(oldTagId, newTagId, newLabel, newColor);
    setQrCodes(result.updatedCodes);
    setCustomTags(result.updatedTags);
  };

  const handleDeleteTag = (tagId: string) => {
    const result = deleteTagGlobally(tagId);
    setQrCodes(result.updatedCodes);
    setCustomTags(result.updatedTags);
    if (tagFilter === tagId) setTagFilter('all');
  };

  const handleGenerateScavengerHunt = (newCodes: EducationalQRCode[], newFolder: EducationalFolder) => {
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    saveStoredFolders(updatedFolders);

    const updatedCodes = [...newCodes, ...qrCodes];
    setQrCodes(updatedCodes);
    saveStoredQRCodes(updatedCodes);

    setActiveFolderId(newFolder.id);
    setActiveWorkspaceTab('materials');
    showToast(
      language === 'mk'
        ? `🧭 QR Ловот е подготвен! Отворена е папката "${newFolder.name}".`
        : `🧭 Scavenger Hunt ready! Folder "${newFolder.name}" opened.`
    );
  };

  const handleSaveMathQuiz = (newCodes: EducationalQRCode[], newFolder: EducationalFolder) => {
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    saveStoredFolders(updatedFolders);

    const updatedCodes = [...newCodes, ...qrCodes];
    setQrCodes(updatedCodes);
    saveStoredQRCodes(updatedCodes);

    setActiveFolderId(newFolder.id);
    setActiveWorkspaceTab('materials');
    showToast(
      language === 'mk'
        ? `📐 Квизот и QR Клучот со решенија се зачувани во "${newFolder.name}"!`
        : `📐 Math Quiz and Answer Key saved in "${newFolder.name}"!`
    );
  };

  const handlePrintQuizDirectly = (codes: EducationalQRCode[]) => {
    setSelectedCodeIds(codes.map((c) => c.id));
    setIsPrintModalOpen(true);
  };

  const handleBatchPdfImportComplete = (newCodes: EducationalQRCode[], newFolder: EducationalFolder) => {
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    saveStoredFolders(updatedFolders);

    const updatedCodes = [...newCodes, ...qrCodes];
    setQrCodes(updatedCodes);
    saveStoredQRCodes(updatedCodes);

    setActiveFolderId(newFolder.id);
    setActiveWorkspaceTab('materials');
    showToast(
      language === 'mk'
        ? `✅ Успешно увезени ${newCodes.length} PDF документи во папка "${newFolder.name}"!`
        : `✅ Successfully imported ${newCodes.length} PDF documents into folder "${newFolder.name}"!`
    );
  };

  const handleCopyCardImage = async (item: EducationalQRCode) => {
    const ok = await copyPngToClipboard(item);
    if (ok) {
      showToast(
        language === 'mk'
          ? `📋 Сликата за "${item.title}" е копирана! Залепете со Ctrl+V во PowerPoint / Google Slides.`
          : `📋 Image for "${item.title}" copied! Paste with Ctrl+V into PowerPoint or Google Slides.`
      );
    } else {
      setSelectedCodeIds([item.id]);
      setIsPresentationExportOpen(true);
    }
  };

  const handlePrintStationsDirectly = (stations: EducationalQRCode[]) => {
    setSelectedCodeIds(stations.map(s => s.id));
    setIsPrintModalOpen(true);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('edu_qr_lang', lang);
  };

  const handleSaveItem = (item: EducationalQRCode) => {
    let updated: EducationalQRCode[];
    const exists = qrCodes.some(q => q.id === item.id);
    if (exists) {
      updated = qrCodes.map(q => q.id === item.id ? item : q);
    } else {
      updated = [item, ...qrCodes];
    }
    setQrCodes(updated);
    saveStoredQRCodes(updated);
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm(language === 'mk' ? 'Дали сте сигурни дека сакате да го избришете овој образовен QR код?' : 'Are you sure you want to delete this educational QR code?')) {
      const updated = qrCodes.filter(q => q.id !== id);
      setQrCodes(updated);
      saveStoredQRCodes(updated);
    }
  };

  const handleSaveFolder = (folder: EducationalFolder) => {
    let updated: EducationalFolder[];
    const exists = folders.some(f => f.id === folder.id);
    if (exists) {
      updated = folders.map(f => f.id === folder.id ? folder : f);
    } else {
      updated = [...folders, folder];
    }
    setFolders(updated);
    saveStoredFolders(updated);
    setIsFolderEditorOpen(false);
    setEditingFolder(null);
  };

  const handleDeleteFolder = (folderId: string) => {
    if (window.confirm(language === 'mk' ? 'Дали сте сигурни дека сакате да ја избришете оваа папка? Задачите нема да бидат избришани, туку ќе останат како општи материјали.' : 'Are you sure you want to delete this folder?')) {
      const updatedFolders = folders.filter(f => f.id !== folderId);
      setFolders(updatedFolders);
      saveStoredFolders(updatedFolders);
      if (activeFolderId === folderId) {
        setActiveFolderId(null);
      }
      const updatedCodes = qrCodes.map(q => q.folderId === folderId ? { ...q, folderId: undefined } : q);
      setQrCodes(updatedCodes);
      saveStoredQRCodes(updatedCodes);
    }
  };

  const handleMoveItemToFolder = (qrId: string, targetFolderId?: string) => {
    const updated = qrCodes.map(q => q.id === qrId ? { ...q, folderId: targetFolderId || undefined } : q);
    setQrCodes(updated);
    saveStoredQRCodes(updated);
    setMovingQrItem(null);
  };

  const handleOpenEdit = (item: EducationalQRCode) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const handleOpenNew = () => {
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const handleSimulateStudentScan = (item: EducationalQRCode) => {
    const updated = recordScan(item.id);
    if (updated) {
      setQrCodes(prev => prev.map(q => q.id === updated.id ? updated : q));
      setActiveStudentItem(updated);
    } else {
      setActiveStudentItem(item);
    }
    setIsStudentModalOpen(true);
  };

  // Автоматско групирање и броење на предмети од сите QR кодови
  const availableSubjects = useMemo(() => {
    const map = new Map<string, number>();
    qrCodes.forEach((c) => {
      const subj = (c.subject || '').trim();
      if (subj) {
        map.set(subj, (map.get(subj) || 0) + 1);
      }
    });

    return Array.from(map.entries())
      .map(([name, count]) => {
        const matched = EDUCATIONAL_SUBJECTS.find(
          (s) => s.name.toLowerCase() === name.toLowerCase() ||
                 s.id.toLowerCase() === name.toLowerCase()
        );
        return {
          name,
          count,
          icon: matched?.icon || '📚',
          color: matched?.defaultColor || '#4f46e5',
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [qrCodes]);

  // Филтрирање
  const filteredCodes = useMemo(() => {
    return qrCodes.filter(code => {
      const matchesSearch = 
        code.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.latexContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.shortCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'all' || code.type === typeFilter;
      const matchesBloom = bloomFilter === 'all' || code.bloomLevel === bloomFilter;
      const matchesFolder = activeFolderId === null || code.folderId === activeFolderId;
      const matchesTag = tagFilter === 'all' || (code.tags && code.tags.includes(tagFilter));
      const matchesSubject =
        subjectFilter === 'all' ||
        code.subject.toLowerCase() === subjectFilter.toLowerCase() ||
        (code.tags && code.tags.some((t) => t.toLowerCase() === subjectFilter.toLowerCase()));

      return matchesSearch && matchesType && matchesBloom && matchesFolder && matchesTag && matchesSubject;
    });
  }, [qrCodes, searchQuery, typeFilter, bloomFilter, activeFolderId, tagFilter, subjectFilter]);

  const customTagsInUse = useMemo(() => {
    const set = new Set<string>();
    const presetIds = new Set(['exam_prep', 'homework', 'in_class', 'competition', 'group_work']);
    qrCodes.forEach((c) => {
      (c.tags || []).forEach((t) => {
        if (!presetIds.has(t)) set.add(t);
      });
    });
    return Array.from(set);
  }, [qrCodes]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    qrCodes.forEach((c) => {
      (c.tags || []).forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return counts;
  }, [qrCodes]);

  const handleToggleSelectCode = (id: string) => {
    setSelectedCodeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    const allFilteredIds = filteredCodes.map((c) => c.id);
    const isAllSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedCodeIds.includes(id));

    if (isAllSelected) {
      setSelectedCodeIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedCodeIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const handleExportSelectedZip = async () => {
    const selectedCodes = qrCodes.filter((c) => selectedCodeIds.includes(c.id));
    if (selectedCodes.length === 0) return;

    setIsExportingZip(true);
    setZipProgress({ completed: 0, total: selectedCodes.length });

    try {
      await exportQRCodesToZip(
        selectedCodes,
        `EduQR_Export_${selectedCodes.length}_Codes.zip`,
        (completed, total) => {
          setZipProgress({ completed, total });
        }
      );
    } catch (err) {
      console.error('Failed to export ZIP archive', err);
      alert(language === 'mk' ? 'Грешка при креирање на ZIP архивата.' : 'Error generating ZIP archive.');
    } finally {
      setIsExportingZip(false);
      setZipProgress(null);
    }
  };

  const handleApplyBulkRename = (renamedCodes: EducationalQRCode[]) => {
    const idMap = new Map(renamedCodes.map((c) => [c.id, c]));
    const updated = qrCodes.map((code) => idMap.get(code.id) || code);
    setQrCodes(updated);
    saveStoredQRCodes(updated);
  };

  const itemsToPrint = useMemo(() => {
    if (selectedCodeIds.length > 0) {
      return qrCodes.filter((c) => selectedCodeIds.includes(c.id));
    }
    return filteredCodes;
  }, [qrCodes, filteredCodes, selectedCodeIds]);

  // Статистики
  const totalScans = useMemo(() => qrCodes.reduce((acc, curr) => acc + (curr.scanCount || 0), 0), [qrCodes]);
  const scaffoldCount = useMemo(() => qrCodes.filter(c => c.type === 'vygotsky_scaffold' || (c.scaffoldingSteps && c.scaffoldingSteps.length > 0)).length, [qrCodes]);
  const bloomCount = useMemo(() => qrCodes.filter(c => c.bloomLevel).length, [qrCodes]);

  const handleResetAllFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setBloomFilter('all');
    setTagFilter('all');
    setSubjectFilter('all');
    setActiveFolderId(null);
  };

  const hasActiveFilters = searchQuery !== '' || typeFilter !== 'all' || bloomFilter !== 'all' || tagFilter !== 'all' || subjectFilter !== 'all' || activeFolderId !== null;
  const activeFiltersCount = (searchQuery ? 1 : 0) + (typeFilter !== 'all' ? 1 : 0) + (bloomFilter !== 'all' ? 1 : 0) + (tagFilter !== 'all' ? 1 : 0) + (subjectFilter !== 'all' ? 1 : 0) + (activeFolderId !== null ? 1 : 0);

  const handleAutoGenerateSubjectTags = () => {
    let updatedCount = 0;
    const newCustomTagsMap = new Map<string, CustomTag>();

    const updatedCodes = qrCodes.map((code) => {
      const rawSubj = (code.subject || '').trim();
      if (!rawSubj) return code;

      const currentTags = code.tags || [];
      const hasSubjectTag = currentTags.some((t) => t.toLowerCase() === rawSubj.toLowerCase());

      const tagId = rawSubj.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_а-шђјљњћџ]/gi, '');
      if (!customTags.some((ct) => ct.label.toLowerCase() === rawSubj.toLowerCase()) && !newCustomTagsMap.has(tagId)) {
        const match = EDUCATIONAL_SUBJECTS.find(
          (s) => s.name.toLowerCase() === rawSubj.toLowerCase() || s.id.toLowerCase() === rawSubj.toLowerCase()
        );
        newCustomTagsMap.set(tagId, {
          id: tagId || `tag_${Date.now()}`,
          label: rawSubj,
          color: match?.defaultColor || '#4f46e5',
          createdAt: new Date().toISOString().split('T')[0],
        });
      }

      if (!hasSubjectTag) {
        updatedCount++;
        return {
          ...code,
          tags: [...currentTags, rawSubj],
        };
      }
      return code;
    });

    if (updatedCount > 0 || newCustomTagsMap.size > 0) {
      if (updatedCount > 0) {
        setQrCodes(updatedCodes);
        saveStoredQRCodes(updatedCodes);
      }
      if (newCustomTagsMap.size > 0) {
        const added = Array.from(newCustomTagsMap.values());
        setCustomTags((prev) => {
          const next = [...prev, ...added];
          saveStoredCustomTags(next);
          return next;
        });
      }
      showToast(
        language === 'mk'
          ? `⚡ Автоматски се генерирани предметни тагови за ${updatedCount > 0 ? updatedCount : 'сите'} QR кодови!`
          : `⚡ Auto-generated subject tags for ${updatedCount} QR codes!`
      );
    } else {
      showToast(
        language === 'mk'
          ? 'Сите предмети се веќе синхронизирани со соодветните тагови.'
          : 'All subjects are already synced with tags.'
      );
    }
  };

  const handleApplyVoiceTask = (taskData: Partial<EducationalQRCode>) => {
    const uniqueSlug = 'math' + Math.floor(100 + Math.random() * 900);
    const newItem: EducationalQRCode = {
      id: `qr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      shortCode: uniqueSlug,
      title: taskData.title || (language === 'mk' ? 'Гласовно генерирана задача' : 'Voice Generated Task'),
      description: taskData.description || '',
      type: taskData.type || 'math_latex',
      createdAt: new Date().toISOString().split('T')[0],
      subject: taskData.subject || 'Математика',
      targetGrade: taskData.targetGrade || '8-мо одделение',
      latexContent: taskData.latexContent || '',
      solutionLatex: taskData.solutionLatex || '',
      scaffoldingSteps: taskData.scaffoldingSteps || [],
      bloomLevel: taskData.bloomLevel || 'apply',
      tags: taskData.tags || ['in_class'],
      scanCount: 0,
      requiresPin: false,
      style: {
        fgColor: '#1e3a8a',
        bgColor: '#ffffff',
        errorCorrectionLevel: 'Q',
        iconType: 'math',
        margin: 2,
        size: 260
      }
    };
    setEditingItem(newItem);
    setIsEditorOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onOpenNewModal={handleOpenNew}
        onOpenBatchPdfModal={() => setIsBatchPdfImportOpen(true)}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
        onOpenAnalyticsModal={() => setIsAnalyticsOpen(true)}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        onOpenTestingGuide={() => setIsTestingGuideOpen(true)}
        onOpenMathQuiz={() => setIsMathQuizOpen(true)}
      />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full space-y-5">
        {/* Чисто и елегантно заглавие на работниот простор (Streamlined Header) */}
        {!isHeaderCollapsed ? (
          <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden animate-fade-in">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-200 border border-white/10">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{language === 'mk' ? 'Основно & Средно Образование' : 'Primary & Secondary Education'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsTestingGuideOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-full text-xs font-extrabold border border-amber-400/30 transition cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{language === 'mk' ? 'Водич за тестирање 🚀' : 'Testing Guide 🚀'}</span>
                  </button>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
                  {language === 'mk' 
                    ? 'Дигитални Образовни QR Кодови' 
                    : language === 'sq'
                    ? 'Kode Interaktive Edukative QR'
                    : 'Interactive Educational QR Codes'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {language === 'mk'
                    ? 'Креирајте интерактивни задачи со KaTeX формули, скалирање по Виготски и PDF документи за сите предмети.'
                    : language === 'sq'
                    ? 'Krijoni detyra interaktive me KaTeX, shkallëzim Vygotsky dhe PDF për të gjitha lëndët.'
                    : 'Create interactive tasks with KaTeX formulas, Vygotskian scaffolding, and PDF documents across all subjects.'}
                </p>

                {/* Брзи копчиња за дејство */}
                <div className="pt-1.5 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenNew}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.newQr}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsBatchPdfImportOpen(true)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    title="Групен увоз на PDF датотеки со авто-генерирање QR кодови во нова папка"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t.batchPdfImportBtn || 'Групно увези PDF'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsScavengerHuntOpen(true)}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 text-slate-900" />
                    <span>{language === 'mk' ? 'QR Лов (Станици)' : 'Scavenger Hunt'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMathQuizOpen(true)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    title="Генерирај математички квиз со соодветен QR клуч со решенија"
                  >
                    <FileQuestion className="w-3.5 h-3.5 text-emerald-200" />
                    <span>{language === 'mk' ? 'Математички Квиз' : 'Math Quiz'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsVoiceAssistantOpen(true)}
                    className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-indigo-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/15 cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>{language === 'mk' ? 'Гласовен AI' : 'Voice AI'}</span>
                  </button>
                </div>
              </div>

              {/* Бројачи и опција за собирање (Collapse) */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={toggleHeaderCollapse}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition cursor-pointer"
                  title="Скриј го заглавието за повеќе простор"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>{t.compactHeaderToggle || 'Компактен приказ'}</span>
                </button>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-center">
                    <span className="text-xl sm:text-2xl font-black text-indigo-300 block">{qrCodes.length}</span>
                    <span className="text-[10px] text-slate-300 font-medium">{t.activeCodes}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAnalyticsOpen(true)}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 hover:border-emerald-400/40 text-center transition cursor-pointer group"
                    title="Отвори детална аналитика на скенирања"
                  >
                    <span className="text-xl sm:text-2xl font-black text-emerald-300 block group-hover:scale-105 transition-transform">{totalScans}</span>
                    <span className="text-[10px] text-slate-300 font-medium underline decoration-emerald-400/50">{t.totalScans}</span>
                  </button>
                  <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-center">
                    <span className="text-xl sm:text-2xl font-black text-amber-300 block">{scaffoldCount}</span>
                    <span className="text-[10px] text-slate-300 font-medium">Виготски ZPD</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* Компактна лента кога насловот е собран */
          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-serif italic">∑</span>
                <span>{t.appTitle}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-semibold">
                {qrCodes.length} {t.activeCodes} | {totalScans} {t.totalScans}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsBatchPdfImportOpen(true)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-rose-600" />
                <span>{t.batchPdfImportBtn || 'Увези PDF'}</span>
              </button>
              <button
                type="button"
                onClick={toggleHeaderCollapse}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                <span>{t.fullHeaderToggle || 'Целосен преглед'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Селектор на режим за наставникот (Едноставен за час vs. Педагошко студио) */}
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              {t.teacherModeLabel || 'Режим на работа'}:
            </span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleTeacherModeChange('simple')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  teacherMode === 'simple'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🎓</span>
                <span>{t.teacherModeSimple || 'Едноставен за час'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleTeacherModeChange('advanced')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  teacherMode === 'advanced'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🔬</span>
                <span>{t.teacherModeAdvanced || 'Педагошко студио'}</span>
              </button>
            </div>
          </div>

          {/* Брзи копчиња за наставникот: Говорен AI, QR Лов на информации и Лидерска табла */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsScavengerHuntOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-extrabold shadow-xs hover:shadow transition cursor-pointer"
              title={t.scavengerHuntSubtitle || 'Креирај QR Лов на информации (4-5 станици низ училницата)'}
            >
              <Compass className="w-4 h-4 text-amber-100" />
              <span>{language === 'mk' ? '🧭 QR Лов (Станици)' : '🧭 Scavenger Hunt'}</span>
              <span className="text-[10px] bg-white/20 px-1 py-0.2 rounded font-black uppercase">1-клик</span>
            </button>

            {/* Брзо копче за Математички Квиз & Клуч со решенија */}
            <button
              type="button"
              onClick={() => setIsMathQuizOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-extrabold shadow-xs hover:shadow transition cursor-pointer"
              title="Креирај математички квиз со соодветен QR клуч со решенија"
            >
              <FileQuestion className="w-4 h-4 text-emerald-100" />
              <span>{language === 'mk' ? '📐 Квиз & Клуч' : '📐 Math Quiz'}</span>
              <span className="text-[10px] bg-white/20 px-1 py-0.2 rounded font-black uppercase text-amber-200">
                LaTeX
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('engagement')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
                activeWorkspaceTab === 'engagement'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
              title={t.engagementTitle || 'Лидерска табла на ангажираност на ученици'}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.tabEngagement || 'Ангажираност'}</span>
            </button>

            {/* Копче за двонасочен говорен дијалог со моделот */}
            <button
              type="button"
              onClick={() => setIsVoiceAssistantOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-xs hover:shadow transition cursor-pointer ring-2 ring-indigo-200/60"
              title="Отвори го двонасочниот гласовен асистент за наставници"
            >
              <Mic className="w-4 h-4 animate-pulse text-amber-300" />
              <span>{language === 'mk' ? '🎙️ Зборувај со моделот' : '🎙️ Speak with AI Model'}</span>
              <span className="text-[10px] font-black uppercase px-1.5 py-0.2 bg-white/20 rounded">AI</span>
            </button>
          </div>
        </div>

        {/* За педагошко студио: прикажи ги 4-те специјализирани работни простори */}
        {teacherMode === 'advanced' && (
          <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-2 animate-fade-in">
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {/* Таб 1: Мои Задачи & Материјали */}
              <button
                type="button"
                onClick={() => setActiveWorkspaceTab('materials')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                  activeWorkspaceTab === 'materials'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>{t.tabMaterials}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeWorkspaceTab === 'materials' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {filteredCodes.length}
                </span>
              </button>

              {/* Таб 2: Блумова Аналитика & Баланс */}
              <button
                type="button"
                onClick={() => setActiveWorkspaceTab('bloom')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                  activeWorkspaceTab === 'bloom'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>{t.tabBloom}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeWorkspaceTab === 'bloom' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                  {bloomCount}
                </span>
              </button>

              {/* Таб 3: Папки & Збирки */}
              <button
                type="button"
                onClick={() => setActiveWorkspaceTab('folders')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                  activeWorkspaceTab === 'folders'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FolderTree className="w-4 h-4" />
                <span>{t.tabFolders}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeWorkspaceTab === 'folders' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {folders.length}
                </span>
              </button>

              {/* Таб 4: Ангажираност на ученици & Лидерска табла */}
              <button
                type="button"
                onClick={() => setActiveWorkspaceTab('engagement')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                  activeWorkspaceTab === 'engagement'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-200" />
                <span>{t.tabEngagement || 'Ангажираност'}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeWorkspaceTab === 'engagement' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                  {totalScans}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ПРИКАЗ 2: БЛУМОВА ТАКСОНОМИЈА */}
        {activeWorkspaceTab === 'bloom' && (
          <div className="space-y-4 animate-fade-in">
            <BloomTaxonomySummary
              items={qrCodes}
              language={language}
              activeBloomFilter={bloomFilter}
              onSelectBloomFilter={(lvl) => {
                setBloomFilter(lvl);
                setActiveWorkspaceTab('materials');
              }}
            />
            <div className="text-center">
              <button
                type="button"
                onClick={() => setActiveWorkspaceTab('materials')}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>{language === 'mk' ? 'Премини кон задачите со избраниот филтер' : 'View tasks with selected filter'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ПРИКАЗ 3: ОРГАНИЗАЦИЈА ПО ПАПКИ */}
        {activeWorkspaceTab === 'folders' && (
          <div className="space-y-4 animate-fade-in">
            <FolderManager
              folders={folders}
              activeFolderId={activeFolderId}
              onSelectFolder={(fId) => {
                setActiveFolderId(fId);
                setActiveWorkspaceTab('materials');
              }}
              onOpenCreateFolder={() => {
                setEditingFolder(null);
                setIsFolderEditorOpen(true);
              }}
              onOpenSharedModal={() => setIsSharedFolderModalOpen(true)}
              onEditFolder={(folder) => {
                setEditingFolder(folder);
                setIsFolderEditorOpen(true);
              }}
              onDeleteFolder={handleDeleteFolder}
              items={qrCodes}
              language={language}
            />
            <div className="text-center">
              <button
                type="button"
                onClick={() => setActiveWorkspaceTab('materials')}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>{language === 'mk' ? 'Прегледај ги сите задачи во избраната папка' : 'Browse tasks in selected folder'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ПРИКАЗ 4: АНГАЖИРАНОСТ НА УЧЕНИЦИ & ЛИДЕРСКА ТАБЛА */}
        {activeWorkspaceTab === 'engagement' && (
          <StudentEngagementView
            items={qrCodes}
            folders={folders}
            language={language}
            onSimulateScan={handleSimulateStudentScan}
            onEditItem={handleOpenEdit}
            onPrintItem={(item) => {
              setSelectedCodeIds([item.id]);
              setIsPrintModalOpen(true);
            }}
            onOpenPdfViewer={(item) => setPdfViewerItem(item)}
            onOpenScavengerHunt={() => setIsScavengerHuntOpen(true)}
          />
        )}

        {/* ПРИКАЗ 1: ГЛАВНИ МАТЕРИЈАЛИ & ЗАДАЧИ */}
        {activeWorkspaceTab === 'materials' && (
          <div className="space-y-5 animate-fade-in">
            {/* Управувачки центар за наставници (Teacher Control Hub) */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
              
              {/* Горен главен ред: Пребарување + Брзи дејства */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                {/* Големо и прегледно поле за пребарување */}
                <div className="relative grow max-w-2xl">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden transition text-slate-800 placeholder:text-slate-400 font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Главни акциски копчиња */}
                <div className="flex flex-wrap items-center gap-2 justify-end">
                  {/* Копче за филтри */}
                  <button
                    type="button"
                    onClick={() => setIsFilterPanelExpanded(!isFilterPanelExpanded)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold border transition cursor-pointer ${
                      isFilterPanelExpanded || hasActiveFilters
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                    title={t.filterPanelToggle}
                  >
                    <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                    <span>{t.filterPanelToggle}</span>
                    {activeFiltersCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  {/* Копче за групен избор */}
                  <button
                    type="button"
                    onClick={() => setIsBatchMode(!isBatchMode)}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-bold border transition cursor-pointer ${
                      isBatchMode || selectedCodeIds.length > 0
                        ? 'bg-purple-50 border-purple-200 text-purple-700'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                    title={t.batchSelectToggle}
                  >
                    <CheckSquare className="w-4 h-4 text-purple-600" />
                    <span>{t.batchSelectToggle}</span>
                  </button>

                  {/* Водич за часот */}
                  <button
                    type="button"
                    onClick={() => setIsWizardOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
                    title="Стартувај чекор-по-чекор водич за наставници"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{language === 'mk' ? 'Водич' : 'Wizard'}</span>
                  </button>

                  {/* QR Лов на информации (Scavenger Hunt) */}
                  <button
                    type="button"
                    onClick={() => setIsScavengerHuntOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
                    title={t.scavengerHuntSubtitle || 'Креирај QR Лов на информации (4-5 станици низ училницата)'}
                  >
                    <Compass className="w-4 h-4 text-amber-100" />
                    <span>{language === 'mk' ? 'QR Лов (Станици)' : 'Scavenger Hunt'}</span>
                  </button>

                  {/* Математички Квиз & Клуч со решенија */}
                  <button
                    type="button"
                    onClick={() => setIsMathQuizOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs hover:shadow transition cursor-pointer"
                    title={language === 'mk' ? 'Генерирај LaTeX математички квиз со соодветен QR Клуч со решенија' : 'Generate LaTeX Math Quiz with matching Answer Key QR'}
                  >
                    <FileQuestion className="w-4 h-4 text-emerald-200" />
                    <span>{language === 'mk' ? 'Математички Квиз' : 'Math Quiz'}</span>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-black uppercase text-amber-200">
                      🔑 Клуч
                    </span>
                  </button>

                  {/* Групно увези PDF */}
                  <button
                    type="button"
                    onClick={() => setIsBatchPdfImportOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-bold rounded-xl border border-rose-200 transition cursor-pointer shadow-2xs"
                    title={t.batchPdfImportSubtitle || 'Групен увоз на PDF документи со авто-генерирање QR кодови'}
                  >
                    <Upload className="w-4 h-4 text-rose-600" />
                    <span>{t.batchPdfImportBtn || 'Увези PDF'}</span>
                  </button>

                  {/* Нов QR код */}
                  <button
                    type="button"
                    onClick={handleOpenNew}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs hover:shadow transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.newQr}</span>
                  </button>
                </div>
              </div>

              {/* ГРУПИРАН ПАНЕЛ ЗА ФИЛТРИРАЊЕ (Педагошки цели + Предмет + Блум) */}
              {(isFilterPanelExpanded || hasActiveFilters) && (
                <div className="pt-3 border-t border-slate-100 space-y-3.5 animate-fade-in">
                  
                  {/* Група 1: Педагошки ознаки (Цел на часот) */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mr-1 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{t.tagFilterTitle}:</span>
                      </span>

                      {/* Сите активности */}
                      <button
                        type="button"
                        onClick={() => setTagFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                          tagFilter === 'all'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>✨</span>
                        <span>{t.allTags}</span>
                        <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${tagFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                          {qrCodes.length}
                        </span>
                      </button>

                      {/* Предефинирани педагошки тагови */}
                      {PRESET_TAG_DEFINITIONS.map((def) => {
                        const isSelected = tagFilter === def.id;
                        const count = tagCounts[def.id] || 0;
                        const label = t[def.labelKey as keyof typeof t] as string;

                        return (
                          <button
                            key={def.id}
                            type="button"
                            onClick={() => setTagFilter(isSelected ? 'all' : def.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? `${def.activeColor} shadow-xs ring-2 ring-indigo-200`
                                : `${def.color} hover:opacity-90`
                            }`}
                          >
                            <span>{def.icon}</span>
                            <span>{label}</span>
                            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-white/25 text-white' : 'bg-white/80 text-slate-700 shadow-2xs'}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}

                      {/* Сопствени ознаки */}
                      {customTagsInUse.map((customTag) => {
                        const isSelected = tagFilter === customTag;
                        const count = tagCounts[customTag] || 0;

                        return (
                          <button
                            key={customTag}
                            type="button"
                            onClick={() => setTagFilter(isSelected ? 'all' : customTag)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-slate-800 text-white border-slate-800 shadow-xs ring-2 ring-slate-300'
                                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <span>🏷️</span>
                            <span>{customTag}</span>
                            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-700'}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}

                      {/* Менаџер на ознаки */}
                      <button
                        type="button"
                        onClick={() => setIsTagManagerOpen(true)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-indigo-700 transition flex items-center gap-1.5 cursor-pointer ml-1 shadow-2xs"
                        title={t.tagManagerTitle || 'Менаџер на ознаки'}
                      >
                        <Settings className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{t.tagManagerBtn || 'Менаџер на ознаки'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Група 1.5: Предметни филтри (Математика, Физика, Историја, итн.) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100/80">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mr-1 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{language === 'mk' ? 'Наставен предмет:' : 'Subject:'}</span>
                      </span>

                      {/* Сите предмети */}
                      <button
                        type="button"
                        onClick={() => setSubjectFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                          subjectFilter === 'all'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>📚</span>
                        <span>{language === 'mk' ? 'Сите предмети' : 'All Subjects'}</span>
                        <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${subjectFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                          {qrCodes.length}
                        </span>
                      </button>

                      {/* Динамички филтри за детектираните предмети */}
                      {availableSubjects.map((subj) => {
                        const isSelected = subjectFilter.toLowerCase() === subj.name.toLowerCase();
                        return (
                          <button
                            key={subj.name}
                            type="button"
                            onClick={() => setSubjectFilter(isSelected ? 'all' : subj.name)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-200'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>{subj.icon}</span>
                            <span>{subj.name}</span>
                            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                              {subj.count}
                            </span>
                          </button>
                        );
                      })}

                      {/* Брзо копче за авто-синхронизација на предметите како тагови */}
                      <button
                        type="button"
                        onClick={handleAutoGenerateSubjectTags}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 transition flex items-center gap-1.5 cursor-pointer ml-1 shadow-2xs"
                        title={language === 'mk' ? 'Автоматски генерирај ознаки за сите предмети' : 'Auto-generate tags for all subjects'}
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        <span>{language === 'mk' ? 'Авто-тагови' : 'Auto-Tags'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Група 2: Селектори по Тип на задача, Блумово ниво и активна папка */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100/80">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                        {language === 'mk' ? 'Категоризација:' : 'Category & Demand:'}
                      </span>

                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-hidden focus:bg-white cursor-pointer"
                      >
                        <option value="all">{t.filterType}</option>
                        <option value="math_latex">{t.types.math_latex}</option>
                        <option value="vygotsky_scaffold">{t.types.vygotsky_scaffold}</option>
                        <option value="bloom_taxonomy">{t.types.bloom_taxonomy}</option>
                        <option value="gardner_multiple">{t.types.gardner_multiple}</option>
                        <option value="short_url">{t.types.short_url}</option>
                        <option value="document_file">{t.types.document_file}</option>
                        <option value="wifi_access">{t.types.wifi_access}</option>
                      </select>

                      <select
                        value={bloomFilter}
                        onChange={(e) => setBloomFilter(e.target.value)}
                        className="text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-hidden focus:bg-white cursor-pointer"
                      >
                        <option value="all">{t.filterBloom}</option>
                        <option value="remember">1. {t.bloomShort.remember}</option>
                        <option value="understand">2. {t.bloomShort.understand}</option>
                        <option value="apply">3. {t.bloomShort.apply}</option>
                        <option value="analyze">4. {t.bloomShort.analyze}</option>
                        <option value="evaluate">5. {t.bloomShort.evaluate}</option>
                        <option value="create">6. {t.bloomShort.create}</option>
                      </select>

                      {activeFolderId && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200">
                          <span>📁</span>
                          <span>{folders.find(f => f.id === activeFolderId)?.name || 'Папка'}</span>
                          <button
                            type="button"
                            onClick={() => setActiveFolderId(null)}
                            className="hover:text-rose-600 font-bold ml-1 cursor-pointer"
                            title="Тргни филтер по папка"
                          >
                            ×
                          </button>
                        </span>
                      )}
                    </div>

                    {/* Копче за ресетирање на сите филтри */}
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={handleResetAllFilters}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition cursor-pointer border border-rose-200"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{t.clearAllFilters}</span>
                      </button>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* ЛЕНТА ЗА ГРУПНА СЕЛЕКЦИЈА (Се прикажува кога има селекција или е вклучен групен режим) */}
            {(selectedCodeIds.length > 0 || isBatchMode) && (
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 rounded-3xl text-white shadow-md flex flex-wrap items-center justify-between gap-3 border border-slate-800 animate-fade-in">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSelectAllFiltered}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    {filteredCodes.length > 0 && filteredCodes.every((c) => selectedCodeIds.includes(c.id)) ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                    <span>{t.selectAll} ({filteredCodes.length})</span>
                  </button>

                  <span className="text-xs font-bold text-indigo-200 bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-400/30">
                    {selectedCodeIds.length} {t.selectedCount}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Извоз за PowerPoint & Google Slides (PNG / SVG) */}
                  <button
                    type="button"
                    onClick={() => setIsPresentationExportOpen(true)}
                    disabled={selectedCodeIds.length === 0}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    title={t.exportPresentationSubtitle || 'Извоз во PNG и SVG за PowerPoint и Google Slides'}
                  >
                    <Monitor className="w-4 h-4 text-slate-900" />
                    <span>{t.exportPresentationBtn || 'Извоз за слајдови (PNG/SVG)'}</span>
                  </button>

                  {/* Брзо копирање за единечен селектиран */}
                  {selectedCodeIds.length === 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = qrCodes.find((c) => c.id === selectedCodeIds[0]);
                        if (target) handleCopyCardImage(target);
                      }}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
                      title="Копирај слика за директно Ctrl+V на слајд"
                    >
                      <Copy className="w-4 h-4 text-amber-300" />
                      <span>{t.copyForSlides || 'Копирај за PowerPoint'}</span>
                    </button>
                  )}

                  {/* Преземи како ZIP */}
                  <button
                    type="button"
                    onClick={handleExportSelectedZip}
                    disabled={isExportingZip || selectedCodeIds.length === 0}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isExportingZip ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>
                          {t.exportingZip} ({zipProgress?.completed}/{zipProgress?.total})
                        </span>
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4" />
                        <span>{t.exportZip}</span>
                      </>
                    )}
                  </button>

                  {/* Групно преименување */}
                  <button
                    type="button"
                    onClick={() => setIsBulkRenameOpen(true)}
                    disabled={selectedCodeIds.length === 0}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer border border-slate-700 hover:border-slate-600"
                    title={t.bulkRename}
                  >
                    <Edit3 className="w-4 h-4 text-indigo-400" />
                    <span>{t.bulkRename}</span>
                  </button>

                  {/* Испечати избрани (А4) */}
                  <button
                    type="button"
                    onClick={() => setIsPrintModalOpen(true)}
                    disabled={selectedCodeIds.length === 0}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{t.printSelected}</span>
                  </button>

                  {/* Откажи селекција */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCodeIds([]);
                      setIsBatchMode(false);
                    }}
                    className="p-2 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                    title={t.deselectAll}
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

        {/* Мрежа со едукативни QR картички */}
        {filteredCodes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">{t.noCodesFound}</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{t.createFirstCode}</p>
            </div>
            <button
              type="button"
              onClick={handleOpenNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t.newQr}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCodes.map(item => {
              const isSelected = selectedCodeIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
                    isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-500/80 shadow-md bg-indigo-50/20'
                      : 'border-slate-200/90 shadow-2xs hover:shadow-md'
                  }`}
                >
                  {/* Горна лента на картичката */}
                  <div className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Чекбокс за селекција */}
                        <button
                          type="button"
                          onClick={() => handleToggleSelectCode(item.id)}
                          className="p-0.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition cursor-pointer"
                          title={isSelected ? t.deselectAll : t.batchSelect}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                          )}
                        </button>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                        {item.subject}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                        {item.targetGrade}
                      </span>
                      {item.folderId && (() => {
                        const folder = folders.find((f) => f.id === item.folderId);
                        if (!folder) return null;
                        return (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 text-white shadow-2xs"
                            style={{ backgroundColor: folder.color }}
                            title={`${folder.name} (${folder.categoryType})`}
                          >
                            <span>{folder.icon || '📁'}</span>
                            <span className="truncate max-w-[110px]">{folder.name}</span>
                          </span>
                        );
                      })()}
                    </div>

                    {/* Педагошки беџ: Блум или Виготски */}
                    {item.bloomLevel && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full border border-amber-200 flex items-center gap-1">
                        <Brain className="w-3 h-3 text-amber-600" />
                        <span>{t.bloomShort[item.bloomLevel]}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-indigo-600 transition">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  )}

                  {/* Математички приказ со LaTeX */}
                  {item.latexContent && (
                    <div className="mt-3 p-3 bg-slate-50/90 border border-slate-200/70 rounded-xl text-xs line-clamp-3 overflow-hidden text-slate-800">
                      <LatexRenderer content={item.latexContent} />
                    </div>
                  )}

                  {/* Виготски статус */}
                  {item.scaffoldingSteps && item.scaffoldingSteps.length > 0 && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50/70 px-2.5 py-1 rounded-lg">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{item.scaffoldingSteps.length} {language === 'mk' ? 'чекори на помош (ZPD)' : 'scaffolding steps'}</span>
                    </div>
                  )}

                  {/* Документ статус и копче за вграден PDF прегледувач */}
                  {(item.fileName || item.type === 'document_file') && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPdfViewerItem(item);
                      }}
                      className="mt-2.5 w-full flex items-center justify-between text-xs text-rose-800 bg-rose-50 hover:bg-rose-100/90 px-3 py-2 rounded-xl border border-rose-200 font-bold transition cursor-pointer shadow-2xs group/pdf"
                      title="Кликнете за преглед на PDF документот во вградениот прегледувач"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-rose-600 shrink-0 group-hover/pdf:scale-110 transition-transform" />
                        <span className="truncate">{item.fileName || 'Наставен Ресурс (PDF)'}</span>
                      </div>
                      <span className="text-[11px] font-black uppercase text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200 shrink-0 ml-1">
                        PDF Преглед →
                      </span>
                    </button>
                  )}

                  {/* Педагошки ознаки (Tags: Exam Prep, Homework, In-class Activity) */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      {item.tags.map((tagKey) => {
                        const presetDef = PRESET_TAG_DEFINITIONS.find((p) => p.id === tagKey);
                        const isFilterActive = tagFilter === tagKey;

                        if (presetDef) {
                          const label = t[presetDef.labelKey as keyof typeof t] as string;
                          return (
                            <button
                              key={tagKey}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTagFilter(isFilterActive ? 'all' : tagKey);
                              }}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 transition cursor-pointer ${
                                isFilterActive
                                  ? `${presetDef.activeColor} ring-2 ring-indigo-400`
                                  : `${presetDef.color} hover:opacity-85`
                              }`}
                              title={`${t.filterByThisTag}: ${label}`}
                            >
                              <span>{presetDef.icon}</span>
                              <span>{label}</span>
                            </button>
                          );
                        }

                        return (
                          <button
                            key={tagKey}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTagFilter(isFilterActive ? 'all' : tagKey);
                            }}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 transition cursor-pointer ${
                              isFilterActive
                                ? 'bg-slate-800 text-white border-slate-800 ring-2 ring-slate-400'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            }`}
                            title={`${t.filterByThisTag}: ${tagKey}`}
                          >
                            <span>🏷️</span>
                            <span>{tagKey}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* QR код секција и преглед */}
                <div className="px-5 py-3 bg-slate-50/60 border-y border-slate-100 flex justify-center">
                  <QRCodePreview
                    item={item}
                    language={language}
                    onSimulateScan={handleSimulateStudentScan}
                  />
                </div>

                {/* Долна лента: Копчиња за уредување и бришење */}
                <div className="px-5 py-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono text-[11px]">
                    {item.createdAt}
                  </span>

                  <div className="flex items-center gap-1">
                    {(item.type === 'document_file' || item.fileName) && (
                      <button
                        type="button"
                        onClick={() => setPdfViewerItem(item)}
                        className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        title={language === 'mk' ? 'Отвори во вграден PDF прегледувач' : 'Open in PDF Viewer'}
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    )}

                    {/* Копирај слика за PowerPoint / Слајдови (Ctrl+V) */}
                    <button
                      type="button"
                      onClick={() => handleCopyCardImage(item)}
                      className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                      title={language === 'mk' ? 'Копирај слика за PowerPoint / Слајдови (Ctrl+V)' : 'Copy image for PowerPoint / Slides (Ctrl+V)'}
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Извоз во PNG / SVG за презентација */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCodeIds([item.id]);
                        setIsPresentationExportOpen(true);
                      }}
                      className="p-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
                      title={language === 'mk' ? 'Извоз во PNG/SVG за презентација' : 'Export PNG/SVG for Slides'}
                    >
                      <Monitor className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setMovingQrItem(item)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title={t.moveToFolder}
                    >
                      <FolderInput className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateStudentScan(item)}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title={t.previewStudentScan}
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                      title={t.edit}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title={t.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )}
</main>

      {/* Футер */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">ЕдуQR Студио</span>
            <span>•</span>
            <span>Напредна образовна платформа за наставници по математика</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsArchitectureModalOpen(true)}
              className="text-indigo-600 hover:underline font-medium"
            >
              {language === 'mk' ? 'Системска Архитектура & База' : 'Architecture & DB Schema'}
            </button>
            <span>•</span>
            <span>Лев Виготски ZPD • Блумова Таксономија • Хауард Гарднер</span>
          </div>
        </div>
      </footer>

      {/* Модали */}
      {isEditorOpen && (
        <QRCodeEditorModal
          initialItem={editingItem}
          folders={folders}
          language={language}
          onSave={handleSaveItem}
          onSwitchToWizard={() => {
            setIsEditorOpen(false);
            setIsWizardOpen(true);
          }}
          onOpenTagManager={() => setIsTagManagerOpen(true)}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Уредувач на папки */}
      {isFolderEditorOpen && (
        <FolderEditorModal
          isOpen={isFolderEditorOpen}
          folder={editingFolder}
          language={language}
          onSave={handleSaveFolder}
          onClose={() => {
            setIsFolderEditorOpen(false);
            setEditingFolder(null);
          }}
        />
      )}

      {/* Брз дијалог за преместување на ставка во папка */}
      {movingQrItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderInput className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  {t.moveToFolder}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMovingQrItem(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              {language === 'mk'
                ? `Изберете во која папка сакате да го преместите QR кодот "${movingQrItem.title}":`
                : `Select target folder for "${movingQrItem.title}":`}
            </p>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => handleMoveItemToFolder(movingQrItem.id, undefined)}
                className={`w-full text-left px-3 py-2 text-xs rounded-xl border transition flex items-center justify-between ${
                  !movingQrItem.folderId
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>📁</span>
                  <span>{t.noFolderAssigned}</span>
                </span>
                {!movingQrItem.folderId && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </button>

              {folders.map((f) => {
                const isSelected = movingQrItem.folderId === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleMoveItemToFolder(movingQrItem.id, f.id)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: f.color }}
                      />
                      <span className="text-sm">{f.icon || '📁'}</span>
                      <span className="truncate">{f.name}</span>
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setMovingQrItem(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {isWizardOpen && (
        <GuidedLessonWizardModal
          language={language}
          onSave={(item) => {
            handleSaveItem(item);
            setIsWizardOpen(false);
          }}
          onClose={() => setIsWizardOpen(false)}
          onOpenPrintSheet={(item) => {
            handleSaveItem(item);
            setIsWizardOpen(false);
            setIsPrintModalOpen(true);
          }}
          onSimulateScan={(item) => {
            handleSimulateStudentScan(item);
          }}
        />
      )}

      {isStudentModalOpen && activeStudentItem && (
        <StudentScanModal
          item={activeStudentItem}
          language={language}
          onClose={() => {
            setIsStudentModalOpen(false);
            setActiveStudentItem(null);
          }}
          onOpenPdfViewer={(item) => setPdfViewerItem(item)}
        />
      )}

      {isPrintModalOpen && (
        <PrintWorksheetModal
          items={itemsToPrint}
          language={language}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

      {isArchitectureModalOpen && (
        <ArchitectureDocsModal
          language={language}
          onClose={() => setIsArchitectureModalOpen(false)}
        />
      )}

      {isAnalyticsOpen && (
        <AnalyticsDashboard
          items={qrCodes}
          language={language}
          onClose={() => setIsAnalyticsOpen(false)}
          onSimulateScan={handleSimulateStudentScan}
        />
      )}

      {/* Модал за споделени папки и соработка */}
      {isSharedFolderModalOpen && (
        <SharedFolderModal
          isOpen={isSharedFolderModalOpen}
          folders={folders}
          items={qrCodes}
          language={language}
          onSelectFolder={(folderId) => {
            setActiveFolderId(folderId);
          }}
          onClose={() => setIsSharedFolderModalOpen(false)}
        />
      )}

      {/* Модал за групно преименување */}
      {isBulkRenameOpen && (
        <BulkRenameModal
          isOpen={isBulkRenameOpen}
          selectedCodes={qrCodes.filter((c) => selectedCodeIds.includes(c.id))}
          language={language}
          onClose={() => setIsBulkRenameOpen(false)}
          onApplyRename={handleApplyBulkRename}
        />
      )}

      {/* Двонасочен гласовен асистент за наставникот (Speech Recognition + Gemini AI + Text-to-Speech) */}
      {isVoiceAssistantOpen && (
        <VoiceAssistantModal
          isOpen={isVoiceAssistantOpen}
          onClose={() => setIsVoiceAssistantOpen(false)}
          language={language}
          onApplyAsQRCode={handleApplyVoiceTask}
        />
      )}

      {/* Интерактивен PDF прегледувач за наставни ресурси */}
      {pdfViewerItem && (
        <PdfViewerModal
          isOpen={!!pdfViewerItem}
          item={pdfViewerItem}
          language={language}
          onClose={() => setPdfViewerItem(null)}
        />
      )}

      {/* Странична лента за управување со образовни ознаки */}
      <TagManagerSidebar
        isOpen={isTagManagerOpen}
        onClose={() => setIsTagManagerOpen(false)}
        language={language}
        qrCodes={qrCodes}
        customTags={customTags}
        onSaveNewTag={handleSaveNewTag}
        onRenameTag={handleRenameTag}
        onDeleteTag={handleDeleteTag}
        onSelectTagFilter={(tagId) => setTagFilter(tagId)}
        onSelectSubjectFilter={(subject) => {
          setSubjectFilter(subject);
          setActiveWorkspaceTab('materials');
        }}
        onAutoGenerateSubjectTags={handleAutoGenerateSubjectTags}
      />

      {/* 1-Клик Генератор за QR Лов на информации (Тематски станици) */}
      <ScavengerHuntModal
        isOpen={isScavengerHuntOpen}
        language={language}
        onClose={() => setIsScavengerHuntOpen(false)}
        onGenerate={handleGenerateScavengerHunt}
        onPrintStationsDirectly={handlePrintStationsDirectly}
      />

      {/* Математички Квиз со LaTeX & Клуч со решенија */}
      <MathQuizModal
        isOpen={isMathQuizOpen}
        language={language}
        onClose={() => setIsMathQuizOpen(false)}
        onSaveQuiz={handleSaveMathQuiz}
        onPrintQuizDirectly={handlePrintQuizDirectly}
      />

      {/* Водич за колеги & Чеклиста за тестирање */}
      <TeacherTestingGuideModal
        isOpen={isTestingGuideOpen}
        language={language}
        onClose={() => setIsTestingGuideOpen(false)}
        onOpenNewQr={handleOpenNew}
        onOpenScavengerHunt={() => setIsScavengerHuntOpen(true)}
        onOpenMathQuiz={() => setIsMathQuizOpen(true)}
        onOpenEngagement={() => setActiveWorkspaceTab('engagement')}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        onOpenTagManager={() => setIsTagManagerOpen(true)}
      />

      {/* Модал за групен увоз на PDF документи */}
      <BatchPdfImportModal
        isOpen={isBatchPdfImportOpen}
        language={language}
        existingFolders={folders}
        onClose={() => setIsBatchPdfImportOpen(false)}
        onComplete={handleBatchPdfImportComplete}
      />

      {/* Модал за извоз на PNG и SVG за PowerPoint & Google Slides */}
      <PresentationExportModal
        isOpen={isPresentationExportOpen}
        selectedCodes={
          selectedCodeIds.length > 0
            ? qrCodes.filter((c) => selectedCodeIds.includes(c.id))
            : filteredCodes.slice(0, 1)
        }
        language={language}
        onClose={() => setIsPresentationExportOpen(false)}
      />

      {/* Тост известување за копирање / увоз */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-bold animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
