import React, { useState, useEffect, useRef } from 'react';
import { Language, EducationalQRCode, BloomLevel, ScaffoldingStep } from '../types';
import { translations } from '../i18n/translations';
import { LatexRenderer } from './LatexRenderer';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  X,
  Play,
  RotateCcw,
  PlusCircle,
  Brain,
  Layers,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onApplyAsQRCode: (taskData: Partial<EducationalQRCode>) => void;
}

interface AssistantResponse {
  spokenResponse: string;
  title: string;
  subject: string;
  targetGrade: string;
  latexContent: string;
  solutionLatex?: string;
  scaffoldingSteps?: ScaffoldingStep[];
  bloomLevel?: BloomLevel;
  tags?: string[];
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onApplyAsQRCode
}) => {
  const t = translations[language];

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Иницијализација на Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechRecognitionSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      // Јазик на препознавање според тековно избраниот
      if (language === 'mk') {
        recognition.lang = 'mk-MK';
      } else if (language === 'sq') {
        recognition.lang = 'sq-AL';
      } else {
        recognition.lang = 'en-US';
      }

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError(
            language === 'mk'
              ? 'Ве молиме овозможете пристап до микрофонот во прелистувачот.'
              : 'Please allow microphone access in your browser.'
          );
        } else if (event.error !== 'no-speech') {
          setSpeechError(
            language === 'mk'
              ? `Грешка при препознавање на говорот (${event.error}). Можете да напишете порака.`
              : `Voice error (${event.error}). You can type your request directly.`
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition not available', e);
      setIsSpeechRecognitionSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      stopSpeaking();
    };
  }, [language]);

  // Запирање на говорот кога ќе се затвори модалот
  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    }
  }, [isOpen]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError(
        language === 'mk'
          ? 'Препознавањето на глас не е поддржано во овој прелистувач. Напишете го барањето во полето подолу.'
          : 'Speech recognition is not supported in this browser. Please type your request.'
      );
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    } else {
      stopSpeaking();
      setSpeechError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window) || !text) return;

    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    if (language === 'mk') {
      utterance.lang = 'mk-MK';
    } else if (language === 'sq') {
      utterance.lang = 'sq-AL';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendPrompt = async (promptToSend?: string) => {
    const textQuery = (promptToSend || transcript).trim();
    if (!textQuery) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }

    setIsProcessing(true);
    setSpeechError(null);
    stopSpeaking();

    try {
      const response = await fetch('/api/ai/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textQuery,
          language
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AssistantResponse = await response.json();
      setResponse(data);

      // Автоматски изговори го одговорот на моделот со глас
      if (data.spokenResponse) {
        speakText(data.spokenResponse);
      }
    } catch (err: any) {
      console.error('Voice Assistant fetch error:', err);
      setSpeechError(
        language === 'mk'
          ? 'Настана грешка при комуникацијата со моделот. Обидете се повторно.'
          : 'Error communicating with AI assistant. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectQuickPrompt = (promptText: string) => {
    setTranscript(promptText);
    handleSendPrompt(promptText);
  };

  const handleCreateQRCodeFromResponse = () => {
    if (!response) return;

    onApplyAsQRCode({
      title: response.title,
      subject: response.subject,
      targetGrade: response.targetGrade,
      latexContent: response.latexContent,
      solutionLatex: response.solutionLatex || '',
      scaffoldingSteps: response.scaffoldingSteps || [],
      bloomLevel: response.bloomLevel || 'apply',
      type: response.scaffoldingSteps && response.scaffoldingSteps.length > 0 ? 'vygotsky_scaffold' : 'math_latex',
      tags: response.tags || ['in_class']
    });

    stopSpeaking();
    onClose();
  };

  if (!isOpen) return null;

  const quickPrompts = [
    {
      label: language === 'mk' ? '📐 Питагорова теорема со чекори' : '📐 Pythagorean theorem with steps',
      prompt: language === 'mk' ? 'Креирај задача за Питагорова теорема за 8-мо одделение со скалирани чекори' : 'Create Pythagorean theorem task for grade 8 with scaffolding'
    },
    {
      label: language === 'mk' ? '➗ Квадратна равенка (Анализа)' : '➗ Quadratic equation (Analyze)',
      prompt: language === 'mk' ? 'Направи задача за квадратна равенка со дискриминанта за Блумово ниво Анализа' : 'Quadratic equation task with discriminant for Bloom Analyze level'
    },
    {
      label: language === 'mk' ? '📊 Проценти и попуст (Домашно)' : '📊 Percentages & discount (Homework)',
      prompt: language === 'mk' ? 'Дај ми практична вежба за проценти за домашна задача за 7-мо одделение' : 'Practical percentage exercise for grade 7 homework'
    },
    {
      label: language === 'mk' ? '💡 Собирање на дропки со помош' : '💡 Fraction addition with hints',
      prompt: language === 'mk' ? 'Креирај задача за собирање дропки со различни именители и насоки по Виготски' : 'Fractions addition with different denominators and Vygotsky hints'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Заглавие на модалот */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white flex items-center justify-between border-b border-indigo-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <Mic className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">
                  {language === 'mk' ? 'Гласовен помошник за наставникот' : 'Teacher Voice Assistant'}
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Gemini AI Voice</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'mk'
                  ? 'Зборувајте со моделот за креирање задачи, формули и педагошки чекори.'
                  : 'Speak directly with the model to generate tasks, formulas, and scaffolding hints.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Содржина со скролање */}
        <div className="p-6 overflow-y-auto space-y-6 grow">
          
          {/* Интерактивна секција за говор (Микрофон & Анимација) */}
          <div className="bg-gradient-to-b from-indigo-50/70 to-slate-50 border border-indigo-100 rounded-3xl p-6 text-center space-y-4">
            
            {/* Големо пулсирачко копче за микрофон */}
            <div className="relative inline-block">
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping pointer-events-none" />
              )}
              <button
                type="button"
                onClick={toggleListening}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-300 scale-105'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105 ring-4 ring-indigo-200'
                }`}
                title={isListening ? 'Кликнете за запирање' : 'Кликнете и зборувајте'}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8 animate-pulse" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
            </div>

            <div>
              <div className="text-base font-bold text-slate-800">
                {isListening ? (
                  <span className="text-rose-600 flex items-center justify-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    {language === 'mk' ? 'Слушам... Зборувајте слободно' : 'Listening... Speak now'}
                  </span>
                ) : isSpeaking ? (
                  <span className="text-indigo-600 flex items-center justify-center gap-2">
                    <Volume2 className="w-5 h-5 animate-bounce" />
                    {language === 'mk' ? 'Моделот зборува...' : 'Model is speaking...'}
                  </span>
                ) : isProcessing ? (
                  <span className="text-purple-600 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    {language === 'mk' ? 'Обработувам со Gemini AI...' : 'Processing with Gemini AI...'}
                  </span>
                ) : (
                  <span>{language === 'mk' ? 'Кликнете на микрофонот за да зборувате' : 'Click the microphone to speak'}</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {language === 'mk'
                  ? 'Кажете каква математичка задача ви треба (предмет, одделение, тема, или Блумово ниво).'
                  : 'State what math task you need (grade, topic, formulas, or Bloom cognitive demand).'}
              </p>
            </div>

            {/* Бран од звук кога моделот или наставникот зборуваат */}
            {(isListening || isSpeaking) && (
              <div className="flex items-center justify-center gap-1.5 h-6">
                {[40, 70, 100, 60, 90, 50, 80, 45, 95, 65, 35].map((h, idx) => (
                  <div
                    key={idx}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isListening ? 'bg-rose-500' : 'bg-indigo-600'
                    }`}
                    style={{
                      height: `${h}%`,
                      animation: 'pulse 1s infinite',
                      animationDelay: `${idx * 0.1}s`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Поле за текст со транскрипција од гласот */}
            <div className="relative max-w-xl mx-auto">
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={
                  language === 'mk'
                    ? 'Вашиот изговорен текст ќе се појави овде, или можете да го напишете директно...'
                    : 'Transcribed speech will appear here, or you can type directly...'
                }
                rows={2}
                className="w-full text-sm p-3.5 pr-24 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none shadow-inner"
              />

              <div className="absolute right-2.5 bottom-3.5 flex items-center gap-1">
                {transcript && (
                  <button
                    type="button"
                    onClick={() => setTranscript('')}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg text-xs"
                    title="Исчисти"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSendPrompt()}
                  disabled={!transcript.trim() || isProcessing}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'mk' ? 'Испрати' : 'Send'}</span>
                </button>
              </div>
            </div>

            {speechError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 text-left max-w-xl mx-auto">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{speechError}</span>
              </div>
            )}
          </div>

          {/* Брзи гласовни примери за наставници */}
          <div>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{language === 'mk' ? 'Препорачани прашања / гласовни команди:' : 'Suggested voice prompts:'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuickPrompt(item.prompt)}
                  disabled={isProcessing}
                  className="p-2.5 text-left bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-medium text-slate-700 transition flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate">{item.label}</span>
                  <span className="text-slate-400 group-hover:text-indigo-600 font-bold ml-1">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Приказ на одговорот од моделот */}
          {response && (
            <div className="bg-gradient-to-br from-indigo-50/40 via-purple-50/20 to-white border border-indigo-200 rounded-3xl p-5 space-y-4 shadow-sm animate-fade-in">
              
              {/* Гласовна порака од моделот */}
              <div className="flex items-start justify-between gap-3 bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-indigo-900">
                      {language === 'mk' ? 'Одговор од Гласовниот Помошник:' : 'Voice Assistant Response:'}
                    </div>
                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                      {response.spokenResponse}
                    </p>
                  </div>
                </div>

                {/* Контрола за преслушување */}
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      speakText(response.spokenResponse);
                    }
                  }}
                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title={isSpeaking ? 'Паузирај изговор' : 'Преслушај повторно'}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSpeaking ? (language === 'mk' ? 'Запри' : 'Stop') : (language === 'mk' ? 'Слушај' : 'Listen')}</span>
                </button>
              </div>

              {/* Генерирана задача и метаподатоци */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {response.subject}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">
                      {response.targetGrade}
                    </span>
                    {response.bloomLevel && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Brain className="w-3.5 h-3.5 text-amber-600" />
                        <span>{t.bloomShort[response.bloomLevel]}</span>
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900">
                  {response.title}
                </h4>

                {/* Формула со LaTeX */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {language === 'mk' ? 'Математичка формула со LaTeX:' : 'LaTeX Mathematical Formula:'}
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                    <LatexRenderer content={response.latexContent} />
                  </div>
                </div>

                {/* Чекор-по-чекор решение */}
                {response.solutionLatex && (
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-emerald-800">
                      {language === 'mk' ? 'Решение со чекори:' : 'Step-by-step Solution:'}
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-100 text-slate-800">
                      <LatexRenderer content={response.solutionLatex} />
                    </div>
                  </div>
                )}

                {/* Скалирани чекори по Виготски */}
                {response.scaffoldingSteps && response.scaffoldingSteps.length > 0 && (
                  <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl text-xs space-y-2">
                    <div className="font-bold text-purple-900 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-purple-600" />
                      <span>{language === 'mk' ? `Скалирани чекори по Виготски (${response.scaffoldingSteps.length}):` : `Vygotsky Hints (${response.scaffoldingSteps.length}):`}</span>
                    </div>
                    <div className="space-y-1.5">
                      {response.scaffoldingSteps.map((step, idx) => (
                        <div key={idx} className="bg-white p-2 rounded-lg border border-purple-100 text-slate-700">
                          <span className="font-bold text-purple-800">#{step.stepNumber}: {step.title} — </span>
                          <span><LatexRenderer content={step.contentWithLatex} /></span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Главно копче за примена: Директно креирање QR код */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  {language === 'mk'
                    ? 'Задоволни сте со резултатот? Отворете го директно во QR уредникот.'
                    : 'Satisfied with the result? Open it directly in the QR editor.'}
                </span>

                <button
                  type="button"
                  onClick={handleCreateQRCodeFromResponse}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{language === 'mk' ? 'Креирај QR код од овој одговор' : 'Create QR Code from this Task'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Долна лента */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>{language === 'mk' ? 'Двонасочен гласовен модел за наставници (STT + Gemini + TTS)' : 'Two-way Teacher Voice Model (STT + Gemini + TTS)'}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold transition cursor-pointer"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};
