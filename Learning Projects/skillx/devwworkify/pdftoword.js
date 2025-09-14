// document.getElementById("convertBtn").addEventListener("click", async function () {
//     const fileInput = document.getElementById("pdfInput");
//     if (!fileInput.files.length) {
//         alert("Please select a PDF file first!");
//         return;
//     }
    
//     const file = fileInput.files[0];
//     const fileReader = new FileReader();
//     fileReader.readAsArrayBuffer(file);

//     fileReader.onload = async function (){
//         const pdfData = new Uint8Array(fileReader.result);
//         const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
//         const numPages = pdf.numPages;

//         // Create a new Word document
//         const { Document, Packer, Paragraph } = docx;
//         const doc = new Document({
//             sections: [{ properties: {}, children: [] }]
//         });

//         for (let i = 1; i <= numPages; i++) {
//             const page = await pdf.getPage(i);
//             const textContent = await page.getTextContent();
//             const pageText = textContent.items.map(item => item.str).join(" ");

//             // Add text to the Word document
//             doc.sections[0].children.push(new Paragraph({ text: `Page ${i}`, bold: true }));
//             doc.sections[0].children.push(new Paragraph(pageText));

//             if (i < numPages) {
//                 doc.sections[0].children.push(new Paragraph("\n---\n"));
//             }
//         }

//         // Generate the DOCX file
//         Packer.toBlob(doc).then(blob => {
//             const a = document.createElement("a");
//             a.href = URL.createObjectURL(blob);
//             a.download = "converted.docx";
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//         });
//     };
// });


document.getElementById("convertBtn").addEventListener("click", async function () {
    const pdfInput = document.getElementById("pdfInput").files[0];

    if (!pdfInput) {
        alert("Please select a PDF file first.");
        return;
    }

    const reader = new FileReader();
    reader.onload = async function () {
        const typedarray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            console.log(`Processing page ${i}...`);
            const page = await pdf.getPage(i);
            const text = await extractTextFromPage(page);

            if (text.trim()) {
                extractedText += `Page ${i}:\n${text}\n\n`;
            } else {
                console.warn(`No text found on page ${i}, trying OCR...`);
                const ocrText = await extractTextUsingOCR(page);
                extractedText += `Page ${i} (OCR):\n${ocrText}\n\n`;
            }
        }

        if (!extractedText.trim()) {
            alert("No extractable text found in the PDF.");
            return;
        }

        generateWordDoc(extractedText);
    };

    reader.readAsArrayBuffer(pdfInput);
});

// ✅ Extracts text from a page using pdf.js
async function extractTextFromPage(page) {
    try {
        const textContent = await page.getTextContent();
        return textContent.items.map(item => item.str).join(" ");
    } catch (error) {
        console.error("Error extracting text:", error);
        return "";
    }
}

// ✅ Extracts text from images using Tesseract.js (OCR)
async function extractTextUsingOCR(page) {
    try {
        const scale = 2;  // Increases image quality
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = { canvasContext: context, viewport };
        await page.render(renderContext).promise;

        // Use Tesseract.js to recognize text
        const { data: { text } } = await Tesseract.recognize(canvas, 'eng', { logger: m => console.log(m) });
        return text;
    } catch (error) {
        console.error("OCR Error:", error);
        return "";
    }
}

// ✅ Generates Word document using docx.js
function generateWordDoc(text) {
    try {
        const doc = new docx.Document({
            sections: [{
                children: [
                    new docx.Paragraph({ children: [new docx.TextRun(text)] })
                ]
            }]
        });

        docx.Packer.toBlob(doc).then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "converted.docx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(error => {
            console.error("Error generating Word document:", error);
            alert("Failed to generate the Word document.");
        });
    } catch (error) {
        console.error("Error in Word generation:", error);
    }
}
