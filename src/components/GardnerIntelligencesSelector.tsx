import React from 'react';
import { GardnerIntelligence, Language } from '../types';
import { translations } from '../i18n/translations';
import { Compass, Sparkles } from 'lucide-react';

interface GardnerIntelligencesSelectorProps {
  value?: GardnerIntelligence;
  activityType?: string;
  onChange: (intelligence: GardnerIntelligence, activityType: string) => void;
  language: Language;
}

export const GardnerIntelligencesSelector: React.FC<GardnerIntelligencesSelectorProps> = ({
  value = 'logical_mathematical',
  activityType = '',
  onChange,
  language
}) => {
  const t = translations[language];

  const intelligences: { id: GardnerIntelligence; icon: string; title: string; desc: string }[] = [
    {
      id: 'logical_mathematical',
      icon: '🧮',
      title: language === 'mk' ? 'Логичко-Математичка' : language === 'sq' ? 'Logjiko-Matematikore' : 'Logical-Mathematical',
      desc: language === 'mk' ? 'Решавање равенки, формални докази, броеви' : 'Formulas, equations, logic'
    },
    {
      id: 'visual_spatial',
      icon: '📐',
      title: language === 'mk' ? 'Визуелно-Просторна' : language === 'sq' ? 'Pamoro-Hapësinore' : 'Visual-Spatial',
      desc: language === 'mk' ? 'Геометриски тела, графици, дијаграми, GeoGebra' : 'Graphs, 3D shapes, diagrams'
    },
    {
      id: 'verbal_linguistic',
      icon: '📖',
      title: language === 'mk' ? 'Вербално-Јазична' : language === 'sq' ? 'Gjuhësore-Verbale' : 'Verbal-Linguistic',
      desc: language === 'mk' ? 'Текстуални задачи, математички есеи, дефиниции' : 'Word problems, definitions, essays'
    },
    {
      id: 'bodily_kinesthetic',
      icon: '🖐️',
      title: language === 'mk' ? 'Телесно-Кинестетичка' : language === 'sq' ? 'Trupore-Kinestetike' : 'Bodily-Kinesthetic',
      desc: language === 'mk' ? 'Рачно мерење, превиткување хартија (оригами), модели' : 'Hands-on measurement, origami geometry'
    },
    {
      id: 'musical',
      icon: '🎵',
      title: language === 'mk' ? 'Музичко-Ритмичка' : language === 'sq' ? 'Muzikore-Ritmike' : 'Musical-Rhythmic',
      desc: language === 'mk' ? 'Математички шаблони, хармониски низи, ритам' : 'Patterns, acoustic waves, ratios'
    },
    {
      id: 'interpersonal',
      icon: '👥',
      title: language === 'mk' ? 'Интерперсонална' : language === 'sq' ? 'Ndërpersonale' : 'Interpersonal',
      desc: language === 'mk' ? 'Тимска соработка во училница, математичка дебата' : 'Team collaboration, peer tutoring'
    },
    {
      id: 'intrapersonal',
      icon: '🧘',
      title: language === 'mk' ? 'Интраперсонална' : language === 'sq' ? 'Vetjake' : 'Intrapersonal',
      desc: language === 'mk' ? 'Индивидуална рефлексија, самооценување' : 'Self-paced reflection, self-quiz'
    },
    {
      id: 'naturalistic',
      icon: '🌿',
      title: language === 'mk' ? 'Природнонаучна' : language === 'sq' ? 'Natyrore' : 'Naturalistic',
      desc: language === 'mk' ? 'Математика во флора и фауна, Фибоначи низа' : 'Fibonacci in nature, fractal geometry'
    }
  ];

  return (
    <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-2xs">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm">
            {language === 'mk' ? 'Теорија на мултипни интелигенции (Хауард Гарднер)' : language === 'sq' ? 'Inteligjencat e Shumëfishta (Gardner)' : "Gardner's Multiple Intelligences"}
          </h4>
          <p className="text-xs text-slate-600">
            {language === 'mk' 
              ? 'Прилагодете го начинот на презентирање за различни типови ученици.'
              : language === 'sq'
              ? 'Përshtatni formatin për stile të ndryshme të nxënit.'
              : 'Differentiate content modalities to reach diverse learning intelligences.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
        {intelligences.map((item) => {
          const isSelected = value === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id, activityType)}
              className={`p-2 rounded-lg border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-emerald-500 ring-2 ring-emerald-300 font-semibold shadow-2xs'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div>
                <span className="text-base mr-1.5">{item.icon}</span>
                <span className="text-xs font-bold text-slate-800">{item.title}</span>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-1">
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          {language === 'mk' ? 'Опис на мултимедијалната активност / формат:' : language === 'sq' ? 'Përshkrimi i aktivitetit:' : 'Modality / Format Note:'}
        </label>
        <input
          type="text"
          value={activityType}
          onChange={(e) => onChange(value, e.target.value)}
          placeholder={language === 'mk' ? 'на пр. Интерактивен 3D модел или динамички геогебра симулатор' : 'e.g. Dynamic GeoGebra 3D graph'}
          className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
        />
      </div>
    </div>
  );
};
