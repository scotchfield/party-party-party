import { Transform, Color, Dimensions, Coord } from './types';
import { isTransparent, getAveragePixelValue } from './utils';

const PARTY_COLORS: Color[] = [
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

const party: Transform = {
  name: 'party',
  fn: ({ getSourcePixel, coord, frameIndex, totalFrameCount }) => {
    const srcPixel = getSourcePixel(coord);

    if (isTransparent(srcPixel)) {
      return [0, 0, 0, 0];
    }

    const partyColorIdx = Math.round(
      (frameIndex / totalFrameCount) * PARTY_COLORS.length
    );
    const partyColor = PARTY_COLORS[partyColorIdx];

    const gray = getAveragePixelValue(srcPixel);

    return [
      (gray * partyColor[0]) / 255,
      (gray * partyColor[1]) / 255,
      (gray * partyColor[2]) / 255,
      255,
    ];
  },
};

const backgroundParty: Transform = {
  name: 'background-party',
  fn: ({ getSourcePixel, coord, frameIndex, totalFrameCount }) => {
    const srcPixel = getSourcePixel(coord);

    // Make the transparent parts colorful
    if (isTransparent(srcPixel)) {
      const partyColorIdx = Math.round(
        (frameIndex / totalFrameCount) * PARTY_COLORS.length
      );
      return PARTY_COLORS[partyColorIdx];
    }

    return srcPixel;
  },
};

const bounce: Transform<[string]> = {
  name: 'bounce',
  fn: ({ getSourcePixel, coord, frameIndex, totalFrameCount, parameters }) => {
    const bounceSpeed = parseFloat(parameters[0]); // TODO Validation

    const x = coord[0];
    const y =
      coord[1] +
      Math.round(
        bounceSpeed * Math.sin((frameIndex / totalFrameCount) * 2 * Math.PI)
      );

    return getSourcePixel([x, y]);
  },
};

const rotate: Transform = {
  name: 'rotate',
  fn: ({ getSourcePixel, coord, frameIndex, totalFrameCount, dimensions }) => {
    const centerX = dimensions[0] / 2;
    const centerY = dimensions[1] / 2;
    const xRelCenter = coord[0] - centerX;
    const yRelCenter = coord[1] - centerY;

    const amount = frameIndex / totalFrameCount;
    const cos = Math.cos(2 * Math.PI * amount);
    const sin = Math.sin(2 * Math.PI * amount);

    const newCoord: Coord = [
      Math.round(centerX + xRelCenter * cos - yRelCenter * sin),
      Math.round(centerY + yRelCenter * cos + xRelCenter * sin),
    ];

    return getSourcePixel(newCoord);
  },
};

const radius: Transform<[string]> = {
  name: 'radius',
  fn: ({ getSourcePixel, coord, frameIndex, totalFrameCount, parameters }) => {
    const partyRadius = parseFloat(parameters[0]); // TODO validation

    const xOffset = Math.round(
      partyRadius * Math.sin(-2 * Math.PI * (frameIndex / totalFrameCount))
    );
    const yOffset = Math.round(
      partyRadius * Math.cos(-2 * Math.PI * (frameIndex / totalFrameCount))
    );

    return getSourcePixel([coord[0] + xOffset, coord[1] + yOffset]);
  },
};

const shocking: Transform<[string]> = {
  name: 'static',
  fn: ({ coord, getSourcePixel, parameters }) => {
    const strength = parseFloat(parameters[0]);
    const src = getSourcePixel(coord);

    if (isTransparent(src)) {
      return [0, 0, 0, 0];
    }

    const inverse = Math.ceil(Math.random() * strength) > 1;

    return inverse ? [255 - src[0], 255 - src[1], 255 - src[2], src[3]] : src;
  },
};

export const transformsList = [
  party,
  backgroundParty,
  radius,
  rotate,
  bounce,
  shocking,
];
