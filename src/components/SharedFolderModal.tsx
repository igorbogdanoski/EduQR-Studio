import React, { useState } from 'react';
import { EducationalFolder, EducationalQRCode, Language } from '../types';
import { translations } from '../i18n/translations';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Folder, 
  ArrowRight, 
  ExternalLink, 
  Users, 
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SharedFolderModalProps {
  isOpen: boolean;
  folders: EducationalFolder[];
  items: EducationalQRCode[];
  language: Language;
  onSelectFolder: (folderId: string) => void;
  onClose: () => void;
}

export const SharedFolderModal: React.FC<SharedFolderModalProps> = ({
  isOpen,
  folders,
  items,
  language,
  onSelectFolder,
  onClose,
}) => {
  const t = translations[language];
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [inputFolderId, setInputFolderId] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleCopyId = (folderId: string) => {
    navigator.clipboard.writeText(folderId);
    setCopiedId(folderId);
    setStatusMessage({
      type: 'success',
      text: `${t.folderIdCopied} (${folderId})`,
    });
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const handleCopyShareLink = (folderId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('folder', folderId);
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(folderId);
    setStatusMessage({
      type: 'success',
      text: language === 'mk' ? 'Директниот линк за колеги е копиран!' : 'Direct sharing link copied!',
    });
    setTimeout(() => {
      setCopiedLink(null);
    }, 2500);
  };

  const handleOpenFolderById = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = inputFolderId.trim();
    if (!cleanId) return;

    const matched = folders.find((f) => f.id.toLowerCase() === cleanId.toLowerCase());
    if (matched) {
      onSelectFolder(matched.id);
      setStatusMessage({
        type: 'success',
        text: `${t.folderOpenedSuccess} (${matched.name})`,
      });
      setTimeout(() => {
        onClose();
      }, 900);
    } else {
      setStatusMessage({
        type: 'error',
        text: `${t.folderNotFound} Проверете дали ID-то е точно.`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Хедер */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-inner">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {t.sharedFoldersTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'mk' 
                  ? 'Споделувајте цели збирки на наставни QR кодови со колеги наставници преку клипборд'
                  : 'Share collections of educational QR codes with colleagues via clipboard'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto grow">
          {/* Статус порака */}
          {statusMessage && (
            <div
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Внеси ID на споделена папка од колега */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
              <Share2 className="w-4 h-4 text-indigo-600" />
              <span>{t.openSharedFolder}</span>
            </div>
            <p className="text-xs text-slate-600">
              {t.enterFolderIdPrompt}
            </p>
            <form onSubmit={handleOpenFolderById} className="flex gap-2">
              <input
                type="text"
                value={inputFolderId}
                onChange={(e) => setInputFolderId(e.target.value)}
                placeholder="на пр: folder-geom-8 или folder-alg-1"
                className="grow px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Отвори</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Листа на ваши папки за споделување */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                {language === 'mk' ? 'Ваши папки и уникатни ID кодови:' : 'Your Folders & Unique IDs:'}
              </h3>
              <span className="text-[11px] text-slate-400">
                {folders.length} {language === 'mk' ? 'папки достапни' : 'folders available'}
              </span>
            </div>

            <div className="space-y-2.5">
              {folders.map((folder) => {
                const count = items.filter((i) => i.folderId === folder.id).length;
                const isIdCopied = copiedId === folder.id;
                const isLinkCopied = copiedLink === folder.id;

                return (
                  <div
                    key={folder.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner shrink-0"
                        style={{ backgroundColor: `${folder.color}20`, color: folder.color }}
                      >
                        {folder.icon || '📁'}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                            {folder.name}
                          </h4>
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.2 rounded-md text-white"
                            style={{ backgroundColor: folder.color }}
                          >
                            {count} {t.itemsCount}
                          </span>
                        </div>
                        {folder.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {folder.description}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] font-medium text-slate-400">ID:</span>
                          <code className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                            {folder.id}
                          </code>
                        </div>
                      </div>
                    </div>

                    {/* Копчиња за копирање */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      {/* Копирај ID */}
                      <button
                        type="button"
                        onClick={() => handleCopyId(folder.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                          isIdCopied
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                        title={t.copyFolderId}
                      >
                        {isIdCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>{language === 'mk' ? 'Копирано!' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{t.copyFolderId}</span>
                          </>
                        )}
                      </button>

                      {/* Копирај директен линк */}
                      <button
                        type="button"
                        onClick={() => handleCopyShareLink(folder.id)}
                        className={`p-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                          isLinkCopied
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                        }`}
                        title="Копирај директен линк со филтер за колега"
                      >
                        {isLinkCopied ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <ExternalLink className="w-4 h-4 text-indigo-600" />
                        )}
                      </button>

                      {/* Избери директно */}
                      <button
                        type="button"
                        onClick={() => {
                          onSelectFolder(folder.id);
                          onClose();
                        }}
                        className="p-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl text-slate-500 transition cursor-pointer"
                        title="Отвори ја оваа папка"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Футер */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{language === 'mk' ? 'Колегата едноставно го внесува ID-то и веднаш ја отвора збирката.' : 'Colleagues can paste the ID to immediately filter and access the collection.'}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
