import React from 'react';
import { ScaffoldingStep, Language } from '../types';
import { Plus, Trash2, Layers, HelpCircle } from 'lucide-react';
import { translations } from '../i18n/translations';
import { LatexRenderer } from './LatexRenderer';

interface VygotskyScaffoldingBuilderProps {
  steps: ScaffoldingStep[];
  onChange: (steps: ScaffoldingStep[]) => void;
  language: Language;
}

export const VygotskyScaffoldingBuilder: React.FC<VygotskyScaffoldingBuilderProps> = ({
  steps,
  onChange,
  language
}) => {
  const t = translations[language];

  const handleAddStep = () => {
    const nextNumber = steps.length + 1;
    const newStep: ScaffoldingStep = {
      id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      stepNumber: nextNumber,
      title: language === 'mk' 
        ? `Насока ${nextNumber}: Дополнителна помош` 
        : language === 'sq' 
        ? `Ndihma ${nextNumber}: Këshillë shtesë` 
        : `Hint ${nextNumber}: Guided prompt`,
      contentWithLatex: '',
      revealedByDefault: false
    };
    onChange([...steps, newStep]);
  };

  const handleRemoveStep = (id: string) => {
    const updated = steps
      .filter(s => s.id !== id)
      .map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    onChange(updated);
  };

  const handleStepChange = (id: string, field: 'title' | 'contentWithLatex', value: string) => {
    const updated = steps.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    });
    onChange(updated);
  };

  return (
    <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-2xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">{t.scaffoldingTitle}</h4>
            <p className="text-xs text-slate-600 mt-0.5 max-w-xl">{t.scaffoldingDesc}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddStep}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.addStep}</span>
        </button>
      </div>

      {steps.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-indigo-200 rounded-xl bg-white/60">
          <HelpCircle className="w-8 h-8 text-indigo-400 mx-auto mb-1.5" />
          <p className="text-xs text-slate-600">
            {language === 'mk' 
              ? 'Сè уште нема додадено скалирани чекори. Додадете насоки за поддршка на учениците.'
              : language === 'sq'
              ? 'Nuk ka hapa shkallëzimi. Shtoni këshilla ndihmëse për nxënësit.'
              : 'No scaffolding steps added yet. Add hints to guide students step-by-step.'}
          </p>
          <button
            type="button"
            onClick={handleAddStep}
            className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-800"
          >
            <Plus className="w-3.5 h-3.5" />
            {t.addStep}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="bg-white border border-indigo-100 rounded-xl p-3.5 shadow-2xs relative transition hover:border-indigo-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-800 bg-indigo-100/80 px-2.5 py-0.5 rounded-full">
                  <span>#{index + 1}</span>
                  <span>{t.stepNumber}</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleRemoveStep(step.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition"
                  title={t.removeStep}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => handleStepChange(step.id, 'title', e.target.value)}
                  placeholder={t.stepTitlePlaceholder}
                  className="w-full text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />

                <textarea
                  rows={2}
                  value={step.contentWithLatex}
                  onChange={(e) => handleStepChange(step.id, 'contentWithLatex', e.target.value)}
                  placeholder={t.stepContentPlaceholder}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
                />

                {step.contentWithLatex && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-lg text-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {language === 'mk' ? 'Преглед во живо со LaTeX:' : language === 'sq' ? 'Pamja me LaTeX:' : 'Live LaTeX Preview:'}
                    </span>
                    <LatexRenderer content={step.contentWithLatex} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
