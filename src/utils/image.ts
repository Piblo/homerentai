export async function compressImage(image: File, quality: number) {
  const canvas = document.createElement("canvas");
  const imageBitmap = await createImageBitmap(image);

  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2d context");
  }

  ctx.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, image.type, quality)
  );

  if (!blob) {
    throw new Error("Could not compress image");
  }

  document.body.appendChild(canvas);

  //   canvas.remove();

  return new File([blob], image.name, {
    type: blob.type,
  });
}
