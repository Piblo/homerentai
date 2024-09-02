export async function compressImage(image: File, quality: number) {
  const canvas = document.createElement("canvas");
  const imageBitmap = await createImageBitmap(image);

  canvas.width = imageBitmap.width * quality;
  canvas.height = imageBitmap.height * quality;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2d context");
  }

  ctx.drawImage(
    imageBitmap,
    0,
    0,
    imageBitmap.width * quality,
    imageBitmap.height * quality
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, image.type, quality)
  );

  if (!blob) {
    throw new Error("Could not compress image");
  }

  canvas.remove();

  return new File([blob], image.name, {
    type: blob.type,
  });
}
