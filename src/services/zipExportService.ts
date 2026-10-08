import JSZip from 'jszip';
import QRCode from 'qrcode';
import { EducationalQRCode } from '../types';

/**
 * Рендерира високорезолуциска PNG слика (1024x1024) за даден едукативен QR код
 */
export const renderQRCodeToBlob = async (item: EducationalQRCode): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas 2D context not supported'));
      return;
    }

    const fgColor = item.style?.fgColor || '#1e1b4b';
    const bgColor = item.style?.bgColor || '#ffffff';
    const ecc = item.style?.errorCorrectionLevel || 'H';
    const margin = item.style?.margin ?? 2;
    const iconType = item.style?.iconType || 'none';

    // 1. Позадина
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    const pattern = item.style?.pattern || 'standard';
    const targetWidth = size - 120;
    const qrCanvas = document.createElement('canvas');

    const finishDrawingAndResolve = () => {
      // Нацртај го QR кодот во центарот
      ctx.drawImage(qrCanvas, 60, 60);

      // 3. Ако е поставена централна икона/беџ (∑, ⚛, 📖, 💡, 🎓)
      if (iconType && iconType !== 'none') {
        const badgeRadius = size * 0.085;
        const centerX = size / 2;
        const centerY = size / 2;

        // Бела рамка околу беџот за подобро скенирање
        ctx.beginPath();
        ctx.arc(centerX, centerY, badgeRadius + 10, 0, 2 * Math.PI);
        ctx.fillStyle = bgColor;
        ctx.fill();

        // Обоена позадина за беџот
        ctx.beginPath();
        ctx.arc(centerX, centerY, badgeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = fgColor;
        ctx.fill();

        // Симбол
        ctx.fillStyle = bgColor;
        ctx.font = `bold ${badgeRadius * 1.1}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let symbol = '∑';
        if (iconType === 'atom') symbol = '⚛';
        if (iconType === 'book') symbol = '📖';
        if (iconType === 'lightbulb') symbol = '💡';
        if (iconType === 'school') symbol = '🎓';

        ctx.fillText(symbol, centerX, centerY);
      }

      // Претворање во Blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create Blob from canvas'));
        }
      }, 'image/png');
    };

    if (pattern === 'standard') {
      QRCode.toCanvas(
        qrCanvas,
        item.targetUrl || `https://eduqr.app/?task=${item.shortCode}`,
        {
          width: targetWidth,
          margin: margin,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: ecc,
        },
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          finishDrawingAndResolve();
        }
      );
    } else {
      try {
        qrCanvas.width = targetWidth;
        qrCanvas.height = targetWidth;
        const qCtx = qrCanvas.getContext('2d');
        if (!qCtx) {
          reject(new Error('Canvas 2D context not available'));
          return;
        }

        qCtx.fillStyle = bgColor;
        qCtx.fillRect(0, 0, targetWidth, targetWidth);

        const qr = QRCode.create(item.targetUrl || `https://eduqr.app/?task=${item.shortCode}`, {
          errorCorrectionLevel: ecc,
        });
        const moduleCount = qr.modules.size;
        const totalModules = moduleCount + margin * 2;
        const modulePx = targetWidth / totalModules;

        const isFinder = (r: number, c: number) => {
          return (
            (r < 7 && c < 7) ||
            (r < 7 && c >= moduleCount - 7) ||
            (r >= moduleCount - 7 && c < 7)
          );
        };

        qCtx.fillStyle = fgColor;
        for (let r = 0; r < moduleCount; r++) {
          for (let c = 0; c < moduleCount; c++) {
            if (qr.modules.get(r, c) && !isFinder(r, c)) {
              const mx = (c + margin) * modulePx;
              const my = (r + margin) * modulePx;
              if (pattern === 'dots') {
                qCtx.beginPath();
                qCtx.arc(mx + modulePx / 2, my + modulePx / 2, modulePx * 0.43, 0, 2 * Math.PI);
                qCtx.fill();
              } else if (pattern === 'rounded') {
                qCtx.beginPath();
                if (qCtx.roundRect) {
                  qCtx.roundRect(mx + modulePx * 0.08, my + modulePx * 0.08, modulePx * 0.84, modulePx * 0.84, modulePx * 0.3);
                } else {
                  qCtx.rect(mx, my, modulePx, modulePx);
                }
                qCtx.fill();
              } else if (pattern === 'classy') {
                qCtx.beginPath();
                qCtx.moveTo(mx + modulePx / 2, my + modulePx * 0.06);
                qCtx.lineTo(mx + modulePx * 0.94, my + modulePx / 2);
                qCtx.lineTo(mx + modulePx / 2, my + modulePx * 0.94);
                qCtx.lineTo(mx + modulePx * 0.06, my + modulePx / 2);
                qCtx.closePath();
                qCtx.fill();
              } else if (pattern === 'mosaic') {
                qCtx.beginPath();
                if (qCtx.roundRect) {
                  qCtx.roundRect(mx + modulePx * 0.05, my + modulePx * 0.05, modulePx * 0.9, modulePx * 0.9, modulePx * 0.18);
                } else {
                  qCtx.rect(mx, my, modulePx, modulePx);
                }
                qCtx.fill();
              }
            }
          }
        }

        // Finder patterns:
        const finders = [
          { c: 0, r: 0 },
          { c: moduleCount - 7, r: 0 },
          { c: 0, r: moduleCount - 7 }
        ];

        finders.forEach(({ c, r }) => {
          const fx = (c + margin) * modulePx;
          const fy = (r + margin) * modulePx;
          const eyeW = 7 * modulePx;
          const rad = pattern === 'dots' || pattern === 'rounded' ? modulePx * 1.8 : pattern === 'mosaic' ? modulePx * 1.2 : 0;

          // Outer frame
          qCtx.fillStyle = fgColor;
          qCtx.beginPath();
          if (rad > 0 && qCtx.roundRect) {
            qCtx.roundRect(fx, fy, eyeW, eyeW, rad);
          } else {
            qCtx.rect(fx, fy, eyeW, eyeW);
          }
          qCtx.fill();

          // Cutout
          qCtx.fillStyle = bgColor;
          qCtx.beginPath();
          if (rad > 0 && qCtx.roundRect) {
            qCtx.roundRect(fx + modulePx, fy + modulePx, 5 * modulePx, 5 * modulePx, rad * 0.7);
          } else {
            qCtx.rect(fx + modulePx, fy + modulePx, 5 * modulePx, 5 * modulePx);
          }
          qCtx.fill();

          // Center dot
          qCtx.fillStyle = fgColor;
          qCtx.beginPath();
          if (rad > 0 && qCtx.roundRect) {
            qCtx.roundRect(fx + 2 * modulePx, fy + 2 * modulePx, 3 * modulePx, 3 * modulePx, rad * 0.5);
          } else {
            qCtx.rect(fx + 2 * modulePx, fy + 2 * modulePx, 3 * modulePx, 3 * modulePx);
          }
          qCtx.fill();
        });

        finishDrawingAndResolve();
      } catch (patternErr) {
        reject(patternErr);
      }
    }
  });
};

/**
 * Селектира повеќе QR кодови и генерира еден ZIP фајл со сите нивни PNG слики
 */
export const exportQRCodesToZip = async (
  selectedCodes: EducationalQRCode[],
  zipFilename = 'EduQR_Export_PNGs.zip',
  onProgress?: (completed: number, total: number) => void
): Promise<void> => {
  if (!selectedCodes || selectedCodes.length === 0) return;

  const zip = new JSZip();
  const folder = zip.folder('EduQR_Images');

  if (!folder) {
    throw new Error('Failed to create folder in ZIP');
  }

  for (let i = 0; i < selectedCodes.length; i++) {
    const code = selectedCodes[i];
    try {
      const blob = await renderQRCodeToBlob(code);
      
      // Човечки разбирливо име за датотеката
      const sanitizedTitle = (code.title || 'QR_Code')
        .toLowerCase()
        .replace(/[^a-z0-9а-шђјљњќчџ]/gi, '_')
        .substring(0, 30);
      const fileName = `${code.shortCode || 'code'}_${sanitizedTitle}.png`;

      folder.file(fileName, blob);

      if (onProgress) {
        onProgress(i + 1, selectedCodes.length);
      }
    } catch (err) {
      console.error(`Failed to generate PNG for ${code.id}`, err);
    }
  }

  // Создади го заглавниот текстовен фајл со информации
  const readmeContent = `ЕдуQR Студио - Пакетиран извоз на образовни QR кодови
Датум на генерирање: ${new Date().toLocaleString('mk-MK')}
Вкупно кодови: ${selectedCodes.length}

Листа на вклучени QR кодови:
${selectedCodes
  .map(
    (c, idx) =>
      `${idx + 1}. [${c.shortCode}] ${c.title} (${c.subject || 'Општо'} - ${c.targetGrade || 'Сите'})`
  )
  .join('\n')}

Упатство за печатење:
- Сите слики се во HD резолуција (1024x1024 px) и можат директно да се внесат во MS Word, PowerPoint или да се испечатат за наставни листови.
`;

  zip.file('README_EduQR_Упатство.txt', readmeContent);

  // Генерирање на крајниот ZIP
  const content = await zip.generateAsync({ type: 'blob' });

  // Автоматско преземање
  const downloadUrl = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = zipFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
};
