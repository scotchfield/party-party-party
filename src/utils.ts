import { Color, Coord, Dimensions, Image } from './types';

/**
 * Converts a Pixel into a hex string like '0x00FF00'
 */
export const toHexColor = ([r, g, b]: Color) => {
  const toHexValue = (c: number) => {
    const s = c.toString(16).toUpperCase();
    return s.length === 2 ? s : '0' + s;
  };

  return `0x${toHexValue(r)}${toHexValue(g)}${toHexValue(b)}`;
};

export const isTransparent = (pixel: Color) => pixel[3] < 64;

export const getAveragePixelValue = ([r, g, b]: Color) =>
  Math.round((r + g + b) / 3);

export const getPixelFromSource = (
  [width, height]: Dimensions,
  image: Image
) => ([x, y]: Coord): Color => {
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return [0, 0, 0, 0]; // Default to transparent if an invalid coordinate
  }

  const idx = x * 4 + y * 4 * width;
  return [image[idx], image[idx + 1], image[idx + 2], image[idx + 3]];
};
