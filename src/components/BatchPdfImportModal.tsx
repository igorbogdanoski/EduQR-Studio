import React, { useState, useRef } from 'react';
import { EducationalFolder, EducationalQRCode, FolderCategoryType, Language } from '../types';
import { translations } from '../i18n/translations';
import { EDUCATIONAL_SUBJECTS } from '../data/educationalSubjects';
import {
  FileText,
  Upload,
  FolderPlus,
  X,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
  Palette,
  Folder,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface BatchPdfFileItem {
  id: string;
  file: File;
  title: string;
  subject: string;
  grade: string;
  sizeFormatted: string;
}

interface BatchPdfImportModalProps {
  isOpen: boolean;
  language: Language;
  existingFolders: EducationalFolder[];
  onClose: () => void;
  onComplete: (newCodes: EducationalQRCode[], newFolder: EducationalFolder) => void;
}

const FOLDER_COLOR_PALETTE = [
  '#4f46e5', // Indigo
  '#0d9488', // Teal
  '#0284c7', // Sky
  '#7c3aed', // Purple
  '#c2410c', // Orange
  '#059669', // Emerald
  '#e11d48', // Rose
  '#d97706', // Amber
  '#475569'  // Slate
];

const FOLDER_ICONS = ['📁', '📄', '📑', '📚', '🧪', '⚡', '📐', '💻', '🌍', '📝', '🎯', '🏫'];

export const BatchPdfImportModal: React.FC<BatchPdfImportModalProps> = ({
  isOpen,
  language,
  existingFolders,
  onClose,
  onComplete
}) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<BatchPdfFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState<{ current: number; total: number } | null>(null);

  // Конфигурација на новата папка
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [newFolderCategory, setNewFolderCategory] = useState<FolderCategoryType>('class');
  const [newFolderColor, setNewFolderColor] = useState<string>('#4f46e5');
  const [newFolderIcon, setNewFolderIcon] = useState<string>('📑');
  const [defaultSubject, setDefaultSubject] = useState<string>('Математика');
  const [defaultGrade, setDefaultGrade] = useState<string>('8-мо одделение');

  if (!isOpen) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const sanitizeFilenameToTitle = (filename: string): string => {
    return filename
      .replace(/\.pdf$/i, '')
      .replace(/[_-]+/g, ' ')
      .trim();
  };

  const handleFilesSelected = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newItems: BatchPdfFileItem[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const title = sanitizeFilenameToTitle(file.name);
        newItems.push({
          id: `batch-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          file,
          title,
          subject: defaultSubject,
          grade: defaultGrade,
          sizeFormatted: formatFileSize(file.size)
        });
      }
    }

    if (newItems.length > 0) {
      setFiles((prev) => [...prev, ...newItems]);
      if (!newFolderName) {
        setNewFolderName(
          language === 'mk'
            ? `Увезени PDF Документи (${newItems.length})`
            : language === 'sq'
            ? `Dokumente PDF të Importuara (${newItems.length})`
            : `Imported PDF Documents (${newItems.length})`
        );
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateItemTitle = (id: string, newTitle: string) => {
    setFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  };

  const handleUpdateItemSubject = (id: string, newSubject: string) => {
    setFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, subject: newSubject } : item))
    );
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handleExecuteBatchImport = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProcessProgress({ current: 0, total: files.length });

    try {
      const folderId = `folder-batch-${Date.now()}`;
      const finalFolderName =
        newFolderName.trim() ||
        (language === 'mk'
          ? `Увезени PDF Материјали (${files.length})`
          : `Imported PDF Materials (${files.length})`);

      const createdFolder: EducationalFolder = {
        id: folderId,
        name: finalFolderName,
        description:
          language === 'mk'
            ? `Автоматски креирана папка со ${files.length} дигитализирани PDF документи за настава.`
            : `Auto-generated folder with ${files.length} digitized educational PDF documents.`,
        categoryType: newFolderCategory,
        color: newFolderColor,
        icon: newFolderIcon,
        createdAt: new Date().toISOString().split('T')[0]
      };

      const generatedCodes: EducationalQRCode[] = [];

      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        let fileDataUrl = '';
        try {
          fileDataUrl = await readFileAsDataUrl(item.file);
        } catch (readErr) {
          console.warn(`Could not read file ${item.file.name}`, readErr);
        }

        const shortCode = `doc${Math.floor(100 + Math.random() * 900)}${String.fromCharCode(
          97 + Math.floor(Math.random() * 26)
        )}`;

        const newQrCode: EducationalQRCode = {
          id: `qr-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          shortCode: shortCode,
          title: item.title || sanitizeFilenameToTitle(item.file.name),
          description:
            language === 'mk'
              ? `PDF документ: ${item.file.name} (${item.sizeFormatted}). Скенирајте за отворање и преглед на содржината.`
              : `PDF document: ${item.file.name} (${item.sizeFormatted}). Scan to open and review.`,
          type: 'document_file',
          createdAt: new Date().toISOString().split('T')[0],
          subject: item.subject || defaultSubject,
          targetGrade: item.grade || defaultGrade,
          folderId: folderId,
          fileName: item.file.name,
          fileSize: item.sizeFormatted,
          fileType: 'application/pdf',
          fileDataUrl: fileDataUrl,
          targetUrl: `https://eduqr.app/?task=${shortCode}`,
          latexContent: `\\text{${item.title.substring(0, 40)}}`,
          bloomLevel: 'apply',
          tags: ['in_class', 'homework'],
          scanCount: 0,
          requiresPin: false,
          style: {
            fgColor: newFolderColor,
            bgColor: '#ffffff',
            errorCorrectionLevel: 'Q',
            iconType: 'book',
            margin: 2,
            size: 260
          }
        };

        generatedCodes.push(newQrCode);
        setProcessProgress({ current: i + 1, total: files.length });
      }

      onComplete(generatedCodes, createdFolder);
      onClose();
    } catch (err) {
      console.error('Batch import failed', err);
      alert(language === 'mk' ? 'Грешка при увоз на PDF документите.' : 'Failed to import PDF documents.');
    } finally {
      setIsProcessing(false);
      setProcessProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-auto animate-scale-in">
        
        {/* Заглавие */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-100">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {language === 'mk'
                    ? 'Групен Увоз на PDF Документи'
                    : language === 'sq'
                    ? 'Importimi në Grup i Dokumenteve PDF'
                    : 'Batch PDF Documents Import'}
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md border border-rose-200">
                  Auto-QR
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'mk'
                  ? 'Прикачете повеќе PDF фајлови: секој добива сопствен QR код во новосоздадена папка, со насловот преземен од името на датотеката.'
                  : 'Upload multiple PDF files: each gets an automatic QR code in a new folder, titled after its filename.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Чекор 1: Зона за прикачување / Избор на фајлови */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/70 scale-[1.01]'
              : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept=".pdf,application/pdf"
            onChange={(e) => handleFilesSelected(e.target.files)}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-rose-600 group-hover:scale-105 transition-transform">
            <FileText className="w-7 h-7" />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800">
              {language === 'mk'
                ? 'Кликнете за избор на PDF датотеки или повлечете ги тука (Drag & Drop)'
                : 'Click to select PDF files or drag and drop them here'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'mk'
                ? 'Поддржани се повеќекратни PDF датотеки (наставни листови, тестови, вежби, наставни материјали)'
                : 'Supports multiple PDF files simultaneously (worksheets, tests, exercises)'}
            </p>
          </div>

          <button
            type="button"
            className="mt-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>{language === 'mk' ? 'Избери PDF датотеки' : 'Select PDF files'}</span>
          </button>
        </div>

        {/* Список на избрани документи */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span>{language === 'mk' ? 'Избрани документи' : 'Selected documents'}:</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-xs">
                  {files.length}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setFiles([])}
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                {language === 'mk' ? 'Исчисти сè' : 'Clear all'}
              </button>
            </div>

            <div className="max-h-52 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
              {files.map((item, idx) => (
                <div
                  key={item.id}
                  className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2.5 grow min-w-0">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                    <div className="grow min-w-0">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateItemTitle(item.id, e.target.value)}
                        placeholder="Наслов на документот"
                        className="w-full font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                        <span className="font-mono">{item.file.name}</span>
                        <span>•</span>
                        <span>{item.sizeFormatted}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={item.subject}
                      onChange={(e) => handleUpdateItemSubject(item.id, e.target.value)}
                      className="text-[11px] bg-white border border-slate-200 rounded-lg px-2 py-1 font-medium text-slate-700"
                    >
                      {EDUCATIONAL_SUBJECTS.map((sub) => (
                        <option key={sub.id} value={sub.name}>
                          {sub.icon} {sub.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveFile(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition"
                      title="Отстрани"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Чекор 2: Креирање на нова папка за увозот */}
        <div className="bg-indigo-50/50 p-4 sm:p-5 rounded-2xl border border-indigo-100 space-y-4">
          <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
            <FolderPlus className="w-4 h-4 text-indigo-600" />
            <span>
              {language === 'mk'
                ? 'Нова папка за автоматско групирање на кодовите'
                : 'New folder for automatic grouping'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'mk' ? 'Име на новата папка:' : 'New folder name:'}
              </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="на пр. Тестови 8-мо одделение (Март)"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'mk' ? 'Категорија на папка:' : 'Folder category:'}
              </label>
              <select
                value={newFolderCategory}
                onChange={(e) => setNewFolderCategory(e.target.value as FolderCategoryType)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
              >
                <option value="class">{language === 'mk' ? 'Одделение / Клас' : 'Class / Grade'}</option>
                <option value="subject">{language === 'mk' ? 'Наставен Предмет' : 'Subject'}</option>
                <option value="project">{language === 'mk' ? 'Тематски Проект' : 'Project'}</option>
              </select>
            </div>
          </div>

          {/* Избор на икона и боја за папката */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-indigo-100">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600 mr-1">
                {language === 'mk' ? 'Икона:' : 'Icon:'}
              </span>
              <div className="flex items-center gap-1">
                {FOLDER_ICONS.slice(0, 7).map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewFolderIcon(icon)}
                    className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition ${
                      newFolderIcon === icon
                        ? 'bg-indigo-600 text-white shadow-2xs scale-110'
                        : 'bg-white hover:bg-indigo-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600 mr-1">
                {language === 'mk' ? 'Боја:' : 'Color:'}
              </span>
              <div className="flex items-center gap-1">
                {FOLDER_COLOR_PALETTE.slice(0, 6).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewFolderColor(color)}
                    className={`w-5 h-5 rounded-full transition ${
                      newFolderColor === color ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Прогрес при обработка */}
        {isProcessing && processProgress && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>{language === 'mk' ? 'Се генерираат QR кодови...' : 'Generating QR codes...'}</span>
              </span>
              <span>
                {processProgress.current} / {processProgress.total}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-300"
                style={{
                  width: `${(processProgress.current / processProgress.total) * 100}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Долни контроли */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            {t.close}
          </button>

          <button
            type="button"
            onClick={handleExecuteBatchImport}
            disabled={files.length === 0 || isProcessing}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === 'mk' ? 'Се зачувува...' : 'Processing...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {language === 'mk'
                    ? `Генерирај ${files.length} QR кодови во нова папка`
                    : `Generate ${files.length} QR codes in new folder`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
