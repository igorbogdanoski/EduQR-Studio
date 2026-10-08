import React, { useState, useEffect } from 'react';
import { EducationalFolder, FolderCategoryType, Language } from '../types';
import { translations } from '../i18n/translations';
import { X, Folder, Palette, Smile, Save, Check } from 'lucide-react';

interface FolderEditorModalProps {
  isOpen: boolean;
  folder?: EducationalFolder | null;
  language: Language;
  onSave: (folder: EducationalFolder) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#4f46e5', // Indigo
  '#0d9488', // Teal
  '#7c3aed', // Purple/Violet
  '#059669', // Emerald
  '#d97706', // Amber
  '#e11d48', // Rose
  '#0284c7', // Sky Blue
  '#475569', // Slate
];

const PRESET_ICONS = [
  '📁', '📐', '🧮', '⚛️', '📄', '🏫', '🎯', '🧪', '💡', '📊', '🎓', '💻', '🔬', '🌟', '📚', '✏️'
];

export const FolderEditorModal: React.FC<FolderEditorModalProps> = ({
  isOpen,
  folder,
  language,
  onSave,
  onClose,
}) => {
  const t = translations[language];

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryType, setCategoryType] = useState<FolderCategoryType>('subject');
  const [color, setColor] = useState('#4f46e5');
  const [icon, setIcon] = useState('📁');

  useEffect(() => {
    if (folder) {
      setName(folder.name || '');
      setDescription(folder.description || '');
      setCategoryType(folder.categoryType || 'subject');
      setColor(folder.color || '#4f46e5');
      setIcon(folder.icon || '📁');
    } else {
      setName('');
      setDescription('');
      setCategoryType('subject');
      setColor('#4f46e5');
      setIcon('📁');
    }
  }, [folder, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const savedFolder: EducationalFolder = {
      id: folder?.id || `folder-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      description: description.trim() || undefined,
      categoryType,
      color,
      icon,
      createdAt: folder?.createdAt || new Date().toISOString().split('T')[0],
    };

    onSave(savedFolder);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Хедер */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner border border-white/20"
              style={{ backgroundColor: color }}
            >
              {icon}
            </div>
            <div>
              <h2 className="text-base font-bold">
                {folder ? t.editFolder : t.newFolder}
              </h2>
              <p className="text-xs text-slate-400">
                {t.foldersTitle}
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

        {/* Формулар */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Име на папка */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.folderName} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                language === 'mk'
                  ? 'на пр: Математика 8-мо одделение или Квадратни равенки'
                  : 'e.g., Geometry Grade 8 or Project STEM'
              }
              className="w-full text-xs font-medium px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Опис / Педагошка цел */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.folderDesc}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                language === 'mk'
                  ? 'Краток опис на содржината, тематската целина или методологија...'
                  : 'Brief description of the lesson module or topic...'
              }
              className="w-full text-xs px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none"
            />
          </div>

          {/* Категорија */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.categoryType}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCategoryType('subject')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                  categoryType === 'subject'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>📚</span>
                <span>{t.catSubject}</span>
              </button>

              <button
                type="button"
                onClick={() => setCategoryType('class')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                  categoryType === 'class'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>🏫</span>
                <span>{t.catClass}</span>
              </button>

              <button
                type="button"
                onClick={() => setCategoryType('project')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                  categoryType === 'project'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>⚛️</span>
                <span>{t.catProject}</span>
              </button>
            </div>
          </div>

          {/* Избор на боја */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.selectFolderColor}</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-xl transition-transform flex items-center justify-center shadow-xs ${
                    color === c ? 'scale-110 ring-2 ring-offset-2 ring-slate-800' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                title="Произволна боја"
              />
            </div>
          </div>

          {/* Избор на икона / емоџи */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.selectFolderIcon}</span>
            </label>
            <div className="grid grid-cols-8 gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
              {PRESET_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`h-8 rounded-lg text-base flex items-center justify-center transition ${
                    icon === emoji
                      ? 'bg-white shadow-xs border border-indigo-300 scale-110'
                      : 'hover:bg-slate-200/60'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Копчиња */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.saveFolder}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
