import React from 'react';
import { BloomLevel, Language } from '../types';
import { translations } from '../i18n/translations';
import { Brain, CheckCircle2 } from 'lucide-react';

interface BloomTaxonomySelectorProps {
  value?: BloomLevel;
  objectives?: string;
  onChange: (level: BloomLevel, objectives: string) => void;
  language: Language;
}

export const BloomTaxonomySelector: React.FC<BloomTaxonomySelectorProps> = ({
  value = 'apply',
  objectives = '',
  onChange,
  language
}) => {
  const t = translations[language];

  const levels: { id: BloomLevel; color: string; border: string; bg: string; verbs: string }[] = [
    {
      id: 'remember',
      color: 'text-sky-700',
      border: 'border-sky-300',
      bg: 'bg-sky-50',
      verbs: language === 'mk' ? 'Именувај, наброј, дефинирај, запиши' : language === 'sq' ? 'Përkufizo, listo, kujto' : 'List, define, identify, recall'
    },
    {
      id: 'understand',
      color: 'text-teal-700',
      border: 'border-teal-300',
      bg: 'bg-teal-50',
      verbs: language === 'mk' ? 'Објасни, илустрирај, сумирај, преведе' : language === 'sq' ? 'Shpjego, ilustro, përmblidh' : 'Explain, summarize, visualize'
    },
    {
      id: 'apply',
      color: 'text-indigo-700',
      border: 'border-indigo-300',
      bg: 'bg-indigo-50',
      verbs: language === 'mk' ? 'Пресметај, реши, примени формула, конструирај' : language === 'sq' ? 'Llogarit, zgjidh, zbato, ndërto' : 'Calculate, solve, apply, demonstrate'
    },
    {
      id: 'analyze',
      color: 'text-amber-700',
      border: 'border-amber-300',
      bg: 'bg-amber-50',
      verbs: language === 'mk' ? 'Разложи, спореди, изведи доказ, класифицирај' : language === 'sq' ? 'Analizo, krahaso, provo, dallo' : 'Deconstruct, compare, contrast, deduce'
    },
    {
      id: 'evaluate',
      color: 'text-orange-700',
      border: 'border-orange-300',
      bg: 'bg-orange-50',
      verbs: language === 'mk' ? 'Оцени точност, пронајди грешка, аргументирај' : language === 'sq' ? 'Vlerëso, gjej gabimin, argumenton' : 'Critique, judge, verify error, justify'
    },
    {
      id: 'create',
      color: 'text-rose-700',
      border: 'border-rose-300',
      bg: 'bg-rose-50',
      verbs: language === 'mk' ? 'Создади задача, дизајнирај модел, синтетизирај' : language === 'sq' ? 'Krijo, dizajno model, sintetizo' : 'Formulate, design, construct model'
    }
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-2xs">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm">
            {language === 'mk' ? 'Блумова таксономија на когнитивни цели' : language === 'sq' ? 'Taksonomia e Bloom-it' : "Bloom's Taxonomy Cognitive Hierarchy"}
          </h4>
          <p className="text-xs text-slate-600">
            {language === 'mk' 
              ? 'Изберете го когнитивното ниво на сложеност на математичката задача.'
              : language === 'sq'
              ? 'Zgjidhni nivelin kognitiv të kompleksitetit për detyrën.'
              : 'Categorize the cognitive demand of this mathematical activity.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
        {levels.map((lvl) => {
          const isSelected = value === lvl.id;
          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => onChange(lvl.id, objectives)}
              className={`text-left p-2.5 rounded-lg border text-xs transition relative ${
                isSelected
                  ? `${lvl.bg} ${lvl.border} ring-2 ring-indigo-400 font-semibold shadow-xs`
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold ${lvl.color}`}>
                  {t.bloomShort[lvl.id]}
                </span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mb-1">
                {t.bloom[lvl.id].split('(')[1]?.replace(')', '') || ''}
              </p>
              <div className="text-[10px] text-slate-600 italic">
                {language === 'mk' ? 'Глаголи:' : language === 'sq' ? 'Folje:' : 'Verbs:'} {lvl.verbs}
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-1">
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          {language === 'mk' ? 'Конкретна когнитивна цел (исход од учењето):' : language === 'sq' ? 'Objektivi mësimor specifik:' : 'Specific Learning Objective:'}
        </label>
        <input
          type="text"
          value={objectives}
          onChange={(e) => onChange(value, e.target.value)}
          placeholder={language === 'mk' ? 'на пр. Ученикот може да изведе заклучок од знакот на дискриминантата' : 'e.g. Student can analyze quadratic roots'}
          className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
        />
      </div>
    </div>
  );
};
