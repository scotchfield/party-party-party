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
 * Writes a party version of the given input image to the specified output stream.
 * @param {string} inputFilename A GIF image file to be partified
 * @param {stream.Writable} outputStream The stream where the partified image is to be written
 * @param {number} partyRadius The radius used to animate movement in the output image
 */
function createPartyImage(inputFilename, outputStream, partyRadius) {
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

        const gif = new gifEncoder(shape[0], shape[1]);
        gif.pipe(outputStream);

        gif.setDelay(50);
        gif.setRepeat(0);
        gif.setTransparent("0x00FF00");
        gif.writeHeader();
        gif.on("readable", function() {
            gif.read();
        });

        function getPixelValue(arr, shape, x, y) {
            if (x < 0 || x >= shape[0] || y < 0 || y >= shape[1]) {
                return -1;
            }
            return arr[x + y * shape[0]];
        }

        colours.forEach(function(c, colourIndex) {
            const offset = partyOffset[colourIndex];
            const p = [];

            for (let y = 0; y < shape[1]; y += 1) {
                for (let x = 0; x < shape[0]; x += 1) {
                    let g = getPixelValue(
                        greyscale,
                        shape,
                        x + offset[0],
                        y + offset[1]
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