document.getElementById("convertBtn").addEventListener("click", function () {
    const fileInput = document.getElementById("wordInput").files[0];

    if (!fileInput) {
        alert("Please select a Word file first.");
        return;
    }

    if (!fileInput.name.endsWith(".docx")) {
        alert("Only .docx files are supported.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const arrayBuffer = event.target.result;
        const container = document.getElementById("output");
        container.innerHTML = ""; // Clear previous content

        // ✅ Render Word document using docx-preview.js
        docx.renderAsync(arrayBuffer, container, null, {
            className: "docx-container",
            inWrapper: true
        }).then(() => {
            console.log("Word document rendered successfully!");
            alert("Document rendered! Click 'Download as PDF' to save.");
        }).catch(err => {
            console.error("Error rendering document:", err);
            alert("Failed to render Word document.");
        });
    };

    reader.readAsArrayBuffer(fileInput);
});

// ✅ Convert rendered content to PDF using html2canvas & jsPDF
document.getElementById("downloadPDF").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const container = document.getElementById("output");

    if (!container.innerHTML.trim()) {
        alert("Please upload and render a document first.");
        return;
    }

    html2canvas(container, { scale: 2, backgroundColor: "#ffffff" }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("converted.pdf");

        alert("PDF downloaded successfully!");
    }).catch(err => {
        console.error("Error converting to PDF:", err);
        alert("Failed to convert document to PDF.");
    });
});
