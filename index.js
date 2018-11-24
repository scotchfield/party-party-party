const getPixels = require("get-pixels");
const gifEncoder = require("gif-encoder");
const toGreyscale = require("./lib/grayscale");

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

/**
 * Writes a party version of the given input image to the specified output stream.
 * @param {string} inputFilename A GIF image file to be partified
 * @param {stream.Writable} outputStream The stream where the partified image is to be written
 * @param {number} partyRadius The radius used to animate movement in the output image
 * @param {number} rotationSpeed The speed of rotation in the output image (if desired)
 */
function createPartyImage(inputFilename, outputStream, partyRadius, rotationSpeed) {
    //TODO(somewhatabstract): Add other variations to radius, like tilt (for bobbling side to side)
    const partyOffset = [];
    colours.forEach((c, colourIndex) => {
        const x =
            partyRadius * Math.sin(2 * Math.PI * (-colourIndex / colours.length));
        const y =
            partyRadius * Math.cos(2 * Math.PI * (-colourIndex / colours.length));
        partyOffset.push([Math.round(x), Math.round(y)]);
    });

    function processImage(err, pixels) {
        if (err) {
            console.log("Invalid image path..");
            console.log(err);
            return;
        }

        const { shape } = pixels;
        const greyscale = toGreyscale(pixels);

        const hasMultipleFrames = shape.length == 4

        const width =  hasMultipleFrames ? shape[1] : shape[0]
        const height = hasMultipleFrames ? shape[2] : shape[1]

        const gif = new gifEncoder(width, height);
        
        gif.pipe(outputStream);

        gif.setDelay(50);
        gif.setRepeat(0);
        gif.setTransparent("0x00FF00");
        gif.writeHeader();
        gif.on("readable", function() {
            gif.read();
        });
    
        function getPixelValue(arr, x, y) {
            if (x < 0 || x >= width || y < 0 || y >= height) {
                return -1;
            }
            return arr[x + y * width];
        }

        colours.forEach(function(c, colourIndex) {
            const offset = partyOffset[colourIndex];
            const p = [];
            let rotX, rotY;

            for (let y = 0; y < height; y += 1) {
                for (let x = 0; x < width; x += 1) {
                    if (rotationSpeed) {
                        [rotX, rotY] = rotate(
                            x, y, rotationSpeed * colourIndex / colours.length, shape);
                    } else {
                        [rotX, rotY] = [x, y];
                    }
                    let g = getPixelValue(
                        greyscale,
                        rotX + offset[0],
                        rotY + offset[1]
                    );

                    if (g === -1) {
                        p.push(0);
                        p.push(255);
                        p.push(0);
                        p.push(0);
                    } else {
                        g = g < 32 ? 32 : g;

                        p.push(g * c[0] / 255);
                        p.push(g * c[1] / 255);
                        p.push(g * c[2] / 255);
                        p.push(255);
                    }
                }
            }

            gif.addFrame(p);
            gif.flushData();
        });

        gif.finish();
    }

    getPixels(inputFilename, processImage);
}

module.exports = createPartyImage;
