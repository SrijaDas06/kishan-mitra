async function convertPdfToJpg() {
    const input = document.getElementById("pdfInput");
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = ""; 

    if (!input.files.length) {
        alert("Please select a PDF file.");
        return;
    }

    const file = input.files[0];
    const fileReader = new FileReader();

    fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        const totalPages = pdf.numPages;

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            renderPage(pdf, pageNum);
        }
    };

    fileReader.readAsArrayBuffer(file);
}

async function renderPage(pdf, pageNum) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 }); // Scale for better resolution
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = { canvasContext: ctx, viewport: viewport };
    await page.render(renderContext).promise;

    const imgData = canvas.toDataURL("image/jpeg", pageNum); 

  
    const imgElement = document.createElement("img");
    imgElement.src = imgData;
    imgElement.style.width = "100%";
    document.getElementById("output").appendChild(imgElement);

    const downloadLink = document.createElement("a");
    downloadLink.href = imgData;
    downloadLink.download = `page_${pageNum}.jpg`;
    downloadLink.innerText = `Download Page ${pageNum}`;
    document.getElementById("output").appendChild(downloadLink);
    document.getElementById("output").appendChild(document.createElement("br"));
}


async function compressImage() {
    const input = document.getElementById("imageInput");
    if (!input.files.length) {
        alert("Please select an image to compress.");
        return;
    }

    const file = input.files[0]; 

    const options = {
        maxSizeMB: 1, // Maximum file size in MB
        maxWidthOrHeight: 800, // Resize image if larger
        useWebWorker: true, // Use multi-threading for faster processing
    };

    try {
        const compressedFile = await imageCompression(file, options);
        const compressedDataUrl = await imageCompression.getDataUrlFromFile(compressedFile);
        
        displayImage(compressedDataUrl, "Compressed Image");
        downloadImage(compressedDataUrl, "compressed.jpg");

    } catch (error) {
        console.error("Compression Error:", error);
        alert("Error compressing the image.");
    }
}
async function decompressImage() {
    const input = document.getElementById("imageInput");
    if (!input.files.length) {
        alert("Please select an image to decompress.");
        return;
    }

    const file = input.files[0];

    try {
        const decompressedDataUrl = await imageCompression.getDataUrlFromFile(file);
        
        displayImage(decompressedDataUrl, "Decompressed Image");
        downloadImage(decompressedDataUrl, "decompressed.jpg");

    } catch (error) {
        console.error("Decompression Error:", error);
        alert("Error decompressing the image.");
    }
}
function displayImage(dataUrl, label) {
    const output = document.getElementById("outputSection");
    output.innerHTML = `<h3>${label}</h3> <img src="${dataUrl}" width="100%">`;
}
function downloadImage(dataUrl, filename) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
