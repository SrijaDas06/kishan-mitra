document.addEventListener("DOMContentLoaded", () => {
    let selectedFiles = [];
  
    document.getElementById("pdfInput").addEventListener("change", (event) => {
      selectedFiles = event.target.files;
    });
  
    document.getElementById("convertBtn").addEventListener("click", async () => {
      if (selectedFiles.length < 2) {
        alert("Please select at least two PDF files to merge.");
        return;
      }
  
      const mergedPdf = await PDFLib.PDFDocument.create();
  
      for (const file of selectedFiles) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
  
      const mergedPdfFile = await mergedPdf.save();
  
      // Download the merged PDF
      const blob = new Blob([mergedPdfFile], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  });
  