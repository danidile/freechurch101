"use client";

export default async function convertImageToWebpWithMaxHeight(
  file: File
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const scale = Math.min(1, 300 / img.height); // shrink only if taller than 300px
      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context is null"));
        return;
      }

      // Ensure canvas is transparent before drawing
      ctx.clearRect(0, 0, newWidth, newHeight);
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Conversion to WebP failed"));
          }
        },
        "image/webp",
        0.9 // quality (0-1)
      );

      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      reject(new Error("Image load error"));
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
}
