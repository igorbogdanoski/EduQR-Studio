import React, { useState } from 'react';
import { EducationalFolder, EducationalQRCode, FolderCategoryType, Language } from '../types';
import { translations } from '../i18n/translations';
import { Folder, Plus, Edit2, Trash2, FolderOpen, Layers, BookOpen, GraduationCap, Sparkles, Share2, Copy, Check } from 'lucide-react';

interface FolderManagerProps {
  folders: EducationalFolder[];
  activeFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onOpenCreateFolder: () => void;
  onOpenSharedModal?: () => void;
  onEditFolder: (folder: EducationalFolder) => void;
  onDeleteFolder: (folderId: string) => void;
  items: EducationalQRCode[];
  language: Language;
}

export const FolderManager: React.FC<FolderManagerProps> = ({
  folders,
  activeFolderId,
  onSelectFolder,
  onOpenCreateFolder,
  onOpenSharedModal,
  onEditFolder,
  onDeleteFolder,
  items,
  language,
}) => {
  const t = translations[language];
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'all' | FolderCategoryType>('all');
  const [recentlyCopiedId, setRecentlyCopiedId] = useState<string | null>(null);

  // Број на ставки по папка
  const getItemCount = (folderId: string) => {
    return items.filter((item) => item.folderId === folderId).length;
  };

  const uncategorizedCount = items.filter((item) => !item.folderId).length;

  const filteredFolders = folders.filter((f) => {
    if (selectedCategoryTab === 'all') return true;
    return f.categoryType === selectedCategoryTab;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
      {/* Хедер на папките со табови за тип */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <FolderOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800">
              {t.foldersTitle}
            </h3>
            <p className="text-[11px] text-slate-500">
              {language === 'mk' 
                ? 'Организирајте ги наставните содржини по предмети, одделенија или проекти'
                : 'Organize lesson materials by subjects, classes, or specific projects'}
            </p>
          </div>
        </div>

        {/* Табови за филтер на папките + Копче за нова папка */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-[11px]">
            <button
              type="button"
              onClick={() => setSelectedCategoryTab('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                selectedCategoryTab === 'all'
                  ? 'bg-white text-slate-800 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'mk' ? 'Сите' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategoryTab('subject')}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                selectedCategoryTab === 'subject'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📚</span>
              <span>{t.catSubject}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategoryTab('class')}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                selectedCategoryTab === 'class'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🏫</span>
              <span>{t.catClass}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategoryTab('project')}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                selectedCategoryTab === 'project'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>⚛️</span>
              <span>{t.catProject}</span>
            </button>
          </div>

          {onOpenSharedModal && (
            <button
              type="button"
              onClick={onOpenSharedModal}
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl transition flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
              title={t.sharedFoldersTitle}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t.sharedFoldersTitle}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCreateFolder}
            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-[11px] font-bold rounded-xl transition flex items-center gap-1 shrink-0 cursor-pointer"
            title={t.newFolder}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.newFolder}</span>
          </button>
        </div>
      </div>

      {/* Листа / Чипови на папки */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {/* Копче: Сите материјали */}
        <button
          type="button"
          onClick={() => onSelectFolder(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 border ${
            activeFolderId === null
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span>📁</span>
          <span>{t.allMaterials}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeFolderId === null ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {items.length}
          </span>
        </button>

        {/* Папки */}
        {filteredFolders.map((folder) => {
          const count = getItemCount(folder.id);
          const isActive = activeFolderId === folder.id;

          return (
            <div
              key={folder.id}
              className={`group inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-xl text-xs font-medium border transition ${
                isActive
                  ? 'bg-indigo-50/80 border-indigo-500 text-indigo-900 shadow-xs ring-1 ring-indigo-500'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectFolder(folder.id)}
                className="inline-flex items-center gap-1.5 text-left"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: folder.color }}
                />
                <span className="text-sm leading-none">{folder.icon || '📁'}</span>
                <span className="font-semibold text-xs truncate max-w-[150px] sm:max-w-[200px]" title={folder.name}>
                  {folder.name}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-indigo-200/70 text-indigo-900' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>

              {/* Акции: сподели ID, уреди и бриши */}
              <div className="flex items-center opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity ml-1 pl-1 border-l border-slate-200">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(folder.id);
                    setRecentlyCopiedId(folder.id);
                    setTimeout(() => setRecentlyCopiedId(null), 2000);
                  }}
                  className="p-1 text-slate-400 hover:text-indigo-600 rounded-md transition cursor-pointer"
                  title={`${t.copyFolderId}: ${folder.id}`}
                >
                  {recentlyCopiedId === folder.id ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditFolder(folder);
                  }}
                  className="p-1 text-slate-400 hover:text-indigo-600 rounded-md transition cursor-pointer"
                  title={t.editFolder}
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFolder(folder.id);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition cursor-pointer"
                  title={t.deleteFolder}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredFolders.length === 0 && (
          <span className="text-xs text-slate-400 italic px-2">
            {language === 'mk' ? 'Нема папки во оваа категорија' : 'No folders in this category'}
          </span>
        )}
      </div>

      {/* Приказ на активна папка детали */}
      {activeFolderId && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          {(() => {
            const current = folders.find((f) => f.id === activeFolderId);
            if (!current) return null;
            return (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">
                    {language === 'mk' ? 'Активен филтер:' : 'Active Filter:'} {current.icon} {current.name}
                  </span>
                  {current.description && (
                    <span className="text-slate-400 hidden md:inline truncate max-w-sm">
                      — {current.description}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-mono">ID:</span>
                    <code className="text-[11px] font-bold font-mono text-indigo-700">{current.id}</code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(current.id);
                        setRecentlyCopiedId(current.id);
                        setTimeout(() => setRecentlyCopiedId(null), 2000);
                      }}
                      className="text-slate-400 hover:text-indigo-600 p-0.5 ml-0.5 transition cursor-pointer"
                      title={t.copyFolderId}
                    >
                      {recentlyCopiedId === current.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectFolder(null)}
                    className="text-indigo-600 hover:underline font-semibold text-[11px] cursor-pointer"
                  >
                    {language === 'mk' ? 'Прикажи ги сите' : 'Clear filter'}
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
