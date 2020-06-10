const getPixels = require("get-pixels");
const gifEncoder = require("gif-encoder");

// The party palette. Party on, Sirocco!
const colours = [
    [255, 141, 139],
    [254, 214, 137],
    [136, 255, 137],
    [135, 255, 255],
    [139, 181, 254],
    [215, 140, 255],
    [255, 140, 255],
    [255, 104, 247],
    [254, 108, 183],
    [255, 105, 104]
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
function rotate(x, y, frac, shape) {
    const centerX = shape[0] / 2;
    const centerY = shape[1] / 2;
    const xRelCenter = x - centerX
    const yRelCenter = y - centerY
    const cos = Math.cos(2 * Math.PI * frac);
    const sin = Math.sin(2 * Math.PI * frac);
    return [
        Math.round(centerX + xRelCenter * cos - yRelCenter * sin),
        Math.round(centerY + yRelCenter * cos + xRelCenter * sin),
    ];
}

const MIN_FRAMES = 20;

// Any pixel in the source with an alpha value lower than this will become a transparent pixel in the result
const ALPHA_THRESHOLD = 64;

/**
 * Writes a party version of the given input image to the specified output stream.
 * @param {string} inputFilename A GIF image file to be partified
 * @param {stream.Writable} outputStream The stream where the partified image is to be written
 * @param {number} partyRadius The radius used to animate movement in the output image
 * @param {number} rotationSpeed The speed of rotation in the output image (if desired)
 */
function createPartyImage({inputFilename, outputStream, partyRadius, rotationSpeed, colorSpeed, noParty, backgroundParty}) {
    // IF we're rotating slower, then we'll need to increase the number of frames in order to get a full rotation
    const frameCount = MIN_FRAMES * (rotationSpeed ? 1 / Math.abs(rotationSpeed) : 1);

    // We need a transparent color, so we're going green screen. If you got green, it'll be transparent. Sorry.
    const transparentColor = [0, 255, 0, 0];

    //TODO(somewhatabstract): Add other variations to radius, like tilt (for bobbling side to side)
    const partyOffset = [];
    const coloursByFrame = [];
    const rotateAmounts = [];
    for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
        const x =
            partyRadius * Math.sin(-2 * Math.PI * (frameIndex / frameCount));
        const y =
            partyRadius * Math.cos(-2 * Math.PI * (frameIndex / frameCount));
        partyOffset.push([Math.round(x), Math.round(y)]);

        const colourIndex = colorSpeed ? (Math.round((colorSpeed * frameIndex)) % colours.length) : 0;
        coloursByFrame.push(colours[colourIndex]);

        rotateAmounts.push(rotationSpeed ? (Math.sign(rotationSpeed) * frameIndex/frameCount) : 0);
    };

    // Turns a one-dimensional pixel value array [r1,g1,b1,a1,r2,g2,b2,a2,...] into an array of [r,g,b,a] tuples
    const parsePixelData = (pixelData) => {
        const data = []; // Will be array of [r,g,b, a] tuples
        for (var idx = 0; idx < pixelData.length; idx += 4) {
            data.push([
                pixelData[idx],
                pixelData[idx+1],
                pixelData[idx+2],
                pixelData[idx+3],
            ]);
        }
        return data;
    };
     
    // Turns [r,g,b] into a hex string like '0x00FF00'
    const toHexColor = ([r,g,b]) => {
        const toHexValue = (c) => {
            const s = c.toString(16).toUpperCase();
            return s.length === 2 ? s : '0' + s;
        };

        return `0x${toHexValue(r)}${toHexValue(g)}${toHexValue(b)}`
    };

    function processImage(err, pixels) {
        if (err) {
            console.log("Invalid image path..");
            console.log(err);
            return;
        }

        const { shape } = pixels;
        const source = parsePixelData(pixels.data);

        const gif = new gifEncoder(shape[0], shape[1]);
        gif.pipe(outputStream);

        gif.setDelay(50);
        gif.setRepeat(0);
        gif.setTransparent(toHexColor(transparentColor));
        //gif.setQuality(1);
        gif.writeHeader();
        gif.on("readable", function() {
            gif.read();
        });

        function getPixelValue(x, y) {
            if (x < 0 || x >= shape[0] || y < 0 || y >= shape[1]) {
                return transparentColor;
            }
            return source[x + y * shape[0]];
        }

        for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
            const colour = coloursByFrame[frameIndex];
            const offset = partyOffset[frameIndex];
            const rotateAmount = rotateAmounts[frameIndex];

            const p = [];

            for (let y = 0; y < shape[1]; y += 1) {
                for (let x = 0; x < shape[0]; x += 1) {
                    const [rotX, rotY] = rotate(x, y, rotateAmount, shape);
                    let [r, g, b, a] = getPixelValue(
                        rotX + offset[0],
                        rotY + offset[1]
                    );

                    if (a < ALPHA_THRESHOLD) {
                        if (backgroundParty) {
                            p.push(colour[0]);
                            p.push(colour[1]);
                            p.push(colour[2]);
                            p.push(255)
                        } else {
                            p.push(...transparentColor);
                        }
                    } else {
                        if (noParty || backgroundParty) {
                            // Original colors
                            p.push(r);
                            p.push(g);
                            p.push(b);
                            p.push(a);
                        } else {
                            // If party is enabled, then we'll greyscale the pixel and then apply colors to it
                            const avg = Math.max(Math.round((r+b+g)/3), 32);
                            p.push(avg * colour[0] / 255);
                            p.push(avg * colour[1] / 255);
                            p.push(avg * colour[2] / 255);
                            p.push(a);
                        }
                    }
                }
            }

            gif.addFrame(p);
        };

        gif.finish();
    }

    getPixels(inputFilename, processImage);
}

module.exports = createPartyImage;
