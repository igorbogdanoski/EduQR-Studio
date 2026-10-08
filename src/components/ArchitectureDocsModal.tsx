import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { X, Database, Server, Cpu, ShieldCheck, Layers, BookOpen, Code2 } from 'lucide-react';

interface ArchitectureDocsModalProps {
  language: Language;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({
  language,
  onClose
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'architecture' | 'database' | 'pedagogy' | 'guide'>('architecture');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Хедер */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {language === 'mk' ? 'Системска Архитектура & База на Податоци' : language === 'sq' ? 'Arkitektura e Sistemit & Baza e të Dhënave' : 'System Architecture & Database Schema'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'mk' ? 'Техничка и педагошка спецификација за ЕдуQR Студио' : 'Technical & pedagogical engineering blueprint'}
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

        {/* Табови */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 gap-1 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>{language === 'mk' ? '1. Системска Архитектура' : '1. High-Level Architecture'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'database'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{language === 'mk' ? '2. Шема на База (Schema)' : '2. Database Schema'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pedagogy')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'pedagogy'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{language === 'mk' ? '3. Педагошки Модели' : '3. Pedagogical Frameworks'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{language === 'mk' ? '4. Водич за Имплементација' : '4. Implementation Guide'}</span>
          </button>
        </div>

        {/* Содржина на табовите */}
        <div className="p-6 overflow-y-auto text-xs sm:text-sm text-slate-700 space-y-6 leading-relaxed">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <span>Високонивовска Системска Архитектура (High-Level Architecture)</span>
              </h3>
              <p>
                Архитектурата е дизајнирана според моделот на <strong>EdTech Micro-Services & Modular Web Architecture</strong>, со фокус на брзина, нула зависност од надворешни тешки сервери за приказ на математика и поддршка за училишни мрежи со слаб интернет.
              </p>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto space-y-1">
                <div className="text-indigo-400 font-bold mb-2">┌── [ FRONTEND LAYER (React 19 + TypeScript + KaTeX + Tailwind) ] ──┐</div>
                <div>│  ├─ LaTeX Parser Engine (Клиентско инстантно рендерирање без лаг)      │</div>
                <div>│  ├─ QR Generation Canvas (QR Matrix со ECC L/M/Q/H & прилагодени икони)  │</div>
                <div>│  ├─ Trilingual i18n Store (Македонски, Албански, Англиски)               │</div>
                <div>│  ├─ Scaffolding State Machine (Отклучување чекори на ZPD)               │</div>
                <div>│  └─ Print Engine (А4 Работни листови за училница со станици)            │</div>
                <div className="text-indigo-400 font-bold my-2">├── [ API & BACKEND ROUTING LAYER (Express / Node.js Router) ] ──────────┤</div>
                <div>│  ├─ GET /s/:slug → Скратувач на линкови со аналитика и редирекција      │</div>
                <div>│  ├─ POST /api/qrcodes → Зачувување на метаподатоци и задачи             │</div>
                <div>│  ├─ POST /api/upload → Безбеден пренос на образовни материјали (PDF)     │</div>
                <div>│  └─ GET /api/analytics/:id → Бројач на скенирања и време                │</div>
                <div className="text-indigo-400 font-bold my-2">└── [ PERSISTENCE & STORAGE LAYER (Cloud SQL / PostgreSQL / Cloud Storage) ┘</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <h4 className="font-bold text-indigo-900 text-xs mb-1">1. LaTeX Рендерирање</h4>
                  <p className="text-[11px] text-slate-600">
                    Интегриран KaTeX 0.16 кој ги парсира сите комплексни формули, дропки, корени и матрици на самиот уред на ученикот, трошејќи 0 MB дополнителен мобилен интернет.
                  </p>
                </div>
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <h4 className="font-bold text-emerald-900 text-xs mb-1">2. Скратувач на Линкови</h4>
                  <p className="text-[11px] text-slate-600">
                    Автоматско генерирање на лесни 6-значни кодови (Base62) кои овозможуваат помала густина на QR кодот за брзо скенирање дури и од најобични телефони на учениците.
                  </p>
                </div>
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <h4 className="font-bold text-amber-900 text-xs mb-1">3. Безбедност со PIN</h4>
                  <p className="text-[11px] text-slate-600">
                    Опција за заштита со PIN код спречува учениците предвреме да ги видат решенијата пред наставникот да даде дозвола на часот.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <span>Релациона Шема на База на Податоци (PostgreSQL / SQL DDL)</span>
              </h3>
              <p>
                Оптимизирана шема која ги мапира скратените врски, образовните фајлови, чекорите за скалирање по Виготски и категоризацијата според Блумовата таксономија.
              </p>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto">
                <pre className="text-slate-100">{`-- 1. Табела за образовни QR кодови и скратени линкови
CREATE TABLE educational_qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    short_code VARCHAR(16) UNIQUE NOT NULL,      -- на пр. 'geo302'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(64) NOT NULL,               -- Математика, Геометрија
    target_grade VARCHAR(32) NOT NULL,          -- 8-мо одделение
    qr_type VARCHAR(32) NOT NULL,               -- 'math_latex', 'vygotsky_scaffold', итн.
    
    -- Содржина со LaTeX
    latex_content TEXT NOT NULL,
    solution_latex TEXT,
    
    -- Педагошки метаподатоци
    bloom_level VARCHAR(16),                    -- 'remember', 'understand', 'apply', итн.
    bloom_objectives TEXT,
    gardner_intelligence VARCHAR(32),           -- 'visual_spatial', 'logical_mathematical'
    gardner_activity_type VARCHAR(128),
    
    -- Скратен линк и безбедност
    target_url TEXT,
    requires_pin BOOLEAN DEFAULT FALSE,
    pin_code VARCHAR(8),
    
    -- QR Дизајн
    style_fg_color VARCHAR(16) DEFAULT '#1e3a8a',
    style_bg_color VARCHAR(16) DEFAULT '#ffffff',
    error_correction VARCHAR(2) DEFAULT 'Q',
    center_icon VARCHAR(16) DEFAULT 'math',
    
    -- Аналитика
    scan_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_scanned_at TIMESTAMP WITH TIME ZONE
);

-- 2. Чекори за скалирање по Виготски (Зона на нареден развој)
CREATE TABLE vygotsky_scaffolding_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_code_id UUID NOT NULL REFERENCES educational_qr_codes(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,               -- 1, 2, 3
    title VARCHAR(128) NOT NULL,                -- 'Насока 1: Идентификувај ги катетите'
    content_with_latex TEXT NOT NULL,           -- Текст со $...$ ознаки
    revealed_by_default BOOLEAN DEFAULT FALSE
);

-- 3. Споделување на документи и наставни материјали
CREATE TABLE educational_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_code_id UUID NOT NULL REFERENCES educational_qr_codes(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(64) NOT NULL,             -- 'application/pdf', 'image/png'
    storage_bucket_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индекси за брз пристап при скенирање во училница
CREATE INDEX idx_qr_short_code ON educational_qr_codes(short_code);
CREATE INDEX idx_scaffolding_qr_id ON vygotsky_scaffolding_steps(qr_code_id);`}</pre>
              </div>
            </div>
          )}

          {activeTab === 'pedagogy' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                Интеграција на Трите Педагошки Рамки
              </h3>

              <div className="space-y-3">
                <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
                  <h4 className="font-bold text-indigo-900 text-sm mb-1">
                    1. Скалирање по Лев Виготски (Scaffolding & ZPD)
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Зоната на нареден развој (ZPD) претставува простор помеѓу она што ученикот може да го реши самостојно и она што може да го реши со менторска помош. Во апликацијата ова е решено преку <strong>постепено отклучување насоки</strong>: QR кодот прво ја нуди само задачата. Доколку ученикот наиде на пречка, со клик на копчето добива Насока 1 (дефиниции), па Насока 2 (парцијална замена на вредности), па Насока 3 (инструкција за пресметка), пред конечното официјално решение.
                  </p>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
                  <h4 className="font-bold text-amber-900 text-sm mb-1">
                    2. Блумова Таксономија (Cognitive Complexity)
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Секој QR код содржи ознака за едно од 6-те когнитивни нивоа: <em>Помнење, Разбирање, Примена, Анализа, Евалуација и Креирање</em>. Наставникот може да подготви QR кодови со различна боја во училницата за ученици со различни предзнаења (диференцирана настава).
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                  <h4 className="font-bold text-emerald-900 text-sm mb-1">
                    3. Мултипни Интелигенции на Хауард Гарднер
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Математиката не се учи само со броеви (логичко-математичка). Платформата овозможува врзување на QR кодовите со GeoGebra симулации за <strong>просторно-визуелни</strong> ученици, текстуални есеи за <strong>вербални</strong>, аудио-опис за слушање и практични мерења за <strong>кинестетички</strong> ученици.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                Чекор-по-чекор Водич за Имплементација и Употреба во Училиште
              </h3>

              <ol className="list-decimal list-inside space-y-2.5 text-xs text-slate-700">
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Чекор 1: Креирање задача со LaTeX</strong> — Отворете го дијалогот за нов QR код, изберете „Математичка задача“ или „Скалирање по Виготски“ и користете ја лентата со формули за брзо внесување дропки и корени.
                </li>
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Чекор 2: Дефинирање на ZPD насоки</strong> — Внесете 2 до 3 последователни чекори на помош кои ученикот ќе ги отклучува кога ќе се сопне.
                </li>
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Чекор 3: Печатење на работен лист (А4)</strong> — Кликнете на „Печати Наставен Лист“, изберете ги задачите по станици и отпечатете ги за учениците.
                </li>
                <li className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Чекор 4: Скенирање на часот</strong> — Учениците ги скенираат кодовите со телефон или таблет, а наставникот во живо го следи бројот на скенирања преку вградената аналитика.
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Футер */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
