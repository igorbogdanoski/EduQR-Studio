import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Helper local pedagogical generator when API key is not supplied or for fallback
function generateLocalPedagogicalResponse(prompt: string, language: string = 'mk') {
  const isMk = language === 'mk';
  const isSq = language === 'sq';
  const pLower = (prompt || '').toLowerCase();

  let subject = isMk ? 'Математика' : isSq ? 'Matematikë' : 'Mathematics';
  let grade = isMk ? '8-мо одделение' : isSq ? 'Klasa 8' : 'Grade 8';
  let title = isMk ? 'Математичка задача' : isSq ? 'Detyrë matematike' : 'Math Task';
  let bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create' = 'apply';
  let tags: string[] = ['in_class', 'exam_prep'];

  let latexContent = 'Реши ја равенката: $$3x + 12 = 33$$ и пресметај ја вредноста на променливата $x$.';
  let solutionLatex = '$$3x = 33 - 12$$\n$$3x = 21$$\n$$x = \\frac{21}{3} = 7$$';
  let scaffoldingSteps = [
    {
      stepNumber: 1,
      title: isMk ? 'Чекор 1: Изолирање на членовите' : 'Step 1: Term Isolation',
      contentWithLatex: 'Префрли го бројот $+12$ од десната страна со спротивен знак: $$3x = 33 - 12$$',
      revealedByDefault: false
    },
    {
      stepNumber: 2,
      title: isMk ? 'Чекор 2: Делење со коефициентот' : 'Step 2: Division',
      contentWithLatex: 'Подели ги двете страни на равенката со коефициентот $3$: $$x = \\frac{21}{3} = 7$$',
      revealedByDefault: false
    }
  ];

  if (pLower.includes('питагор') || pLower.includes('pythagor') || pLower.includes('триаголник')) {
    subject = isMk ? 'Геометрија' : isSq ? 'Gjeometri' : 'Geometry';
    grade = isMk ? '8-мо одделение' : 'Grade 8';
    title = isMk ? 'Питагорова теорема: Хипотенуза и катети' : 'Pythagorean Theorem: Hypotenuse';
    latexContent = 'Во правоаголен триаголник катетите се $a = 6\\text{ cm}$ и $b = 8\\text{ cm}$. Пресметај ја хипотенузата $c$ и плоштината $P$.';
    solutionLatex = 'По теорема на Питагора: $$c^2 = a^2 + b^2 = 6^2 + 8^2 = 36 + 64 = 100 \\implies c = 10\\text{ cm}$$\nПлоштина: $$P = \\frac{a \\cdot b}{2} = \\frac{6 \\cdot 8}{2} = 24\\text{ cm}^2$$';
    bloomLevel = 'apply';
    scaffoldingSteps = [
      {
        stepNumber: 1,
        title: isMk ? 'Формула за врска меѓу страните' : 'Fundamental formula',
        contentWithLatex: 'Квадратот над хипотенузата е еднаков на збирот од квадратите над катетите: $$c^2 = a^2 + b^2$$',
        revealedByDefault: false
      },
      {
        stepNumber: 2,
        title: isMk ? 'Формула за плоштина' : 'Area formula',
        contentWithLatex: 'Плоштината на правоаголен триаголник е половина од производот на катетите: $$P = \\frac{a \\cdot b}{2}$$',
        revealedByDefault: false
      }
    ];
  } else if (pLower.includes('квадрат') || pLower.includes('дискриминант') || pLower.includes('равенка')) {
    subject = isMk ? 'Алгебра' : 'Algebra';
    grade = isMk ? 'I година средно' : 'High School Year 1';
    title = isMk ? 'Квадратна равенка со дискриминанта' : 'Quadratic Equation with Discriminant';
    bloomLevel = 'analyze';
    latexContent = 'Дадена е квадратната равенка: $$x^2 - 7x + 10 = 0$$.\nОпредели ја дискриминантата $D$ и најди ги нејзините корени $x_1$ и $x_2$.';
    solutionLatex = '$$D = (-7)^2 - 4(1)(10) = 49 - 40 = 9 > 0$$\n$$x_{1,2} = \\frac{7 \\pm \\sqrt{9}}{2} = \\frac{7 \\pm 3}{2} \\implies x_1 = 5, \\quad x_2 = 2$$';
    scaffoldingSteps = [
      {
        stepNumber: 1,
        title: isMk ? 'Формула за дискриминанта' : 'Discriminant Formula',
        contentWithLatex: 'Пресметај: $$D = b^2 - 4ac$$. Бидејќи $D > 0$, равенката има две различни реални решенија.',
        revealedByDefault: false
      }
    ];
  } else if (pLower.includes('процент') || pLower.includes('попуст') || pLower.includes('percent')) {
    subject = isMk ? 'Применета Математика' : 'Applied Math';
    grade = isMk ? '7-мо одделение' : 'Grade 7';
    title = isMk ? 'Пресметка на процент и намалување' : 'Percentage and Discount Calculation';
    bloomLevel = 'understand';
    tags = ['homework', 'in_class'];
    latexContent = 'Цената на еден учебник од $1200\\text{ денари}$ е намалена за $15\\%$. Колку изнесува новата намалена цена?';
    solutionLatex = 'Износ на попуст: $$1200 \\cdot \\frac{15}{100} = 180\\text{ ден.}$$\nНова цена: $$1200 - 180 = 1020\\text{ денари}$$';
    scaffoldingSteps = [
      {
        stepNumber: 1,
        title: isMk ? 'Пресметка на 15%' : 'Calculating 15%',
        contentWithLatex: 'Помножи ја почетната цена со $\\frac{15}{100}$ за да го најдеш попустот.',
        revealedByDefault: false
      }
    ];
  }

  const spokenResponse = isMk
    ? `Ја подготвив задачата за вас! Се однесува на ${title} за ${grade}. Вклучува формула со LaTeX, целосно решение и скалирани чекори за учениците според Виготски. Можете веднаш да ја зачувате како интерактивен QR код.`
    : isSq
    ? `Përgatita detyrën për ju! I përket temës ${title} për ${grade}. Përmban formulë LaTeX dhe hapa shkallëzues sipas Vygotskyt.`
    : `I have prepared the task for you! It covers ${title} for ${grade}, including LaTeX formulas, full solution, and Vygotskian scaffolding steps.`;

  return {
    spokenResponse,
    title,
    subject,
    targetGrade: grade,
    latexContent,
    solutionLatex,
    scaffoldingSteps,
    bloomLevel,
    tags
  };
}

// Helper local Math Quiz generator when API key is not supplied or for fallback
function generateLocalMathQuizResponse(
  topic: string = 'linear_equations',
  grade: string = '8-мо одделение',
  questionCount: number = 5,
  difficulty: string = 'medium',
  language: string = 'mk'
) {
  const isMk = language === 'mk';
  const isSq = language === 'sq';
  const tLower = (topic || '').toLowerCase();

  interface QuizQ {
    questionNumber: number;
    questionLatex: string;
    solutionLatex: string;
    correctAnswerText: string;
    points: number;
    bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  }

  let title = isMk ? 'Математички квиз: Линеарни равенки' : isSq ? 'Kuiz Matematik: Ekuacionet Lineare' : 'Math Quiz: Linear Equations';
  let subject = isMk ? 'Алгебра & Математика' : isSq ? 'Algjebër' : 'Algebra';
  let instructions = isMk
    ? 'Решете ги следните задачи со целосна математичка постапка. На крајот, проверете ги одговорите преку QR кодот со клучеви.'
    : isSq
    ? 'Zgjidhni detyrat e mëposhtme me procedurë të plotë matematikore. Në fund verifikoni përgjigjet me QR kodin e çelësit.'
    : 'Solve the following math problems showing complete step-by-step working. Check your answers using the Answer Key QR code.';

  let pool: QuizQ[] = [];

  if (tLower.includes('pythagor') || tLower.includes('питагор') || tLower.includes('геометр')) {
    title = isMk ? 'Математички квиз: Питагорова теорема и правоаголен триаголник' : 'Math Quiz: Pythagorean Theorem';
    subject = isMk ? 'Геометрија' : 'Geometry';
    pool = [
      {
        questionNumber: 1,
        questionLatex: 'Во правоаголен триаголник катетите се $a = 6\\text{ cm}$ и $b = 8\\text{ cm}$. Пресметај ја должината на хипотенузата $c$.',
        solutionLatex: '$$c = \\sqrt{a^2 + b^2} = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10\\text{ cm}$$',
        correctAnswerText: 'c = 10 cm',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        questionNumber: 2,
        questionLatex: 'Хипотенузата на правоаголен триаголник е $c = 13\\text{ cm}$, а едната катета е $a = 5\\text{ cm}$. Одреди ја втората катета $b$.',
        solutionLatex: '$$b = \\sqrt{c^2 - a^2} = \\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12\\text{ cm}$$',
        correctAnswerText: 'b = 12 cm',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        questionNumber: 3,
        questionLatex: 'Пресметај ја плоштината на правоаголен триаголник со катети $a = 12\\text{ cm}$ и $b = 9\\text{ cm}$.',
        solutionLatex: '$$P = \\frac{a \\cdot b}{2} = \\frac{12 \\cdot 9}{2} = \\frac{108}{2} = 54\\text{ cm}^2$$',
        correctAnswerText: 'P = 54 cm²',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        questionNumber: 4,
        questionLatex: 'Дијагоналата на правоаголник е $d = 25\\text{ cm}$, а едната страна е $a = 24\\text{ cm}$. Пресметај го периметарот $L$.',
        solutionLatex: '$$b = \\sqrt{25^2 - 24^2} = \\sqrt{625 - 576} = \\sqrt{49} = 7\\text{ cm}$$\n$$L = 2(a + b) = 2(24 + 7) = 2(31) = 62\\text{ cm}$$',
        correctAnswerText: 'L = 62 cm (b = 7 cm)',
        points: 3,
        bloomLevel: 'analyze'
      },
      {
        questionNumber: 5,
        questionLatex: 'Рамнокрак триаголник има основа $a = 16\\text{ cm}$ и крак $b = 10\\text{ cm}$. Пресметај ја висината спуштена кон основата $h_a$.',
        solutionLatex: 'Висината ја дели основата на две еднакви половини: $\\frac{a}{2} = 8\\text{ cm}$.\n$$h_a = \\sqrt{b^2 - (a/2)^2} = \\sqrt{10^2 - 8^2} = \\sqrt{100 - 64} = \\sqrt{36} = 6\\text{ cm}$$',
        correctAnswerText: 'h_a = 6 cm',
        points: 3,
        bloomLevel: 'analyze'
      },
      {
        questionNumber: 6,
        questionLatex: 'Квадрат има плоштина $P = 50\\text{ cm}^2$. Пресметај ја должината на неговата дијагонала $d$.',
        solutionLatex: 'Формула за плоштина преку дијагонала: $$P = \\frac{d^2}{2} \\implies d^2 = 2P = 2 \\cdot 50 = 100 \\implies d = 10\\text{ cm}$$',
        correctAnswerText: 'd = 10 cm',
        points: 3,
        bloomLevel: 'analyze'
      }
    ];
  } else if (tLower.includes('квадрат') || tLower.includes('quadratic') || tLower.includes('дискриминант')) {
    title = isMk ? 'Математички квиз: Квадратни равенки и формули' : 'Math Quiz: Quadratic Equations';
    subject = isMk ? 'Алгебра' : 'Algebra';
    pool = [
      {
        questionNumber: 1,
        questionLatex: 'Реши ја квадратната равенка: $$x^2 - 7x + 12 = 0$$ преку разложување на множители или формула.',
        solutionLatex: '$$(x - 3)(x - 4) = 0 \\implies x_1 = 3, \\quad x_2 = 4$$',
        correctAnswerText: 'x₁ = 3, x₂ = 4',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        questionNumber: 2,
        questionLatex: 'Пресметај ја дискриминантата $D$ и одреди ги решенијата на: $$2x^2 - 5x - 3 = 0$$',
        solutionLatex: '$$D = (-5)^2 - 4(2)(-3) = 25 + 24 = 49$$\n$$x = \\frac{5 \\pm \\sqrt{49}}{2 \\cdot 2} = \\frac{5 \\pm 7}{4} \\implies x_1 = 3, \\quad x_2 = -\\frac{1}{2}$$',
        correctAnswerText: 'D = 49; x₁ = 3, x₂ = -0.5',
        points: 3,
        bloomLevel: 'analyze'
      },
      {
        questionNumber: 3,
        questionLatex: 'Реши ја нецелосната квадратна равенка: $$3x^2 - 27 = 0$$',
        solutionLatex: '$$3x^2 = 27 \\implies x^2 = 9 \\implies x = \\pm 3$$',
        correctAnswerText: 'x = ±3',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        questionNumber: 4,
        questionLatex: 'Реши ја равенката: $$x^2 - 6x + 9 = 0$$ и одреди ја природата на корените.',
        solutionLatex: '$$(x - 3)^2 = 0 \\implies D = 0 \\implies x_1 = x_2 = 3$$ (двократен реален корен)',
        correctAnswerText: 'x = 3 (двократен корен)',
        points: 2,
        bloomLevel: 'understand'
      },
      {
        questionNumber: 5,
        questionLatex: 'За кои вредности на $x$ изразот $2x^2 - 8x = 0$ е еднаков на нула?',
        solutionLatex: '$$2x(x - 4) = 0 \\implies x_1 = 0, \\quad x_2 = 4$$',
        correctAnswerText: 'x₁ = 0, x₂ = 4',
        points: 2,
        bloomLevel: 'apply'
      }
    ];
  } else if (tLower.includes('процент') || tLower.includes('дропк') || tLower.includes('percent') || tLower.includes('fraction')) {
    title = isMk ? 'Математички квиз: Дропки, проценти и сразмер' : 'Math Quiz: Fractions & Percentages';
    subject = isMk ? 'Аритметика' : 'Arithmetic';
    pool = [
      {
        questionNumber: 1,
        questionLatex: 'Пресметај ја вредноста на бројниот израз: $$\\frac{3}{5} + \\frac{1}{4} - \\frac{3}{10}$$',
        solutionLatex: 'НЗС за 5, 4 и 10 е 20:\n$$\\frac{12 + 5 - 6}{20} = \\frac{11}{20}$$',
        correctAnswerText: '11/20 = 0.55',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        questionNumber: 2,
        questionLatex: 'Пресметај го производот и скрати до нескратлива дропка: $$\\frac{7}{12} \\cdot \\frac{8}{21}$$',
        solutionLatex: 'По скратување на 7 со 21 (останува 3) и 8 со 12 (останува 2 и 3):\n$$\\frac{1 \\cdot 2}{3 \\cdot 3} = \\frac{2}{9}$$',
        correctAnswerText: '2/9',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        questionNumber: 3,
        questionLatex: 'Пресметај $15\\%$ од сумата од $2400\\text{ денари}$.',
        solutionLatex: '$$2400 \\cdot \\frac{15}{100} = 24 \\cdot 15 = 360\\text{ денари}$$',
        correctAnswerText: '360 денари',
        points: 2,
        bloomLevel: 'understand'
      },
      {
        questionNumber: 4,
        questionLatex: 'Еден артикал со првична цена од $1600\\text{ ден.}$ е намален за $20\\%$. Колку изнесува новата продажна цена?',
        solutionLatex: 'Попуст: $$1600 \\cdot 0.20 = 320\\text{ ден.}$$\nНова цена: $$1600 - 320 = 1280\\text{ денари}$$',
        correctAnswerText: '1280 денари',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        questionNumber: 5,
        questionLatex: 'Ако $\\frac{x}{12} = \\frac{5}{6}$, пресметај ја непознатата $x$.',
        solutionLatex: '$$6x = 12 \\cdot 5 = 60 \\implies x = 10$$',
        correctAnswerText: 'x = 10',
        points: 2,
        bloomLevel: 'apply'
      }
    ];
  } else {
    // Стандардно: Линеарни равенки
    pool = [
      {
        questionNumber: 1,
        questionLatex: 'Реши ја линеарната равенка: $$4x - 9 = 23$$',
        solutionLatex: '$$4x = 23 + 9$$\n$$4x = 32$$\n$$x = \\frac{32}{4} = 8$$',
        correctAnswerText: 'x = 8',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        questionNumber: 2,
        questionLatex: 'Определи ја вредноста на $x$: $$5(x - 3) = 2x + 6$$',
        solutionLatex: '$$5x - 15 = 2x + 6$$\n$$5x - 2x = 6 + 15$$\n$$3x = 21$$\n$$x = 7$$',
        correctAnswerText: 'x = 7',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        questionNumber: 3,
        questionLatex: 'Реши ја дробната равенка: $$\\frac{3x + 1}{4} = 4$$',
        solutionLatex: '$$3x + 1 = 4 \\cdot 4 = 16$$\n$$3x = 15$$\n$$x = 5$$',
        correctAnswerText: 'x = 5',
        points: 2,
        bloomLevel: 'apply'
      },
      {
        questionNumber: 4,
        questionLatex: 'Реши ја равенката со загради: $$7 - 2(3x - 1) = 21$$',
        solutionLatex: '$$7 - 6x + 2 = 21$$\n$$9 - 6x = 21$$\n$$-6x = 12$$\n$$x = -2$$',
        correctAnswerText: 'x = -2',
        points: 3,
        bloomLevel: 'analyze'
      },
      {
        questionNumber: 5,
        questionLatex: 'Збирот на три последователни цели броеви е $72$. Состави равенка и најди го најголемиот од нив.',
        solutionLatex: 'Нека броевите се $n, n+1, n+2$.\n$$n + (n+1) + (n+2) = 72 \\implies 3n + 3 = 72 \\implies 3n = 69 \\implies n = 23$$\nБроевите се 23, 24, 25. Најголемиот број е $25$.',
        correctAnswerText: '25 (броевите се 23, 24, 25)',
        points: 3,
        bloomLevel: 'analyze'
      },
      {
        questionNumber: 6,
        questionLatex: 'Реши ја равенката: $$\\frac{x - 1}{2} - \\frac{x + 1}{3} = 1$$',
        solutionLatex: 'Множиме со НЗС(2, 3) = 6:\n$$3(x - 1) - 2(x + 1) = 6$$\n$$3x - 3 - 2x - 2 = 6$$\n$$x - 5 = 6 \\implies x = 11$$',
        correctAnswerText: 'x = 11',
        points: 3,
        bloomLevel: 'analyze'
      }
    ];
  }

  // Ограничи на саканиот број на прашања
  const selected = pool.slice(0, Math.min(questionCount, pool.length)).map((q, idx) => ({
    ...q,
    questionNumber: idx + 1
  }));

  return {
    title,
    subject,
    grade,
    difficulty,
    instructions,
    questions: selected
  };
}

// API Endpoint for Math Quiz Generation
app.post('/api/ai/math-quiz', async (req, res) => {
  try {
    const {
      topic = 'linear_equations',
      grade = '8-мо одделение',
      questionCount = 5,
      difficulty = 'medium',
      language = 'mk'
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json(generateLocalMathQuizResponse(topic, grade, questionCount, difficulty, language));
    }

    const ai = new GoogleGenAI({});
    const prompt = `Generate a rigorous, curriculum-aligned mathematical quiz for grade "${grade}" on topic "${topic}".
Difficulty: "${difficulty}".
Number of questions: exactly ${questionCount}.
Language: ${language === 'mk' ? 'Macedonian' : language === 'sq' ? 'Albanian' : 'English'}.

Every question must include valid KaTeX LaTeX formulas ($...$ inline or $$...$$ display).
Provide a complete, step-by-step mathematical solution in LaTeX and an unambiguous concise correct answer.
Points per question: 2 to 4 points.

Output JSON only matching this schema:
{
  "title": "Clear educational quiz title in Macedonian/selected language",
  "subject": "e.g. Математика, Алгебра, Геометрија",
  "grade": "${grade}",
  "difficulty": "${difficulty}",
  "instructions": "Helpful instructions for students",
  "questions": [
    {
      "questionNumber": 1,
      "questionLatex": "Question statement with LaTeX",
      "solutionLatex": "Full step-by-step LaTeX derivation",
      "correctAnswerText": "Final exact answer (e.g. x = 7)",
      "points": 2,
      "bloomLevel": "apply"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '';
    try {
      const parsed = JSON.parse(text);
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return res.json(parsed);
      }
      return res.json(generateLocalMathQuizResponse(topic, grade, questionCount, difficulty, language));
    } catch {
      return res.json(generateLocalMathQuizResponse(topic, grade, questionCount, difficulty, language));
    }
  } catch (err: any) {
    console.error('Error in /api/ai/math-quiz:', err);
    return res.json(
      generateLocalMathQuizResponse(
        req.body?.topic,
        req.body?.grade,
        req.body?.questionCount,
        req.body?.difficulty,
        req.body?.language
      )
    );
  }
});

// API Endpoint for Voice Teaching Assistant
app.post('/api/ai/voice-assistant', async (req, res) => {
  try {
    const { prompt, language = 'mk' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json(generateLocalPedagogicalResponse(prompt, language));
    }

    const ai = new GoogleGenAI({});
    const systemInstruction = `You are an expert pedagogical assistant for Macedonian STEM educators in EduQR Studio.
The teacher spoke to you in ${language === 'mk' ? 'Macedonian' : language === 'sq' ? 'Albanian' : 'English'}.
Understand their voice prompt and respond with structured educational content.
You MUST output a strict JSON object with these exact keys:
{
  "spokenResponse": "Natural, spoken Macedonian (or selected language) message to be read aloud via Text-to-Speech to the teacher (1-3 friendly sentences).",
  "title": "Short pedagogical task title",
  "subject": "e.g. Математика, Алгебра, Геометрија, Физика",
  "targetGrade": "e.g. 8-мо одделение, I година гимназија",
  "latexContent": "The math equation or problem using valid KaTeX LaTeX ($...$ inline or $$...$$ block)",
  "solutionLatex": "Step-by-step LaTeX solution",
  "scaffoldingSteps": [
    { "stepNumber": 1, "title": "Hint title", "contentWithLatex": "Hint LaTeX text", "revealedByDefault": false }
  ],
  "bloomLevel": "one of: remember, understand, apply, analyze, evaluate, create",
  "tags": ["one or more of: in_class, homework, exam_prep, competition, group_work"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '';
    try {
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch {
      return res.json(generateLocalPedagogicalResponse(prompt, language));
    }
  } catch (error: any) {
    console.error('Error generating voice assistant response:', error);
    return res.json(generateLocalPedagogicalResponse(req.body.prompt, req.body.language));
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduQR Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
