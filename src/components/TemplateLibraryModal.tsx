import React, { useState, useMemo } from 'react';
import { EducationalQRCode, Language } from '../types';
import { latexTemplates, LatexTemplate } from '../data/latexTemplates';
import { translations } from '../i18n/translations';
import { LatexRenderer } from './LatexRenderer';
import { 
  X, 
  Sparkles, 
  Search, 
  BookOpen, 
  Layers, 
  Brain, 
  PlusCircle, 
  CheckCircle2,
  Calculator,
  Sigma,
  Grid,
  Percent
} from 'lucide-react';

interface TemplateLibraryModalProps {
  isOpen: boolean;
  language: Language;
  onSelectTemplate: (template: LatexTemplate) => void;
  onClose: () => void;
}

export const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  isOpen,
  language,
  onSelectTemplate,
  onClose,
}) => {
  const t = translations[language];
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTemplates = useMemo(() => {
    return latexTemplates.filter((item) => {
      const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
      const titleStr = item.title[language] || item.title.mk;
      const descStr = item.description[language] || item.description.mk;

      const searchMatch =
        titleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        descStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.latexSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, searchQuery, language]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Хедер */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-inner">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {t.templateLibraryTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {t.templateLibrarySubtitle}
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

        {/* Контроли за категорија и пребарување */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'mk'
                  ? 'Пребарувај по формула, назив или тема (на пр. Квадратна, Интеграл, Матрица)...'
                  : 'Search by formula name or topic (e.g. Quadratic, Integral, Matrix)...'
              }
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Табови за категории */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t.allTemplateCategories}
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('algebra')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                activeCategory === 'algebra'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>🧮</span>
              <span>{t.templateCategories.algebra}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('calculus')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                activeCategory === 'calculus'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Sigma className="w-3.5 h-3.5" />
              <span>{t.templateCategories.calculus}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('linear')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                activeCategory === 'linear'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{t.templateCategories.linear}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('trig')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                activeCategory === 'trig'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>📐</span>
              <span>{t.templateCategories.trig}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('geometry')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                activeCategory === 'geometry'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>📏</span>
              <span>{t.templateCategories.geometry}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('stats')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                activeCategory === 'stats'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>{t.templateCategories.stats}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('physics')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                activeCategory === 'physics'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>⚡</span>
              <span>{t.templateCategories.physics}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('chemistry')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                activeCategory === 'chemistry'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>🧪</span>
              <span>{t.templateCategories.chemistry}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('biology')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                activeCategory === 'biology'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>🌿</span>
              <span>{t.templateCategories.biology}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('cs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                activeCategory === 'cs'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>💻</span>
              <span>{t.templateCategories.cs}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('geography')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                activeCategory === 'geography'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>🌍</span>
              <span>{t.templateCategories.geography}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('humanities')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                activeCategory === 'humanities'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>📖</span>
              <span>{t.templateCategories.humanities}</span>
            </button>
          </div>
        </div>

        {/* Листа со шаблони */}
        <div className="p-5 overflow-y-auto grow space-y-4 max-h-[60vh]">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <BookOpen className="w-10 h-10 mx-auto opacity-50" />
              <p className="text-xs font-medium">
                {language === 'mk' ? 'Не се пронајдени шаблони за вашето пребарување.' : 'No templates match your search.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => {
                const titleStr = template.title[language] || template.title.mk;
                const descStr = template.description[language] || template.description.mk;
                const categoryStr = template.categoryLabel[language] || template.categoryLabel.mk;

                return (
                  <div
                    key={template.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                          {categoryStr}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                            {template.subject}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                            {template.targetGrade}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">
                        {titleStr}
                      </h3>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {descStr}
                      </p>

                      {/* Рендериран LaTeX приказ */}
                      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs overflow-x-auto text-slate-800">
                        <LatexRenderer content={template.latexSnippet} displayMode={true} />
                      </div>

                      {/* Беџови за Виготски ZPD и Блум */}
                      <div className="flex items-center gap-2 pt-1 text-[11px]">
                        {template.scaffoldingSteps && template.scaffoldingSteps.length > 0 && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-md">
                            <Layers className="w-3 h-3" />
                            <span>{template.scaffoldingSteps.length} {language === 'mk' ? 'чекори (ZPD)' : 'scaffold steps'}</span>
                          </span>
                        )}

                        {template.bloomLevel && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 font-bold rounded-md">
                            <Brain className="w-3 h-3 text-amber-600" />
                            <span>{t.bloomShort[template.bloomLevel]}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Копче за вметнување */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTemplate(template);
                        onClose();
                      }}
                      className="w-full mt-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{t.insertTemplate}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Футер */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            {language === 'mk'
              ? `Прикажани ${filteredTemplates.length} математички шаблони`
              : `Showing ${filteredTemplates.length} math templates`}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
