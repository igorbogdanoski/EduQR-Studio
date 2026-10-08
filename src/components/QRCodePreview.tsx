import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { toPng, toSvg } from 'html-to-image';
import { EducationalQRCode, Language } from '../types';
import { Download, Copy, Check, Eye, ChevronDown, Image as ImageIcon, FileCode, Sparkles } from 'lucide-react';
import { translations } from '../i18n/translations';

interface QRCodePreviewProps {
  item: EducationalQRCode;
  language: Language;
  onSimulateScan?: (item: EducationalQRCode) => void;
  showActions?: boolean;
  colorMode?: 'color' | 'grayscale';
}

export const QRCodePreview: React.FC<QRCodePreviewProps> = ({
  item,
  language,
  onSimulateScan,
  showActions = true,
  colorMode = 'color',
}) => {
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [svgContent, setSvgContent] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<'png' | 'svg' | null>(null);

  const t = translations[language];

  // Создаваме вистинска содржина/URL за QR кодот
  const payloadUrl = React.useMemo(() => {
    if (item.type === 'wifi_access' && item.wifiSsid) {
      const enc = item.wifiEncryption || 'WPA';
      const pass = item.wifiPassword || '';
      return `WIFI:T:${enc};S:${item.wifiSsid};P:${pass};;`;
    }
    if (item.type === 'short_url' && item.targetUrl) {
      return item.targetUrl;
    }
    const baseUrl = window.location.origin;
    return `${baseUrl}?task=${encodeURIComponent(item.shortCode)}`;
  }, [item]);

  // Генерирање на рендериран SVG елемент со вграден образовен беџ
  useEffect(() => {
    let isMounted = true;
    const generateSvg = async () => {
      try {
        const isGrayscale = colorMode === 'grayscale';
        const margin = item.style?.margin ?? 2;
        const fg = isGrayscale ? '#000000' : (item.style?.fgColor || '#1e3a8a');
        const bg = isGrayscale ? '#ffffff' : (item.style?.bgColor || '#ffffff');
        const ecc = item.style?.errorCorrectionLevel || 'Q';
        const pattern = item.style?.pattern || 'standard';

        let rawSvg = '';

        if (pattern === 'standard') {
          rawSvg = await QRCode.toString(payloadUrl, {
            type: 'svg',
            margin: margin,
            color: {
              dark: fg,
              light: bg
            },
            errorCorrectionLevel: ecc
          });
        } else {
          // Напредно генерирање со прилагодена матрица и форма (Dots, Rounded, Classy, Mosaic)
          const qr = QRCode.create(payloadUrl, { errorCorrectionLevel: ecc });
          const moduleCount = qr.modules.size;
          const totalSize = moduleCount + margin * 2;

          const isFinder = (r: number, c: number) => {
            return (
              (r < 7 && c < 7) ||
              (r < 7 && c >= moduleCount - 7) ||
              (r >= moduleCount - 7 && c < 7)
            );
          };

          const elements: string[] = [];

          // 1. Позадина
          elements.push(`<rect width="${totalSize}" height="${totalSize}" fill="${bg}" />`);

          // 2. Рендерирање на податочните модули (Data Modules)
          for (let r = 0; r < moduleCount; r++) {
            for (let c = 0; c < moduleCount; c++) {
              if (qr.modules.get(r, c) && !isFinder(r, c)) {
                const x = c + margin;
                const y = r + margin;
                if (pattern === 'dots') {
                  elements.push(`<circle cx="${x + 0.5}" cy="${y + 0.5}" r="0.43" fill="${fg}" />`);
                } else if (pattern === 'rounded') {
                  elements.push(`<rect x="${x + 0.08}" y="${y + 0.08}" width="0.84" height="0.84" rx="0.32" fill="${fg}" />`);
                } else if (pattern === 'classy') {
                  const cx = x + 0.5;
                  const cy = y + 0.5;
                  elements.push(`<polygon points="${cx},${cy - 0.44} ${cx + 0.44},${cy} ${cx},${cy + 0.44} ${cx - 0.44},${cy}" fill="${fg}" />`);
                } else if (pattern === 'mosaic') {
                  elements.push(`<rect x="${x + 0.05}" y="${y + 0.05}" width="0.9" height="0.9" rx="0.18" fill="${fg}" />`);
                }
              }
            }
          }

          // 3. Рендерирање на 3-те аголни Finder Patterns (Очи за скенирање)
          const finders = [
            { x: margin, y: margin },
            { x: margin + moduleCount - 7, y: margin },
            { x: margin, y: margin + moduleCount - 7 }
          ];

          finders.forEach(({ x, y }) => {
            const rxOuter = pattern === 'dots' || pattern === 'rounded' ? '1.8' : pattern === 'mosaic' ? '1.2' : '0.4';
            const rxInner = pattern === 'dots' || pattern === 'rounded' ? '1.2' : pattern === 'mosaic' ? '0.8' : '0.2';
            const rxCenter = pattern === 'dots' || pattern === 'rounded' ? '0.9' : pattern === 'mosaic' ? '0.6' : '0.2';

            // Надворешна рамка (7x7)
            elements.push(`<rect x="${x}" y="${y}" width="7" height="7" rx="${rxOuter}" fill="${fg}" />`);
            // Внатрешен бел процеп (5x5)
            elements.push(`<rect x="${x + 1}" y="${y + 1}" width="5" height="5" rx="${rxInner}" fill="${bg}" />`);
            // Внатрешно око (3x3)
            elements.push(`<rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx="${rxCenter}" fill="${fg}" />`);
          });

          rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" shape-rendering="geometricPrecision">\n${elements.join('\n')}\n</svg>`;
        }

        // Вградување на централен образовен симбол (беџ) директно во SVG кодот
        if (item.style?.iconType && item.style.iconType !== 'none') {
          let symbol = '∑';
          if (item.style.iconType === 'atom') symbol = '⚛';
          else if (item.style.iconType === 'book') symbol = '📖';
          else if (item.style.iconType === 'lightbulb') symbol = '💡';
          else if (item.style.iconType === 'school') symbol = '🎓';

          const match = rawSvg.match(/viewBox="0 0 ([0-9.]+) ([0-9.]+)"/);
          if (match) {
            const viewBoxWidth = parseFloat(match[1]);
            const cx = viewBoxWidth / 2;
            const cy = viewBoxWidth / 2;
            const radius = viewBoxWidth * 0.125;
            const strokeW = Math.max(0.3, viewBoxWidth * 0.015);
            const fontSize = radius * 1.15;

            const badgeElement = `
              <g id="center-educational-badge">
                <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${bg}" stroke="${fg}" stroke-width="${strokeW}" />
                <text x="${cx}" y="${cy}" font-size="${fontSize}" font-family="Plus Jakarta Sans, sans-serif" font-weight="bold" fill="${fg}" text-anchor="middle" dominant-baseline="central">${symbol}</text>
              </g>
            `;
            rawSvg = rawSvg.replace('</svg>', `${badgeElement}\n</svg>`);
          }
        }

        if (isMounted) {
          setSvgContent(rawSvg);
        }
      } catch (err) {
        console.error('Failed to generate SVG QR code:', err);
      }
    };

    generateSvg();
    return () => {
      isMounted = false;
    };
  }, [payloadUrl, item.style, colorMode]);

  // Затворање на менито при клик надвор
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Извоз на PNG со html-to-image од рендерираниот SVG елемент
  const handleExportPng = async () => {
    if (!svgContainerRef.current) return;
    setIsExporting('png');
    try {
      // Го зафаќаме рендерираниот SVG елемент со 3x pixelRatio за висока резолуција при печатење
      const dataUrl = await toPng(svgContainerRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: item.style?.bgColor || '#ffffff',
        quality: 1.0
      });

      const link = document.createElement('a');
      link.download = `QR_${item.shortCode || 'code'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('html-to-image PNG export failed:', err);
    } finally {
      setIsExporting(null);
      setIsMenuOpen(false);
    }
  };

  // Извоз на SVG со html-to-image од рендерираниот SVG елемент
  const handleExportSvg = async () => {
    if (!svgContainerRef.current) return;
    setIsExporting('svg');
    try {
      const dataUrl = await toSvg(svgContainerRef.current, {
        cacheBust: true,
        backgroundColor: item.style?.bgColor || '#ffffff'
      });

      const link = document.createElement('a');
      link.download = `QR_${item.shortCode || 'code'}.svg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('html-to-image SVG export failed:', err);
    } finally {
      setIsExporting(null);
      setIsMenuOpen(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(payloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Контејнер со рендериран SVG QR код */}
      <div className="relative p-3 bg-white rounded-2xl shadow-sm border border-slate-200/80 transition-transform duration-200 hover:shadow-md">
        <div
          ref={svgContainerRef}
          className="rounded-xl overflow-hidden flex items-center justify-center max-w-[240px] max-h-[240px] [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
          style={{ backgroundColor: item.style?.bgColor || '#ffffff' }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {item.requiresPin && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
            <span>PIN: {item.pinCode}</span>
          </div>
        )}
      </div>

      {/* Код и информации за скенирање */}
      <div className="mt-3 text-center">
        <span className="inline-block font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
          edu://{item.shortCode}
        </span>
        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-center gap-2">
          <span>ECC: {item.style?.errorCorrectionLevel || 'Q'}</span>
          <span>•</span>
          <span>{item.scanCount} {t.totalScans.toLowerCase()}</span>
        </div>
      </div>

      {/* Контролна лента со мени за преземање */}
      {showActions && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 w-full relative">
          {/* Главно мени за преземање (PNG / SVG) */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-lg shadow-2xs transition active:scale-95"
              title="Преземи како PNG или SVG"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t.downloadMenuTitle}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Паѓачко мени */}
            {isMenuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-left animate-fadeIn">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Формати за извоз (html-to-image)
                </div>

                <button
                  type="button"
                  onClick={handleExportPng}
                  disabled={isExporting !== null}
                  className="w-full px-3 py-2 text-left hover:bg-indigo-50/80 transition flex items-start gap-2.5 text-xs group"
                >
                  <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 group-hover:text-indigo-900 flex items-center gap-1.5">
                      <span>{t.downloadPng}</span>
                      {isExporting === 'png' && <span className="text-[10px] text-indigo-600 font-normal">...</span>}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{t.downloadPngDesc}</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleExportSvg}
                  disabled={isExporting !== null}
                  className="w-full px-3 py-2 text-left hover:bg-teal-50/80 transition flex items-start gap-2.5 text-xs group"
                >
                  <div className="p-1.5 bg-teal-100 text-teal-700 rounded-lg mt-0.5 group-hover:bg-teal-600 group-hover:text-white transition">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 group-hover:text-teal-900 flex items-center gap-1.5">
                      <span>{t.downloadSvg}</span>
                      {isExporting === 'svg' && <span className="text-[10px] text-teal-600 font-normal">...</span>}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{t.downloadSvgDesc}</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Копирај URL */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition"
            title={t.copyShortUrl}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">✓</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>URL</span>
              </>
            )}
          </button>

          {/* Тест симулација */}
          {onSimulateScan && (
            <button
              type="button"
              onClick={() => onSimulateScan(item)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs hover:shadow transition"
              title={t.previewStudentScan}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{language === 'mk' ? 'Тест' : 'Test'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
