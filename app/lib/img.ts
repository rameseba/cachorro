// Las fotos de /assets están guardadas (también en la base de datos) como .png de 1024 px y ~650 KB.
// Al lado hay una .webp del mismo nombre, redimensionada (~30 KB). Esta función la usa al mostrar,
// sin tocar lo que hay guardado. Las imágenes subidas desde el panel (Convex Storage) pasan igual.
const OPTIMIZADAS = /^\/assets\/(logo|logo-light|hero_dog|beagle|brit_puppy|chihuahua|cocker|dachshund|golden|husky|maltes|pastor|pomerania|poodle|proplan_puppy|proplan_puppy_large|shih_tzu|yorkshire)\.png$/;

export function liviana<T extends string | null | undefined>(src: T): T {
  return (typeof src === "string" && OPTIMIZADAS.test(src) ? src.replace(/\.png$/, ".webp") : src) as T;
}
