import html2pdf from 'html2pdf.js';

export const handleDownloadPdf = (elementId, fileName = 'resume') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const opt = {
    margin: 0,
    filename: `${fileName}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
};