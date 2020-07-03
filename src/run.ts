// @ts-ignore TODO
import getPixels from 'get-pixels';
// @ts-ignore TODO
import gifEncoder from 'gif-encoder';
import { WriteStream } from 'fs';

import {
  GetPixelResults,
  Color,
  TransformInput,
  Image,
  Dimensions,
} from './types';
import { toHexColor, getPixelFromSource } from './utils';

const FRAME_COUNT = 10; // TODO we can probably take this as input now

export const run = async (
  inputFilename: string,
  outputStream: WriteStream,
  transformList: TransformInput[]
) => {
  const { shape: dimensions, data: originalImage } = await readImage(
    inputFilename
  );

  const frames: Image[] = [];

  for (let frameIndex = 0; frameIndex < FRAME_COUNT; frameIndex += 1) {
    const frame = buildImageFrame(
      dimensions,
      originalImage,
      transformList,
      frameIndex
    );
    frames.push(frame);
  }

  // Transform any of our transparent pixels to what our gif understands to be transparent
  const { image, transparentColor } = encodeTransparency(frames);

  createGif(dimensions, image, transparentColor, outputStream);
};

/**
 * Apply each of the transformers in order to the original image and return the new one
 */
const buildImageFrame = (
  dimensions: Dimensions,
  srcImage: Image,
  transformList: TransformInput[],
  frameIndex: number
): Image => {
  const [width, height] = dimensions;

  return transformList.reduce((image, transformInput) => {
    const transformedImage: Image = [];
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const destPixel = transformInput.transform.fn({
          coord: [x, y],
          dimensions,
          frameIndex,
          getSourcePixel: getPixelFromSource(dimensions, image),
          parameters: transformInput.params,
          totalFrameCount: FRAME_COUNT,
        });

        transformedImage.push(...destPixel);
      }
    }

    return transformedImage;
  }, srcImage);
};

/**
 * Each pixel in our image has an alpha channel, but gifs don't.
 * We transform each pixel that appears transparent to be a designated transparent color.
 */
const encodeTransparency = (
  frames: Image[]
): { image: Image[]; transparentColor: Color } => {
  // We need a transparent color, so we're going green screen. If you got green, it'll be transparent. Sorry.
  // TODO: Go through the pixels in each frame and find a color that isn't used, and make that our transparent color.
  const transparentColor: Color = [0, 255, 0, 255];

  const image = frames.map((frame) => {
    const img: Image = [];
    for (let i = 0; i < frame.length; i += 4) {
      if (frame[i + 3] < 128) {
        // Anything more than halfway transparent is considered transparent
        img.push(...transparentColor);
      } else {
        img.push(frame[i]);
        img.push(frame[i + 1]);
        img.push(frame[i + 2]);
        img.push(255); // Gifs don't do transparency, I dunno why they take in an alpha value...
      }
    }
    return img;
  });

  return { image, transparentColor };
};

const createGif = (
  dimensions: Dimensions,
  frames: Image[],
  transparentColor: Color,
  outputStream: WriteStream
) => {
  const [width, height] = dimensions;
  const gif = new gifEncoder(width, height);
  gif.pipe(outputStream);

  gif.setDelay(50);
  gif.setRepeat(0);
  gif.setTransparent(toHexColor(transparentColor));
  //gif.setQuality(500);
  gif.writeHeader();
  gif.on('readable', () => {
    gif.read();
  });

  frames.forEach((f) => gif.addFrame(f));

  gif.finish();
};

const readImage = (inputFilename: string): Promise<GetPixelResults> =>
  new Promise<GetPixelResults>((res, rej) =>
    getPixels(inputFilename, (err: Error, getPixelResults: GetPixelResults) => {
      if (err) {
        return rej(err);
      } else {
        return res(getPixelResults);
      }
    })
  );
