export default async function convertImageToJpeg(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context is null"));
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Conversion to JPEG failed"));
          }
        },
        "image/jpeg",
        0.9 // quality: 90%
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
