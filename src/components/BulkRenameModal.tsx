import React, { useState, useMemo } from 'react';
import { EducationalQRCode, Language } from '../types';
import { translations } from '../i18n/translations';
import { 
  X, 
  Edit3, 
  Check, 
  Hash, 
  Type, 
  ListOrdered, 
  ArrowRight, 
  Sparkles,
  Info
} from 'lucide-react';

export type RenameMode = 'prefix_existing' | 'prefix_sequential' | 'number_existing' | 'common_title';

interface BulkRenameModalProps {
  isOpen: boolean;
  selectedCodes: EducationalQRCode[];
  language: Language;
  onClose: () => void;
  onApplyRename: (updatedCodes: EducationalQRCode[]) => void;
}

export const BulkRenameModal: React.FC<BulkRenameModalProps> = ({
  isOpen,
  selectedCodes,
  language,
  onClose,
  onApplyRename
}) => {
  const t = translations[language];

  const [mode, setMode] = useState<RenameMode>('prefix_existing');
  const [prefix, setPrefix] = useState<string>(
    language === 'mk' ? 'Тема 1 - ' : language === 'sq' ? 'Tema 1 - ' : 'Unit 1 - '
  );
  const [commonTitle, setCommonTitle] = useState<string>(
    language === 'mk' ? 'Математичка станица' : language === 'sq' ? 'Stacioni matematikor' : 'Math Station'
  );
  const [startNumber, setStartNumber] = useState<number>(1);
  const [suffix, setSuffix] = useState<string>('');
  const [useZeroPadding, setUseZeroPadding] = useState<boolean>(true);

  // Калкулација на нови наслови во живо
  const previewItems = useMemo(() => {
    return selectedCodes.map((code, index) => {
      const currentNum = startNumber + index;
      const formattedNum = useZeroPadding && selectedCodes.length >= 10 && currentNum < 10
        ? `0${currentNum}`
        : `${currentNum}`;

      let newTitle = code.title;

      switch (mode) {
        case 'prefix_existing':
          newTitle = `${prefix}${code.title}${suffix}`;
          break;
        case 'prefix_sequential':
          newTitle = `${prefix}#${formattedNum}${suffix ? ` ${suffix}` : ''}`;
          break;
        case 'number_existing':
          newTitle = `${formattedNum}. ${code.title}${suffix}`;
          break;
        case 'common_title':
          newTitle = `${commonTitle} #${formattedNum}${suffix ? ` ${suffix}` : ''}`;
          break;
      }

      return {
        id: code.id,
        originalTitle: code.title,
        newTitle: newTitle.trim(),
        originalItem: code
      };
    });
  }, [selectedCodes, mode, prefix, commonTitle, startNumber, suffix, useZeroPadding]);

  if (!isOpen || selectedCodes.length === 0) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = previewItems.map((p) => ({
      ...p.originalItem,
      title: p.newTitle,
      updatedAt: new Date().toISOString()
    }));
    onApplyRename(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Заглавие */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-xl">
              <Edit3 className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {t.bulkRenameTitle}
              </h3>
              <p className="text-xs text-indigo-200">
                {selectedCodes.length} {t.selectedCount} {language === 'mk' ? 'за преименување' : 'to be renamed'}
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

        {/* Форма за конфигурација */}
        <form onSubmit={handleSubmit} className="flex flex-col grow overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-5 grow">
            {/* Опис */}
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>{t.bulkRenameSubtitle}</span>
            </div>

            {/* Избор на режим на преименување */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.renameMode}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* 1. Префикс + Постоечки наслов */}
                <button
                  type="button"
                  onClick={() => {
                    setMode('prefix_existing');
                    if (!prefix) setPrefix('Тема 1 - ');
                  }}
                  className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
                    mode === 'prefix_existing'
                      ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 font-semibold text-indigo-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-indigo-600" />
                      {language === 'mk' ? 'Префикс + Постоечки' : 'Prefix + Existing Title'}
                    </span>
                    {mode === 'prefix_existing' && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    [Префикс] + [Тековен наслов]
                  </span>
                </button>

                {/* 2. Префикс + Реден број */}
                <button
                  type="button"
                  onClick={() => {
                    setMode('prefix_sequential');
                    if (!prefix) setPrefix('Станица ');
                  }}
                  className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
                    mode === 'prefix_sequential'
                      ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 font-semibold text-indigo-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <ListOrdered className="w-3.5 h-3.5 text-indigo-600" />
                      {language === 'mk' ? 'Префикс + Реден број' : 'Prefix + Sequential #'}
                    </span>
                    {mode === 'prefix_sequential' && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Станица #1, Станица #2...
                  </span>
                </button>

                {/* 3. Реден број + Постоечки наслов */}
                <button
                  type="button"
                  onClick={() => setMode('number_existing')}
                  className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
                    mode === 'number_existing'
                      ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 font-semibold text-indigo-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-indigo-600" />
                      {language === 'mk' ? 'Нумериран редослед' : 'Numbered Prefix + Title'}
                    </span>
                    {mode === 'number_existing' && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    1. Наслов, 2. Наслов...
                  </span>
                </button>

                {/* 4. Заеднички наслов + Бројка */}
                <button
                  type="button"
                  onClick={() => setMode('common_title')}
                  className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
                    mode === 'common_title'
                      ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 font-semibold text-indigo-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      {language === 'mk' ? 'Заеднички назив + Број' : 'Common Title + Number'}
                    </span>
                    {mode === 'common_title' && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Математички квиз #1...
                  </span>
                </button>
              </div>
            </div>

            {/* Влезни полиња зависно од режимот */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
              {mode === 'common_title' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'mk' ? 'Заеднички основен наслов:' : 'Base Common Title:'}
                  </label>
                  <input
                    type="text"
                    value={commonTitle}
                    onChange={(e) => setCommonTitle(e.target.value)}
                    placeholder={language === 'mk' ? 'на пр: Математичка активност' : 'e.g. Math Lab'}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              ) : (
                mode !== 'number_existing' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.prefixLabel}
                    </label>
                    <input
                      type="text"
                      value={prefix}
                      onChange={(e) => setPrefix(e.target.value)}
                      placeholder={language === 'mk' ? 'на пр: Станица ' : 'e.g. Station '}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                )
              )}

              {/* Нумерирање и суфикс */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mode !== 'prefix_existing' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.startNumberLabel}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={startNumber}
                      onChange={(e) => setStartNumber(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.suffixLabel}
                  </label>
                  <input
                    type="text"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder={language === 'mk' ? 'на пр: (Група А)' : 'e.g. (Group A)'}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Опција за 0-padding (на пр. 01, 02) */}
              {mode !== 'prefix_existing' && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="zeroPadding"
                    checked={useZeroPadding}
                    onChange={(e) => setUseZeroPadding(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="zeroPadding" className="text-xs text-slate-600 cursor-pointer select-none">
                    {language === 'mk'
                      ? 'Користи водечка нула за едноцифрени броеви (на пр. #01, #02)'
                      : 'Use leading zero for single digits (e.g. #01, #02)'}
                  </label>
                </div>
              )}
            </div>

            {/* Преглед во живо на преименуваните кодови */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.livePreviewTitle}
                </span>
                <span className="text-[11px] text-slate-400">
                  {previewItems.length} {language === 'mk' ? 'ставки' : 'items'}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl max-h-48 overflow-y-auto divide-y divide-slate-100">
                {previewItems.map((item, idx) => (
                  <div key={item.id} className="p-3 text-xs flex items-center justify-between gap-3">
                    <span className="text-slate-400 font-mono text-[11px] shrink-0 w-6">
                      #{idx + 1}
                    </span>
                    <span className="text-slate-500 line-through truncate max-w-[40%]">
                      {item.originalTitle}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="font-bold text-indigo-950 truncate max-w-[50%] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                      {item.newTitle}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Копчиња за акција */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{t.applyBulkRename} ({selectedCodes.length})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
