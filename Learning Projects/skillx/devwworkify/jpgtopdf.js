// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById("pdfInput").addEventListener("change", handleFiles);
// });

// function handleFiles(event) {
//     const files = event.target.files;
//     if (files.length === 0) {
//         alert("Please select at least one JPG image.");
//         return;
//     }

//     convertJpgToPdf(files);
// }

// async function convertJpgToPdf(files) {
//     const { jsPDF } = window.jspdf; // Ensure jsPDF is available
//     const pdf = new jsPDF();
//     let firstImage = true;

//     for (let file of files) {
//         if (!file.type.startsWith("image/")) {
//             alert("Only JPG images are supported.");
//             return;
//         }

//         const imageUrl = await readFileAsDataURL(file);
//         const img = new Image();
//         img.src = imageUrl;
//         await new Promise((resolve) => {
//             img.onload = () => {
//                 const imgWidth = 210; // A4 width in mm
//                 const imgHeight = (img.height * imgWidth) / img.width;

//                 if (!firstImage) pdf.addPage();
//                 pdf.addImage(img, "JPEG", 0, 0, imgWidth, imgHeight);
//                 firstImage = false;
//                 resolve();
//             };
//         });
//     }

//     pdf.save("converted.pdf"); // Download the PDF
// }

// // Helper function to read files as data URLs
// function readFileAsDataURL(file) {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => resolve(reader.result);
//         reader.onerror = reject;
//         reader.readAsDataURL(file);
//     });
// }


document.addEventListener("DOMContentLoaded", function () {
    let selectedFiles = [];

    document.getElementById("pdfInput").addEventListener("change", function (event) {
        selectedFiles = event.target.files; // Store selected files
    });

    document.getElementById("convertBtn").addEventListener("click", function () {
        if (selectedFiles.length === 0) {
            alert("Please select at least one JPG image.");
            return;
        }
        convertJpgToPdf(selectedFiles);
    });
});

async function convertJpgToPdf(files) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    let firstImage = true;

    for (let file of files) {
        if (!file.type.startsWith("image/")) {
            alert("Only JPG and PNG images are supported.");
            return;
        }

        const imageUrl = await readFileAsDataURL(file);
        const img = new Image();
        img.src = imageUrl;

        await new Promise((resolve) => {
            img.onload = () => {
                const imgWidth = 210; // A4 width in mm
                const imgHeight = (img.height * imgWidth) / img.width;

                if (!firstImage) pdf.addPage();
                pdf.addImage(img, "JPEG", 0, 0, imgWidth, imgHeight);
                firstImage = false;
                resolve();
            };
        });
    }

    pdf.save("converted.pdf"); // Save PDF only when conversion completes
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
