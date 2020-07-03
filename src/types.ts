/**
 * [R, G, B, A] in values 0 - 255 inclusive
 */
export type Color = [number, number, number, number];

/**
 * [x, y]
 */
export type Coord = [number, number];

/**
 * [width, height]
 */
export type Dimensions = [number, number];

/**
 * The results of get-pixels processImage()
 */
export interface GetPixelResults {
  shape: Dimensions;
  data: number[];
}

export interface TransformFnOpts<Params> {
  /**
   * The coordinates we're trying to map with this function
   */
  coord: Coord;

  /**
   * Function to get the pixel from the source image
   */
  getSourcePixel: (coord: Coord) => Color;

  /**
   * Dimensions of the source and final image
   */
  dimensions: Dimensions;

  /**
   * The current frame we're rendering. Will be in the range [0, totalFrameCount)
   */
  frameIndex: number;

  /**
   * Total number of frames that the final gif will have
   */
  totalFrameCount: number;

  /**
   * User-passed in parameters.
   * These need to be validated.
   * TODO We can probably add custom runtypes validation so this can all be typesafe.
   */
  parameters: Params;
}

export type TransformFn<Params> = (opts: TransformFnOpts<Params>) => Color;

export interface Transform<Params = unknown[]> {
  name: string;
  fn: TransformFn<Params>;
}

export interface TransformInput {
  transform: Transform<any>;
  params: any[];
}

/**
 * a one-dimensional array of pixels; looks like [r1,g1,b1,a1, r2,g2,b2,a2,...]
 */
export type Image = number[];
