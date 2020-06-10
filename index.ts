// @ts-ignore TODO
import getPixels from 'get-pixels';
// @ts-ignore TODO
import gifEncoder from 'gif-encoder';
import { WriteStream } from 'fs';

type Color = [number, number, number, number];

type GetPixelResults = {
  shape: [number, number];
  data: number[];
};

// The party palette. Party on, Sirocco!
const colours: Color[] = [
  [255, 141, 139, 255],
  [254, 214, 137, 255],
  [136, 255, 137, 255],
  [135, 255, 255, 255],
  [139, 181, 254, 255],
  [215, 140, 255, 255],
  [255, 140, 255, 255],
  [255, 104, 247, 255],
  [254, 108, 183, 255],
  [255, 105, 104, 255],
];

/**
 * Rotates the point [x, y] frac of a rotation around the center of the image.
 *
 * @param {number} x The starting x coordinate.
 * @param {number} y The starting y coordinate.
 * @param {number} frac The fraction of a rotation by which to rotate (that is,
 *     we rotate by frac * 2pi radians).
 * @param {Array} shape An array of length 2 containing the dimensions of the image.
 */
const rotate = (
  x: number,
  y: number,
  frac: number,
  width: number,
  height: number
): [number, number] => {
  const centerX = width / 2;
  const centerY = height / 2;
  const xRelCenter = x - centerX;
  const yRelCenter = y - centerY;
  const cos = Math.cos(2 * Math.PI * frac);
  const sin = Math.sin(2 * Math.PI * frac);
  return [
    Math.round(centerX + xRelCenter * cos - yRelCenter * sin),
    Math.round(centerY + yRelCenter * cos + xRelCenter * sin),
  ];
};

const getAlpha = (color: Color) => color[3];

const getAverage = ([r, g, b]: Color) => Math.round((r + g + b) / 3);

const MIN_FRAMES = 20;

// Any pixel in the source with an alpha value lower than this will become a transparent pixel in the result
const ALPHA_THRESHOLD = 64;

interface Opts {
  inputFilename: string;
  outputStream: WriteStream;
  partyRadius: number;
  rotationSpeed: number;
  colorSpeed: number;
  noParty: boolean;
  backgroundParty: boolean;
}

/**
 * Writes a party version of the given input image to the specified output stream.
 * @param {string} inputFilename A GIF image file to be partified
 * @param {stream.Writable} outputStream The stream where the partified image is to be written
 * @param {number} partyRadius The radius used to animate movement in the output image
 * @param {number} rotationSpeed The speed of rotation in the output image (if desired)
 */
export const createPartyImage = ({
  inputFilename,
  outputStream,
  partyRadius,
  rotationSpeed,
  colorSpeed,
  noParty,
  backgroundParty,
}: Opts) => {
  // IF we're rotating slower, then we'll need to increase the number of frames in order to get a full rotation
  const frameCount =
    MIN_FRAMES * (rotationSpeed ? 1 / Math.abs(rotationSpeed) : 1);

  // We need a transparent color, so we're going green screen. If you got green, it'll be transparent. Sorry.
  const transparentColor: Color = [0, 255, 0, 0];

  //TODO(somewhatabstract): Add other variations to radius, like tilt (for bobbling side to side)
  const partyOffset: [number, number][] = [];
  const coloursByFrame: Color[] = [];
  const rotateAmounts: number[] = [];
  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    const x = partyRadius * Math.sin(-2 * Math.PI * (frameIndex / frameCount));
    const y = partyRadius * Math.cos(-2 * Math.PI * (frameIndex / frameCount));
    partyOffset.push([Math.round(x), Math.round(y)]);

    const colourIndex = colorSpeed
      ? Math.round(colorSpeed * frameIndex) % colours.length
      : 0;
    coloursByFrame.push(colours[colourIndex]);

    rotateAmounts.push(
      rotationSpeed ? (Math.sign(rotationSpeed) * frameIndex) / frameCount : 0
    );
  }

  // Turns [r,g,b] into a hex string like '0x00FF00'
  const toHexColor = ([r, g, b]: Color) => {
    const toHexValue = (c: number) => {
      const s = c.toString(16).toUpperCase();
      return s.length === 2 ? s : '0' + s;
    };

    return `0x${toHexValue(r)}${toHexValue(g)}${toHexValue(b)}`;
  };

  const processImage = (err: Error, pixels: GetPixelResults) => {
    if (err) {
      console.log('Invalid image path..');
      console.log(err);
      return;
    }

    const [width, height] = pixels.shape;
    const source = pixels.data;

    const gif = new gifEncoder(width, height);
    gif.pipe(outputStream);

    gif.setDelay(50);
    gif.setRepeat(0);
    gif.setTransparent(toHexColor(transparentColor));
    //gif.setQuality(500);
    gif.writeHeader();
    gif.on('readable', function () {
      gif.read();
    });

    const getColorFromSource = (x: number, y: number): Color => {
      if (x < 0 || x >= width || y < 0 || y >= height) {
        return transparentColor;
      }

      // Source is a one-dimensional array that looks like [r1,g1,b1,a1,r2,g2,b2,a2,...]
      const idx = x * 4 + y * 4 * width;
      return [source[idx], source[idx + 1], source[idx + 2], source[idx + 3]];
    };

    for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
      const partyColor = coloursByFrame[frameIndex];
      const [xOffset, yOffset] = partyOffset[frameIndex];
      const rotateAmount = rotateAmounts[frameIndex];

      const frame: Color[] = [];

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const [rotX, rotY] = rotate(x, y, rotateAmount, width, height);
          const sourceColor = getColorFromSource(
            rotX + xOffset,
            rotY + yOffset
          );

          if (getAlpha(sourceColor) < ALPHA_THRESHOLD) {
            if (backgroundParty) {
              frame.push(partyColor);
            } else {
              frame.push(transparentColor);
            }
          } else {
            if (noParty || backgroundParty) {
              // Original colors
              frame.push(sourceColor);
            } else {
              // If party is enabled, then we'll greyscale the pixel and then apply colors to it
              const avg = Math.max(getAverage(sourceColor), 32);
              frame.push([
                (avg * partyColor[0]) / 255,
                (avg * partyColor[1]) / 255,
                (avg * partyColor[2]) / 255,
                getAlpha(sourceColor),
              ]);
            }
          }
        }
      }

      gif.addFrame(frame.flat());
    }

    gif.finish();
  };

  getPixels(inputFilename, processImage);
};
