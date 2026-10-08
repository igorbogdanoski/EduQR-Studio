import React, { useState } from 'react';
import { EducationalQRCode, Language } from '../types';
import { LatexRenderer } from './LatexRenderer';
import { translations } from '../i18n/translations';
import { 
  X, 
  Lock, 
  Unlock, 
  ChevronRight, 
  CheckCircle, 
  Download, 
  Volume2, 
  ExternalLink,
  Layers,
  Brain,
  HelpCircle,
  Sparkles,
  Wifi,
  FileText,
  Key,
  Award,
  Check,
  Printer
} from 'lucide-react';

interface StudentScanModalProps {
  item: EducationalQRCode;
  language: Language;
  onClose: () => void;
  onOpenPdfViewer?: (item: EducationalQRCode) => void;
}

export const StudentScanModal: React.FC<StudentScanModalProps> = ({
  item,
  language,
  onClose,
  onOpenPdfViewer
}) => {
  const t = translations[language];
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(!item.requiresPin);
  const [pinError, setPinError] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [revealedStepsCount, setRevealedStepsCount] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedQuestionTab, setSelectedQuestionTab] = useState<'all' | number>('all');

  const isAnswerKey = item.type === 'answer_key' || item.isAnswerKey || (item.tags && item.tags.includes('answer_key'));
  const quizQuestions = item.quizQuestions || [];
  const totalQuizPoints = quizQuestions.reduce((s, q) => s + (q.points || 0), 0);

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (item.pinCode && pinInput.trim() === item.pinCode.trim()) {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleRevealNextHint = () => {
    if (item.scaffoldingSteps && revealedStepsCount < item.scaffoldingSteps.length) {
      setRevealedStepsCount(prev => prev + 1);
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Текст за изговор (чист текст без LaTeX симболи)
    const textToSpeak = (item.title + '. ' + item.latexContent)
      .replace(/\$\$[\s\S]*?\$\$/g, ' математичка формула ')
      .replace(/\$([^\$]+?)\$/g, ' $1 ');

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'mk' ? 'mk-MK' : language === 'sq' ? 'sq-AL' : 'en-US';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Мобилен заглавен бар со симулација на телефонски преглед */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-slate-300">
              {t.studentPortal}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Тело на ученичкиот приказ */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {!isUnlocked ? (
            <div className="text-center py-8 px-4 space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{t.enterPin}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'mk' 
                    ? 'Оваа наставна активност е заштитена со PIN код од наставникот.' 
                    : 'This educational task is secured with a classroom PIN.'}
                </p>
              </div>

              <form onSubmit={handleUnlockPin} className="max-w-xs mx-auto space-y-3">
                <input
                  type="text"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN (на пр. 2026)"
                  className="w-full text-center text-xl font-bold tracking-widest px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-hidden"
                />

                {pinError && (
                  <p className="text-xs text-rose-600 font-semibold">{t.invalidPin}</p>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md transition"
                >
                  <Unlock className="w-4 h-4" />
                  <span>{t.unlock}</span>
                </button>
              </form>
            </div>
          ) : isAnswerKey ? (
            /* СПЕЦИЈАЛЕН ПРИКАЗ ЗА КЛУЧ СО РЕШЕНИЈА (ANSWER KEY) */
            <div className="space-y-5 animate-fadeIn">
              {/* Заглавие на Клучот */}
              <div className="p-4 bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white rounded-2xl shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-white/20 rounded-xl text-lg">🔑</span>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200 block">
                        Официјален клуч со точни одговори
                      </span>
                      <h2 className="font-extrabold text-base sm:text-lg text-white leading-tight">
                        {item.title}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                    {quizQuestions.length > 0 ? `${quizQuestions.length} задачи` : 'Тематски клуч'}
                  </span>
                  {totalQuizPoints > 0 && (
                    <span className="bg-amber-400/30 text-amber-200 border border-amber-300/40 px-2.5 py-0.5 rounded-full font-bold">
                      Вкупно: {totalQuizPoints} бодови
                    </span>
                  )}
                  <span className="bg-white/10 px-2 py-0.5 rounded-full text-emerald-100">
                    {item.subject} • {item.targetGrade}
                  </span>
                </div>
              </div>

              {/* Табови за брз скок по задачи */}
              {quizQuestions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Филтрирај по задача:</span>
                    <button
                      type="button"
                      onClick={() => setSelectedQuestionTab(selectedQuestionTab === 'all' ? 1 : 'all')}
                      className="text-indigo-600 hover:text-indigo-800 font-bold text-xs cursor-pointer"
                    >
                      {selectedQuestionTab === 'all' ? 'Прикажи поединечно' : 'Прикажи ги сите одеднаш'}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedQuestionTab('all')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        selectedQuestionTab === 'all'
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Сите ({quizQuestions.length})
                    </button>

                    {quizQuestions.map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setSelectedQuestionTab(q.questionNumber)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          selectedQuestionTab === q.questionNumber
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span>#{q.questionNumber}</span>
                        <span className="text-[10px] opacity-80">({q.points}б)</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Приказ на решенијата */}
              <div className="space-y-4">
                {quizQuestions.length > 0 ? (
                  quizQuestions
                    .filter((q) => selectedQuestionTab === 'all' || selectedQuestionTab === q.questionNumber)
                    .map((q) => (
                      <div
                        key={q.id}
                        className="bg-white border-2 border-emerald-200/90 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white text-xs font-black flex items-center justify-center">
                              #{q.questionNumber}
                            </span>
                            <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                              Задача {q.questionNumber}
                            </span>
                          </div>
                          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                            {q.points} {q.points === 1 ? 'бод' : 'бода'}
                          </span>
                        </div>

                        {/* Поставка на задачата */}
                        <div className="p-3 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-800 border border-slate-200/60">
                          <LatexRenderer content={q.questionLatex} />
                        </div>

                        {/* ТОЧЕН ОДГОВОР БАНЕР */}
                        <div className="p-3 bg-emerald-600 text-white rounded-xl flex items-center justify-between shadow-2xs">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-200 shrink-0" />
                            <span className="text-xs font-bold uppercase tracking-wider">Точен одговор:</span>
                          </div>
                          <span className="font-mono font-extrabold text-xs sm:text-sm text-white select-all">
                            {q.correctAnswerText}
                          </span>
                        </div>

                        {/* ДЕТАЛНА ПОСТАПКА */}
                        {q.solutionLatex && (
                          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                              Чекор-по-чекор постапка:
                            </span>
                            <div className="text-xs sm:text-sm text-slate-900">
                              <LatexRenderer content={q.solutionLatex} />
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                ) : (
                  /* Доколку нема посебни структурирани прашања туку општ клуч */
                  <div className="bg-white border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl font-bold text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Комплетно официјално решение и упатство:</span>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-800 p-4 bg-slate-50 rounded-xl">
                      <LatexRenderer content={item.solutionLatex || item.latexContent} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Хедер за задачата */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
                    {item.subject}
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                    {item.targetGrade}
                  </span>

                  {item.bloomLevel && (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full flex items-center gap-1">
                      <Brain className="w-3 h-3" />
                      <span>{t.bloomShort[item.bloomLevel]}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h2>
                  <button
                    type="button"
                    onClick={handleSpeak}
                    className={`p-2 rounded-xl transition ${
                      isSpeaking ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title="Слушај аудио опис"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {item.description && (
                  <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                )}
              </div>

              {/* Ако е WiFi QR код */}
              {item.type === 'wifi_access' && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                  <div className="p-3 bg-emerald-600 text-white rounded-xl">
                    <Wifi className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900 uppercase">Училишна Мрежа (WiFi)</h4>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                      SSID: <span className="font-mono text-indigo-700">{item.wifiSsid}</span>
                    </p>
                    <p className="text-xs text-slate-600">
                      Лозинка: <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 select-all">{item.wifiPassword}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Главна математичка поставка со KaTeX */}
              {item.latexContent && (
                <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
                  <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>{t.problemStatement}</span>
                  </div>
                  <div className="text-slate-800 text-sm sm:text-base">
                    <LatexRenderer content={item.latexContent} />
                  </div>
                </div>
              )}

              {/* Ако има прикачен документ или е од тип document_file */}
              {(item.fileName || item.type === 'document_file') && (
                <div className="p-4 bg-indigo-50/80 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-2xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-indigo-950">{item.fileName || 'Наставен Ресурс (PDF)'}</h4>
                      <p className="text-[11px] text-indigo-700 font-medium">{item.fileSize || '1.4 MB • Дигитализиран документ'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {onOpenPdfViewer && (
                      <button
                        type="button"
                        onClick={() => onOpenPdfViewer(item)}
                        className="grow sm:grow-0 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Отвори во вграден PDF прегледувач"
                      >
                        <FileText className="w-4 h-4" />
                        <span>{language === 'mk' ? 'Прегледај PDF' : 'View PDF'}</span>
                      </button>
                    )}

                    <a
                      href={item.fileDataUrl || '#'}
                      download={item.fileName || 'EduQR_Dokument.pdf'}
                      className="grow sm:grow-0 px-3 py-2 bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl shadow-2xs transition flex items-center justify-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.downloadAttachedFile}</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Ако има целен линк (на пр. GeoGebra) */}
              {item.targetUrl && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-slate-700">Интерактивна алатка: </span>
                    <span className="text-slate-500 font-mono text-[11px]">{item.targetUrl}</span>
                  </div>
                  <a
                    href={item.targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg"
                  >
                    <span>Отвори</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Скалирање по Виготски (Scaffolding Ladder) */}
              {item.scaffoldingSteps && item.scaffoldingSteps.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {language === 'mk' ? 'Чекори на помош (Виготски ZPD)' : 'Scaffolding Guidance (ZPD)'}
                      </h4>
                    </div>
                    <span className="text-xs text-indigo-700 font-semibold">
                      {revealedStepsCount} / {item.scaffoldingSteps.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {item.scaffoldingSteps.slice(0, revealedStepsCount).map((step, idx) => (
                      <div
                        key={step.id}
                        className="p-3.5 bg-indigo-50/60 border border-indigo-200/80 rounded-xl space-y-1.5 animate-fadeIn"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-indigo-950">{step.title}</span>
                        </div>
                        <div className="text-xs text-slate-700 pl-7">
                          <LatexRenderer content={step.contentWithLatex} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {revealedStepsCount < item.scaffoldingSteps.length ? (
                    <button
                      type="button"
                      onClick={handleRevealNextHint}
                      className="w-full py-2.5 bg-white border border-indigo-300 hover:bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-2xs"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>{t.revealNextHint} ({revealedStepsCount + 1}/{item.scaffoldingSteps.length})</span>
                    </button>
                  ) : (
                    <p className="text-[11px] text-center text-slate-500 font-medium pt-1">
                      {t.allHintsRevealed}
                    </p>
                  )}
                </div>
              )}

              {/* Чекор-по-чекор конечно решение */}
              {item.solutionLatex && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowSolution(!showSolution)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>{showSolution ? t.hideSolution : t.viewSolution}</span>
                    <ChevronRight className={`w-4 h-4 transform transition ${showSolution ? 'rotate-90' : ''}`} />
                  </button>

                  {showSolution && (
                    <div className="mt-3 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-slate-800 animate-fadeIn">
                      <div className="font-bold text-emerald-800 text-xs mb-2 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        <span>{language === 'mk' ? 'Комплетно официјално решение:' : 'Complete Model Solution:'}</span>
                      </div>
                      <LatexRenderer content={item.solutionLatex} />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Футер */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{t.scanSuccess}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
