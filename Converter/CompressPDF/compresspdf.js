document.addEventListener("DOMContentLoaded", () => {
    let selectedFile = null;
  
    document.getElementById("pdfInput").addEventListener("change", (event) => {
      selectedFile = event.target.files[0];
    });
  
    document.getElementById("convertBtn").addEventListener("click", async () => {
      if (!selectedFile) {
        alert("Please select a PDF file to compress.");
        return;
      }
  
      const originalPdfBytes = await selectedFile.arrayBuffer();
      const originalPdf = await PDFLib.PDFDocument.load(originalPdfBytes);
  
      // Create a new compressed PDF
      const compressedPdf = await PDFLib.PDFDocument.create();
      const copiedPages = await compressedPdf.copyPages(originalPdf, originalPdf.getPageIndices());
  
      for (const page of copiedPages) {
        compressedPdf.addPage(page);
      }
  
      // Remove metadata
      compressedPdf.setTitle('');
      compressedPdf.setAuthor('');
      compressedPdf.setProducer('');
      compressedPdf.setCreator('');
      compressedPdf.setSubject('');
  
      const compressedBytes = await compressedPdf.save();
  
      const blob = new Blob([compressedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed.pdf";
      a.click();
    });
  });
  