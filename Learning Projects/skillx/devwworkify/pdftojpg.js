const dropContainer = document.getElementById("dropcontainer")
  const fileInput = document.getElementById("images")

  dropContainer.addEventListener("dragover", (e) => {
    // prevent default to allow drop
    e.preventDefault()
  }, false)

  dropContainer.addEventListener("dragenter", () => {
    dropContainer.classList.add("drag-active")
  })

  dropContainer.addEventListener("dragleave", () => {
    dropContainer.classList.remove("drag-active")
  })

  dropContainer.addEventListener("drop", (e) => {
    e.preventDefault()
    dropContainer.classList.remove("drag-active")
    fileInput.files = e.dataTransfer.files
  })


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

