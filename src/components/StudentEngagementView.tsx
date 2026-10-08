import React, { useState, useMemo } from 'react';
import { EducationalQRCode, EducationalFolder, Language, CustomTag } from '../types';
import { translations } from '../i18n/translations';
import { QRCodePreview } from './QRCodePreview';
import { getStoredCustomTags } from '../services/storage';
import {
  Trophy,
  Flame,
  TrendingUp,
  Award,
  Sparkles,
  Eye,
  Edit3,
  Printer,
  FileText,
  Search,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  AlertCircle,
  Compass,
  Lightbulb,
  GraduationCap,
  Play
} from 'lucide-react';

interface StudentEngagementViewProps {
  items: EducationalQRCode[];
  folders: EducationalFolder[];
  language: Language;
  onSimulateScan: (item: EducationalQRCode) => void;
  onEditItem: (item: EducationalQRCode) => void;
  onPrintItem: (item: EducationalQRCode) => void;
  onOpenPdfViewer: (item: EducationalQRCode) => void;
  onOpenScavengerHunt: () => void;
}

export const StudentEngagementView: React.FC<StudentEngagementViewProps> = ({
  items,
  folders,
  language,
  onSimulateScan,
  onEditItem,
  onPrintItem,
  onOpenPdfViewer,
  onOpenScavengerHunt
}) => {
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'scans_desc' | 'scans_asc' | 'recent' | 'title'>('scans_desc');

  const customTags: CustomTag[] = useMemo(() => {
    return getStoredCustomTags();
  }, [items]);

  const customTagMap = useMemo(() => {
    const map = new Map<string, CustomTag>();
    customTags.forEach(ct => map.set(ct.id, ct));
    return map;
  }, [customTags]);

  // Вкупно скенирања и аналитика
  const totalScans = useMemo(() => {
    return items.reduce((acc, curr) => acc + (curr.scanCount || 0), 0);
  }, [items]);

  const maxScans = useMemo(() => {
    return Math.max(...items.map(i => i.scanCount || 0), 1);
  }, [items]);

  const sortedLeaderboard = useMemo(() => {
    let result = [...items];

    // Филтрирање
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        i =>
          i.title.toLowerCase().includes(q) ||
          i.subject.toLowerCase().includes(q) ||
          (i.targetGrade && i.targetGrade.toLowerCase().includes(q))
      );
    }

    if (subjectFilter !== 'all') {
      result = result.filter(i => i.subject === subjectFilter);
    }

    // Сортирање
    result.sort((a, b) => {
      if (sortBy === 'scans_desc') return (b.scanCount || 0) - (a.scanCount || 0);
      if (sortBy === 'scans_asc') return (a.scanCount || 0) - (b.scanCount || 0);
      if (sortBy === 'recent') {
        const dateA = a.lastScannedAt ? new Date(a.lastScannedAt).getTime() : 0;
        const dateB = b.lastScannedAt ? new Date(b.lastScannedAt).getTime() : 0;
        return dateB - dateA;
      }
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [items, searchQuery, subjectFilter, sortBy]);

  // Предмети достапни за филтер
  const availableSubjects = useMemo(() => {
    const subs = new Set<string>();
    items.forEach(i => {
      if (i.subject) subs.add(i.subject);
    });
    return Array.from(subs);
  }, [items]);

  // Најпопуларен материјал (#1)
  const topMaterial = useMemo(() => {
    if (items.length === 0) return null;
    const sorted = [...items].sort((a, b) => (b.scanCount || 0) - (a.scanCount || 0));
    return sorted[0];
  }, [items]);

  // Најактивен предмет
  const topSubjectStat = useMemo(() => {
    const subjectScans: Record<string, number> = {};
    items.forEach(i => {
      subjectScans[i.subject] = (subjectScans[i.subject] || 0) + (i.scanCount || 0);
    });
    let bestSubject = '';
    let bestCount = 0;
    Object.entries(subjectScans).forEach(([subj, count]) => {
      if (count > bestCount) {
        bestCount = count;
        bestSubject = subj;
      }
    });
    return { subject: bestSubject || 'Математика', count: bestCount };
  }, [items]);

  // Материјали со низок интерес (< 5 скенирања)
  const lowEngagementItems = useMemo(() => {
    return items.filter(i => (i.scanCount || 0) < 5);
  }, [items]);

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 font-black text-sm flex items-center justify-center shadow-md shadow-amber-200 ring-2 ring-amber-300/60 shrink-0">
          🥇
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-800 font-black text-sm flex items-center justify-center shadow-md shadow-slate-200 ring-2 ring-slate-300/60 shrink-0">
          🥈
        </div>
      );
    }
    if (index === 2) {
      return (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-600 text-amber-100 font-black text-sm flex items-center justify-center shadow-md shadow-amber-800/30 ring-2 ring-amber-600/60 shrink-0">
          🥉
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center border border-slate-200 shrink-0">
        #{index + 1}
      </div>
    );
  };

  const getEngagementBadge = (scanCount: number) => {
    if (scanCount >= 40) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-50 text-rose-700 border border-rose-200">
          <Flame className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
          <span>{t.engagementTopRank || '🔥 Шампион на часот'}</span>
        </span>
      );
    }
    if (scanCount >= 20) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-700 border border-amber-200">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>{t.engagementHighInterest || '⭐ Висок интерес'}</span>
        </span>
      );
    }
    if (scanCount >= 6) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.engagementTrending || '📈 Во пораст'}</span>
        </span>
      );
    }
    if (scanCount >= 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.engagementStarted || '🎯 Започнато'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
        <span>💤 Без скенирања</span>
      </span>
    );
  };

  const averageScans = items.length > 0 ? (totalScans / items.length).toFixed(1) : '0';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Наслов и опис на приказот */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-indigo-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'mk' ? 'Аналитика на ученички интерес & Скенирања' : 'Student Interest & Scan Analytics'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              {t.engagementTitle || 'Лидерска табла на ученичка ангажираност'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.engagementSubtitle || 'Следете кои наставни материјали и QR кодови предизвикуваат најголем интерес и активност кај учениците во училницата.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenScavengerHunt}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>{t.scavengerHuntTitle || 'QR Лов на информации (Станици)'}</span>
            </button>
          </div>
        </div>

        {/* Статистички картички */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-slate-300 font-semibold">{t.totalScans}</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">{totalScans}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{language === 'mk' ? 'активни интеракции' : 'active scans'}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-slate-300 font-semibold">{t.engagementAvgScans || 'Просечно по материјал'}</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">{averageScans}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{language === 'mk' ? 'скенирања по QR код' : 'scans / code'}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-slate-300 font-semibold">{t.engagementTopSubject || 'Најактивен предмет'}</div>
            <div className="text-lg sm:text-xl font-black text-indigo-200 mt-1 truncate">{topSubjectStat.subject}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{topSubjectStat.count} {language === 'mk' ? 'скенирања' : 'scans'}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="text-[11px] text-slate-300 font-semibold">{t.engagementTopRank || 'Шампион на часот'}</div>
            <div className="text-lg sm:text-xl font-black text-amber-300 mt-1 truncate">
              {topMaterial ? topMaterial.title : '-'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {topMaterial ? `${topMaterial.scanCount} ${language === 'mk' ? 'скенирања' : 'scans'}` : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Контролна лента за пребарување и филтрирање на лидерската табла */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative grow max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Филтер по предмет */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="all">{t.filterSubject}</option>
              {availableSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            {/* Сортирање */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              <button
                type="button"
                onClick={() => setSortBy('scans_desc')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  sortBy === 'scans_desc' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                {language === 'mk' ? 'Најмногу скенирани' : 'Most Scans'}
              </button>
              <button
                type="button"
                onClick={() => setSortBy('recent')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  sortBy === 'recent' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                {language === 'mk' ? 'Најнови' : 'Recent'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Главна лидерска табла */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
              {t.engagementLeaderboardBtn || t.engagementTitle || 'Лидерска табла на најпопуларни QR кодови'}
            </h3>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
              {sortedLeaderboard.length} {language === 'mk' ? 'материјали' : 'items'}
            </span>
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            {language === 'mk' ? 'Кликнете на копчињата за дејство десно за брз тест или печатење' : 'Quick test or print directly'}
          </div>
        </div>

        {sortedLeaderboard.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <div className="text-3xl">🔍</div>
            <p className="font-bold text-slate-700">{t.noCodesFound}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedLeaderboard.map((item, index) => {
              const scans = item.scanCount || 0;
              const scanPercentage = totalScans > 0 ? Math.round((scans / totalScans) * 100) : 0;
              const relativeBarWidth = Math.max(Math.round((scans / maxScans) * 100), 4);
              const folderObj = folders.find(f => f.id === item.folderId);

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  {/* Лева страна: Ранг + QR минијатура + Информации за задачата */}
                  <div className="flex items-start sm:items-center gap-3.5 grow min-w-0">
                    {/* Ранг значка */}
                    {getRankBadge(index)}

                    {/* QR Preview минијатура */}
                    <div className="shrink-0 w-14 h-14 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs group-hover:border-indigo-300 transition overflow-hidden flex items-center justify-center">
                      <QRCodePreview
                        item={item}
                        language={language}
                        showActions={false}
                      />
                    </div>

                    {/* Наслов, предмет, одделение и ознаки */}
                    <div className="space-y-1 min-w-0 grow">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition truncate">
                          {item.title}
                        </span>
                        {getEngagementBadge(scans)}
                        {item.type === 'document_file' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                            <FileText className="w-3 h-3" />
                            <span>PDF</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                        <span className="text-indigo-600 font-bold">{item.subject}</span>
                        {item.targetGrade && <span>• {item.targetGrade}</span>}
                        {folderObj && (
                          <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            <span>📁</span>
                            <span className="truncate max-w-[120px]">{folderObj.name}</span>
                          </span>
                        )}
                        {item.lastScannedAt && (
                          <span className="text-[11px] text-slate-400">
                            (Последно: {item.lastScannedAt.split(' ')[0]})
                          </span>
                        )}
                      </div>

                      {/* Приказ на ознаки со нивните сопствени бои */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                          {item.tags.map(tagId => {
                            const customDef = customTagMap.get(tagId);
                            if (customDef) {
                              return (
                                <span
                                  key={tagId}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border shadow-2xs"
                                  style={{
                                    backgroundColor: `${customDef.color}15`,
                                    borderColor: `${customDef.color}40`,
                                    color: customDef.color
                                  }}
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: customDef.color }}
                                  />
                                  <span>{customDef.label}</span>
                                </span>
                              );
                            }
                            return (
                              <span
                                key={tagId}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                <span>🏷️</span>
                                <span>{tagId}</span>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Десна страна: Метар на скенирања + Копчиња за дејство */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Метар на скенирања и прогрес бар */}
                    <div className="text-right min-w-[110px] space-y-1">
                      <div className="flex items-baseline justify-end gap-1.5">
                        <span className="text-xl sm:text-2xl font-black text-slate-900">{scans}</span>
                        <span className="text-xs font-semibold text-slate-400">
                          {language === 'mk' ? 'скенирања' : 'scans'}
                        </span>
                      </div>
                      <div className="w-28 bg-slate-100 h-2 rounded-full overflow-hidden ml-auto border border-slate-200/60">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${relativeBarWidth}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {scanPercentage}% {language === 'mk' ? 'од вкупните' : 'of total'}
                      </div>
                    </div>

                    {/* Акциски копчиња */}
                    <div className="flex items-center gap-1">
                      {/* Тестирај ученички приказ */}
                      <button
                        type="button"
                        onClick={() => onSimulateScan(item)}
                        className="p-2 text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition cursor-pointer"
                        title={language === 'mk' ? 'Тестирај ученички приказ' : 'Simulate student scan'}
                      >
                        <Play className="w-4 h-4 fill-indigo-600" />
                      </button>

                      {/* PDF Viewer ако е наставен лист */}
                      {item.type === 'document_file' && (
                        <button
                          type="button"
                          onClick={() => onOpenPdfViewer(item)}
                          className="p-2 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer"
                          title="Отвори во интерактивен PDF прегледувач"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}

                      {/* Печати */}
                      <button
                        type="button"
                        onClick={() => onPrintItem(item)}
                        className="p-2 text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition cursor-pointer"
                        title={t.printSheet}
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {/* Уреди */}
                      <button
                        type="button"
                        onClick={() => onEditItem(item)}
                        className="p-2 text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                        title="Уреди ја задачата"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Секција за стимулација на помалку активни материјали */}
      {lowEngagementItems.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 sm:p-6 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="space-y-1 grow">
              <h4 className="font-extrabold text-amber-950 text-sm sm:text-base">
                {t.engagementLowPrompt || 'Материјали за дополнителна стимулација на часот'}
              </h4>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                {t.engagementLowAdvice || 'Овие материјали имаат помалку од 5 скенирања. Препорака за наставникот: Испечатете ги како картички за маси, прикачете ги на физичката огласна табла или вклучете ги во QR Лов на информации низ училницата!'}
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenScavengerHunt}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{language === 'mk' ? 'Креирај QR Лов' : 'Create Scavenger Hunt'}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {lowEngagementItems.slice(0, 6).map(it => (
              <span
                key={it.id}
                onClick={() => onSimulateScan(it)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-200 rounded-xl text-xs font-bold text-amber-950 hover:border-amber-400 hover:bg-amber-100/50 transition cursor-pointer shadow-2xs"
                title="Кликни за симулација на скенирање"
              >
                <span>🎯</span>
                <span className="truncate max-w-[200px]">{it.title}</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-black">
                  {it.scanCount || 0}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
