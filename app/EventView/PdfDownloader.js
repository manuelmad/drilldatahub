import { jsPDF } from 'jspdf';

// Using the built-in html() function of jsPDF which uses html2canvas underneath
// to convert DOM nodes into canvas and then into the PDF.
export async function downloadReportPDFFromElement(element, filename = 'reporte.pdf') {
  if (!element) {
    throw new Error('No element provided');
  }

  const doc = new jsPDF({ unit: 'px', format: 'letter' });

  // Ensure the element is in document so html2canvas can render styles/layout correctly.
  let tempContainer = null;
  if (!document.body.contains(element)) {
    tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0px';
    tempContainer.style.width = '1000px';
    tempContainer.style.height = 'auto';
    tempContainer.style.overflow = 'visible';
    tempContainer.appendChild(element);
    document.body.appendChild(tempContainer);
  }

  const opts = {
    callback: function (doc) {
      // Save after doc rendered
      doc.save(filename);
    },
    x: 20,
    y: 20,
    html2canvas: {
      scale: 0.6,
      useCORS: true,
      allowTaint: true,
    },
    autoPaging: 'text',
  };

  try {
    await doc.html(element, opts);
  } finally {
    // Clean up temp container
    if (tempContainer && tempContainer.parentNode) {
      tempContainer.parentNode.removeChild(tempContainer);
    }
  }
}
