export interface SubjectOption {
  id: string;
  name: string;
  category: 'primary' | 'secondary' | 'both';
  field: 'math' | 'science' | 'informatics' | 'humanities' | 'languages' | 'arts';
  icon: string;
  defaultColor: string;
  exampleTopics: string[];
}

export const EDUCATIONAL_SUBJECTS: SubjectOption[] = [
  // --- ОСНОВНО ОБРАЗОВАНИЕ (PRIMARY) & СРЕДНО (BOTH) ---
  {
    id: 'matematika',
    name: 'Математика',
    category: 'both',
    field: 'math',
    icon: '📐',
    defaultColor: '#4f46e5',
    exampleTopics: ['Аритметика', 'Дропки', 'Равенки', 'Геометрија', 'Проценти']
  },
  {
    id: 'fizika',
    name: 'Физика',
    category: 'both',
    field: 'science',
    icon: '⚡',
    defaultColor: '#0284c7',
    exampleTopics: ['Движење и брзина', 'Сили и Њутнови закони', 'Електрицитет', 'Оптика', 'Енергија']
  },
  {
    id: 'hemija',
    name: 'Хемија',
    category: 'both',
    field: 'science',
    icon: '🧪',
    defaultColor: '#059669',
    exampleTopics: ['Периоден систем', 'Хемиски врски', 'Раствори и pH', 'Хемиски реакции', 'Органска хемија']
  },
  {
    id: 'biologija',
    name: 'Биологија',
    category: 'both',
    field: 'science',
    icon: '🌿',
    defaultColor: '#16a34a',
    exampleTopics: ['Клеточна градба', 'ДНК и генетика', 'Човечко тело', 'Екосистеми', 'Ботаника и зоологија']
  },
  {
    id: 'prirodni_nauki',
    name: 'Природни науки',
    category: 'primary',
    field: 'science',
    icon: '🔬',
    defaultColor: '#0d9488',
    exampleTopics: ['Материјали и супстанци', 'Животна средина', 'Магнетизам', 'Сончев систем']
  },
  {
    id: 'informatika',
    name: 'Информатика & Програмирање',
    category: 'both',
    field: 'informatics',
    icon: '💻',
    defaultColor: '#7c3aed',
    exampleTopics: ['Алгоритми и псевдокод', 'Python основи', 'Бинарен броен систем', 'Безбедност на интернет', 'Веб програмирање']
  },
  {
    id: 'geografija',
    name: 'Географија',
    category: 'both',
    field: 'humanities',
    icon: '🌍',
    defaultColor: '#d97706',
    exampleTopics: ['Географска карта и размери', 'Релјеф и клима', 'Население и стопанство', 'Континенти', 'Географија на Македонија']
  },
  {
    id: 'istorija',
    name: 'Историја',
    category: 'both',
    field: 'humanities',
    icon: '🏛️',
    defaultColor: '#92400e',
    exampleTopics: ['Антички цивилизации', 'Средновековна историја', 'Нов век и револуции', 'Современа историја', 'Историски извори']
  },
  {
    id: 'makedonski_jazik',
    name: 'Македонски јазик & Литература',
    category: 'both',
    field: 'languages',
    icon: '📖',
    defaultColor: '#e11d48',
    exampleTopics: ['Морфологија и синтакса', 'Правопис и граматика', 'Стилски фигури', 'Анализа на лектира', 'Есеј и писмена работа']
  },
  {
    id: 'angliski_jazik',
    name: 'Англиски јазик',
    category: 'both',
    field: 'languages',
    icon: '🗣️',
    defaultColor: '#2563eb',
    exampleTopics: ['Граматика (Tenses)', 'Вокабулар и фрази', 'Читање со разбирање', 'Идиоми', 'Дијалози']
  },
  {
    id: 'gragjansko',
    name: 'Граѓанско образование & Општество',
    category: 'both',
    field: 'humanities',
    icon: '⚖️',
    defaultColor: '#475569',
    exampleTopics: ['Човекови права', 'Демократија и закони', 'Учество во заедницата', 'Еколошка свест']
  },
  {
    id: 'tehnicko_stem',
    name: 'Техничко образование & STEM',
    category: 'primary',
    field: 'informatics',
    icon: '🛠️',
    defaultColor: '#b45309',
    exampleTopics: ['Техничко цртање', 'Моделирање', 'Електроника', 'Роботика основи']
  },
  {
    id: 'filozofija_logika',
    name: 'Филозофија & Логика',
    category: 'secondary',
    field: 'humanities',
    icon: '🤔',
    defaultColor: '#6366f1',
    exampleTopics: ['Формална логика', 'Етика', 'Теорија на познание', 'Аргументација']
  },
  {
    id: 'ekonomija_biznis',
    name: 'Економија & Претприемништво',
    category: 'secondary',
    field: 'humanities',
    icon: '📊',
    defaultColor: '#059669',
    exampleTopics: ['Понуда и побарувачка', 'Буџетирање', 'Бизнис план', 'Маркетинг основи']
  }
];

export const PRIMARY_GRADE_OPTIONS = [
  '1-во одделение',
  '2-ро одделение',
  '3-то одделение',
  '4-то одделение',
  '5-то одделение',
  '6-то одделение',
  '7-мо одделение',
  '8-мо одделение',
  '9-то одделение'
];

export const SECONDARY_GRADE_OPTIONS = [
  'I година средно (гимназија/стручно)',
  'II година средно (гимназија/стручно)',
  'III година средно (гимназија/стручно)',
  'IV година средно (матура)'
];
