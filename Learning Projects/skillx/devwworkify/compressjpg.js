document.addEventListener("DOMContentLoaded", () => {
    let files = [];
  
    document.getElementById("jpgInput").addEventListener("change", (event) => {
      files = Array.from(event.target.files);
    });
  
    document.getElementById("compressBtn").addEventListener("click", async () => {
      if (!files.length) {
        alert("Please select JPG file(s) to compress.");
        return;
      }
  
      for (const file of files) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
  
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
  
          // Resize to original dimensions (or scale down if needed)
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
  
          // Compress quality (0.5 = 50%)
          canvas.toBlob((blob) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `compressed-${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }, "image/jpeg", 0.5); // Compression level (0 to 1)
        };
      }
    });
  });
  