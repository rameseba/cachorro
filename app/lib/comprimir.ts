// Achica las fotos en el navegador antes de subirlas desde el panel (08-11-2026).
// Motivo: una foto de celular (3 MB) subida al panel hacía que la portada pesara 3,7 MB.
// - Lado mayor máximo: 1600 px (sobra para tarjetas de 280 px y el banner de 600 px en pantallas retina).
// - Formato WebP calidad 0.82 (mantiene la transparencia de los logos).
// - Si el navegador no puede, o el resultado no es más liviano, se sube el archivo original.
// - SVG y GIF se suben tal cual (vectores / animaciones).

const LADO_MAX = 1600;
const CALIDAD = 0.82;

export async function comprimirImagen(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || /svg|gif/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height));
    const ancho = Math.round(bitmap.width * escala);
    const alto = Math.round(bitmap.height * escala);
    const canvas = document.createElement("canvas");
    canvas.width = ancho;
    canvas.height = alto;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, ancho, alto);
    bitmap.close();
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/webp", CALIDAD));
    if (!blob || blob.type !== "image/webp" || blob.size >= file.size) return file;
    const nombre = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], nombre, { type: "image/webp" });
  } catch {
    return file;
  }
}
