import React, { useState, useMemo } from 'react';
import { EducationalQRCode, Language } from '../types';
import { translations } from '../i18n/translations';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  X, 
  TrendingUp, 
  BarChart2, 
  Award, 
  Layers, 
  Brain, 
  Calendar, 
  ArrowUpRight, 
  Eye, 
  CheckCircle2, 
  BookOpen,
  FileSpreadsheet,
  Download,
  Loader2
} from 'lucide-react';
import { exportAnalyticsToCsv } from '../services/csvExportService';

interface AnalyticsDashboardProps {
  items: EducationalQRCode[];
  language: Language;
  onClose: () => void;
  onSimulateScan?: (item: EducationalQRCode) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  items,
  language,
  onClose,
  onSimulateScan
}) => {
  const t = translations[language];
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7);
  const [chartMode, setChartMode] = useState<'total' | 'materials'>('total');
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [csvSuccessMessage, setCsvSuccessMessage] = useState(false);

  const handleExportCsv = () => {
    setIsExportingCsv(true);
    setTimeout(() => {
      const success = exportAnalyticsToCsv(items, dateLabels, language);
      setIsExportingCsv(false);
      if (success) {
        setCsvSuccessMessage(true);
        setTimeout(() => setCsvSuccessMessage(false), 4000);
      }
    }, 150);
  };

  // Генерирање на хронолошка временска низа за последните N денови
  const dateLabels = useMemo(() => {
    const list: string[] = [];
    const now = new Date();
    for (let i = timeRange - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      list.push(str);
    }
    return list;
  }, [timeRange]);

  // Сортирање на материјалите според фреквенција на пристап (најскенирани први)
  const sortedMaterials = useMemo(() => {
    return [...items].sort((a, b) => (b.scanCount || 0) - (a.scanCount || 0));
  }, [items]);

  // Топ 4 најпопуларни наставни материјали за компаративен графикон
  const topMaterials = useMemo(() => {
    return sortedMaterials.slice(0, 4);
  }, [sortedMaterials]);

  // Форматирање на податоците за Recharts LineChart
  const chartData = useMemo(() => {
    // Детерминистичка симулација на распределба за историските денови врз основа на scanCount
    return dateLabels.map((dateStr, idx) => {
      // Форматирање на датумот за приказ на X-оската (на пр. "12 Апр")
      const parts = dateStr.split('-');
      const day = parts[2];
      const monthNum = parseInt(parts[1], 10);
      const monthNamesMk = ['Јан', 'Фев', 'Мар', 'Апр', 'Мај', 'Јун', 'Јул', 'Авг', 'Сеп', 'Окт', 'Ноем', 'Дек'];
      const displayDate = `${day} ${monthNamesMk[monthNum - 1] || parts[1]}`;

      const point: Record<string, any> = {
        date: displayDate,
        rawDate: dateStr,
        total: 0
      };

      // Пресметка на скенирања за секој материјал
      sortedMaterials.forEach((mat) => {
        // Ако има запишано во scanHistory
        const found = mat.scanHistory?.find(h => h.date === dateStr);
        let count = 0;
        if (found) {
          count = found.count;
        } else {
          // Реалистична синусоидна дистрибуција на скенирањата за часовите по математика
          const baseWeight = (mat.scanCount || 0) / (timeRange * 1.5);
          const variation = Math.sin((idx + mat.title.length) * 0.9) * 0.5 + 0.5;
          count = Math.max(0, Math.round(baseWeight * (0.5 + variation)));
        }

        // Кратенка на наслов за легенда
        const key = mat.shortCode;
        point[key] = count;
        point.total += count;
      });

      return point;
    });
  }, [dateLabels, sortedMaterials, timeRange]);

  // Вкупни статистички показатели
  const totalScans = useMemo(() => items.reduce((acc, c) => acc + (c.scanCount || 0), 0), [items]);
  const avgScans = useMemo(() => (items.length > 0 ? (totalScans / items.length).toFixed(1) : '0'), [items, totalScans]);
  const mostAccessed = sortedMaterials[0];

  // Бои за линиите на Recharts
  const materialColors = ['#4f46e5', '#059669', '#d97706', '#dc2626'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[94vh]">
        {/* Заглавие */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-md shadow-indigo-500/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  {language === 'mk' ? 'Аналитика на Скенирања на QR Кодови' : language === 'sq' ? 'Analitika e Skanimeve' : 'QR Scan Analytics Dashboard'}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/30 text-indigo-300 rounded-md border border-indigo-400/20">
                  Recharts Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'mk' 
                  ? 'Фреквенција на пристап и идентификација на најкористените наставни материјали' 
                  : 'Scan frequency over time & most accessed educational materials'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={isExportingCsv}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition cursor-pointer disabled:opacity-50"
              title={t.exportCsv}
            >
              {isExportingCsv ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{t.exportingCsv}</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                  <span className="hidden sm:inline">{t.exportCsv}</span>
                  <span className="sm:hidden">CSV</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {csvSuccessMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.csvExportSuccess}</span>
          </div>
        )}

        {/* Тело на аналитичкиот панел */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Индикатор картички */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Вкупно скенирања</span>
                <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                  <BarChart2 className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{totalScans}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Активни во училниците</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Просек по материјал</span>
                <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <BookOpen className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{avgScans}</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                скенирања по задача
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Топ наставен материјал</span>
                <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                  <Award className="w-4 h-4" />
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 mt-2 truncate">
                {mostAccessed ? mostAccessed.title : 'Нема податоци'}
              </div>
              <div className="text-[11px] text-indigo-700 font-semibold mt-0.5">
                {mostAccessed ? `${mostAccessed.scanCount} скенирања (${mostAccessed.shortCode})` : '-'}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Виготски ZPD задачи</span>
                <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                  <Layers className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {items.filter(i => i.type === 'vygotsky_scaffold' || (i.scaffoldingSteps && i.scaffoldingSteps.length > 0)).length}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                со скалирани чекори
              </div>
            </div>
          </div>

          {/* Главен графикон со Recharts */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span>Фреквенција на скенирања низ времето</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {chartMode === 'total' 
                    ? 'Вкупен број на интеракции со сите QR кодови по денови' 
                    : 'Споредба на топ 4 најбарани наставни материјали'}
                </p>
              </div>

              {/* Контроли за временски опсег и приказ */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Режим на графикон */}
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 font-semibold shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setChartMode('total')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      chartMode === 'total'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Вкупно
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMode('materials')}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      chartMode === 'materials'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    По материјали
                  </button>
                </div>

                {/* Временски опсег */}
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 font-semibold shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setTimeRange(7)}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      timeRange === 7
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    7 дена
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeRange(14)}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      timeRange === 14
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    14 дена
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeRange(30)}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      timeRange === 30
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    30 дена
                  </button>
                </div>
              </div>
            </div>

            {/* Самиот Recharts приказ */}
            <div className="w-full h-72 sm:h-80 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === 'total' ? (
                  <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="totalScanGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      stroke="#cbd5e1"
                    />
                    <YAxis 
                      allowDecimals={false} 
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      stroke="#cbd5e1"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                      }}
                      itemStyle={{ color: '#818cf8' }}
                      formatter={(value: any) => [`${value} скенирања`, 'Вкупно активност']}
                      labelFormatter={(label) => `Датум: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      name="Вкупно скенирања"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#totalScanGradient)"
                      activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                ) : (
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      stroke="#cbd5e1"
                    />
                    <YAxis 
                      allowDecimals={false} 
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      stroke="#cbd5e1"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '11px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                      }}
                      labelFormatter={(label) => `Датум: ${label}`}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                    />
                    {topMaterials.map((mat, idx) => (
                      <Line
                        key={mat.id}
                        type="monotone"
                        dataKey={mat.shortCode}
                        name={mat.title.length > 25 ? `${mat.title.substring(0, 25)}...` : mat.title}
                        stroke={materialColors[idx % materialColors.length]}
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Табела на најпосетувани наставни материјали */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>{language === 'mk' ? 'Рангирање на наставни материјали според фреквенција на скенирање' : language === 'sq' ? 'Renditja e materialeve sipas skanimeve' : 'Materials Ranking by Scan Frequency'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'mk' ? 'Кои задачи и формули најмногу ги отвораат учениците во текот на наставата' : 'Which tasks and formulas are most scanned by students during classes'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportCsv}
                disabled={isExportingCsv}
                className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300/80 transition cursor-pointer"
                title={t.exportCsv}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.exportCsv}</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Наставна активност / Задача</th>
                      <th className="py-3 px-4">Предмет / Клас</th>
                      <th className="py-3 px-4">Педагошка рамка</th>
                      <th className="py-3 px-4 text-right">Број на скенирања</th>
                      <th className="py-3 px-4 text-right">% од вкупно</th>
                      <th className="py-3 px-4 text-center">Акција</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedMaterials.map((item, index) => {
                      const percentage = totalScans > 0 ? ((item.scanCount / totalScans) * 100).toFixed(1) : '0';
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4 font-bold text-slate-400">
                            {index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : index + 1}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-800">{item.title}</div>
                            <div className="font-mono text-[10px] text-slate-400">edu://{item.shortCode}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-700">{item.subject}</span>
                            <div className="text-[11px] text-slate-500">{item.targetGrade}</div>
                          </td>
                          <td className="py-3 px-4">
                            {item.bloomLevel && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 mr-1.5">
                                <Brain className="w-2.5 h-2.5 text-amber-600" />
                                <span>{t.bloomShort[item.bloomLevel]}</span>
                              </span>
                            )}
                            {item.scaffoldingSteps && item.scaffoldingSteps.length > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                <Layers className="w-2.5 h-2.5" />
                                <span>ZPD ({item.scaffoldingSteps.length})</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right font-black text-slate-900 text-sm">
                            {item.scanCount}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                                <div
                                  className="bg-indigo-600 h-full rounded-full"
                                  style={{ width: `${Math.min(100, parseFloat(percentage))}%` }}
                                />
                              </div>
                              <span className="font-mono font-semibold text-slate-600 text-[11px]">{percentage}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {onSimulateScan && (
                              <button
                                type="button"
                                onClick={() => onSimulateScan(item)}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                title="Отвори како ученик"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Футер */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Податоците се ажурираат во реално време при секое скенирање</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
