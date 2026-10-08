import React, { useState, useMemo } from 'react';
import { EducationalQRCode, BloomLevel, Language } from '../types';
import { translations } from '../i18n/translations';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Layers,
  ArrowRight
} from 'lucide-react';

interface BloomTaxonomySummaryProps {
  items: EducationalQRCode[];
  language: Language;
  activeBloomFilter: string;
  onSelectBloomFilter: (level: string) => void;
}

export const BloomTaxonomySummary: React.FC<BloomTaxonomySummaryProps> = ({
  items,
  language,
  activeBloomFilter,
  onSelectBloomFilter
}) => {
  const t = translations[language];
  const [isExpanded, setIsExpanded] = useState(true);

  const bloomDefinitions: {
    id: BloomLevel;
    order: number;
    color: string;
    barColor: string;
    bg: string;
    border: string;
    tier: 'LOTS' | 'HOTS';
  }[] = [
    { id: 'remember', order: 1, color: 'text-sky-700', barColor: '#0284c7', bg: 'bg-sky-50', border: 'border-sky-200', tier: 'LOTS' },
    { id: 'understand', order: 2, color: 'text-teal-700', barColor: '#0d9488', bg: 'bg-teal-50', border: 'border-teal-200', tier: 'LOTS' },
    { id: 'apply', order: 3, color: 'text-indigo-700', barColor: '#6366f1', bg: 'bg-indigo-50', border: 'border-indigo-200', tier: 'HOTS' },
    { id: 'analyze', order: 4, color: 'text-amber-700', barColor: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-200', tier: 'HOTS' },
    { id: 'evaluate', order: 5, color: 'text-orange-700', barColor: '#ea580c', bg: 'bg-orange-50', border: 'border-orange-200', tier: 'HOTS' },
    { id: 'create', order: 6, color: 'text-rose-700', barColor: '#e11d48', bg: 'bg-rose-50', border: 'border-rose-200', tier: 'HOTS' }
  ];

  // Пресметка на фреквенција по Блумови нивоа
  const distributionData = useMemo(() => {
    const totalWithBloom = items.filter((item) => item.bloomLevel).length;

    return bloomDefinitions.map((def) => {
      const count = items.filter((item) => item.bloomLevel === def.id).length;
      const percentage = totalWithBloom > 0 ? Math.round((count / totalWithBloom) * 100) : 0;
      const name = t.bloomShort[def.id] || def.id;

      return {
        id: def.id,
        order: def.order,
        name: `${def.order}. ${name}`,
        shortName: name,
        count,
        percentage,
        color: def.color,
        barColor: def.barColor,
        bg: def.bg,
        border: def.border,
        tier: def.tier
      };
    });
  }, [items, t, bloomDefinitions]);

  // Статистики за LOTS наспроти HOTS
  const balanceStats = useMemo(() => {
    const totalCategorized = items.filter((i) => i.bloomLevel).length;
    if (totalCategorized === 0) {
      return {
        total: 0,
        lotsCount: 0,
        hotsCount: 0,
        lotsPercent: 0,
        hotsPercent: 0,
        uncategorizedCount: items.length,
        status: 'neutral' as const,
        recommendation: language === 'mk' 
          ? 'Сè уште немате означено Блумови нивоа на вашите QR кодови. Означете ги за да добиете препорака.' 
          : language === 'sq'
          ? 'Ende nuk keni shënuar nivele të Bloom-it në kodet tuaja QR.'
          : 'No QR codes tagged with Bloom taxonomy levels yet. Categorize items to receive lesson planning insights.'
      };
    }

    const lotsCount = items.filter((i) => i.bloomLevel === 'remember' || i.bloomLevel === 'understand').length;
    const hotsCount = totalCategorized - lotsCount;
    const lotsPercent = Math.round((lotsCount / totalCategorized) * 100);
    const hotsPercent = 100 - lotsPercent;

    let status: 'balanced' | 'lots_heavy' | 'hots_heavy' = 'balanced';
    let recommendation = '';

    if (lotsPercent >= 65) {
      status = 'lots_heavy';
      recommendation = language === 'mk'
        ? 'Преовладуваат основни вештини за помнење. Се препорачува додавање на повеќе задачи од ниво "Примена" и "Анализа" за критичко размислување.'
        : language === 'sq'
        ? 'Mbizotërojnë shkathtësitë themelore të kujtesës. Rekomandohet shtimi i detyrave të zbatimit dhe analizës.'
        : 'Heavy emphasis on foundational recall. Consider adding more "Apply" and "Analyze" activities to foster critical thinking.';
    } else if (hotsPercent >= 80) {
      status = 'hots_heavy';
      recommendation = language === 'mk'
        ? 'Висока когнитивна сложеност. Обезбедете скалирање по Виготски (ZPD) или 1-2 задачи за разбирање како воведни чекори.'
        : language === 'sq'
        ? 'Kompleksitet i lartë kognitiv. Siguroni shkallëzim Vygotsky ose detyra hyrëse për kuptim.'
        : 'High cognitive rigor. Consider adding Vygotsky scaffolding hints or 1-2 introductory conceptual checks.';
    } else {
      status = 'balanced';
      recommendation = language === 'mk'
        ? 'Одличен баланс на наставниот план! Имате здрава рамнотежа помеѓу концептуална основа (LOTS) и практично решавање (HOTS).'
        : language === 'sq'
        ? 'Balancë e shkëlqyer e planit mësimor midis bazës konceptuale dhe zgjidhjes praktike!'
        : 'Well-balanced pedagogical distribution between conceptual foundation and higher-order critical thinking.';
    }

    return {
      total: totalCategorized,
      lotsCount,
      hotsCount,
      lotsPercent,
      hotsPercent,
      uncategorizedCount: items.length - totalCategorized,
      status,
      recommendation
    };
  }, [items, language]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200">
      {/* Заглавие со контрола за колапс */}
      <div 
        className="px-5 py-4 bg-gradient-to-r from-slate-50 via-indigo-50/30 to-purple-50/20 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl shadow-xs">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
                {t.bloomSummaryTitle}
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                {balanceStats.total}/{items.length} {language === 'mk' ? 'означени' : 'tagged'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.bloomSummarySubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Брзи индикатори за LOTS / HOTS */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-sky-700">LOTS: {balanceStats.lotsPercent}%</span>
            <span className="text-slate-300">|</span>
            <span className="text-indigo-700">HOTS: {balanceStats.hotsPercent}%</span>
          </div>

          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white/80 transition"
            aria-label={t.toggleBloomChart}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Проширена содржина со графикон и педагошки совет */}
      {isExpanded && (
        <div className="p-5 space-y-5">
          {/* Графикон и Баланс индикатор */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Recharts BarChart */}
            <div className="lg:col-span-7 bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                  {language === 'mk' ? 'Когнитивен дијаграм на задачите' : 'Cognitive Demand Bar Chart'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {language === 'mk' ? 'Кликнете на столб за филтрирање' : 'Click a bar to filter'}
                </span>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={distributionData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                  >
                    <XAxis
                      dataKey="shortName"
                      tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                      interval={0}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                    />
                    <Tooltip
                      formatter={(val: any, _name: any, item: any) => [
                        `${val} ${language === 'mk' ? 'задачи' : 'tasks'} (${item.payload.percentage}%)`,
                        item.payload.tier === 'LOTS' ? 'LOTS (Основни вештини)' : 'HOTS (Виши вештини)'
                      ]}
                      labelFormatter={(label: any) => `${label}`}
                      contentStyle={{
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar
                      dataKey="count"
                      radius={[6, 6, 0, 0]}
                      onClick={(data) => {
                        if (data && data.id) {
                          onSelectBloomFilter(activeBloomFilter === data.id ? 'all' : data.id);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {distributionData.map((entry) => (
                        <Cell
                          key={`cell-${entry.id}`}
                          fill={entry.barColor}
                          opacity={activeBloomFilter === 'all' || activeBloomFilter === entry.id ? 1 : 0.35}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Педагошки баланс и советник */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              {/* Пропорција LOTS vs HOTS */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>{t.lotsLabel.split('(')[0]}</span>
                  <span>{t.hotsLabel.split('(')[0]}</span>
                </div>

                {/* Баланс скала */}
                <div className="h-3.5 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${balanceStats.lotsPercent}%` }}
                    className="bg-gradient-to-r from-sky-500 to-teal-500 transition-all duration-500"
                    title={`LOTS: ${balanceStats.lotsPercent}%`}
                  />
                  <div
                    style={{ width: `${balanceStats.hotsPercent}%` }}
                    className="bg-gradient-to-r from-indigo-500 via-amber-500 to-rose-500 transition-all duration-500"
                    title={`HOTS: ${balanceStats.hotsPercent}%`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                    {balanceStats.lotsCount} ({balanceStats.lotsPercent}%)
                  </span>
                  <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                    {balanceStats.hotsCount} ({balanceStats.hotsPercent}%)
                  </span>
                </div>
              </div>

              {/* Педагошка препорака */}
              <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                balanceStats.status === 'balanced'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : balanceStats.status === 'lots_heavy'
                  ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                  : 'bg-indigo-50/80 border-indigo-200 text-indigo-900'
              }`}>
                <div className="flex items-center gap-1.5 font-bold">
                  {balanceStats.status === 'balanced' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>{t.balanceRecommendation}</span>
                </div>
                <p className="text-[11px] opacity-90">
                  {balanceStats.recommendation}
                </p>
              </div>
            </div>
          </div>

          {/* Интерактивни чипови за секое ниво за брзо филтрирање */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1 border-t border-slate-100">
            {distributionData.map((lvl) => {
              const isActive = activeBloomFilter === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onSelectBloomFilter(isActive ? 'all' : lvl.id)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer group ${
                    isActive
                      ? 'bg-indigo-600 border-indigo-700 text-white shadow-xs'
                      : `${lvl.bg} ${lvl.border} hover:shadow-2xs text-slate-800`
                  }`}
                  title={`${t.filterByBloomLevel}: ${lvl.name}`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                      isActive ? 'text-indigo-200' : lvl.color
                    }`}>
                      {lvl.tier}
                    </span>
                    <span className={`text-xs font-black px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-700 border border-slate-200'
                    }`}>
                      {lvl.count}
                    </span>
                  </div>
                  <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>
                    {lvl.name}
                  </div>
                  <div className={`text-[10px] mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {lvl.percentage}% {language === 'mk' ? 'од кодовите' : 'of codes'}
                  </div>
                </button>
              );
            })}
          </div>

          {activeBloomFilter !== 'all' && (
            <div className="flex items-center justify-between text-xs bg-indigo-50 text-indigo-800 px-3 py-2 rounded-xl border border-indigo-100">
              <span className="flex items-center gap-1.5 font-medium">
                <Filter className="w-3.5 h-3.5" />
                <span>
                  {language === 'mk' ? 'Активен филтер:' : 'Active Filter:'}{' '}
                  <strong>{t.bloomShort[activeBloomFilter as BloomLevel] || activeBloomFilter}</strong>
                </span>
              </span>
              <button
                type="button"
                onClick={() => onSelectBloomFilter('all')}
                className="font-bold underline hover:text-indigo-950 cursor-pointer"
              >
                {language === 'mk' ? 'Прикажи ги сите' : 'Show All'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
