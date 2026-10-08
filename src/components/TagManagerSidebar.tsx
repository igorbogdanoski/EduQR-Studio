import React, { useState, useMemo } from 'react';
import { EducationalQRCode, Language, CustomTag } from '../types';
import { translations } from '../i18n/translations';
import { EDUCATIONAL_SUBJECTS } from '../data/educationalSubjects';
import {
  Tag,
  X,
  Plus,
  Edit2,
  Trash2,
  Check,
  Palette,
  CheckCircle2,
  AlertTriangle,
  Folder,
  Layers,
  Sparkles,
  BookOpen,
  Zap,
  Filter
} from 'lucide-react';

const TAG_COLOR_PALETTE = [
  { name: 'Виолетова', color: '#8b5cf6' },
  { name: 'Тиркизна', color: '#0d9488' },
  { name: 'Портокалова', color: '#ea580c' },
  { name: 'Розова', color: '#e11d48' },
  { name: 'Килибарна', color: '#d97706' },
  { name: 'Индиго', color: '#4f46e5' },
  { name: 'Смарагдна', color: '#059669' },
  { name: 'Сина', color: '#0284c7' },
  { name: 'Скриена сива', color: '#475569' },
];

interface TagManagerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  qrCodes: EducationalQRCode[];
  customTags: CustomTag[];
  onSaveNewTag: (tag: CustomTag) => void;
  onRenameTag: (oldTagId: string, newTagId: string, newLabel?: string, newColor?: string) => void;
  onDeleteTag: (tagId: string) => void;
  onSelectTagFilter?: (tagId: string) => void;
  onSelectSubjectFilter?: (subject: string) => void;
  onAutoGenerateSubjectTags?: () => void;
}

export const TagManagerSidebar: React.FC<TagManagerSidebarProps> = ({
  isOpen,
  onClose,
  language,
  qrCodes,
  customTags,
  onSaveNewTag,
  onRenameTag,
  onDeleteTag,
  onSelectTagFilter,
  onSelectSubjectFilter,
  onAutoGenerateSubjectTags
}) => {
  const t = translations[language];

  // Создавање нова ознака
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState('#8b5cf6');
  const [isCreating, setIsCreating] = useState(false);

  // Уредување на постоечка ознака
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editColor, setEditColor] = useState('');

  // Пресметка на употреба на секоја ознака во QR кодовите
  const tagUsageMap = useMemo(() => {
    const map: Record<string, number> = {};
    qrCodes.forEach(code => {
      (code.tags || []).forEach(tag => {
        map[tag] = (map[tag] || 0) + 1;
      });
    });
    return map;
  }, [qrCodes]);

  // Автоматско детектирање и екстракција на предмети од QR кодовите
  const autoSubjectTags = useMemo(() => {
    const map = new Map<string, number>();
    qrCodes.forEach(c => {
      const subj = (c.subject || '').trim();
      if (subj) {
        map.set(subj, (map.get(subj) || 0) + 1);
      }
    });

    return Array.from(map.entries())
      .map(([name, count]) => {
        const matched = EDUCATIONAL_SUBJECTS.find(
          s => s.name.toLowerCase() === name.toLowerCase() ||
               s.id.toLowerCase() === name.toLowerCase()
        );
        return {
          name,
          count,
          icon: matched?.icon || '📚',
          color: matched?.defaultColor || '#4f46e5'
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [qrCodes]);

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const id = newLabel
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_а-шђјљњћџ]/gi, '');

    const newTag: CustomTag = {
      id: id || `tag_${Date.now()}`,
      label: newLabel.trim(),
      color: newColor,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onSaveNewTag(newTag);
    setNewLabel('');
    setNewColor('#8b5cf6');
    setIsCreating(false);
  };

  const handleStartEdit = (tag: CustomTag) => {
    setEditingTagId(tag.id);
    setEditLabel(tag.label);
    setEditColor(tag.color);
  };

  const handleSaveEdit = (oldTagId: string) => {
    if (!editLabel.trim()) return;
    const newTagId = editLabel
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_а-шђјљњћџ]/gi, '');

    onRenameTag(oldTagId, newTagId || oldTagId, editLabel.trim(), editColor);
    setEditingTagId(null);
  };

  const handleDelete = (tagId: string, label: string) => {
    const count = tagUsageMap[tagId] || 0;
    const msg =
      language === 'mk'
        ? `Дали сте сигурни дека сакате глобално да ја избришете ознаката "${label}"?\nТаа ќе биде отстранета од сите ${count} поврзани QR кодови.`
        : `Are you sure you want to delete tag "${label}" globally?\nIt will be removed from all ${count} associated QR codes.`;

    if (window.confirm(msg)) {
      onDeleteTag(tagId);
      if (editingTagId === tagId) setEditingTagId(null);
    }
  };

  const presetDefinitions = [
    { id: 'exam_prep', label: t.tagExamPrep, icon: '📝', color: '#2563eb' },
    { id: 'homework', label: t.tagHomework, icon: '🏠', color: '#d97706' },
    { id: 'in_class', label: t.tagInClass, icon: '🏫', color: '#059669' },
    { id: 'competition', label: t.tagCompetition, icon: '🏆', color: '#7c3aed' },
    { id: 'group_work', label: t.tagGroupWork, icon: '👥', color: '#4f46e5' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Затемнета позадина */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-slide-left">
          
          {/* Заглавие */}
          <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">
                  {t.tagManagerTitle || 'Менаџер на образовни ознаки'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'mk' ? 'Глобално управување со сите тагови' : 'Global management of all tags'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Содржина со скрол */}
          <div className="grow overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* Копче за додавање нова ознака */}
            {!isCreating ? (
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.tagManagerCreateNew || 'Креирај нова сопствена ознака'}</span>
              </button>
            ) : (
              <form
                onSubmit={handleCreateSubmit}
                className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-4 space-y-3 animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    {language === 'mk' ? 'Нова сопствена ознака' : 'New Custom Tag'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    {t.tagManagerTagLabel || 'Назив на ознаката'}
                  </label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder={language === 'mk' ? 'на пр. QR Лов на информации' : 'e.g. Scavenger Hunt'}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{t.tagManagerTagColor || 'Изберете боја'}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TAG_COLOR_PALETTE.map((pal) => (
                      <button
                        key={pal.color}
                        type="button"
                        onClick={() => setNewColor(pal.color)}
                        className={`w-7 h-7 rounded-full transition cursor-pointer flex items-center justify-center shadow-2xs ${
                          newColor === pal.color
                            ? 'ring-3 ring-indigo-500 scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: pal.color }}
                        title={pal.name}
                      >
                        {newColor === pal.color && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200/60 rounded-xl"
                  >
                    {language === 'mk' ? 'Откажи' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={!newLabel.trim()}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                  >
                    {t.tagManagerSaveTag || 'Зачувај'}
                  </button>
                </div>
              </form>
            )}

            {/* Секција 0: Автоматски предметни тагови од QR кодовите */}
            <div className="space-y-3 p-4 bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-slate-50 border border-indigo-200/90 rounded-3xl shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>{language === 'mk' ? 'Предметни тагови (Автоматски)' : 'Subject Tags (Auto)'}</span>
                </span>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  {autoSubjectTags.length} {language === 'mk' ? 'предмети' : 'subjects'}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-snug">
                {language === 'mk'
                  ? 'Автоматски екстрахирани од полето „Предмет“ во вашите QR кодови. Кликнете за брзо филтрирање низ сите содржини.'
                  : 'Automatically extracted from the Subject field in your QR codes. Click to filter immediately.'}
              </p>

              {/* Копче за глобална синхронизација */}
              {onAutoGenerateSubjectTags && (
                <button
                  type="button"
                  onClick={onAutoGenerateSubjectTags}
                  className="w-full py-2 px-3 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer group"
                  title="Автоматски додај го предметот како активен таг на сите QR кодови"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span>{language === 'mk' ? '⚡ Синхронизирај предмети како тагови' : '⚡ Sync Subjects into Tags'}</span>
                </button>
              )}

              {autoSubjectTags.length === 0 ? (
                <div className="p-3 bg-white/70 border border-slate-200 rounded-xl text-center text-xs text-slate-500 italic">
                  {language === 'mk' ? 'Нема пронајдено предмети во тековните материјали.' : 'No subjects detected in items.'}
                </div>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {autoSubjectTags.map((subj) => {
                    const isAlreadyCustomTag = customTags.some(
                      ct => ct.label.toLowerCase() === subj.name.toLowerCase()
                    );

                    return (
                      <div
                        key={subj.name}
                        className="bg-white border border-slate-200/90 hover:border-indigo-300 rounded-xl p-2.5 flex items-center justify-between gap-2 transition shadow-2xs group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base shrink-0">{subj.icon}</span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-800 truncate">
                              {subj.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">
                              {subj.count} {subj.count === 1 ? (language === 'mk' ? 'материјал' : 'item') : (language === 'mk' ? 'материјали' : 'items')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Копче: Филтрирај */}
                          {onSelectSubjectFilter && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectSubjectFilter(subj.name);
                                onClose();
                              }}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              title={`Филтрирај само ${subj.name}`}
                            >
                              <Filter className="w-3 h-3 text-indigo-600" />
                              <span>{language === 'mk' ? 'Филтер' : 'Filter'}</span>
                            </button>
                          )}

                          {/* Копче: Зачувај како трајна ознака */}
                          {!isAlreadyCustomTag && (
                            <button
                              type="button"
                              onClick={() => {
                                onSaveNewTag({
                                  id: subj.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_а-шђјљњћџ]/gi, ''),
                                  label: subj.name,
                                  color: subj.color,
                                  createdAt: new Date().toISOString().split('T')[0]
                                });
                              }}
                              className="p-1 text-slate-400 hover:text-emerald-600 rounded-md hover:bg-emerald-50 transition cursor-pointer text-xs"
                              title={language === 'mk' ? 'Зачувај како траен таг' : 'Save as permanent tag'}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Секција 1: Сопствени ознаки (Custom Tags) со уредување & бришење */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>{language === 'mk' ? 'Сопствени ознаки' : 'Custom Tags'}</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {customTags.length} {language === 'mk' ? 'вкупно' : 'total'}
                </span>
              </div>

              {customTags.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                  {language === 'mk' ? 'Нема креирано сопствени ознаки. Кликнете на копчето горе за да додадете!' : 'No custom tags created yet.'}
                </div>
              ) : (
                <div className="space-y-2">
                  {customTags.map((tag) => {
                    const isEditing = editingTagId === tag.id;
                    const usageCount = tagUsageMap[tag.id] || 0;

                    if (isEditing) {
                      return (
                        <div
                          key={tag.id}
                          className="bg-slate-50 border border-indigo-300 rounded-2xl p-3.5 space-y-3 shadow-xs"
                        >
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                              {language === 'mk' ? 'Нов назив на ознаката' : 'Tag Label'}
                            </label>
                            <input
                              type="text"
                              value={editLabel}
                              onChange={(e) => setEditLabel(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                              {language === 'mk' ? 'Боја' : 'Color'}
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                              {TAG_COLOR_PALETTE.map((pal) => (
                                <button
                                  key={pal.color}
                                  type="button"
                                  onClick={() => setEditColor(pal.color)}
                                  className={`w-6 h-6 rounded-full transition cursor-pointer flex items-center justify-center ${
                                    editColor === pal.color
                                      ? 'ring-2 ring-indigo-500 scale-110'
                                      : 'hover:scale-105'
                                  }`}
                                  style={{ backgroundColor: pal.color }}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingTagId(null)}
                              className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-200/60 rounded-lg"
                            >
                              Откажи
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(tag.id)}
                              className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-2xs"
                            >
                              Зачувај измени
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={tag.id}
                        className="bg-white border border-slate-200 rounded-2xl p-3 hover:border-slate-300 transition flex items-center justify-between gap-2 shadow-2xs group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                            style={{ backgroundColor: tag.color }}
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-800 truncate">
                              {tag.label}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {usageCount} {t.tagManagerUsageCount || 'материјали'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Филтрирај директно */}
                          {onSelectTagFilter && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectTagFilter(tag.id);
                                onClose();
                              }}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition cursor-pointer text-xs"
                              title="Филтрирај материјали по оваа ознака"
                            >
                              🔍
                            </button>
                          )}

                          {/* Преименувај */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(tag)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
                            title="Уреди / Преименувај глобално"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Избриши */}
                          <button
                            type="button"
                            onClick={() => handleDelete(tag.id, tag.label)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                            title="Избриши глобално"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Секција 2: Системски педагошки ознаки (Preset System Tags) */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>{language === 'mk' ? 'Стандардни педагошки ознаки' : 'Standard Pedagogical Tags'}</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {language === 'mk' ? 'Системски' : 'System'}
                </span>
              </div>

              <div className="space-y-2">
                {presetDefinitions.map((def) => {
                  const usageCount = tagUsageMap[def.id] || 0;
                  return (
                    <div
                      key={def.id}
                      className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-2.5 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{def.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{def.label}</div>
                          <div className="text-[10px] text-slate-400">
                            {usageCount} {t.tagManagerUsageCount || 'материјали'}
                          </div>
                        </div>
                      </div>

                      {onSelectTagFilter && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectTagFilter(def.id);
                            onClose();
                          }}
                          className="px-2 py-1 text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                        >
                          Филтрирај
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-400 italic pt-1">
                {t.tagManagerPresetNote || 'Стандардните педагошки ознаки се дел од образовната методологија и не можат да се бришат.'}
              </p>
            </div>
          </div>

          {/* Долно подножје */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              {t.close || 'Затвори'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
