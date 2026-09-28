import pptxgen from 'pptxgenjs';
import { jsPDF } from 'jspdf';
import { PresentationDeck } from '../types/presentation';

// Export to Microsoft PowerPoint (.pptx)
export async function exportToPptx(deck: PresentationDeck): Promise<void> {
  const pptx = new pptxgen();
  pptx.layout = deck.aspectRatio === '4:3' ? 'LAYOUT_4x3' : 'LAYOUT_16x9';
  pptx.title = deck.title;
  pptx.author = deck.author || 'DeckCraft AI';

  const themeBgHex = (deck.theme.bgHex || '#0f172a').replace('#', '');
  const titleHex = (deck.theme.titleHex || '#ffffff').replace('#', '');
  const textHex = (deck.theme.textHex || '#cbd5e1').replace('#', '');
  const accentHex = (deck.theme.accentHex || '#6366f1').replace('#', '');
  const cardBgHex = (deck.theme.cardBgHex || '#1e293b').replace('#', '');
  const mutedHex = (deck.theme.mutedHex || '#64748b').replace('#', '');

  deck.slides.forEach((slide) => {
    const s = pptx.addSlide();
    s.background = { color: themeBgHex };

    // Slide Header Title
    s.addText(slide.title, {
      x: 0.8,
      y: 0.6,
      w: '85%',
      h: 0.8,
      fontSize: slide.layout === 'title-slide' ? 36 : 26,
      bold: true,
      color: titleHex,
      fontFace: 'Arial',
    });

    // Subtitle
    if (slide.subtitle) {
      s.addText(slide.subtitle, {
        x: 0.8,
        y: slide.layout === 'title-slide' ? 1.5 : 1.3,
        w: '85%',
        h: 0.6,
        fontSize: slide.layout === 'title-slide' ? 18 : 14,
        color: accentHex,
        fontFace: 'Arial',
      });
    }

    // Content mapping
    if (slide.content.bullets && slide.content.bullets.length > 0) {
      const items = slide.content.bullets.map((b) => ({
        text: b,
        options: { fontSize: 14, color: textHex, lineSpacing: 24 },
      }));
      s.addText(items as any, {
        x: 0.8,
        y: 2.1,
        w: '85%',
        h: 4.2,
        bullet: true,
      });
    } else if (slide.content.columns && slide.content.columns.length > 0) {
      const totalCols = slide.content.columns.length;
      const colWidth = 8.5 / totalCols;

      slide.content.columns.forEach((col, idx) => {
        const xPos = 0.8 + idx * colWidth;

        // Card container box shape
        s.addShape(pptx.ShapeType.rect, {
          x: xPos,
          y: 2.1,
          w: colWidth - 0.3,
          h: 4.2,
          fill: { color: cardBgHex },
          line: { color: mutedHex, width: 1 },
        });

        // Column title
        s.addText(col.title, {
          x: xPos + 0.2,
          y: 2.3,
          w: colWidth - 0.7,
          h: 0.5,
          fontSize: 16,
          bold: true,
          color: titleHex,
        });

        // Column items
        const colBullets = col.items.map((item) => ({
          text: item,
          options: { fontSize: 12, color: textHex },
        }));
        s.addText(colBullets as any, {
          x: xPos + 0.2,
          y: 2.9,
          w: colWidth - 0.7,
          h: 3.2,
          bullet: true,
        });
      });
    } else if (slide.content.metrics && slide.content.metrics.length > 0) {
      const totalMetrics = slide.content.metrics.length;
      const mWidth = 8.5 / totalMetrics;

      slide.content.metrics.forEach((m, idx) => {
        const xPos = 0.8 + idx * mWidth;

        s.addShape(pptx.ShapeType.roundRect, {
          x: xPos,
          y: 2.2,
          w: mWidth - 0.3,
          h: 3.8,
          fill: { color: cardBgHex },
          line: { color: accentHex, width: 1.5 },
          rectRadius: 0.1,
        });

        s.addText(m.value, {
          x: xPos + 0.2,
          y: 2.5,
          w: mWidth - 0.7,
          h: 0.9,
          fontSize: 32,
          bold: true,
          color: accentHex,
        });

        s.addText(m.label, {
          x: xPos + 0.2,
          y: 3.5,
          w: mWidth - 0.7,
          h: 0.5,
          fontSize: 14,
          bold: true,
          color: titleHex,
        });

        if (m.description) {
          s.addText(m.description, {
            x: xPos + 0.2,
            y: 4.1,
            w: mWidth - 0.7,
            h: 1.2,
            fontSize: 11,
            color: mutedHex,
          });
        }
      });
    } else if (slide.content.quote) {
      s.addText(`"${slide.content.quote.text}"`, {
        x: 1.0,
        y: 2.2,
        w: '80%',
        h: 2.5,
        fontSize: 20,
        italic: true,
        color: titleHex,
      });

      s.addText(`— ${slide.content.quote.author} (${slide.content.quote.role || ''})`, {
        x: 1.0,
        y: 4.8,
        w: '80%',
        h: 0.5,
        fontSize: 14,
        bold: true,
        color: accentHex,
      });
    } else if (slide.content.bodyParagraphs) {
      s.addText(slide.content.bodyParagraphs.join('\n\n'), {
        x: 0.8,
        y: 2.1,
        w: '85%',
        h: 4.2,
        fontSize: 14,
        color: textHex,
      });
    }

    // Callout box if present
    if (slide.content.calloutBox) {
      s.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: 5.6,
        w: '85%',
        h: 0.8,
        fill: { color: cardBgHex },
        line: { color: accentHex, width: 1 },
      });
      s.addText(`${slide.content.calloutBox.title}: ${slide.content.calloutBox.text}`, {
        x: 1.0,
        y: 5.75,
        w: '80%',
        h: 0.5,
        fontSize: 12,
        color: titleHex,
      });
    }

    // Speaker Notes
    if (slide.speakerNotes) {
      s.addNotes(slide.speakerNotes);
    }
  });

  const sanitizedTitle = deck.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  await pptx.writeFile({ fileName: `${sanitizedTitle || 'presentation'}.pptx` });
}

// Export to Vector PDF document
export function exportToPdf(deck: PresentationDeck): void {
  const isWidescreen = deck.aspectRatio === '16:9';
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: isWidescreen ? [960, 540] : [800, 600],
  });

  const pageWidth = isWidescreen ? 960 : 800;
  const pageHeight = isWidescreen ? 540 : 600;

  deck.slides.forEach((slide, index) => {
    if (index > 0) pdf.addPage();

    // Background
    pdf.setFillColor(deck.theme.bgHex || '#0f172a');
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Title
    pdf.setTextColor(deck.theme.titleHex || '#ffffff');
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text(slide.title, 50, 70, { maxWidth: pageWidth - 100 });

    // Subtitle
    if (slide.subtitle) {
      pdf.setTextColor(deck.theme.accentHex || '#6366f1');
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text(slide.subtitle, 50, 105, { maxWidth: pageWidth - 100 });
    }

    // Divider
    pdf.setDrawColor(deck.theme.cardBorderHex || '#334155');
    pdf.setLineWidth(1);
    pdf.line(50, 120, pageWidth - 50, 120);

    // Body content
    pdf.setTextColor(deck.theme.textHex || '#cbd5e1');
    pdf.setFontSize(14);

    let currentY = 150;

    if (slide.content.bullets && slide.content.bullets.length > 0) {
      slide.content.bullets.forEach((bullet) => {
        pdf.text(`• ${bullet}`, 60, currentY, { maxWidth: pageWidth - 120 });
        currentY += 32;
      });
    } else if (slide.content.columns && slide.content.columns.length > 0) {
      const colWidth = (pageWidth - 120) / slide.content.columns.length;
      slide.content.columns.forEach((col, cIdx) => {
        const xPos = 60 + cIdx * colWidth;
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(deck.theme.titleHex || '#ffffff');
        pdf.text(col.title, xPos, 160);

        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(deck.theme.textHex || '#cbd5e1');
        pdf.setFontSize(12);

        let itemY = 190;
        col.items.forEach((item) => {
          pdf.text(`- ${item}`, xPos, itemY, { maxWidth: colWidth - 20 });
          itemY += 24;
        });
      });
    } else if (slide.content.metrics && slide.content.metrics.length > 0) {
      const mWidth = (pageWidth - 120) / slide.content.metrics.length;
      slide.content.metrics.forEach((m, mIdx) => {
        const xPos = 60 + mIdx * mWidth;

        pdf.setFontSize(36);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(deck.theme.accentHex || '#6366f1');
        pdf.text(m.value, xPos, 210);

        pdf.setFontSize(14);
        pdf.setTextColor(deck.theme.titleHex || '#ffffff');
        pdf.text(m.label, xPos, 245);

        if (m.description) {
          pdf.setFontSize(11);
          pdf.setTextColor(deck.theme.mutedHex || '#64748b');
          pdf.setFont('helvetica', 'normal');
          pdf.text(m.description, xPos, 270, { maxWidth: mWidth - 20 });
        }
      });
    } else if (slide.content.quote) {
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(deck.theme.titleHex || '#ffffff');
      pdf.text(`"${slide.content.quote.text}"`, 60, 200, { maxWidth: pageWidth - 120 });

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(deck.theme.accentHex || '#6366f1');
      pdf.text(`— ${slide.content.quote.author} ${slide.content.quote.role ? `(${slide.content.quote.role})` : ''}`, 60, 280);
    } else if (slide.content.bodyParagraphs) {
      slide.content.bodyParagraphs.forEach((para) => {
        pdf.text(para, 60, currentY, { maxWidth: pageWidth - 120 });
        currentY += 40;
      });
    }

    // Page Number Footer
    pdf.setFontSize(10);
    pdf.setTextColor(deck.theme.mutedHex || '#64748b');
    pdf.text(`${deck.title} | Slide ${index + 1} of ${deck.slides.length}`, pageWidth - 50, pageHeight - 20, { align: 'right' });
  });

  const sanitizedTitle = deck.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  pdf.save(`${sanitizedTitle || 'presentation'}.pdf`);
}

// Download Deck as raw JSON configuration
export function exportToJson(deck: PresentationDeck): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(deck, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const sanitizedTitle = deck.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  downloadAnchor.setAttribute('download', `${sanitizedTitle || 'deck'}-deckcraft.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
