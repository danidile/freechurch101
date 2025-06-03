export default async function createThumbnail(imageBlob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageBlob);

    img.onload = () => {
      const maxDimension = 150; // max width or height for thumbnail
      let { width, height } = img;

      // Calculate new size keeping aspect ratio
      if (width > height) {
        if (width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context is null"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create thumbnail blob"));
          }
        },
        "image/jpeg",
        0.7 // thumbnail quality
      );

      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image for thumbnail creation"));
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
}
