import { BloomLevel, GardnerIntelligence, ScaffoldingStep } from '../types';

export interface LatexTemplate {
  id: string;
  category: 'algebra' | 'calculus' | 'linear' | 'trig' | 'geometry' | 'stats' | 'physics' | 'chemistry' | 'biology' | 'cs' | 'geography' | 'humanities';
  categoryLabel: {
    mk: string;
    sq: string;
    en: string;
  };
  title: {
    mk: string;
    sq: string;
    en: string;
  };
  description: {
    mk: string;
    sq: string;
    en: string;
  };
  latexSnippet: string;
  solutionLatex?: string;
  subject: string;
  targetGrade: string;
  bloomLevel?: BloomLevel;
  gardnerIntelligence?: GardnerIntelligence;
  scaffoldingSteps?: ScaffoldingStep[];
}

export const latexTemplates: LatexTemplate[] = [
  // АЛГЕБРА
  {
    id: 'algebra-quadratic-formula',
    category: 'algebra',
    categoryLabel: {
      mk: 'Алгебра & Квадратни равенки',
      sq: 'Algjebër & Ekuacione Kuadratike',
      en: 'Algebra & Quadratic Equations',
    },
    title: {
      mk: 'Формула за квадратна равенка ($ax^2 + bx + c = 0$)',
      sq: 'Formula për ekuacionin kuadratik',
      en: 'Quadratic Formula Solution',
    },
    description: {
      mk: 'Општо решение на квадратна равенка со дискриминанта $D = b^2 - 4ac$.',
      sq: 'Zgjidhja e përgjithshme e ekuacionit kuadratik me diskriminant.',
      en: 'General solution of quadratic equation using discriminant.',
    },
    latexSnippet: '$$x_{1,2} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$',
    solutionLatex: 'За равенката $ax^2 + bx + c = 0$:\n$$D = b^2 - 4ac$$\nАко $D > 0$, постојат две реални решенија:\n$$x_1 = \\frac{-b + \\sqrt{D}}{2a}, \\quad x_2 = \\frac{-b - \\sqrt{D}}{2a}$$',
    subject: 'Алгебра',
    targetGrade: 'I година средно',
    bloomLevel: 'apply',
    gardnerIntelligence: 'logical_mathematical',
    scaffoldingSteps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Определување коефициенти',
        contentWithLatex: 'Идентификувај ги вредностите за $a$, $b$ и $c$ во равенката $ax^2 + bx + c = 0$.',
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Пресметка на дискриминанта $D$',
        contentWithLatex: 'Пресметај ја дискриминантата: $$D = b^2 - 4ac$$',
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'Замена во формулата',
        contentWithLatex: 'Замени ги вредностите во: $$x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}$$',
      },
    ],
  },
  {
    id: 'algebra-vieta-formulas',
    category: 'algebra',
    categoryLabel: {
      mk: 'Алгебра & Квадратни равенки',
      sq: 'Algjebër & Ekuacione Kuadratike',
      en: 'Algebra & Quadratic Equations',
    },
    title: {
      mk: 'Виетови формули за корени',
      sq: 'Formulat e Vieta-s për rrënjët',
      en: "Vieta's Formulas for Roots",
    },
    description: {
      mk: 'Врска помеѓу корените $x_1, x_2$ и коефициентите на квадратната равенка.',
      sq: 'Lidhja midis rrënjëve dhe koeficientëve të ekuacionit kuadratik.',
      en: 'Relations between roots and coefficients of a quadratic polynomial.',
    },
    latexSnippet: '$$x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 \\cdot x_2 = \\frac{c}{a}$$',
    solutionLatex: 'За квадратната равенка $x^2 + px + q = 0$:\n$$x_1 + x_2 = -p, \\quad x_1 \\cdot x_2 = q$$',
    subject: 'Алгебра',
    targetGrade: 'I година средно',
    bloomLevel: 'analyze',
    gardnerIntelligence: 'logical_mathematical',
  },

  // КАЛКУЛУС / АНАЛИЗА
  {
    id: 'calculus-definite-integral',
    category: 'calculus',
    categoryLabel: {
      mk: 'Математичка анализа & Интеграли',
      sq: 'Analizë Matematikore & Integrale',
      en: 'Calculus & Integration',
    },
    title: {
      mk: 'Определен интеграл (Њутн-Лајбницова формула)',
      sq: 'Integrali i caktuar (Formula Newton-Leibniz)',
      en: 'Definite Integral & Newton-Leibniz Formula',
    },
    description: {
      mk: 'Пресметување плоштина под крива $f(x)$ на интервалот $[a, b]$.',
      sq: 'Llogaritja e sipërfaqes nën lakore $f(x)$ në intervalin $[a, b]$.',
      en: 'Area under curve $f(x)$ evaluated from $a$ to $b$.',
    },
    latexSnippet: '$$\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)$$',
    solutionLatex: 'Каде што $F(x)$ е примарна функција на $f(x)$, т.е. $F\'(x) = f(x)$.\nПример: $$\ me\\int_{1}^{3} x^2 \\, dx = \\left[ \\frac{x^3}{3} \\right]_{1}^{3} = \\frac{27}{3} - \\frac{1}{3} = \\frac{26}{3}$$',
    subject: 'Математичка анализа',
    targetGrade: 'IV година средно',
    bloomLevel: 'evaluate',
    gardnerIntelligence: 'logical_mathematical',
    scaffoldingSteps: [
      {
        id: 'calc-step-1',
        stepNumber: 1,
        title: 'Наоѓање примарна функција $F(x)$',
        contentWithLatex: 'Пресметај неопределен интеграл: $F(x) = \\int f(x) dx$.',
      },
      {
        id: 'calc-step-2',
        stepNumber: 2,
        title: 'Примена на граници',
        contentWithLatex: 'Пресметај ја разликата: $F(b) - F(a)$.',
      },
    ],
  },
  {
    id: 'calculus-derivative-definition',
    category: 'calculus',
    categoryLabel: {
      mk: 'Математичка анализа & Интеграли',
      sq: 'Analizë Matematikore & Integrale',
      en: 'Calculus & Integration',
    },
    title: {
      mk: 'Дефиниција за извод преку гранична вредност',
      sq: 'Përkufizimi i derivatit me limit',
      en: 'Definition of Derivative via Limit',
    },
    description: {
      mk: 'Моментална брзина на промена на функцијата $f(x)$.',
      sq: 'Shkalla e ndryshimit të menjëhershëm të funksionit $f(x)$.',
      en: 'Instantaneous rate of change definition via limit.',
    },
    latexSnippet: '$$f\'(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x + \\Delta x) - f(x)}{\\Delta x}$$',
    solutionLatex: 'За функцијата $f(x) = x^2$:\n$$f\'(x) = \\lim_{h \\to 0} \\frac{(x+h)^2 - x^2}{h} = \\lim_{h \\to 0} \\frac{2xh + h^2}{h} = 2x$$',
    subject: 'Математичка анализа',
    targetGrade: 'III година средно',
    bloomLevel: 'understand',
    gardnerIntelligence: 'logical_mathematical',
  },

  // ЛИНЕАРНА АЛГЕБРА И МАТРИЦИ
  {
    id: 'linear-matrix-2x2-determinant',
    category: 'linear',
    categoryLabel: {
      mk: 'Линеарна алгебра & Матрици',
      sq: 'Algjebër Lineare & Matrica',
      en: 'Linear Algebra & Matrices',
    },
    title: {
      mk: 'Детерминанта на 2x2 матрица и систем равенки',
      sq: 'Përcaktori i matricës 2x2',
      en: '2x2 Matrix Determinant & System',
    },
    description: {
      mk: 'Пресметување детерминанта $\\det(A)$ и примена на Крамерово правило.',
      sq: 'Llogaritja e përcaktorit të matricës 2x2.',
      en: 'Determinant calculation for a 2x2 matrix.',
    },
    latexSnippet: '$$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}, \\quad \\det(A) = ad - bc$$',
    solutionLatex: 'Ако $\\det(A) \\neq 0$, постои инверзна матрица:\n$$A^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$',
    subject: 'Линеарна алгебра',
    targetGrade: 'II година средно',
    bloomLevel: 'apply',
    gardnerIntelligence: 'logical_mathematical',
  },
  {
    id: 'linear-system-cramer',
    category: 'linear',
    categoryLabel: {
      mk: 'Линеарна алгебра & Матрици',
      sq: 'Algjebër Lineare & Matrica',
      en: 'Linear Algebra & Matrices',
    },
    title: {
      mk: 'Крамерово правило за систем од 2 линеарни равенки',
      sq: 'Rregulli i Cramer-it për sistemin 2x2',
      en: "Cramer's Rule for 2x2 System",
    },
    description: {
      mk: 'Решавање систем $\\begin{cases} a_1 x + b_1 y = c_1 \\\\ a_2 x + b_2 y = c_2 \\end{cases}$ преку детерминанти.',
      sq: 'Zgjidhja e sistemit me përcaktorë.',
      en: 'Solving system of two equations via matrix determinants.',
    },
    latexSnippet: '$$x = \\frac{D_x}{D}, \\quad y = \\frac{D_y}{D}, \\quad D = \\begin{vmatrix} a_1 & b_1 \\\\ a_2 & b_2 \\end{vmatrix}$$',
    solutionLatex: '$$D_x = \\begin{vmatrix} c_1 & b_1 \\\\ c_2 & b_2 \\end{vmatrix}, \\quad D_y = \\begin{vmatrix} a_1 & c_1 \\\\ a_2 & c_2 \\end{vmatrix}$$',
    subject: 'Алгебра',
    targetGrade: 'II година средно',
    bloomLevel: 'apply',
    gardnerIntelligence: 'logical_mathematical',
  },

  // ТРИГОНОМЕТРИЈА
  {
    id: 'trig-pythagorean-identity',
    category: 'trig',
    categoryLabel: {
      mk: 'Тригонометрија & Агли',
      sq: 'Trigonometri & Kënde',
      en: 'Trigonometry & Angles',
    },
    title: {
      mk: 'Основен тригонометриски идентитет',
      sq: 'Identiteti bazë trigonometrik',
      en: 'Fundamental Pythagorean Trig Identity',
    },
    description: {
      mk: 'Врска помеѓу синус и косинус на единичната кружница.',
      sq: 'Lidhja midis sinusin dhe kosinusin në rrethin njësi.',
      en: 'Identity relating sine and cosine on the unit circle.',
    },
    latexSnippet: '$$\\sin^2(\\alpha) + \\cos^2(\\alpha) = 1$$',
    solutionLatex: 'Преку делење со $\\cos^2(\\alpha)$ се добива:\n$$1 + \\tan^2(\\alpha) = \\frac{1}{\\cos^2(\\alpha)}$$',
    subject: 'Тригонометрија',
    targetGrade: 'II година средно',
    bloomLevel: 'remember',
    gardnerIntelligence: 'visual_spatial',
  },
  {
    id: 'trig-sine-law',
    category: 'trig',
    categoryLabel: {
      mk: 'Тригонометрија & Агли',
      sq: 'Trigonometri & Kënde',
      en: 'Trigonometry & Angles',
    },
    title: {
      mk: 'Синусна теорема за произволен триаголник',
      sq: 'Teorema e sinuseve',
      en: 'Law of Sines for General Triangles',
    },
    description: {
      mk: 'Однос помеѓу страните и синусите на спротивните агли.',
      sq: 'Marrëdhënia midis brinjëve dhe sinuseve të këndeve.',
      en: 'Ratio between sides and sines of opposite angles in any triangle.',
    },
    latexSnippet: '$$\\frac{a}{\\sin(\\alpha)} = \\frac{b}{\\sin(\\beta)} = \\frac{c}{\\sin(\\gamma)} = 2R$$',
    solutionLatex: 'Каде што $R$ е радиус на опишаната кружница околу триаголникот $ABC$.',
    subject: 'Тригонометрија',
    targetGrade: 'II година средно',
    bloomLevel: 'apply',
    gardnerIntelligence: 'logical_mathematical',
  },

  // ГЕОМЕТРИЈА
  {
    id: 'geometry-pythagoras-theorem',
    category: 'geometry',
    categoryLabel: {
      mk: 'Геометрија & Стереометрија',
      sq: 'Gjeometri & Stereometri',
      en: 'Geometry & Stereometry',
    },
    title: {
      mk: 'Питагорова теорема',
      sq: 'Teorema e Pitagorës',
      en: 'Pythagorean Theorem',
    },
    description: {
      mk: 'Врска помеѓу катетите $a, b$ и хипотенузата $c$ во правоаголен триаголник.',
      sq: 'Marrëdhënia midis kateteve dhe hipotenuzës.',
      en: 'Right triangle relationship between legs and hypotenuse.',
    },
    latexSnippet: '$$a^2 + b^2 = c^2 \\implies c = \\sqrt{a^2 + b^2}$$',
    solutionLatex: 'За катети $a = 3\\text{ cm}, b = 4\\text{ cm}$:\n$$c = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5\\text{ cm}$$',
    subject: 'Геометрија',
    targetGrade: '7-мо одделение',
    bloomLevel: 'apply',
    gardnerIntelligence: 'visual_spatial',
  },

  // ВЕРОЈАТНОСТ И СТАТИСТИКА
  {
    id: 'stats-normal-distribution',
    category: 'stats',
    categoryLabel: {
      mk: 'Веројатност & Статистика',
      sq: 'Probabilitet & Statistikë',
      en: 'Probability & Statistics',
    },
    title: {
      mk: 'Густина на Гаусова нормална распределба',
      sq: 'Shpërndarja normale e Gausit',
      en: 'Gaussian Normal Distribution Function',
    },
    description: {
      mk: 'Функција на густина на веројатност со аритметичка средина $\\mu$ и стандардна девијација $\\sigma$.',
      sq: 'Funksioni i densitetit me mesatare $\\mu$ dhe devijim standard $\\sigma$.',
      en: 'Probability density function with mean $\\mu$ and standard deviation $\\sigma$.',
    },
    latexSnippet: '$$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x - \\mu}{\\sigma}\\right)^2}$$',
    solutionLatex: 'За стандардизирана нормална распределба $(\\mu = 0, \\sigma = 1)$:\n$$\\phi(z) = \\frac{1}{\\sqrt{2\\pi}} e^{-\\frac{z^2}{2}}$$--',
    subject: 'Статистика',
    targetGrade: 'IV година средно',
    bloomLevel: 'analyze',
    gardnerIntelligence: 'logical_mathematical',
  },

  // ФИЗИКА (PHYSICS) - Основно & Средно образование
  {
    id: 'physics-newton-second-law',
    category: 'physics',
    categoryLabel: {
      mk: 'Физика & Механика',
      sq: 'Fizikë & Mekanikë',
      en: 'Physics & Mechanics',
    },
    title: {
      mk: 'Втор Њутнов закон за движење ($F = m \\cdot a$)',
      sq: 'Ligji i dytë i Njutonit për lëvizjen',
      en: "Newton's Second Law of Motion",
    },
    description: {
      mk: 'Врска помеѓу силата, масата на телото и забрзувањето (Основно: 8-мо одд. / Средно: I год.).',
      sq: 'Lidhja midis forcës, masës dhe nxitimit.',
      en: 'Relation between resultant force, mass, and acceleration.',
    },
    latexSnippet: '$$\\vec{F} = m \\cdot \\vec{a} \\implies a = \\frac{F}{m}$$',
    solutionLatex: 'Ако на тело со маса $m = 5\\text{ kg}$ делува сила $F = 20\\text{ N}$:\n$$a = \\frac{F}{m} = \\frac{20\\text{ N}}{5\\text{ kg}} = 4\\text{ m/s}^2$$',
    subject: 'Физика',
    targetGrade: '8-мо одделение / I година',
    bloomLevel: 'apply',
    gardnerIntelligence: 'logical_mathematical',
    scaffoldingSteps: [
      {
        id: 'phys-step-1',
        stepNumber: 1,
        title: 'Издвојување на дадените величини',
        contentWithLatex: 'Запишете: Маса $m$ во килограми и сила $F$ во Њутни (N).',
        revealedByDefault: false
      },
      {
        id: 'phys-step-2',
        stepNumber: 2,
        title: 'Примена на основната равенка',
        contentWithLatex: 'Изолирајте го забрзувањето $a$: $$a = \\frac{F}{m}$$ и пресметајте ја вредноста.',
        revealedByDefault: false
      }
    ]
  },
  {
    id: 'physics-kinetic-potential-energy',
    category: 'physics',
    categoryLabel: {
      mk: 'Физика & Енергија',
      sq: 'Fizikë & Energji',
      en: 'Physics & Energy',
    },
    title: {
      mk: 'Кинетичка и потенцијална енергија ($E_k$ и $E_p$)',
      sq: 'Energjia kinetike dhe potenciale',
      en: 'Kinetic and Potential Energy',
    },
    description: {
      mk: 'Формули за механичка енергија и закон за зачувување на енергијата.',
      sq: 'Formulat për energjinë mekanike dhe ruajtjen e saj.',
      en: 'Formulas for mechanical energy and conservation law.',
    },
    latexSnippet: '$$E_k = \\frac{1}{2} m v^2, \\quad E_p = m g h, \\quad E_{tot} = E_k + E_p = \\text{const}$$',
    solutionLatex: 'За тело со маса $m = 2\\text{ kg}$ на висина $h = 10\\text{ m}$ ($g = 9.8\\text{ m/s}^2$):\n$$E_p = 2 \\cdot 9.8 \\cdot 10 = 196\\text{ J}$$\nПри паѓање без отпор, целата $E_p$ преминува во $E_k$.',
    subject: 'Физика',
    targetGrade: '8-мо одделение / II година',
    bloomLevel: 'analyze',
    gardnerIntelligence: 'logical_mathematical'
  },
  {
    id: 'physics-ohms-law',
    category: 'physics',
    categoryLabel: {
      mk: 'Физика & Електрицитет',
      sq: 'Fizikë & Elektricitet',
      en: 'Physics & Electricity',
    },
    title: {
      mk: 'Омов закон за дел од струјно коло ($I = \\frac{U}{R}$)',
      sq: 'Ligji i Omit për rrymën elektrike',
      en: "Ohm's Law for Electric Circuits",
    },
    description: {
      mk: 'Зависност на јачината на електричната струја од електричниот напон и електричниот отпор.',
      sq: 'Varësia e intensitetit nga tensioni dhe rezistenca.',
      en: 'Relationship between electric current, voltage, and electrical resistance.',
    },
    latexSnippet: '$$I = \\frac{U}{R} \\iff U = I \\cdot R \\iff R = \\frac{U}{I}$$',
    solutionLatex: 'При напон $U = 220\\text{ V}$ и отпор $R = 44\\,\\Omega$:\n$$I = \\frac{220}{44} = 5\\text{ A}$$',
    subject: 'Физика',
    targetGrade: '9-то одделение / II година',
    bloomLevel: 'apply',
    gardnerIntelligence: 'logical_mathematical'
  },

  // ХЕМИЈА (CHEMISTRY) - Основно & Средно образование
  {
    id: 'chem-molar-mass',
    category: 'chemistry',
    categoryLabel: {
      mk: 'Хемија & Стехиометрија',
      sq: 'Kimi & Stekiometri',
      en: 'Chemistry & Stoichiometry',
    },
    title: {
      mk: 'Количество супстанца и моларна маса ($n = \\frac{m}{M}$)',
      sq: 'Sasia e substancës dhe masa molare',
      en: 'Amount of Substance and Molar Mass',
    },
    description: {
      mk: 'Основна стехиометриска формула за пресметување на молови од маса и релативна молекулска маса.',
      sq: 'Formula themelore për llogaritjen e moleve.',
      en: 'Core stoichiometric relationship between mass, moles, and molar mass.',
    },
    latexSnippet: '$$n = \\frac{m}{M}, \\quad N = n \\cdot N_A \\quad (N_A = 6.022 \\times 10^{23} \\text{ mol}^{-1})$$',
    solutionLatex: 'За вода ($H_2O$): $M(H_2O) = 2(1) + 16 = 18\\text{ g/mol}$.\nЗа маса $m = 36\\text{ g}$:\n$$n = \\frac{36\\text{ g}}{18\\text{ g/mol}} = 2\\text{ mol}$$',
    subject: 'Хемија',
    targetGrade: '8-мо одделение / I година',
    bloomLevel: 'apply',
    gardnerIntelligence: 'logical_mathematical'
  },
  {
    id: 'chem-ph-scale',
    category: 'chemistry',
    categoryLabel: {
      mk: 'Хемија & Раствори',
      sq: 'Kimi & Tretësira',
      en: 'Chemistry & Solutions',
    },
    title: {
      mk: 'pH вредност и концентрација на хидрониум јони',
      sq: 'Vlera pH dhe përqendrimi i joneve',
      en: 'pH Scale and Hydronium Ion Concentration',
    },
    description: {
      mk: 'Мерка за киселост или базност на воден раствор преку негативен декаден логаритам.',
      sq: 'Masa e aciditetit ose bazicitetit të tretësirës.',
      en: 'Logarithmic measure of aqueous solution acidity or basicity.',
    },
    latexSnippet: '$$\\text{pH} = -\\log_{10}[H_3O^+], \\quad \\text{pH} + \\text{pOH} = 14$$',
    solutionLatex: 'Ако концентрацијата на $[H_3O^+] = 10^{-3}\\text{ mol/L}$:\n$$\\text{pH} = -\\log_{10}(10^{-3}) = 3 \\quad (\\text{кисел раствор})$$',
    subject: 'Хемија',
    targetGrade: '9-то одделение / II година',
    bloomLevel: 'analyze',
    gardnerIntelligence: 'logical_mathematical'
  },

  // БИОЛОГИЈА (BIOLOGY) - Основно & Средно образование
  {
    id: 'bio-mendel-genetics',
    category: 'biology',
    categoryLabel: {
      mk: 'Биологија & Генетика',
      sq: 'Biologji & Gjenetikë',
      en: 'Biology & Genetics',
    },
    title: {
      mk: 'Менделов монохибриден крстос ($Aa \\times Aa$)',
      sq: 'Kryqëzimi monohibrid i Mendelit',
      en: "Mendel's Monohybrid Cross Ratio",
    },
    description: {
      mk: 'Пенетов квадрат и генотипски/фенотипски сооднос во втората генерација (F2).',
      sq: 'Sheshi Punnett dhe raporti gjenotipik/fenotipik në F2.',
      en: 'Punnett square genotype (1:2:1) and phenotype (3:1) inheritance ratios.',
    },
    latexSnippet: '$$Aa \\times Aa \\implies 1 AA : 2 Aa : 1 aa \\quad (\\text{Фенотип: } 3:1)$$',
    solutionLatex: 'Генотипски сооднос: $25\\% AA, 50\\% Aa, 25\\% aa$.\nФенотипски сооднос: $75\\%$ со доминантен белег, $25\\%$ со рецесивен белег.',
    subject: 'Биологија',
    targetGrade: '9-то одделение / III година',
    bloomLevel: 'analyze',
    gardnerIntelligence: 'naturalistic'
  },
  {
    id: 'bio-photosynthesis',
    category: 'biology',
    categoryLabel: {
      mk: 'Биологија & Физиологија',
      sq: 'Biologji & Fiziologji',
      en: 'Biology & Physiology',
    },
    title: {
      mk: 'Хемиска равенка на фотосинтеза',
      sq: 'Ekuacioni kimik i fotosintezës',
      en: 'Photosynthesis Chemical Equation',
    },
    description: {
      mk: 'Биохемиска синтеза на гликоза и кислород од јаглероден диоксид и вода со помош на сончева светлина.',
      sq: 'Sinteza biokimike e glukozës me dritë diellore.',
      en: 'Biochemical transformation of light energy into chemical energy stored in glucose.',
    },
    latexSnippet: '$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{h\\nu, \\text{хлорофил}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$',
    solutionLatex: 'Влезни материи: 6 молекули јаглероден диоксид и 6 молекули вода.\nИзлезни продукти: 1 молекула гликоза (шеќер) и 6 молекули кислород кои се ослободуваат во атмосферата.',
    subject: 'Биологија',
    targetGrade: '6-то одделение / I година',
    bloomLevel: 'understand',
    gardnerIntelligence: 'naturalistic'
  },

  // ИНФОРМАТИКА & КОМПЈУТЕРСКИ НАУКИ (CS)
  {
    id: 'cs-binary-conversion',
    category: 'cs',
    categoryLabel: {
      mk: 'Информатика & Бројни системи',
      sq: 'Informatikë & Sisteme Numerike',
      en: 'Informatics & Number Systems',
    },
    title: {
      mk: 'Конверзија од бинарен во декаден броен систем',
      sq: 'Konvertimi binar në dhjetor',
      en: 'Binary to Decimal Representation',
    },
    description: {
      mk: 'Позиционен запис на бинарен број преку тежински степени на основата 2.',
      sq: 'Shënimi i numrit binar përmes fuqive të bazës 2.',
      en: 'Weighted polynomial sum of binary bits to base-10 integer.',
    },
    latexSnippet: '$$N_{(10)} = \\sum_{i=0}^{n-1} b_i \\cdot 2^i = b_{n-1} 2^{n-1} + \\dots + b_1 2^1 + b_0 2^0$$',
    solutionLatex: 'За бинарниот број $(10110)_2$:\n$$1 \\cdot 2^4 + 0 \\cdot 2^3 + 1 \\cdot 2^2 + 1 \\cdot 2^1 + 0 \\cdot 2^0 = 16 + 0 + 4 + 2 + 0 = 22_{(10)}$$',
    subject: 'Информатика & Програмирање',
    targetGrade: '6-то / 7-мо одделение / I година',
    bloomLevel: 'apply',
    gardnerIntelligence: 'logical_mathematical'
  },
  {
    id: 'cs-algorithm-complexity',
    category: 'cs',
    categoryLabel: {
      mk: 'Информатика & Алгоритми',
      sq: 'Informatikë & Algoritme',
      en: 'Informatics & Algorithms',
    },
    title: {
      mk: 'Асимптотска сложеност на алгоритми (Големо O)',
      sq: 'Kompleksiteti i algoritmeve (O e Madhe)',
      en: 'Asymptotic Big-O Algorithmic Complexity',
    },
    description: {
      mk: 'Споредба на времето на извршување: $O(1) < O(\\log n) < O(n) < O(n \\log n) < O(n^2)$.',
      sq: 'Krahasimi i kohës së ekzekutimit të algoritmeve.',
      en: 'Time complexity tiers comparing searching and sorting algorithms.',
    },
    latexSnippet: '$$T(n) = O(n \\log_2 n) \\quad \\text{vs.} \\quad T(n) = O(n^2)$$',
    solutionLatex: 'При $n = 1000$ елементи:\nБрзо сортирање (Quicksort): $\\approx 1000 \\cdot 10 = 10^4$ операции.\nКвадратно сортирање (Bubblesort): $1000^2 = 10^6$ операции (100 пати побавно!).',
    subject: 'Информатика & Програмирање',
    targetGrade: 'III / IV година гимназија',
    bloomLevel: 'analyze',
    gardnerIntelligence: 'logical_mathematical'
  },

  // ГЕОГРАФИЈА & ИСТОРИЈА (GEOGRAPHY & HUMANITIES)
  {
    id: 'geo-scale-map',
    category: 'geography',
    categoryLabel: {
      mk: 'Географија & Картографија',
      sq: 'Gjeografi & Hartografi',
      en: 'Geography & Cartography',
    },
    title: {
      mk: 'Размер на географска карта ($M = 1 : k$)',
      sq: 'Shkalla e hartës gjeografike',
      en: 'Geographic Map Scale Ratio',
    },
    description: {
      mk: 'Пресметка на вистинско растојание во природата од растојание измерено на карта.',
      sq: 'Llogaritja e distancës reale nga harta.',
      en: 'Calculation of real-world ground distances from map measurements.',
    },
    latexSnippet: '$$D_{\\text{вистинско}} = d_{\\text{карта}} \\cdot k \\quad (\\text{Размер } 1 : k)$$',
    solutionLatex: 'Ако на карта со размер $1 : 250\\,000$ растојанието е $d = 4\\text{ cm}$:\n$$D = 4\\text{ cm} \\cdot 250\\,000 = 1\\,000\\,000\\text{ cm} = 10\\text{ km}$$',
    subject: 'Географија',
    targetGrade: '7-мо одделение / I година',
    bloomLevel: 'apply',
    gardnerIntelligence: 'visual_spatial'
  },
  {
    id: 'geo-population-density',
    category: 'geography',
    categoryLabel: {
      mk: 'Географија & Демографија',
      sq: 'Gjeografi & Demografi',
      en: 'Geography & Demographics',
    },
    title: {
      mk: 'Густина на населеност ($Г = \\frac{Н}{П}$)',
      sq: 'Dendësia e popullsisë',
      en: 'Population Density Ratio',
    },
    description: {
      mk: 'Број на жители на квадратен километар територија.',
      sq: 'Numri i banorëve për kilometër katror.',
      en: 'Number of inhabitants per square kilometer of geographical area.',
    },
    latexSnippet: '$$Г = \\frac{N}{P} \\quad [\\text{жит./km}^2]$$',
    solutionLatex: 'За регион со $N = 360\\,000$ жители и површина $P = 4\\,500\\text{ km}^2$:\n$$Г = \\frac{360\\,000}{4\\,500} = 80\\text{ жители/km}^2$$',
    subject: 'Географија',
    targetGrade: '8-мо одделение / II година',
    bloomLevel: 'apply',
    gardnerIntelligence: 'visual_spatial'
  },

  // МАКЕДОНСКИ ЈАЗИК & ЛИТЕРАТУРА (HUMANITIES & LANGUAGE)
  {
    id: 'lang-stylistic-devices',
    category: 'humanities',
    categoryLabel: {
      mk: 'Јазик & Книжевност',
      sq: 'Gjuhë & Letërsi',
      en: 'Language & Literature',
    },
    title: {
      mk: 'Стилски фигури: Метафора, Персонификација, Споредба',
      sq: 'Figurat stilistike në letërsi',
      en: 'Literary Stylistic Figures',
    },
    description: {
      mk: 'Анализа на поетски израз: Преносно значење, оживување на природата и компарација.',
      sq: 'Analiza e shprehjes poetike dhe figurave të fjalës.',
      en: 'Identification and pedagogical analysis of metaphorical and figurative expressions.',
    },
    latexSnippet: '$$\\text{Споредба: } A \\sim B \\quad | \\quad \\text{Метафора: } A = B_{\\text{преносно}}$$',
    solutionLatex: 'Пример персонификација: „Ветрот пееше низ гранките“ (на нежива природа и се даваат човечки особини).\nПример метафора: „Нејзините очи беа две ѕвезди“ (скриена споредба без зборот „како“).',
    subject: 'Македонски јазик & Литература',
    targetGrade: '7-мо / 8-мо одделение / I година',
    bloomLevel: 'analyze',
    gardnerIntelligence: 'verbal_linguistic'
  }
];

