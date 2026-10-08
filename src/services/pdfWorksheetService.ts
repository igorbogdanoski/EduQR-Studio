import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { EducationalQRCode } from '../types';

export type PrintLayoutOption = '1x1' | '2x2' | '3x3' | '4x4' | 'worksheet';
export type PrintColorMode = 'color' | 'grayscale';

export interface PDFGeneratorOptions {
  schoolName: string;
  teacherName: string;
  subjectTitle: string;
  instructions?: string;
  layout: PrintLayoutOption;
  date?: string;
  colorMode?: PrintColorMode;
  onProgress?: (current: number, total: number) => void;
}

const CYRILLIC_TO_LATIN_MAP: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ѓ': 'gj', 'е': 'e', 'ж': 'zh',
  'з': 'z', 'ѕ': 'dz', 'и': 'i', 'ј': 'j', 'к': 'k', 'л': 'l', 'љ': 'lj', 'м': 'm',
  'н': 'n', 'њ': 'nj', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'ќ': 'kj',
  'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'џ': 'dzh', 'ш': 'sh',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Ѓ': 'Gj', 'Е': 'E', 'Ж': 'Zh',
  'З': 'Z', 'Ѕ': 'Dz', 'И': 'I', 'Ј': 'J', 'К': 'K', 'Л': 'L', 'Љ': 'Lj', 'М': 'M',
  'Н': 'N', 'Њ': 'Nj', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'Ќ': 'Kj',
  'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch', 'Џ': 'Dzh', 'Ш': 'Sh',
  '„': '"', '“': '"', '”': '"', '’': "'", '—': '-', '–': '-'
};

export const toSafePdfText = (text: string): string => {
  if (!text) return '';
  return text.split('').map(char => CYRILLIC_TO_LATIN_MAP[char] ?? char).join('');
};

/**
 * Генерира висококвалитетен DataURL за QR код погоден за вметнување во jsPDF
 * Поддржува 'grayscale' за максимална заштеда на мастило/тонер
 */
const getQRDataUrl = async (item: EducationalQRCode, colorMode: PrintColorMode = 'color'): Promise<string> => {
  const isGrayscale = colorMode === 'grayscale';
  const fgColor = isGrayscale ? '#000000' : (item.style?.fgColor || '#1e1b4b');
  const bgColor = '#ffffff';
  const ecc = item.style?.errorCorrectionLevel || 'H';
  const targetUrl = item.targetUrl || `https://eduqr.app/?task=${item.shortCode}`;

  return await QRCode.toDataURL(targetUrl, {
    width: 600,
    margin: item.style?.margin ?? 2,
    color: {
      dark: fgColor,
      light: bgColor,
    },
    errorCorrectionLevel: ecc,
  });
};

export const generateDirectPDF = async (
  items: EducationalQRCode[],
  options: PDFGeneratorOptions
): Promise<void> => {
  if (!items || items.length === 0) return;

  const {
    schoolName,
    teacherName,
    subjectTitle,
    instructions = '',
    layout,
    date = new Date().toLocaleDateString('mk-MK'),
    onProgress,
  } = options;

  // Креирање на A4 документ (210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 12;

  const isGrayscale = options.colorMode === 'grayscale';

  // Преземи DataURL за сите избрани QR кодови
  const qrImages: string[] = [];
  for (let i = 0; i < items.length; i++) {
    const dataUrl = await getQRDataUrl(items[i], options.colorMode);
    qrImages.push(dataUrl);
    if (onProgress) {
      onProgress(i + 1, items.length);
    }
  }

  // Помошна функција за цртање на заглавие на работниот лист
  const drawPageHeader = (compact = false, showInstr = true) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(compact ? 9 : 10);
    doc.setTextColor(50, 50, 50);

    const safeSchool = toSafePdfText(schoolName).toUpperCase();
    const safeTitle = toSafePdfText(subjectTitle).toUpperCase();
    const safeTeacher = toSafePdfText(teacherName);

    doc.text(safeSchool, margin, margin + 2);
    doc.text(`Datum: ${date}`, pageWidth - margin, margin + 2, { align: 'right' });

    doc.setFontSize(compact ? 12 : 15);
    doc.setTextColor(20, 20, isGrayscale ? 20 : 50);
    doc.text(safeTitle, pageWidth / 2, margin + 9, { align: 'center' });

    doc.setFontSize(compact ? 8 : 8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Nastavnik: ${safeTeacher}`, margin, margin + 15);
    doc.text('Ucenik: ____________________________  Klas: _____', pageWidth - margin, margin + 15, { align: 'right' });

    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.line(margin, margin + 17, pageWidth - margin, margin + 17);

    // Доколку има кратки инструкции за учениците
    if (showInstr && instructions.trim()) {
      const instrY = margin + 19;
      const boxHeight = compact ? 8 : 10;
      doc.setFillColor(isGrayscale ? 250 : 248, isGrayscale ? 250 : 250, isGrayscale ? 250 : 252);
      doc.setDrawColor(isGrayscale ? 160 : 226, isGrayscale ? 160 : 232, isGrayscale ? 160 : 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, instrY, pageWidth - margin * 2, boxHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(compact ? 6.5 : 7.5);
      doc.setTextColor(isGrayscale ? 30 : 79, isGrayscale ? 30 : 70, isGrayscale ? 30 : 229);
      doc.text('UPATSTVO:', margin + 2.5, instrY + (compact ? 5 : 6.5));

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(compact ? 6.5 : 7.5);
      doc.setTextColor(51, 65, 85);
      const safeInstr = toSafePdfText(instructions.trim());
      const wrapped = doc.splitTextToSize(safeInstr, pageWidth - margin * 2 - 25);
      doc.text(wrapped, margin + 18, instrY + (compact ? 5 : 6.5));
    }
  };

  // Помошна функција за цртање на футер
  const drawPageFooter = (pageIdx: number, totalPages: number) => {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(140, 140, 140);
    doc.text(
      'EduQR Studio • Platforma za osnovno & sredno obrazovanie • Interaktivni QR stacionarni listovi',
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  };

  const hasInstr = instructions.trim().length > 0;

  if (layout === '1x1') {
    // 1x1: Една голема станица по А4 страница
    for (let i = 0; i < items.length; i++) {
      if (i > 0) doc.addPage();
      const item = items[i];
      const qrDataUrl = qrImages[i];

      drawPageHeader(false, i === 0);

      const startY = (i === 0 && hasInstr) ? margin + 32 : margin + 22;

      // Рамка на станицата
      doc.setDrawColor(isGrayscale ? 120 : 79, isGrayscale ? 120 : 70, isGrayscale ? 120 : 229);
      doc.setLineWidth(0.8);
      doc.roundedRect(margin, startY, pageWidth - margin * 2, pageHeight - startY - 14, 4, 4);

      // Заглавие на станицата
      doc.setFillColor(isGrayscale ? 245 : 243, isGrayscale ? 245 : 244, isGrayscale ? 245 : 246);
      doc.roundedRect(margin + 2, startY + 2, pageWidth - margin * 2 - 4, 15, 3, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(30, 27, 75);
      const safeTitle = toSafePdfText(item.title).substring(0, 48);
      doc.text(`STANICA #${i + 1}: ${safeTitle}`, margin + 6, startY + 11);

      // QR Код
      const qrSize = 72;
      const qrX = pageWidth / 2 - qrSize / 2;
      const qrY = startY + 22;
      doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

      // Код ознака
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(isGrayscale ? 40 : 79, isGrayscale ? 40 : 70, isGrayscale ? 40 : 229);
      doc.text(`KOD: edu://${item.shortCode}`, pageWidth / 2, qrY + qrSize + 6, { align: 'center' });

      // Поставка на задачата
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text('Postavka na zadacata:', margin + 8, qrY + qrSize + 15);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      const rawContent = item.latexContent || item.description || '';
      const cleanContent = toSafePdfText(
        rawContent.replace(/\$\$/g, '').replace(/\$/g, '').substring(0, 300)
      );
      doc.text(doc.splitTextToSize(cleanContent, pageWidth - margin * 2 - 16), margin + 8, qrY + qrSize + 21);

      // Простор за рачна работа
      const boxY = qrY + qrSize + 36;
      const boxHeight = pageHeight - boxY - 20;
      if (boxHeight > 25) {
        doc.setLineDashPattern([2, 2], 0);
        doc.setDrawColor(160, 160, 160);
        doc.roundedRect(margin + 8, boxY, pageWidth - margin * 2 - 16, boxHeight, 3, 3);
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text('Prostor za postapka i resenie na ucenikot:', margin + 12, boxY + 6);
        doc.setLineDashPattern([], 0); // reset dash
      }

      drawPageFooter(i + 1, items.length);
    }
  } else if (layout === '2x2') {
    // 2x2: 4 станици по А4 страница
    const itemsPerPage = 4;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) doc.addPage();
      drawPageHeader(true, page === 0);

      const pageItems = items.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
      const startY = (page === 0 && hasInstr) ? margin + 30 : margin + 22;
      const cardWidth = (pageWidth - margin * 2 - 6) / 2;
      const cardHeight = (pageHeight - startY - 14) / 2;

      for (let idx = 0; idx < pageItems.length; idx++) {
        const item = pageItems[idx];
        const globalIdx = page * itemsPerPage + idx;
        const col = idx % 2;
        const row = Math.floor(idx / 2);

        const cardX = margin + col * (cardWidth + 6);
        const cardY = startY + row * (cardHeight + 6);

        // Линии со точки за сечење со ножици
        doc.setLineDashPattern([2, 2], 0);
        doc.setDrawColor(160, 160, 160);
        doc.setLineWidth(0.4);
        doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3);
        doc.setLineDashPattern([], 0);

        // Заглавие на картичката
        doc.setFillColor(243, 244, 246);
        doc.roundedRect(cardX + 1, cardY + 1, cardWidth - 2, 9, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 27, 75);
        const safeTitle = toSafePdfText(item.title).substring(0, 28);
        doc.text(`STANICA #${globalIdx + 1}: ${safeTitle}`, cardX + 3, cardY + 7);

        // QR код
        const qrSize = 40;
        const qrX = cardX + cardWidth / 2 - qrSize / 2;
        const qrY = cardY + 12;
        doc.addImage(qrImages[globalIdx], 'PNG', qrX, qrY, qrSize, qrSize);

        // Код
        doc.setFontSize(8);
        doc.setTextColor(isGrayscale ? 40 : 79, isGrayscale ? 40 : 70, isGrayscale ? 40 : 229);
        doc.text(`edu://${item.shortCode}`, cardX + cardWidth / 2, qrY + qrSize + 4, { align: 'center' });

        // Опис
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        const rawContent = item.latexContent || item.description || '';
        const cleanContent = toSafePdfText(
          rawContent.replace(/\$\$/g, '').replace(/\$/g, '').substring(0, 140)
        );
        doc.text(doc.splitTextToSize(cleanContent, cardWidth - 6), cardX + 3, qrY + qrSize + 9);

        // Рамка за одговор
        const ansY = qrY + qrSize + 22;
        const ansHeight = cardY + cardHeight - ansY - 3;
        if (ansHeight > 10) {
          doc.setLineDashPattern([1.5, 1.5], 0);
          doc.setDrawColor(200, 200, 200);
          doc.roundedRect(cardX + 3, ansY, cardWidth - 6, ansHeight, 2, 2);
          doc.setFontSize(6.5);
          doc.setTextColor(140, 140, 140);
          doc.text('Resenie / Odgovor:', cardX + 5, ansY + 4);
          doc.setLineDashPattern([], 0);
        }
      }

      drawPageFooter(page + 1, totalPages);
    }
  } else if (layout === '3x3') {
    // 3x3: 9 картички по А4 страница
    const itemsPerPage = 9;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) doc.addPage();
      drawPageHeader(true, page === 0);

      const pageItems = items.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
      const startY = (page === 0 && hasInstr) ? margin + 28 : margin + 20;
      const cardWidth = (pageWidth - margin * 2 - 8) / 3;
      const cardHeight = (pageHeight - startY - 14) / 3;

      for (let idx = 0; idx < pageItems.length; idx++) {
        const item = pageItems[idx];
        const globalIdx = page * itemsPerPage + idx;
        const col = idx % 3;
        const row = Math.floor(idx / 3);

        const cardX = margin + col * (cardWidth + 4);
        const cardY = startY + row * (cardHeight + 4);

        doc.setLineDashPattern([1.5, 1.5], 0);
        doc.setDrawColor(160, 160, 160);
        doc.setLineWidth(0.3);
        doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 2, 2);
        doc.setLineDashPattern([], 0);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(30, 27, 75);
        const safeTitle = toSafePdfText(item.title).substring(0, 22);
        doc.text(`#${globalIdx + 1} ${safeTitle}`, cardX + 2, cardY + 5);

        const qrSize = 32;
        const qrX = cardX + cardWidth / 2 - qrSize / 2;
        const qrY = cardY + 7;
        doc.addImage(qrImages[globalIdx], 'PNG', qrX, qrY, qrSize, qrSize);

        doc.setFontSize(7);
        doc.setTextColor(isGrayscale ? 40 : 79, isGrayscale ? 40 : 70, isGrayscale ? 40 : 229);
        doc.text(`edu://${item.shortCode}`, cardX + cardWidth / 2, qrY + qrSize + 4, { align: 'center' });

        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        const rawContent = item.latexContent || item.description || '';
        const cleanContent = toSafePdfText(
          rawContent.replace(/\$\$/g, '').replace(/\$/g, '').substring(0, 90)
        );
        doc.text(doc.splitTextToSize(cleanContent, cardWidth - 4), cardX + 2, qrY + qrSize + 9);
      }

      drawPageFooter(page + 1, totalPages);
    }
  } else if (layout === '4x4') {
    // 4x4: 16 компактни налепници / мини картички по А4 страница
    const itemsPerPage = 16;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) doc.addPage();
      drawPageHeader(true, page === 0);

      const pageItems = items.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
      const startY = (page === 0 && hasInstr) ? margin + 28 : margin + 20;
      const cardWidth = (pageWidth - margin * 2 - 9) / 4;
      const cardHeight = (pageHeight - startY - 14) / 4;

      for (let idx = 0; idx < pageItems.length; idx++) {
        const item = pageItems[idx];
        const globalIdx = page * itemsPerPage + idx;
        const col = idx % 4;
        const row = Math.floor(idx / 4);

        const cardX = margin + col * (cardWidth + 3);
        const cardY = startY + row * (cardHeight + 3);

        // Граница за сечење
        doc.setLineDashPattern([1, 1], 0);
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.3);
        doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 2, 2);
        doc.setLineDashPattern([], 0);

        // Бројка и предмет
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(30, 27, 75);
        doc.text(`#${globalIdx + 1} ${item.shortCode}`, cardX + 2, cardY + 4);

        // QR код
        const qrSize = 27;
        const qrX = cardX + cardWidth / 2 - qrSize / 2;
        const qrY = cardY + 6;
        doc.addImage(qrImages[globalIdx], 'PNG', qrX, qrY, qrSize, qrSize);

        // Наслов
        doc.setFontSize(6);
        doc.setTextColor(40, 40, 40);
        const safeTitle = toSafePdfText(item.title);
        doc.text(doc.splitTextToSize(safeTitle, cardWidth - 3), cardX + cardWidth / 2, qrY + qrSize + 4, {
          align: 'center',
        });
      }

      drawPageFooter(page + 1, totalPages);
    }
  } else {
    // 'worksheet': Класичен редослед на работен лист
    const itemsPerPage = 3;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) doc.addPage();
      drawPageHeader(false, page === 0);

      const pageItems = items.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
      const startY = (page === 0 && hasInstr) ? margin + 32 : margin + 22;
      const itemHeight = (pageHeight - startY - 16) / itemsPerPage;

      for (let idx = 0; idx < pageItems.length; idx++) {
        const item = pageItems[idx];
        const globalIdx = page * itemsPerPage + idx;
        const currentY = startY + idx * itemHeight;

        // Рамка за задачата
        doc.setDrawColor(210, 210, 210);
        doc.setLineWidth(0.4);
        doc.roundedRect(margin, currentY, pageWidth - margin * 2, itemHeight - 4, 3, 3);

        // QR код лево
        const qrSize = 36;
        const qrX = margin + 4;
        const qrY = currentY + 4;
        doc.addImage(qrImages[globalIdx], 'PNG', qrX, qrY, qrSize, qrSize);

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(isGrayscale ? 40 : 79, isGrayscale ? 40 : 70, isGrayscale ? 40 : 229);
        doc.text(`edu://${item.shortCode}`, qrX + qrSize / 2, qrY + qrSize + 4, { align: 'center' });

        // Содржина десно
        const textX = qrX + qrSize + 6;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(20, 20, 50);
        const safeTitle = toSafePdfText(item.title);
        doc.text(`ZADACA #${globalIdx + 1}: ${safeTitle}`, textX, currentY + 7);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(60, 60, 60);
        const rawContent = item.latexContent || item.description || '';
        const cleanContent = toSafePdfText(
          rawContent.replace(/\$\$/g, '').replace(/\$/g, '').substring(0, 220)
        );
        doc.text(doc.splitTextToSize(cleanContent, pageWidth - margin - textX - 4), textX, currentY + 13);

        // Рамка за одговор
        const ansY = currentY + 26;
        const ansH = itemHeight - 34;
        if (ansH > 10) {
          doc.setLineDashPattern([1.5, 1.5], 0);
          doc.setDrawColor(190, 190, 190);
          doc.roundedRect(textX, ansY, pageWidth - margin - textX - 4, ansH, 2, 2);
          doc.setFontSize(7);
          doc.setTextColor(130, 130, 130);
          doc.text('Prostor za resenie na ucenikot:', textX + 3, ansY + 4);
          doc.setLineDashPattern([], 0);
        }
      }

      drawPageFooter(page + 1, totalPages);
    }
  }

  // Зачувување на датотеката
  const safeFilenameTitle = toSafePdfText(subjectTitle).replace(/[^a-z0-9]/gi, '_').substring(0, 25);
  doc.save(`EduQR_${safeFilenameTitle || 'Worksheet'}_${layout}.pdf`);
};
