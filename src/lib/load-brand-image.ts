import {
  BRAND_LOGO_DITHER,
  BRAND_LOGO_HEIGHT,
  BRAND_LOGO_PATH,
  BRAND_LOGO_WIDTH,
} from "@/lib/constants";

let cachedLogo: HTMLImageElement | null = null;
let loadPromise: Promise<HTMLImageElement | null> | null = null;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Falha ao carregar imagem: ${src}`));
    img.src = src;
  });
}

/** Carrega o logo da marca (cache em memória). Retorna null se indisponível. */
export async function loadBrandLogo(
  src: string = BRAND_LOGO_PATH,
): Promise<HTMLImageElement | null> {
  if (cachedLogo) return cachedLogo;

  if (!loadPromise) {
    loadPromise = loadImage(src)
      .then((img) => {
        cachedLogo = img;
        return img;
      })
      .catch(() => null);
  }

  return loadPromise;
}

export function getBrandLogoDimensions(): {
  width: number;
  height: number;
  dither: typeof BRAND_LOGO_DITHER;
} {
  return {
    width: BRAND_LOGO_WIDTH,
    height: BRAND_LOGO_HEIGHT,
    dither: BRAND_LOGO_DITHER,
  };
}

/** Pré-carrega o logo no browser (opcional, ex.: após montar a página). */
export function preloadBrandLogo(src: string = BRAND_LOGO_PATH): void {
  void loadBrandLogo(src);
}
