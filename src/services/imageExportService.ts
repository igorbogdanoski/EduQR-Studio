import QRCode from 'qrcode';
import JSZip from 'jszip';
import { EducationalQRCode } from '../types';
import { renderQRCodeToBlob } from './zipExportService';

/**
 * Рендерира чист SVG стринг за даден едукативен QR код
 */
export const renderQRCodeToSvg = async (item: EducationalQRCode): Promise<string> => {
  const fgColor = item.style?.fgColor || '#1e1b4b';
  const bgColor = item.style?.bgColor || '#ffffff';
  const ecc = item.style?.errorCorrectionLevel || 'H';
  const margin = item.style?.margin ?? 2;
  const targetUrl = item.targetUrl || `https://eduqr.app/?task=${item.shortCode}`;

  const svgString = await QRCode.toString(targetUrl, {
    type: 'svg',
    margin: margin,
    color: {
      dark: fgColor,
      light: bgColor
    },
    errorCorrectionLevel: ecc,
    width: 1024
  });

  return svgString;
};

/**
 * Преземање на единствен PNG фајл
 */
export const downloadSinglePng = async (item: EducationalQRCode, filename?: string): Promise<void> => {
  const blob = await renderQRCodeToBlob(item);
  const safeTitle = (item.title || 'qr_code')
    .toLowerCase()
    .replace(/[^a-z0-9а-шђјљњќчџ]/gi, '_')
    .substring(0, 30);
  const name = filename || `${item.shortCode || 'code'}_${safeTitle}.png`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Преземање на единствен SVG фајл
 */
export const downloadSingleSvg = async (item: EducationalQRCode, filename?: string): Promise<void> => {
  const svgString = await renderQRCodeToSvg(item);
  const safeTitle = (item.title || 'qr_code')
    .toLowerCase()
    .replace(/[^a-z0-9а-шђјљњќчџ]/gi, '_')
    .substring(0, 30);
  const name = filename || `${item.shortCode || 'code'}_${safeTitle}.svg`;

  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Копирање на PNG слика во Clipboard (за директно Ctrl+V во PowerPoint / Google Slides)
 */
export const copyPngToClipboard = async (item: EducationalQRCode): Promise<boolean> => {
  try {
    const blob = await renderQRCodeToBlob(item);
    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to copy PNG to clipboard', err);
    return false;
  }
};

/**
 * Копирање на SVG код во Clipboard
 */
export const copySvgToClipboard = async (item: EducationalQRCode): Promise<boolean> => {
  try {
    const svgString = await renderQRCodeToSvg(item);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(svgString);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to copy SVG to clipboard', err);
    return false;
  }
};

/**
 * Пакетен извоз на SVG фајлови во ZIP архива
 */
export const exportQRCodesToSvgZip = async (
  selectedCodes: EducationalQRCode[],
  zipFilename = 'EduQR_Export_SVGs.zip',
  onProgress?: (completed: number, total: number) => void
): Promise<void> => {
  if (!selectedCodes || selectedCodes.length === 0) return;

  const zip = new JSZip();
  const folder = zip.folder('EduQR_SVG_Vectors');

  if (!folder) {
    throw new Error('Failed to create folder in ZIP');
  }

  for (let i = 0; i < selectedCodes.length; i++) {
    const code = selectedCodes[i];
    try {
      const svgString = await renderQRCodeToSvg(code);
      const sanitizedTitle = (code.title || 'QR_Code')
        .toLowerCase()
        .replace(/[^a-z0-9а-шђјљњќчџ]/gi, '_')
        .substring(0, 30);
      const fileName = `${code.shortCode || 'code'}_${sanitizedTitle}.svg`;

      folder.file(fileName, svgString);

      if (onProgress) {
        onProgress(i + 1, selectedCodes.length);
      }
    } catch (err) {
      console.error(`Failed to generate SVG for ${code.id}`, err);
    }
  }

  // README со упатство за PowerPoint & Google Slides
  const readmeContent = `ЕдуQR Студио - Векторски SVG извоз за презентации (PowerPoint / Google Slides)
Датум на генерирање: ${new Date().toLocaleString('mk-MK')}
Вкупно кодови: ${selectedCodes.length}

Како да ги користите овие SVG датотеки:
1. Во Microsoft PowerPoint (2019 / 365):
   Одете на Insert -> Pictures -> This Device и изберете го соодветниот .svg фајл.
   Векторската слика нема да губи острина при каква било големина на проектор или табла!
2. Во Google Slides / Презентации:
   Вметнете ја сликата или повлечете ја (Drag & Drop) директно на слајдот.
3. Во Canva / Illustrator / Word:
   Целосна поддршка за векторска острина.
`;

  zip.file('README_Упатство_Презентации.txt', readmeContent);

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = zipFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
};
