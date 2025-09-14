document.addEventListener("DOMContentLoaded", () => {
    let selectedFile = null;
  
    document.getElementById("pdfInput").addEventListener("change", (event) => {
      selectedFile = event.target.files[0];
    });
  
    document.getElementById("convertBtn").addEventListener("click", async () => {
      if (!selectedFile) {
        alert("Please select a PDF file to split.");
        return;
      }
  
      const zip = new JSZip();
      const originalPdfBytes = await selectedFile.arrayBuffer();
      const originalPdf = await PDFLib.PDFDocument.load(originalPdfBytes);
      const totalPages = originalPdf.getPageCount();
  
      for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFLib.PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
        newPdf.addPage(copiedPage);
        const pdfBytes = await newPdf.save();
        zip.file(`page-${i + 1}.pdf`, pdfBytes);
      }
  
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(zipBlob);
      downloadLink.download = "split-pages.zip";
      downloadLink.click();
    });
  });
  