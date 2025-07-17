// src/utils/uploadImageClient.ts
import convertImageToJpeg from "./convertImageToJpeg";
import createThumbnail from "./createThumbnail";
import convertImageToWebpWithMaxHeight from "./convertImageToWebpWithMaxHeight";

export async function prepareImageUpload(
  file: File,
  type: "profilepicture" | "churchlogo"
) {
  if (type === "profilepicture") {
    const jpegBlob = await convertImageToJpeg(file);
    const thumbBlob = await createThumbnail(jpegBlob);
    return {
      type,
      main: jpegBlob,
      thumb: thumbBlob,
      extension: "jpg",
      contentType: "image/jpeg",
    };
  }

  const isPng = file.type === "image/png";
  const finalBlob = isPng ? file : await convertImageToWebpWithMaxHeight(file);
  return {
    type,
    main: finalBlob,
    extension: isPng ? "png" : "webp",
    contentType: isPng ? "image/png" : "image/webp",
  };
}
