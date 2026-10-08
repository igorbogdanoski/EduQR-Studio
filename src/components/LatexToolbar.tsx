import React from 'react';

interface LatexToolbarProps {
  onInsert: (snippet: string) => void;
  language?: 'mk' | 'sq' | 'en';
}

export const LatexToolbar: React.FC<LatexToolbarProps> = ({ onInsert, language = 'mk' }) => {
  const categories = [
    {
      label: language === 'mk' ? 'Основни' : language === 'sq' ? 'Bazike' : 'Basics',
      items: [
        { label: 'a/b', snippet: '\\frac{a}{b}', title: 'Дропка (Fraction)' },
        { label: '√x', snippet: '\\sqrt{x}', title: 'Квадратен корен' },
        { label: 'xⁿ', snippet: 'x^{2}', title: 'Степен (Power)' },
        { label: 'xᵢ', snippet: 'x_{1}', title: 'Индекс (Subscript)' },
        { label: '±', snippet: '\\pm ', title: 'Плус-минус' },
        { label: '·', snippet: '\\cdot ', title: 'Множење' },
        { label: '≈', snippet: '\\approx ', title: 'Приближно' },
        { label: '≠', snippet: '\\neq ', title: 'Нееднакво' },
        { label: '≤', snippet: '\\le ', title: 'Помало или еднакво' },
        { label: '≥', snippet: '\\ge ', title: 'Поголемо или еднакво' },
      ]
    },
    {
      label: language === 'mk' ? 'Формули & Теореми' : language === 'sq' ? 'Formula & Teorema' : 'Formulas',
      items: [
        { label: 'a²+b²=c²', snippet: '$$a^2 + b^2 = c^2$$', title: 'Питагорова теорема' },
        { label: 'Квадратна', snippet: '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$', title: 'Формула за квадратна равенка' },
        { label: 'P=πr²', snippet: '$$P = \\pi r^2$$', title: 'Плоштина на круг' },
        { label: 'L=2πr', snippet: '$$L = 2\\pi r$$', title: 'Периметар на круг' },
        { label: 'Линеарна f(x)', snippet: '$$f(x) = kx + n$$', title: 'Линеарна функција' },
        { label: 'Систем {', snippet: '$$\\begin{cases} 2x + y = 10 \\\\ x - y = 2 \\end{cases}$$', title: 'Систем од две равенки' },
      ]
    },
    {
      label: language === 'mk' ? 'Симболи & Тригонометрија' : language === 'sq' ? 'Simbole & Trig' : 'Symbols & Trig',
      items: [
        { label: 'π', snippet: '\\pi ', title: 'Број Пи' },
        { label: 'α', snippet: '\\alpha ', title: 'Алфа' },
        { label: 'β', snippet: '\\beta ', title: 'Бета' },
        { label: 'θ', snippet: '\\theta ', title: 'Тета' },
        { label: 'Δ', snippet: '\\Delta ', title: 'Делта' },
        { label: 'sin', snippet: '\\sin(\\alpha)', title: 'Синус' },
        { label: 'cos', snippet: '\\cos(\\alpha)', title: 'Косинус' },
        { label: 'tan', snippet: '\\tan(\\alpha)', title: 'Тангенс' },
        { label: '∑', snippet: '\\sum_{i=1}^{n} x_i', title: 'Сума' },
        { label: '∫', snippet: '\\int_{a}^{b} f(x) dx', title: 'Интеграл' },
      ]
    }
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
          <span className="text-indigo-600 font-serif italic text-sm">ƒ(x)</span> 
          {language === 'mk' ? 'Брзи математички формули и ознаки:' : language === 'sq' ? 'Formula dhe simbole të shpejta:' : 'Quick Math Formulas & LaTeX:'}
        </span>
        <span className="text-slate-600 text-[11px]">
          {language === 'mk' ? 'Кликни за вметнување во текстот' : language === 'sq' ? 'Kliko për futje' : 'Click to insert'}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="flex flex-wrap items-center gap-1 mr-2 mb-1">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mr-1">
              {cat.label}:
            </span>
            {cat.items.map((item, itemIdx) => (
              <button
                key={itemIdx}
                type="button"
                onClick={() => onInsert(item.snippet)}
                title={item.title}
                className="px-2 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-800 hover:text-indigo-700 rounded text-xs font-mono transition shadow-xs active:scale-95"
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
