import { EducationalQRCode, EducationalFolder, CustomTag } from '../types';

const STORAGE_KEY = 'edu_qr_codes_v1';
const FOLDERS_STORAGE_KEY = 'edu_qr_folders_v1';
const CUSTOM_TAGS_STORAGE_KEY = 'edu_qr_custom_tags_v1';

export const initialEducationalFolders: EducationalFolder[] = [
  {
    id: 'folder-geom-8',
    name: 'Геометрија & Питагора (8-мо одделение)',
    description: 'Планиметрија, правоаголни триаголници и пресметка на катети и плоштина со ZPD скалирање.',
    categoryType: 'class',
    color: '#4f46e5',
    icon: '📐',
    createdAt: '2026-03-20'
  },
  {
    id: 'folder-alg-1',
    name: 'Алгебра & Квадратни Равенки (I година)',
    description: 'Квадратни формули, дискриминанта и анализа на корени според Блумова таксономија.',
    categoryType: 'subject',
    color: '#0d9488',
    icon: '🧮',
    createdAt: '2026-03-25'
  },
  {
    id: 'folder-trig-stem',
    name: 'STEM Проект: Интерактивна Тригонометрија',
    description: 'Мултимедијални материјали и GeoGebra дигитални симулации за просторна интелигенција.',
    categoryType: 'project',
    color: '#7c3aed',
    icon: '⚛️',
    createdAt: '2026-04-01'
  },
  {
    id: 'folder-worksheets',
    name: 'Печатени Наставни Листови & Тестови',
    description: 'Материјали за групна работа по станици во училницата со заштитени PIN кодови.',
    categoryType: 'class',
    color: '#c2410c',
    icon: '📄',
    createdAt: '2026-04-05'
  },
  {
    id: 'folder-school-infra',
    name: 'Училишна Инфраструктура & Лабораторија',
    description: 'Кодови за поврзување на училишниот интернет и ресурси во кабинетот по информатика.',
    categoryType: 'subject',
    color: '#059669',
    icon: '🏫',
    createdAt: '2026-04-08'
  },
  {
    id: 'folder-physics-stem',
    name: 'Физика & STEM Лабораторија (8-мо / 9-то одд.)',
    description: 'Кинематика, Њутнови закони за движење, електрицитет и закон за зачувување на енергијата.',
    categoryType: 'subject',
    color: '#0284c7',
    icon: '⚡',
    createdAt: '2026-04-10'
  },
  {
    id: 'folder-chemistry-lab',
    name: 'Хемија & Молекуларни Структури (I / II година)',
    description: 'Периоден систем на елементи, моларни пресметки, раствори и стехиометриски реакции.',
    categoryType: 'subject',
    color: '#0d9488',
    icon: '🧪',
    createdAt: '2026-04-11'
  },
  {
    id: 'folder-biology-nature',
    name: 'Биологија & Природни Науки (Основно & Средно)',
    description: 'Клеточна биологија, ДНК наследни законитости на Мендел, ботаника и екосистеми.',
    categoryType: 'subject',
    color: '#16a34a',
    icon: '🌿',
    createdAt: '2026-04-12'
  },
  {
    id: 'folder-cs-coding',
    name: 'Информатика & Програмирање (Python / Алгоритми)',
    description: 'Бинарен броен систем, псевдокод, алгоритми за сортирање и пребарување.',
    categoryType: 'subject',
    color: '#7c3aed',
    icon: '💻',
    createdAt: '2026-04-13'
  },
  {
    id: 'folder-geo-lang',
    name: 'Географија & Македонски Јазик (Хуманистички науки)',
    description: 'Картографски размери, временски зони, морфологија и анализа на стилски фигури.',
    categoryType: 'subject',
    color: '#d97706',
    icon: '🌍',
    createdAt: '2026-04-14'
  }
];

export const initialEducationalCodes: EducationalQRCode[] = [
  {
    id: 'math-pythagoras-01',
    shortCode: 'pitagora7',
    title: 'Питагорова теорема и должина на хипотенуза',
    description: 'Интерактивна задача за пресметување на хипотенуза со скалирана поддршка според Виготски за ученици од 7-мо одделение.',
    type: 'vygotsky_scaffold',
    createdAt: '2026-03-20',
    subject: 'Математика (Геометрија)',
    targetGrade: '7-мо / 8-мо одделение',
    folderId: 'folder-geom-8',
    latexContent: 'Правоаголен триаголник има катети со должини $a = 6\\text{ cm}$ и $b = 8\\text{ cm}$. Пресметај ја должината на хипотенузата $c$, а потоа определи ја плоштината $P$ на триаголникот.',
    solutionLatex: '1. Примена на Питагорова теорема:\n$$c^2 = a^2 + b^2 = 6^2 + 8^2 = 36 + 64 = 100$$\n$$c = \\sqrt{100} = 10\\text{ cm}$$\n2. Пресметка на плоштина:\n$$P = \\frac{a \\cdot b}{2} = \\frac{6 \\cdot 8}{2} = 24\\text{ cm}^2$$',
    scaffoldingSteps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Насока 1: Препознавање на основните елементи',
        contentWithLatex: 'Потсети се на формулата на Питагора: Во секој правоаголен триаголник важи: $$c^2 = a^2 + b^2$$ каде што $c$ е најдолгата страна наспроти правиот агол.',
        revealedByDefault: false
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Насока 2: Квадрирање на вредностите',
        contentWithLatex: 'Замени ги вредностите: $a^2 = 6^2 = 36$ и $b^2 = 8^2 = 64$. Колку изнесува нивниот збир $36 + 64$?',
        revealedByDefault: false
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'Насока 3: Коренување и плоштина',
        contentWithLatex: 'За да го добиеш $c$, пресметај $\\sqrt{100}$. За плоштината искористи ја формулата за правоаголен триаголник: $$P = \\frac{a \\cdot b}{2}$$',
        revealedByDefault: false
      }
    ],
    bloomLevel: 'apply',
    bloomObjectives: 'Примена на теоремата во нумерички пресметки и одредување плоштина.',
    gardnerIntelligence: 'logical_mathematical',
    gardnerActivityType: 'Чекор-по-чекор логичко водење',
    targetUrl: '',
    style: {
      fgColor: '#1e3a8a',
      bgColor: '#ffffff',
      errorCorrectionLevel: 'Q',
      iconType: 'math',
      margin: 2,
      size: 260
    },
    scanCount: 42,
    lastScannedAt: '2026-04-12 10:15',
    requiresPin: false,
    tags: ['in_class', 'exam_prep'],
    versionHistory: [
      {
        id: 'ver-pyth-1',
        timestamp: '2026-03-20 09:15',
        label: 'Првичен нацрт со основни катети',
        latexContent: 'Правоаголен триаголник има катети $a = 3\\text{ cm}$ и $b = 4\\text{ cm}$. Најди ја хипотенузата $c$.',
        solutionLatex: '$$c^2 = 3^2 + 4^2 = 25 \\implies c = 5\\text{ cm}$$',
        scaffoldingSteps: [
          {
            id: 'step-pyth-old-1',
            stepNumber: 1,
            title: 'Формула на Питагора',
            contentWithLatex: 'Во секој правоаголен триаголник важи: $$c^2 = a^2 + b^2$$',
            revealedByDefault: false
          }
        ],
        changeSummary: 'Основна вежба со 3, 4, 5 тројка пред воведување на пресметка на плоштина'
      }
    ]
  },
  {
    id: 'math-quadratic-02',
    shortCode: 'kvadrata9',
    title: 'Квадратна равенка и испитување корени',
    description: 'Задача со фокус на Блумовата таксономија (ниво: Анализа). Испитување на природата на корените преку дискриминанта.',
    type: 'bloom_taxonomy',
    createdAt: '2026-03-25',
    subject: 'Алгебра',
    targetGrade: 'I година средно',
    folderId: 'folder-alg-1',
    tags: ['homework', 'exam_prep'],
    versionHistory: [
      {
        id: 'ver-quad-1',
        timestamp: '2026-03-25 14:00',
        label: 'Првична равенка без коефициент пред x²',
        latexContent: 'Реши ја квадратната равенка: $$x^2 - 5x + 6 = 0$$ и најди ги корените.',
        solutionLatex: '$$D = (-5)^2 - 4(1)(6) = 1$$\n$$x_{1,2} = \\frac{5 \\pm 1}{2} \\implies x_1 = 3, x_2 = 2$$',
        scaffoldingSteps: [],
        changeSummary: 'Првична вежба пред проширување со коефициент $a=2$ и испитување на дискриминанта'
      }
    ],
    latexContent: 'Дадена е квадратната равенка: $$2x^2 - 4x - 6 = 0$$\nОпредели ја дискриминантата $D$, анализирај ја природата на решенијата и најди ги решенијата $x_1$ и $x_2$.',
    solutionLatex: 'Коефициенти: $a = 2, b = -4, c = -6$.\nДискриминанта:\n$$D = b^2 - 4ac = (-4)^2 - 4(2)(-6) = 16 + 48 = 64$$\nБидејќи $D > 0$, равенката има две различни реални решенија:\n$$x_{1,2} = \\frac{-(-4) \\pm \\sqrt{64}}{2 \\cdot 2} = \\frac{4 \\pm 8}{4}$$\n$$x_1 = \\frac{4 + 8}{4} = 3, \\quad x_2 = \\frac{4 - 8}{4} = -1$$',
    bloomLevel: 'analyze',
    bloomObjectives: 'Анализа на знакот на дискриминантата $D > 0$ и геометриска врска со пресечните точки на параболата.',
    gardnerIntelligence: 'logical_mathematical',
    gardnerActivityType: 'Компаративна анализа на решенија',
    targetUrl: '',
    style: {
      fgColor: '#0f766e',
      bgColor: '#ffffff',
      errorCorrectionLevel: 'H',
      iconType: 'atom',
      margin: 2,
      size: 260
    },
    scanCount: 29,
    lastScannedAt: '2026-04-14 11:30',
    requiresPin: false
  },
  {
    id: 'math-circle-visual-03',
    shortCode: 'krug360',
    title: 'Тригонометриска кружница и просторна претстава',
    description: 'Мултимедијален материјал прилагоден за визуелно-просторна интелигенција според Хауард Гарднер со интерактивна симулација.',
    type: 'gardner_multiple',
    createdAt: '2026-04-01',
    subject: 'Тригонометрија',
    targetGrade: 'II година средно',
    folderId: 'folder-trig-stem',
    latexContent: 'За секој агол $\\alpha$ на единичната кружница $x^2 + y^2 = 1$:\n$$x = \\cos(\\alpha), \\quad y = \\sin(\\alpha)$$\nОсновен тригонометриски идентитет:\n$$\\sin^2(\\alpha) + \\cos^2(\\alpha) = 1$$\nПресметај ја вредноста за $\\alpha = 30^\\circ$ (т.е. $\\frac{\\pi}{6}\\text{ rad}$).',
    solutionLatex: 'За $\\alpha = \\frac{\\pi}{6}$:\n$$\\cos\\left(\\frac{\\pi}{6}\\right) = \\frac{\\sqrt{3}}{2}, \\quad \\sin\\left(\\frac{\\pi}{6}\\right) = \\frac{1}{2}$$\nПроверка на идентитетот:\n$$\\left(\\frac{1}{2}\\right)^2 + \\left(\\frac{\\sqrt{3}}{2}\\right)^2 = \\frac{1}{4} + \\frac{3}{4} = 1$$',
    bloomLevel: 'understand',
    bloomObjectives: 'Геометриско поврзување на координатните оски со синус и косинус.',
    gardnerIntelligence: 'visual_spatial',
    gardnerActivityType: 'Графички приказ и динамичка геометрија',
    targetUrl: 'https://www.geogebra.org/m/unit-circle',
    style: {
      fgColor: '#7c3aed',
      bgColor: '#ffffff',
      errorCorrectionLevel: 'Q',
      iconType: 'lightbulb',
      margin: 2,
      size: 260
    },
    scanCount: 56,
    lastScannedAt: '2026-04-15 09:20',
    requiresPin: false,
    tags: ['in_class', 'group_work']
  },
  {
    id: 'math-worksheet-pdf-04',
    shortCode: 'test-geom4',
    title: 'Наставен лист: Геометриски тела и плоштина',
    description: 'Дигитално споделување на работен лист со задачи за призма и цилиндер со заштитен PIN код за наставникот.',
    type: 'document_file',
    createdAt: '2026-04-05',
    subject: 'Стереометрија',
    targetGrade: '9-то одделение',
    folderId: 'folder-worksheets',
    tags: ['exam_prep', 'homework'],
    latexContent: 'Формули за плоштина и волумен на прав цилиндер:\n$$P = 2\\pi r(r + H), \\quad V = \\pi r^2 H$$\nОтворете го работниот лист за 10 текстуални задачи.',
    solutionLatex: '',
    fileName: 'Nastaven_List_Stereometrija_9odd.pdf',
    fileSize: '1.4 MB',
    fileType: 'application/pdf',
    requiresPin: true,
    pinCode: '2026',
    bloomLevel: 'apply',
    gardnerIntelligence: 'logical_mathematical',
    style: {
      fgColor: '#c2410c',
      bgColor: '#ffffff',
      errorCorrectionLevel: 'M',
      iconType: 'book',
      margin: 2,
      size: 260
    },
    scanCount: 18,
    lastScannedAt: '2026-04-16 12:45'
  },
  {
    id: 'wifi-lab-05',
    shortCode: 'wifilab2',
    title: 'Училишна лабораторија за информатика & математика',
    description: 'Брз QR код за безбедно поврзување на таблетите и лаптопите на учениците на училишната WiFi мрежа.',
    type: 'wifi_access',
    createdAt: '2026-04-08',
    subject: 'Училишна инфраструктура',
    targetGrade: 'Сите паралелки',
    folderId: 'folder-school-infra',
    latexContent: 'Насочете ја камерата за автоматско поврзување со заштитената мрежа во кабинетот.',
    wifiSsid: 'Ucilnica_Matematika_5GHz',
    wifiPassword: 'EduMatematika2026!',
    wifiEncryption: 'WPA',
    style: {
      fgColor: '#047857',
      bgColor: '#ffffff',
      errorCorrectionLevel: 'M',
      iconType: 'school',
      margin: 2,
      size: 260
    },
    scanCount: 88,
    lastScannedAt: '2026-04-16 08:30'
  },
  {
    id: 'phys-newton-06',
    shortCode: 'fizika8',
    title: 'Втор Њутнов закон и забрзување на тело',
    description: 'Интерактивна физичка симулација со формулата F = m * a и пресметка на сила на триење со скалирани прашања.',
    type: 'vygotsky_scaffold',
    createdAt: '2026-04-10',
    subject: 'Физика',
    targetGrade: '8-мо одделение / I година',
    folderId: 'folder-physics-stem',
    tags: ['in_class', 'group_work'],
    latexContent: 'На количка со маса $m = 3\\text{ kg}$ делува хоризонтална сила $F = 15\\text{ N}$. Пресметајте го забрзувањето $a$, а потоа кинетичката енергија $E_k$ по $t = 2\\text{ s}$ од мирување ($v = a \\cdot t$).',
    solutionLatex: '1. Забрзување: $$a = \\frac{F}{m} = \\frac{15\\text{ N}}{3\\text{ kg}} = 5\\text{ m/s}^2$$\n2. Брзина по 2 секунди: $$v = a \\cdot t = 5 \\cdot 2 = 10\\text{ m/s}$$\n3. Кинетичка енергија: $$E_k = \\frac{m v^2}{2} = \\frac{3 \\cdot 10^2}{2} = \\frac{300}{2} = 150\\text{ J}$$',
    scaffoldingSteps: [
      {
        id: 'phys-s1',
        stepNumber: 1,
        title: 'Закон на Њутн',
        contentWithLatex: 'Искористете ја релацијата: $$F = m \\cdot a \\implies a = \\frac{F}{m}$$',
        revealedByDefault: false
      },
      {
        id: 'phys-s2',
        stepNumber: 2,
        title: 'Кинетичка енергија',
        contentWithLatex: 'Прво пресметајте ја брзината $v = a \\cdot t$, а потоа: $$E_k = \\frac{m \\cdot v^2}{2}$$',
        revealedByDefault: false
      }
    ],
    bloomLevel: 'apply',
    gardnerIntelligence: 'logical_mathematical',
    style: {
      fgColor: '#0284c7',
      bgColor: '#ffffff',
      errorCorrectionLevel: 'H',
      iconType: 'atom',
      margin: 2,
      size: 260
    },
    scanCount: 52,
    lastScannedAt: '2026-04-15 11:20'
  },
  {
    id: 'chem-molar-07',
    shortCode: 'hemija9',
    title: 'Моларна маса и количество супстанца во раствори',
    description: 'Лабораториска пресметка на молови, релативна атомска маса на соединенија и процентуална концентрација.',
    type: 'bloom_taxonomy',
    createdAt: '2026-04-11',
    subject: 'Хемија',
    targetGrade: '8-мо / 9-то одд. / I година',
    folderId: 'folder-chemistry-lab',
    tags: ['homework', 'exam_prep'],
    latexContent: 'Пресметајте ја моларната маса на готварска сол ($NaCl$): $A_r(Na) = 23, A_r(Cl) = 35.5$. Колку молови има во $m = 117\\text{ g}$ чиста сол ($n = \\frac{m}{M}$)?',
    solutionLatex: '$$M(NaCl) = 23 + 35.5 = 58.5\\text{ g/mol}$$\n$$n = \\frac{117\\text{ g}}{58.5\\text{ g/mol}} = 2\\text{ mol}$$',
    bloomLevel: 'apply',
    bloomObjectives: 'Пресметка на стехиометриски односи и примена на Авогадровиот закон за раствори.',
    gardnerIntelligence: 'logical_mathematical',
    style: {
      fgColor: '#0d9488',
      bgColor: '#ffffff',
      errorCorrectionLevel: 'M',
      iconType: 'math',
      margin: 2,
      size: 260
    },
    scanCount: 37,
    lastScannedAt: '2026-04-14 14:10'
  },
  {
    id: 'bio-dna-08',
    shortCode: 'biokod7',
    title: 'ДНК структура и Менделови закони за наследност',
    description: 'Генетика и веројатност за наследување на белези кај монохибриден крстос со интерактивен квиз.',
    type: 'bloom_taxonomy',
    createdAt: '2026-04-12',
    subject: 'Биологија',
    targetGrade: '9-то одделение / III година',
    folderId: 'folder-biology-nature',
    tags: ['in_class', 'scavenger_hunt'],
    latexContent: 'При вкрстување на два хетерозиготни организми со кафеави очи ($Aa \\times Aa$, каде $A$ е доминантен алел за кафеави очи, а $a$ за сини очи):\nКолкав процент од потомството фенотипски ќе има кафеави очи?',
    solutionLatex: 'Пенетов квадрат:\n$$AA (25\\%), \\quad Aa (50\\%), \\quad aa (25\\%)$$\nФенотипски кафеави очи: $AA + Aa = 25\\% + 50\\% = 75\\%$.\nСини очи: $aa = 25\\%$.',
    bloomLevel: 'analyze',
    gardnerIntelligence: 'naturalistic',
    style: {
      fgColor: '#16a34a',
      bgColor: '#ffffff',
      errorCorrectionLevel: 'H',
      iconType: 'book',
      margin: 2,
      size: 260
    },
    scanCount: 64,
    lastScannedAt: '2026-04-16 09:45'
  },
  {
    id: 'cs-algo-09',
    shortCode: 'python5',
    title: 'Бинарни броеви и алгоритамска сложеност',
    description: 'Основи на компјутерско размислување, бинарно кодирање и ефикасност на алгоритми за пребарување.',
    type: 'vygotsky_scaffold',
    createdAt: '2026-04-13',
    subject: 'Информатика & Програмирање',
    targetGrade: '7-мо / 8-мо одд. / I година',
    folderId: 'folder-cs-coding',
    tags: ['group_work', 'homework'],
    latexContent: '1. Претворете го бинарниот број $(11010)_2$ во декаден број.\n2. Споредете колку чекори прави бинарно пребарување наспроти линейно пребарување за $N = 1024$ податоци ($O(\\log_2 N)$ наспроти $O(N)$).',
    solutionLatex: '1. Декаден запис:\n$$1 \\cdot 16 + 1 \\cdot 8 + 0 \\cdot 4 + 1 \\cdot 2 + 0 \\cdot 1 = 16 + 8 + 2 = 26_{(10)}$$\n2. Бинарно пребарување:\n$$\\log_2(1024) = 10\\text{ чекори (наспроти 1024 чекори кај линеарното!)}$$',
    bloomLevel: 'analyze',
    gardnerIntelligence: 'logical_mathematical',
    style: {
      fgColor: '#7c3aed',
      bgColor: '#ffffff',
      errorCorrectionLevel: 'H',
      iconType: 'math',
      margin: 2,
      size: 260
    },
    scanCount: 71,
    lastScannedAt: '2026-04-16 11:05'
  },
  {
    id: 'geo-map-10',
    shortCode: 'globus4',
    title: 'Размер на географска карта и вистинско растојание',
    description: 'Картографски пресметки за оддалеченост меѓу градови и временски разлики според меридијани.',
    type: 'bloom_taxonomy',
    createdAt: '2026-04-14',
    subject: 'Географија',
    targetGrade: '7-мо одделение / I година',
    folderId: 'folder-geo-lang',
    tags: ['in_class', 'scavenger_hunt'],
    latexContent: 'На топографска карта со размер $1 : 50\\,000$, растојанието помеѓу две точки е $d = 8.4\\text{ cm}$. Пресметајте го реалното растојание во километри ($D = d \\cdot 50\\,000$).',
    solutionLatex: '$$D = 8.4\\text{ cm} \\cdot 50\\,000 = 420\\,000\\text{ cm} = 4\\,200\\text{ m} = 4.2\\text{ km}$$',
    bloomLevel: 'apply',
    gardnerIntelligence: 'visual_spatial',
    style: {
      fgColor: '#d97706',
      bgColor: '#ffffff',
      errorCorrectionLevel: 'M',
      iconType: 'lightbulb',
      margin: 2,
      size: 260
    },
    scanCount: 33,
    lastScannedAt: '2026-04-13 13:25'
  },
  {
    id: 'lang-meta-11',
    shortCode: 'stil7',
    title: 'Морфологија и стилски фигури во поезија',
    description: 'Интерактивно препознавање на метафора, персонификација и епитети во македонската поезија (Кочо Рацин, Блаже Конески).',
    type: 'bloom_taxonomy',
    createdAt: '2026-04-14',
    subject: 'Македонски јазик & Литература',
    targetGrade: '8-мо одделение / I година',
    folderId: 'folder-geo-lang',
    tags: ['homework', 'exam_prep'],
    latexContent: 'Прочитајте го стихот:\n„Денови ли се - денови, аргатски маки големи!“\nИдентификувајте ги употребените стилски фигури (епитет, реторичко прашање) и објаснете ја поетската порака.',
    solutionLatex: 'Епитет: „аргатски маки големи“ (ја засилува тежината на трудот).\nРеторичко прашање и метафора: „Денови ли се - денови“ (изразува протест и монотонија на тешкиот живот).',
    bloomLevel: 'analyze',
    gardnerIntelligence: 'verbal_linguistic',
    style: {
      fgColor: '#e11d48',
      bgColor: '#ffffff',
      errorCorrectionLevel: 'H',
      iconType: 'book',
      margin: 2,
      size: 260
    },
    scanCount: 45,
    lastScannedAt: '2026-04-15 10:40'
  }
];

export const getStoredFolders = (): EducationalFolder[] => {
  try {
    const raw = localStorage.getItem(FOLDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(initialEducationalFolders));
      return initialEducationalFolders;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const existingIds = new Set(parsed.map(f => f.id));
      const missing = initialEducationalFolders.filter(f => !existingIds.has(f.id));
      if (missing.length > 0) {
        const merged = [...parsed, ...missing];
        localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
    return initialEducationalFolders;
  } catch (err) {
    console.error('Failed to load stored folders', err);
    return initialEducationalFolders;
  }
};

export const saveStoredFolders = (folders: EducationalFolder[]): void => {
  try {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  } catch (err) {
    console.error('Failed to save folders', err);
  }
};

export const getStoredQRCodes = (): EducationalQRCode[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEducationalCodes));
      return initialEducationalCodes;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const existingIds = new Set(parsed.map(c => c.id));
      const missing = initialEducationalCodes.filter(c => !existingIds.has(c.id));
      if (missing.length > 0) {
        const merged = [...parsed, ...missing];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
    return initialEducationalCodes;
  } catch (err) {
    console.error('Failed to load stored QR codes', err);
    return initialEducationalCodes;
  }
};

export const saveStoredQRCodes = (codes: EducationalQRCode[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
  } catch (err) {
    console.error('Failed to save QR codes', err);
  }
};

export const recordScan = (idOrShortCode: string): EducationalQRCode | null => {
  const codes = getStoredQRCodes();
  const index = codes.findIndex(c => c.id === idOrShortCode || c.shortCode.toLowerCase() === idOrShortCode.toLowerCase());
  if (index === -1) return null;

  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const currentCode = codes[index];
  const history = [...(currentCode.scanHistory || [])];
  const dayIndex = history.findIndex(h => h.date === todayStr);
  if (dayIndex >= 0) {
    history[dayIndex] = { ...history[dayIndex], count: history[dayIndex].count + 1 };
  } else {
    history.push({ date: todayStr, count: 1 });
  }

  codes[index] = {
    ...currentCode,
    scanCount: currentCode.scanCount + 1,
    lastScannedAt: timestamp,
    scanHistory: history
  };

  saveStoredQRCodes(codes);
  return codes[index];
};

export const moveQRCodeToFolder = (qrId: string, folderId?: string): EducationalQRCode | null => {
  const codes = getStoredQRCodes();
  const index = codes.findIndex(c => c.id === qrId);
  if (index === -1) return null;

  codes[index] = {
    ...codes[index],
    folderId: folderId || undefined
  };

  saveStoredQRCodes(codes);
  return codes[index];
};

export const initialCustomTags: CustomTag[] = [
  {
    id: 'scavenger_hunt',
    label: 'QR Лов на информации',
    color: '#8b5cf6', // Violet
    createdAt: '2026-03-20'
  },
  {
    id: 'interactive_lab',
    label: 'Интерактивна лабораторија',
    color: '#0d9488', // Teal
    createdAt: '2026-03-22'
  },
  {
    id: 'math_olympiad',
    label: 'Математичка олимпијада',
    color: '#ea580c', // Orange
    createdAt: '2026-03-25'
  }
];

export const getStoredCustomTags = (): CustomTag[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_TAGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CUSTOM_TAGS_STORAGE_KEY, JSON.stringify(initialCustomTags));
      return initialCustomTags;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialCustomTags;
  } catch (err) {
    console.error('Failed to load stored custom tags', err);
    return initialCustomTags;
  }
};

export const saveStoredCustomTags = (tags: CustomTag[]): void => {
  try {
    localStorage.setItem(CUSTOM_TAGS_STORAGE_KEY, JSON.stringify(tags));
  } catch (err) {
    console.error('Failed to save custom tags', err);
  }
};

export const saveOrUpdateCustomTag = (tag: CustomTag): CustomTag[] => {
  const tags = getStoredCustomTags();
  const existingIdx = tags.findIndex(t => t.id === tag.id);
  let updated: CustomTag[];
  if (existingIdx >= 0) {
    updated = [...tags];
    updated[existingIdx] = { ...updated[existingIdx], ...tag };
  } else {
    updated = [...tags, tag];
  }
  saveStoredCustomTags(updated);
  return updated;
};

export const renameTagGlobally = (
  oldTagId: string,
  newTagId: string,
  newLabel?: string,
  newColor?: string
): { updatedCodes: EducationalQRCode[]; updatedTags: CustomTag[] } => {
  const codes = getStoredQRCodes();
  const tags = getStoredCustomTags();

  // 1. Ажурирање на ознаките во сите QR кодови
  const updatedCodes = codes.map(code => {
    if (!code.tags || !code.tags.includes(oldTagId)) return code;
    const newTags = code.tags.map(t => (t === oldTagId ? newTagId : t));
    // отстрани дупликати ако евентуално новиот таг веќе постоел
    return {
      ...code,
      tags: Array.from(new Set(newTags))
    };
  });
  saveStoredQRCodes(updatedCodes);

  // 2. Ажурирање во дефинициите на сопствени ознаки
  const tagIdx = tags.findIndex(t => t.id === oldTagId);
  let updatedTags = [...tags];
  if (tagIdx >= 0) {
    updatedTags[tagIdx] = {
      ...updatedTags[tagIdx],
      id: newTagId,
      label: newLabel || updatedTags[tagIdx].label,
      color: newColor || updatedTags[tagIdx].color
    };
  } else if (newLabel) {
    updatedTags.push({
      id: newTagId,
      label: newLabel,
      color: newColor || '#6366f1',
      createdAt: new Date().toISOString().split('T')[0]
    });
  }
  saveStoredCustomTags(updatedTags);

  return { updatedCodes, updatedTags };
};

export const deleteTagGlobally = (
  tagId: string
): { updatedCodes: EducationalQRCode[]; updatedTags: CustomTag[] } => {
  const codes = getStoredQRCodes();
  const tags = getStoredCustomTags();

  // 1. Избриши ја ознаката од сите QR кодови
  const updatedCodes = codes.map(code => {
    if (!code.tags || !code.tags.includes(tagId)) return code;
    return {
      ...code,
      tags: code.tags.filter(t => t !== tagId)
    };
  });
  saveStoredQRCodes(updatedCodes);

  // 2. Избриши од дефинициите
  const updatedTags = tags.filter(t => t.id !== tagId);
  saveStoredCustomTags(updatedTags);

  return { updatedCodes, updatedTags };
};
