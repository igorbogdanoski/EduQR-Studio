export type Language = 'mk' | 'sq' | 'en';

export type QRCodeType = 
  | 'math_latex'         // Математичка задача со LaTeX и формули
  | 'vygotsky_scaffold'  // Синџир на скалирање (Hint 1 -> Hint 2 -> Solution)
  | 'bloom_taxonomy'     // Задача по Блумова таксономија
  | 'gardner_multiple'   // Мултимедијална содржина по Гарднер
  | 'short_url'          // Скратен образовен линк
  | 'document_file'      // Наставен лист / документ (PDF, слика, GeoGebra)
  | 'quick_text'         // Брз текст / училишна порака
  | 'wifi_access'        // Училишна WiFi мрежа
  | 'math_quiz'          // Математички квиз со повеќе задачи
  | 'answer_key';        // Клуч со точни решенија за квиз / тест

export interface MathQuizQuestion {
  id: string;
  questionNumber: number;
  questionLatex: string;
  solutionLatex: string;
  correctAnswerText: string;
  points: number;
  bloomLevel?: BloomLevel;
}

export type BloomLevel = 
  | 'remember'    // Помнење (Remembering)
  | 'understand'  // Разбирање (Understanding)
  | 'apply'       // Примена (Applying)
  | 'analyze'     // Анализа (Analyzing)
  | 'evaluate'    // Евалуација (Evaluating)
  | 'create';     // Креирање (Creating)

export type GardnerIntelligence =
  | 'logical_mathematical' // Логичко-математичка
  | 'visual_spatial'       // Просторно-визуелна
  | 'verbal_linguistic'    // Вербално-јазична
  | 'bodily_kinesthetic'   // Телесно-кинестетичка
  | 'musical'              // Музичко-ритмичка
  | 'interpersonal'        // Интерперсонална (тимска работа)
  | 'intrapersonal'        // Интраперсонална (саморефлексија)
  | 'naturalistic';        // Природнонаучна

export interface ScaffoldingStep {
  id: string;
  stepNumber: number;
  title: string;
  contentWithLatex: string;
  revealedByDefault?: boolean;
}

export interface ScanDataPoint {
  date: string;
  count: number;
}

export type FolderCategoryType = 'subject' | 'class' | 'project';

export interface EducationalFolder {
  id: string;
  name: string;
  description?: string;
  categoryType: FolderCategoryType;
  color: string;
  icon?: string;
  createdAt: string;
}

export type QRThemePreset =
  | 'math_indigo'      // Математика & Алгебра
  | 'science_emerald'  // Природни науки & Биологија
  | 'physics_cyan'     // Физика & Астрономија
  | 'geometry_amber'   // Геометрија & Стереометрија
  | 'chemistry_rose'   // Хемија & Експерименти
  | 'literature_purple'// Литература & Општество
  | 'computer_slate'   // Информатика & Роботика
  | 'warm_papyrus'     // Топла хартија / Печатење
  | 'high_contrast'    // Класичен контраст (Црно/Бело)
  | 'custom';

export type QRPatternStyle =
  | 'standard'  // Класични остри квадрати
  | 'dots'      // Кружни точки (Dots / Circles)
  | 'rounded'   // Меки заоблени квадрати (Smooth rounded)
  | 'classy'    // Елегантен дијамант / ромб (Diamond)
  | 'mosaic';   // Модерен мозаик (Mosaic)

export interface QRCodeVersion {
  id: string;
  timestamp: string;
  label?: string;
  latexContent: string;
  solutionLatex?: string;
  scaffoldingSteps?: ScaffoldingStep[];
  title?: string;
  changeSummary?: string;
}

export type EducationalTagType =
  | 'exam_prep'      // Подготовка за тест / испит
  | 'homework'       // Домашна задача
  | 'in_class'       // Активност на часот
  | 'competition'    // Натпревар / Напредно
  | 'group_work';    // Групна / Тимска работа

export interface EducationalQRCode {
  id: string;
  shortCode: string;          // 6-8 знаци за краток URL (на пр. "geo302")
  title: string;
  description?: string;
  type: QRCodeType;
  createdAt: string;
  subject: string;            // На пр: Математика, Геометрија, Физика
  targetGrade: string;        // На пр: 6-то одделение, I година гимназија
  folderId?: string;          // Организација во папка / категорија
  
  // Математичка содржина со LaTeX
  latexContent: string;       // Формула или задача со LaTeX ознаки ($...$ или $$...$$)
  solutionLatex?: string;     // Чекор-по-чекор решение со LaTeX
  
  // Педагошка диференцијација по Виготски (Scaffolding)
  scaffoldingSteps?: ScaffoldingStep[];
  
  // Блумова таксономија
  bloomLevel?: BloomLevel;
  bloomObjectives?: string;
  
  // Теорија на мултипни интелигенции по Гарднер
  gardnerIntelligence?: GardnerIntelligence;
  gardnerActivityType?: string;
  
  // Документ или скратен линк
  targetUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  fileDataUrl?: string;       // Data URL за приказ и преземање
  
  // WiFi конфигурација
  wifiSsid?: string;
  wifiPassword?: string;
  wifiEncryption?: 'WPA' | 'WEP' | 'nopass';
  // QR дизајн и стилизирање
  style: {
    fgColor: string;
    bgColor: string;
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
    iconType?: 'math' | 'book' | 'atom' | 'lightbulb' | 'school' | 'none';
    margin: number;
    size: number;
    themePreset?: QRThemePreset;
    pattern?: QRPatternStyle;
  };
  // Аналитика за наставникот
  scanCount: number;
  lastScannedAt?: string;
  scanHistory?: ScanDataPoint[];
  requiresPin?: boolean;
  pinCode?: string;

  // Историја на верзии (Version History)
  versionHistory?: QRCodeVersion[];

  // Педагошки ознаки (Tags: Exam Prep, Homework, In-class Activity...)
  tags?: string[];

  // Математички квиз и клуч со решенија
  quizQuestions?: MathQuizQuestion[];
  isAnswerKey?: boolean;
  linkedQuizId?: string;
}

export interface QRFilterOptions {
  searchQuery: string;
  typeFilter: string;
  bloomFilter: string;
  subjectFilter: string;
  folderFilter?: string;
  tagFilter?: string;
}

export interface CustomTag {
  id: string;          // уникален slug на ознаката (на пр. "scavenger_hunt")
  label: string;       // читлив наслов (на пр. "QR Лов на информации")
  color: string;       // боја во hex формат (на пр. "#8b5cf6")
  createdAt?: string;
}
