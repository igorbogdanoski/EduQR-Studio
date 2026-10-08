import React, { useState } from 'react';
import { EducationalQRCode, EducationalFolder, Language, BloomLevel } from '../types';
import { translations } from '../i18n/translations';
import {
  Compass,
  X,
  Sparkles,
  CheckCircle2,
  Printer,
  FolderPlus,
  ArrowRight,
  Flame,
  Award,
  Layers,
  MapPin,
  Check,
  BookOpen
} from 'lucide-react';

interface ScavengerPreset {
  id: string;
  emoji: string;
  title: string;
  subject: string;
  grade: string;
  description: string;
  folderColor: string;
  stationColors: string[];
  stations: Array<{
    stationNumber: number;
    title: string;
    bloomLevel: BloomLevel;
    latexContent: string;
    solutionLatex: string;
    clueForNext: string;
    hints: string[];
  }>;
}

const SCAVENGER_PRESETS: ScavengerPreset[] = [
  {
    id: 'pythagoras_detective',
    emoji: '🔍',
    title: 'Математички Детектив: Мистеријата на изгубениот агол',
    subject: 'Математика (Геометрија)',
    grade: '7-мо / 8-мо одделение',
    description: 'Серија од 5 станици каде тимовите преку Питагорова теорема, плоштини и агли откриваат скриена шифра низ училницата.',
    folderColor: '#4f46e5',
    stationColors: ['#1e3a8a', '#0d9488', '#b45309', '#7c3aed', '#059669'],
    stations: [
      {
        stationNumber: 1,
        title: 'Станица 1: Прва аголна загатка',
        bloomLevel: 'understand',
        latexContent: 'Правоаголен триаголник има катети $a = 6\\text{ cm}$ и $b = 8\\text{ cm}$. Пресметајте ја хипотенузата $c = \\sqrt{a^2 + b^2}$. Бројот на хипотенузата е вашиот прв клуч!',
        solutionLatex: '$$c = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10\\text{ cm}$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 2: Вредноста е 10! Побарајте го следниот QR код поставен кај левиот прозорец во училницата.',
        hints: [
          'Потсетете се на формулата: $c^2 = a^2 + b^2$.',
          'Пресметајте $6^2 = 36$ и $8^2 = 64$. Нивниот збир е 100.'
        ]
      },
      {
        stationNumber: 2,
        title: 'Станица 2: Периметар & Скриена шифра',
        bloomLevel: 'apply',
        latexContent: 'Искористете ја хипотенузата $c = 10\\text{ cm}$ од Станица 1. Пресметајте го периметарот $L = a + b + c$. Вредноста на периметарот е шифрата за следната станица!',
        solutionLatex: '$$L = a + b + c = 6 + 8 + 10 = 24\\text{ cm}$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 3: Периметарот е 24! Следната станица ве чека на полицата со географски карти и учебници.',
        hints: [
          'Периметар е збир од сите три страни: $a + b + c$.',
          'Собирете $6 + 8 + 10 = 24$.'
        ]
      },
      {
        stationNumber: 3,
        title: 'Станица 3: Плоштина на триаголникот',
        bloomLevel: 'apply',
        latexContent: 'Пресметајте ја плоштината на истиот триаголник: $$P = \\frac{a \\cdot b}{2}$$ Колку изнесува плоштината во $\\text{cm}^2$?',
        solutionLatex: '$$P = \\frac{6 \\cdot 8}{2} = \\frac{48}{2} = 24\\text{ cm}^2$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 4: Плоштината е исто така 24! Следната загатка е скриена во близина на главната школска табла.',
        hints: [
          'За правоаголен триаголник, плоштината е половина од производот на катетите.',
          'Пресметајте: $6 \\cdot 8 = 48$, па поделете со 2.'
        ]
      },
      {
        stationNumber: 4,
        title: 'Станица 4: Висина кон хипотенузата',
        bloomLevel: 'analyze',
        latexContent: 'Бидејќи $P = \\frac{c \\cdot h_c}{2} = 24\\text{ cm}^2$ и $c = 10\\text{ cm}$, одредете ја висината спуштена кон хипотенузата: $$h_c = \\frac{2P}{c}$$',
        solutionLatex: '$$h_c = \\frac{2 \\cdot 24}{10} = \\frac{48}{10} = 4.8\\text{ cm}$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 5: Висината изнесува 4.8 cm! Финалната победничка станица ве чека на наставничкото биро!',
        hints: [
          'Искористете ја плоштината: $2P = c \\cdot h_c$.',
          'Помножете $2 \\cdot 24 = 48$, па поделете со 10.'
        ]
      },
      {
        stationNumber: 5,
        title: 'Станица 5: Победнички триумф & Завршен печат',
        bloomLevel: 'create',
        latexContent: 'Финален предизвик: Составете формулен идентитет со вашите клучеви: $$(a+b)^2 = a^2 + 2ab + b^2 = 36 + 2(48) + 64 = 196$$ и $\\sqrt{196} = 14 = a+b$. Честитки за целиот тим!',
        solutionLatex: '$$a + b = 6 + 8 = 14\\text{ cm}, \\quad (14)^2 = 196$$\nТимот успешно го заврши QR Ловот на информации!',
        clueForNext: '🏆 ПОБЕДА: Пријавете се кај наставникот со финалниот код 196 за да добиете победнички поен за тимот!',
        hints: [
          'Поврзете ги сите добиени броеви во заеднички тимски заклучок.',
          'Честитки за соработката!'
        ]
      }
    ]
  },
  {
    id: 'stem_forces_expedition',
    emoji: '🧪',
    title: 'STEM Експедиција: Тајните на природните сили и енергија',
    subject: 'Физика & STEM',
    grade: '8-мо / 9-то одделение',
    description: 'Интерактивен лов со формули за сила, брзина, кинетичка енергија и закони за движење низ лабараторијата.',
    folderColor: '#059669',
    stationColors: ['#047857', '#0284c7', '#d97706', '#7c3aed', '#e11d48'],
    stations: [
      {
        stationNumber: 1,
        title: 'Станица 1: Втор Њутнов закон (Сила и забрзување)',
        bloomLevel: 'understand',
        latexContent: 'Тело со маса $m = 4\\text{ kg}$ се движи со забрзување $a = 2.5\\text{ m/s}^2$. Пресметајте ја силата $F = m \\cdot a$.',
        solutionLatex: '$$F = 4 \\cdot 2.5 = 10\\text{ N}$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 2: Силата е 10 Њутни! Следната станица е поставена кај лабараториските ваги.',
        hints: ['Помножете ја масата $m$ со забрзувањето $a$.']
      },
      {
        stationNumber: 2,
        title: 'Станица 2: Брзина и рамномерно движење',
        bloomLevel: 'apply',
        latexContent: 'Телото поминува пат $s = 100\\text{ m}$ за време $t = 5\\text{ s}$. Колкава е средната брзина $v = \\frac{s}{t}$?',
        solutionLatex: '$$v = \\frac{100}{5} = 20\\text{ m/s}$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 3: Брзината е 20 m/s! Следната станица ве чека кај полицата со модели на движење.',
        hints: ['Поделете го изминатиот пат со потрошеното време.']
      },
      {
        stationNumber: 3,
        title: 'Станица 3: Кинетичка енергија на движење',
        bloomLevel: 'apply',
        latexContent: 'Со брзина $v = 20\\text{ m/s}$ и маса $m = 4\\text{ kg}$, пресметајте ја кинетичката енергија: $$E_k = \\frac{m \\cdot v^2}{2}$$',
        solutionLatex: '$$E_k = \\frac{4 \\cdot 20^2}{2} = \\frac{4 \\cdot 400}{2} = 800\\text{ J}$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 4: Енергијата е 800 Џули! Следната станица е поставена кај ормарот за физика.',
        hints: ['Прво квадрирајте ја брзината: $20^2 = 400$.']
      },
      {
        stationNumber: 4,
        title: 'Станица 4: Потенцијална гравитациона енергија',
        bloomLevel: 'analyze',
        latexContent: 'Ако истата енергија од $E_p = 800\\text{ J}$ се претвори во висина ($g \\approx 10\\text{ m/s}^2, m=4\\text{ kg}$): $$h = \\frac{E_p}{m \\cdot g}$$ Колку метри изнесува висината $h$?',
        solutionLatex: '$$h = \\frac{800}{4 \\cdot 10} = \\frac{800}{40} = 20\\text{ m}$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 5: Висината е 20 метри! Финалната станица е на главната маса во училницата!',
        hints: ['Помножете ја масата со гравитацијата: $4 \\cdot 10 = 40$.']
      },
      {
        stationNumber: 5,
        title: 'Станица 5: Закон за зачувување & Финален победнички код',
        bloomLevel: 'create',
        latexContent: 'Вкупна механичка енергија: $$E = E_k + E_p = 800\\text{ J}$$ Честитки за STEM тимот за успешното решавање на сите енергетски трансформации!',
        solutionLatex: '$$E = 800\\text{ J}$$\nSTEM експедицијата е успешно завршена!',
        clueForNext: '🏆 ПОБЕДА: Пријавете ја шифрата 800 кај наставникот!',
        hints: ['Енергијата не се губи, туку само се трансформира.']
      }
    ]
  },
  {
    id: 'euclid_labyrinth',
    emoji: '🏛️',
    title: 'Античка Геометрија: Лавиринтот на Евклид и Архимед',
    subject: 'Геометрија & Стереометрија',
    grade: '8-мо / 9-то одделение / I средно',
    description: 'Патување низ тајните на кружницата, плоштините на кругот, Архимедовите формули и волуменот.',
    folderColor: '#b45309',
    stationColors: ['#78350f', '#0f766e', '#1d4ed8', '#9333ea', '#15803d'],
    stations: [
      {
        stationNumber: 1,
        title: 'Станица 1: Радиус и периметар на кружница',
        bloomLevel: 'understand',
        latexContent: 'Кружница има радиус $r = 7\\text{ cm}$. Пресметајте ја должината на кружницата земајќи $\\pi \\approx \\frac{22}{7}$: $$L = 2\\pi r$$',
        solutionLatex: '$$L = 2 \\cdot \\frac{22}{7} \\cdot 7 = 44\\text{ cm}$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 2: Должината е 44 cm! Следната станица се наоѓа кај шестарот на таблата.',
        hints: ['Скратете го 7 со 7 во именителот: $2 \\cdot 22 = 44$.']
      },
      {
        stationNumber: 2,
        title: 'Станица 2: Плоштина на кружен диск',
        bloomLevel: 'apply',
        latexContent: 'За истиот радиус $r = 7\\text{ cm}$, пресметајте ја плоштината на кругот: $$P = \\pi r^2$$ со $\\pi \\approx \\frac{22}{7}$.',
        solutionLatex: '$$P = \\frac{22}{7} \\cdot 49 = 22 \\cdot 7 = 154\\text{ cm}^2$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 3: Плоштината е 154 cm²! Следната станица ве чека кај полицата со геометриски тела.',
        hints: ['Квадрирајте го радиусот: $7^2 = 49$, па $49 / 7 = 7$, и $22 \\cdot 7 = 154$.']
      },
      {
        stationNumber: 3,
        title: 'Станица 3: Волумен на кружен цилиндар',
        bloomLevel: 'apply',
        latexContent: 'Цилиндар има основа со плоштина $B = 154\\text{ cm}^2$ и висина $H = 10\\text{ cm}$. Пресметајте го волуменот: $$V = B \\cdot H$$',
        solutionLatex: '$$V = 154 \\cdot 10 = 1540\\text{ cm}^3$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 4: Волуменот е 1540 cm³! Следната станица ве чека кај прозорецот.',
        hints: ['Помножете ја плоштината на основата со висината: $154 \\cdot 10$.']
      },
      {
        stationNumber: 4,
        title: 'Станица 4: Архимедов закон за конус',
        bloomLevel: 'analyze',
        latexContent: 'Конус има иста основа $B = 154\\text{ cm}^2$ и висина $H = 10\\text{ cm}$. Пресметајте го неговиот волумен: $$V_k = \\frac{V_{\\text{цилиндар}}}{3}$$',
        solutionLatex: '$$V_k = \\frac{1540}{3} \\approx 513.33\\text{ cm}^3$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 5: Односот е точно 1/3! Финалната станица ве чека кај катедрата.',
        hints: ['Волуменот на конус е третина од волуменот на цилиндар со иста основа и висина.']
      },
      {
        stationNumber: 5,
        title: 'Станица 5: Златен пресек & Победнички печат',
        bloomLevel: 'create',
        latexContent: 'Златен пресек: $$\\phi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.618$$ Честитки! Вашиот тим го реши лавиринтот на античката геометрија!',
        solutionLatex: '$$\\phi \\approx 1.618$$\nАнтичкиот лавиринт е успешно совладан!',
        clueForNext: '🏆 ПОБЕДА: Пријавете ја шифрата 1618 кај наставникот!',
        hints: ['Златниот пресек е симбол на хармонијата во геометријата.']
      }
    ]
  },
  {
    id: 'chemistry_elements_quest',
    emoji: '🧪',
    title: 'Хемиска Лабораторија: Мистеријата на молекулите & моларна маса',
    subject: 'Хемија',
    grade: '8-мо / 9-то одделение / I средно',
    description: 'Интерактивен лов на станици за хемиски симболи, периодни групи, моларна маса и изедначување на реакции.',
    folderColor: '#0d9488',
    stationColors: ['#0f766e', '#0369a1', '#b45309', '#6d28d9', '#be123c'],
    stations: [
      {
        stationNumber: 1,
        title: 'Станица 1: Моларна маса на вода ($H_2O$)',
        bloomLevel: 'understand',
        latexContent: 'Релативни атомски маси: $A_r(H) = 1$, $A_r(O) = 16$. Пресметајте ја моларната маса на вода: $$M(H_2O) = 2 \\cdot A_r(H) + A_r(O)$$ Вредноста е вашата прва шифра!',
        solutionLatex: '$$M(H_2O) = 2(1) + 16 = 18\\text{ g/mol}$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 2: Моларната маса е 18! Побарајте го следниот QR код кај хемиските епрувети и мензури.',
        hints: ['Помножете ја масата на водородот со 2 и додадете ја масата на кислородот.']
      },
      {
        stationNumber: 2,
        title: 'Станица 2: Број на молови во примерок',
        bloomLevel: 'apply',
        latexContent: 'Имате примерок од вода со маса $m = 54\\text{ g}$. Пресметајте го количеството супстанца во молови: $$n = \\frac{m}{M}$$ користејќи $M = 18\\text{ g/mol}$ од Станица 1.',
        solutionLatex: '$$n = \\frac{54\\text{ g}}{18\\text{ g/mol}} = 3\\text{ mol}$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 3: Бројот на молови е 3! Следната станица се наоѓа на Периодниот систем на ѕидот.',
        hints: ['Поделете 54 со 18: $54 / 18 = 3$.']
      },
      {
        stationNumber: 3,
        title: 'Станица 3: Авогадров број на честички',
        bloomLevel: 'apply',
        latexContent: 'Користете го $n = 3\\text{ mol}$. Ако во 1 мол има приближно $N_A \\approx 6 \\times 10^{23}$ молекули, колку вкупно молекули има во примерокот: $$N = n \\cdot N_A$$',
        solutionLatex: '$$N = 3 \\cdot (6 \\times 10^{23}) = 18 \\times 10^{23} = 1.8 \\times 10^{24}\\text{ молекули}$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 4: Експонентот е 24! Следната загатка е поставена кај шкафот со реагенси.',
        hints: ['Помножете го бројот 3 со 6: добивате 18.']
      },
      {
        stationNumber: 4,
        title: 'Станица 4: Изедначување на синтеза на вода',
        bloomLevel: 'analyze',
        latexContent: 'Изедначете ја хемиската равенка: $$x\\text{H}_2 + y\\text{O}_2 \\to z\\text{H}_2O$$ Кој е збирот на стехиометриските коефициенти: $x + y + z$?',
        solutionLatex: 'Изедначена реакција: $$2\\text{H}_2 + 1\\text{O}_2 \\to 2\\text{H}_2O$$\nЗбир на коефициенти: $2 + 1 + 2 = 5$.',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 5: Збирот на коефициентите е 5! Финалната станица ве чека кај наставничката катедра.',
        hints: ['Потребни се 2 молекули водород и 1 кислород за 2 молекули вода: $2+1+2=5$.']
      },
      {
        stationNumber: 5,
        title: 'Станица 5: pH скала & Победнички раствор',
        bloomLevel: 'create',
        latexContent: 'Неутрална чиста вода на $25^\\circ\\text{C}$ има $\\text{pH} = 7$. Честитки! Вашиот тим успешно ги поврза сите хемиски законитости!',
        solutionLatex: '$$\\text{pH} = 7$$\nТимот успешно го заврши хемискиот лов на информации!',
        clueForNext: '🏆 ПОБЕДА: Пријавете ја шифрата 7 кај наставникот!',
        hints: ['Неутралната вода има pH точно 7.']
      }
    ]
  },
  {
    id: 'informatics_binary_quest',
    emoji: '💻',
    title: 'Информатички Escape Room: Бинарни шифри & Алгоритми',
    subject: 'Информатика & Програмирање',
    grade: '6-то - 9-то одд. / I-II средно',
    description: 'Интерактивна низа од станици за конверзија на бинарни броеви, ASCII дешифрирање, логички порти и алгоритамски чекори.',
    folderColor: '#6366f1',
    stationColors: ['#4338ca', '#0891b2', '#7c3aed', '#b45309', '#059669'],
    stations: [
      {
        stationNumber: 1,
        title: 'Станица 1: Бинарно броење во декаден систем',
        bloomLevel: 'understand',
        latexContent: 'Претворете го бинарниот број $(1010)_2$ во декаден број: $$N_{(10)} = 1 \\cdot 2^3 + 0 \\cdot 2^2 + 1 \\cdot 2^1 + 0 \\cdot 2^0$$',
        solutionLatex: '$$1 \\cdot 8 + 0 \\cdot 4 + 1 \\cdot 2 + 0 \\cdot 1 = 8 + 2 = 10_{(10)}$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 2: Вредноста е 10! Следната станица е поставена кај компјутерот со тастатура.',
        hints: ['Пресметајте: $2^3 = 8$ и $2^1 = 2$. Нивниот збир е 10.']
      },
      {
        stationNumber: 2,
        title: 'Станица 2: Додавање бинарни бајти',
        bloomLevel: 'apply',
        latexContent: 'Користете го резултатот 10. Претворете го бројот $(1100)_2$ во декаден: $$1 \\cdot 8 + 1 \\cdot 4 + 0 \\cdot 2 + 0 \\cdot 1 = 12$$ Пресметајте го нивниот збир: $10 + 12$.',
        solutionLatex: '$$10 + 12 = 22_{(10)} = (10110)_2$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 3: Збирот е 22! Следната станица е кај мрежниот рутер во кабинетот.',
        hints: ['Собирете ги двата броја: 10 + 12 = 22.']
      },
      {
        stationNumber: 3,
        title: 'Станица 3: Логичка И (AND) операција',
        bloomLevel: 'analyze',
        latexContent: 'Пресметајте битско И (AND) помеѓу $(1010)_2$ и $(1100)_2$: $$\\begin{matrix} 1 & 0 & 1 & 0 \\\\ \\text{AND} \\quad 1 & 1 & 0 & 0 \\\\ \\hline 1 & 0 & 0 & 0 \\end{matrix}$$ Колку изнесува $(1000)_2$ во декаден систем?',
        solutionLatex: '$$(1000)_2 = 1 \\cdot 2^3 = 8_{(10)}$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 4: Вредноста е 8! Следната станица е на полицата со роботски комплети.',
        hints: ['Битот на позиција 3 е 1, па вредноста е 2³ = 8.']
      },
      {
        stationNumber: 4,
        title: 'Станица 4: Број на чекори во бинарно пребарување',
        bloomLevel: 'analyze',
        latexContent: 'Во сортирана листа од $N = 64$ елементи, колку максимално споредби се потребни со бинарно пребарување: $$\\log_2(64) = ?$$',
        solutionLatex: 'Бидејќи $2^6 = 64$, потребни се најмногу 6 споредби: $$\\log_2(64) = 6$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 5: Бројот на чекори е 6! Финалната победничка станица ве чека кај наставникот!',
        hints: ['Кој степен на 2 дава 64? Тоа е 6, бидејќи 2⁶ = 64.']
      },
      {
        stationNumber: 5,
        title: 'Станица 5: Победнички ASCII збор',
        bloomLevel: 'create',
        latexContent: 'Секоја чест за тимот на идни инженери! Честитки за успешно дешифрираниот алгоритамски Escape Room!',
        solutionLatex: 'Шифрата е успешно пробиена!\nИнформатичкиот Escape Room е победен!',
        clueForNext: '🏆 ПОБЕДА: Пријавете ја лозинката ALGO кај наставникот!',
        hints: ['Честитки за тимскиот дух!']
      }
    ]
  },
  {
    id: 'geography_world_quest',
    emoji: '🌍',
    title: 'Географска Експедиција: Картографски координати & Патување',
    subject: 'Географија',
    grade: '7-мо / 8-мо одделение / I средно',
    description: 'Тимски лов на станици за размер на карти, пресметка на растојанија, временски зони и координати.',
    folderColor: '#b45309',
    stationColors: ['#92400e', '#0f766e', '#1d4ed8', '#7c3aed', '#15803d'],
    stations: [
      {
        stationNumber: 1,
        title: 'Станица 1: Размер на географска карта',
        bloomLevel: 'understand',
        latexContent: 'Карта има размер $1 : 100\\,000$. Растојанието на карта меѓу два града е $d = 5\\text{ cm}$. Колку километри изнесува вистинското растојание: $$D = \\frac{d \\cdot 100\\,000}{100\\,000\\text{ cm/km}}$$?',
        solutionLatex: '$$5\\text{ cm} \\cdot 100\\,000 = 500\\,000\\text{ cm} = 5\\text{ km}$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 2: Растојанието е 5 km! Следната станица се наоѓа кај географскиот глобус.',
        hints: ['1 километар има 100,000 сантиметри. Затоа 500,000 cm = 5 km.']
      },
      {
        stationNumber: 2,
        title: 'Станица 2: Пресметка на временска зона',
        bloomLevel: 'apply',
        latexContent: 'Земјата се ротира за $360^\\circ$ за 24 часа ($15^\\circ$ на 1 час). Ако помеѓу два града има разлика од $45^\\circ$ географска должина, колку часа е временската разлика: $$\\Delta t = \\frac{45^\\circ}{15^\\circ}$$?',
        solutionLatex: '$$\\Delta t = \\frac{45}{15} = 3\\text{ часа}$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 3: Временската разлика е 3 часа! Побарајте ја следната загатка кај ѕидната карта на Европа.',
        hints: ['Поделете 45 со 15: резултатот е 3.']
      },
      {
        stationNumber: 3,
        title: 'Станица 3: Густина на населеност',
        bloomLevel: 'apply',
        latexContent: 'Регион има површина $P = 2\\,000\\text{ km}^2$ и население од $N = 160\\,000$ жители. Пресметајте ја просечната густина на населеност: $$Г = \\frac{N}{P}$$',
        solutionLatex: '$$Г = \\frac{160\\,000}{2\\,000} = 80\\text{ жители/km}^2$$',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 4: Густината е 80 жители/km²! Следната станица ве чека кај атласите.',
        hints: ['Поделете 160,000 со 2,000: кратат се три нули, па 160 / 2 = 80.']
      },
      {
        stationNumber: 4,
        title: 'Станица 4: Координати и Екватор',
        bloomLevel: 'analyze',
        latexContent: 'Екваторот е нулта паралела ($0^\\circ$). Ако се движите на север до $42^\\circ\\text{N}$ (географска ширина на Скопје), колку степени изнесува лачната оддалеченост од екваторот?',
        solutionLatex: '$$42^\\circ - 0^\\circ = 42^\\circ$$\nСкопје се наоѓа приближно на $42^\\circ\\text{N}$.',
        clueForNext: '📍 ТРАГА ЗА СТАНИЦА 5: Вредноста е 42! Финалната станица ве чека кај наставничката маса!',
        hints: ['Лачната оддалеченост е еднаква на самата географска ширина: 42°.']
      },
      {
        stationNumber: 5,
        title: 'Станица 5: Победнички печат на експедицијата',
        bloomLevel: 'create',
        latexContent: 'Честитки за целиот тим географи и картографи! Успешно го совладавте ориентациониот лов низ географските простори!',
        solutionLatex: 'Географската експедиција е успешно завршена!',
        clueForNext: '🏆 ПОБЕДА: Пријавете ја шифрата GLOBUS кај наставникот!',
        hints: ['Честитки за картографските вештини!']
      }
    ]
  }
];


interface ScavengerHuntModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onGenerate: (stations: EducationalQRCode[], folder: EducationalFolder) => void;
  onPrintStationsDirectly: (stations: EducationalQRCode[]) => void;
}

export const ScavengerHuntModal: React.FC<ScavengerHuntModalProps> = ({
  isOpen,
  language,
  onClose,
  onGenerate,
  onPrintStationsDirectly
}) => {
  const t = translations[language];

  const [selectedPresetId, setSelectedPresetId] = useState<string>(SCAVENGER_PRESETS[0].id);
  const [stationCount, setStationCount] = useState<number>(5);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [generatedCodes, setGeneratedCodes] = useState<EducationalQRCode[]>([]);
  const [generatedFolder, setGeneratedFolder] = useState<EducationalFolder | null>(null);

  if (!isOpen) return null;

  const currentPreset = SCAVENGER_PRESETS.find(p => p.id === selectedPresetId) || SCAVENGER_PRESETS[0];

  const handleGenerateClick = () => {
    const timestamp = Date.now();
    const folderId = `folder-hunt-${timestamp}`;

    // Создавање на посветена папка
    const newFolder: EducationalFolder = {
      id: folderId,
      name: `QR Лов: ${currentPreset.title.split(':')[0]}`,
      description: `${currentPreset.description} (Серија од ${stationCount} станици за училницата)`,
      categoryType: 'project',
      color: currentPreset.folderColor,
      icon: currentPreset.emoji,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Создавање на 4 или 5 последователни QR кодови
    const slicedStations = currentPreset.stations.slice(0, stationCount);
    const newCodes: EducationalQRCode[] = slicedStations.map((st, idx) => {
      const codeId = `hunt-${timestamp}-${idx + 1}`;
      const shortCode = `hunt${Math.floor(100 + Math.random() * 900)}`;
      const color = currentPreset.stationColors[idx % currentPreset.stationColors.length];

      return {
        id: codeId,
        shortCode,
        title: st.title,
        description: `Станица ${idx + 1} од ${stationCount} во образовниот QR Лов: ${currentPreset.title}. ${st.clueForNext}`,
        type: 'vygotsky_scaffold',
        createdAt: new Date().toISOString().split('T')[0],
        subject: currentPreset.subject,
        targetGrade: currentPreset.grade,
        folderId: folderId,
        latexContent: `${st.latexContent}\n\n**${st.clueForNext}**`,
        solutionLatex: st.solutionLatex,
        bloomLevel: st.bloomLevel,
        bloomObjectives: `Тимско решавање на Станица ${idx + 1} со ZPD насоки и упатство за следната станица.`,
        scaffoldingSteps: st.hints.map((hint, hIdx) => ({
          id: `step-${codeId}-${hIdx + 1}`,
          stepNumber: hIdx + 1,
          title: `Насока ${hIdx + 1} за тимот`,
          contentWithLatex: hint,
          revealedByDefault: false
        })),
        tags: ['scavenger_hunt', 'group_work', 'in_class'],
        scanCount: 0,
        style: {
          fgColor: color,
          bgColor: '#ffffff',
          errorCorrectionLevel: 'Q',
          iconType: idx === stationCount - 1 ? 'school' : 'math',
          margin: 2,
          size: 260
        }
      };
    });

    setGeneratedCodes(newCodes);
    setGeneratedFolder(newFolder);
    setIsGenerated(true);

    // Извести го главниот App state
    onGenerate(newCodes, newFolder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-scale-up">
        
        {/* Заглавие */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-200">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {t.scavengerHuntTitle || 'QR Лов на информации (Тематски станици)'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {t.scavengerHuntSubtitle || 'Генерирајте комплетна серија од 4-5 последователни станици низ училницата со еден клик'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isGenerated ? (
          <div className="space-y-6">
            {/* Чекор 1: Избор на тема */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>{t.scavengerThemeSelect || 'Изберете тема на потрагата'}</span>
                <span className="text-indigo-600 font-semibold normal-case text-xs">
                  {SCAVENGER_PRESETS.length} готови наставни теми
                </span>
              </label>

              <div className="space-y-2.5">
                {SCAVENGER_PRESETS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedPresetId(preset.id)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-400/80 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                      }`}
                    >
                      <span className="text-2xl shrink-0 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        {preset.emoji}
                      </span>
                      <div className="space-y-1 grow min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {preset.title}
                          </h4>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                          )}
                        </div>
                        <div className="text-xs text-indigo-700 font-semibold">
                          {preset.subject} • {preset.grade}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {preset.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Чекор 2: Број на станици (4 или 5) */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  {t.scavengerStationsCount || 'Број на станици во училницата'}
                </span>
                <span className="text-xs text-slate-500">
                  {language === 'mk' ? 'Секоја станица содржи трага што води до локацијата на следната станица' : 'Each station contains a clue leading to the next'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setStationCount(4)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    stationCount === 4
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  4 Станици
                </button>
                <button
                  type="button"
                  onClick={() => setStationCount(5)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    stationCount === 5
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  5 Станици (Препорачано)
                </button>
              </div>
            </div>

            {/* Копче за генерирање со 1-клик */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerateClick}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white rounded-2xl text-sm font-extrabold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
                <span>
                  {t.scavengerGenerateBtn || `Генерирај ја серијата од ${stationCount} станици (1-Клик)`}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ) : (
          /* Екран на успех по генерирање */
          <div className="space-y-6 animate-fade-in">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-emerald-950 text-base">
                {t.scavengerSuccessTitle || 'Успешно генерирана серија од станици!'}
              </h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                {language === 'mk'
                  ? `Креирани се ${generatedCodes.length} последователни QR станици и нова папка "${generatedFolder?.name}". Сите се подготвени за печатење и поставување низ училницата!`
                  : `Created ${generatedCodes.length} sequential QR stations in folder "${generatedFolder?.name}". Ready for classroom printing!`}
              </p>
            </div>

            {/* Преглед на генерираните станици */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {generatedCodes.map((st, i) => (
                <div
                  key={st.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: st.style.fgColor }}
                    >
                      {i + 1}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-800 truncate">{st.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{st.latexContent.split('\n')[0]}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                    {st.bloomLevel?.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>

            {/* Акциски копчиња за наставникот */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                {t.scavengerViewStations || 'Прегледај во материјали'}
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPrintStationsDirectly(generatedCodes);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{t.scavengerPrintStations || 'Испечати ги сите станици за училницата (А4)'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
