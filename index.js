const fs = require("fs");
const minimist = require("minimist");
const getPixels = require("get-pixels");
const gifEncoder = require("gif-encoder");

// Process the arguments we're launched with and get rid of anything we won't be using.
args = minimist(process.argv, {
    default: {
        "radius": 10, // 0 = regular stationary party
    },
    unknown: arg => {
        // Filter out node and our index.js.
        // This ensures that the args._ array will just be the files we process
        if (arg === process.execPath) return false;
        if (arg === __filename) return false;
        return true;
    }
});

//TODO(somewhatabstract): Make this code an importable module and then provide a simple wrapper for direct CLI usage
//TODO(somewhatabstract): Consider adding some scaling or a --fitslack option?
//TODO(somewhatabstract): Add ability to specify lots of different files at once.
//TODO(somewhatabstract): Add error checks and useful help text.
if (args._.length !== 2) {
    console.log("Usage: " + __filename + " input.png output.gif");
    process.exit(-1);
}

const inputFilename = args._[0];
const outputFilename = args._[1];

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

//TODO(somewhatabstract): Add other variations to radius, like tilt (for bobbling side to side)
const partyOffset = [];
const partyRadius = parseInt(args.radius);
colours.forEach((c, colourIndex) => {
    const x =
        partyRadius * Math.sin(2 * Math.PI * (-colourIndex / colours.length));
    const y =
        partyRadius * Math.cos(2 * Math.PI * (-colourIndex / colours.length));
    partyOffset.push([Math.round(x), Math.round(y)]);
});

function toGreyscale(pixels) {
    const greyscale = [];

    for (var i = 0; i < pixels.data.length / 4; i += 1) {
        const idx = i * 4;
        if (pixels.data[idx + 3] < 64) {
            greyscale.push(-1);
        } else {
            const avg =
                (pixels.data[idx] +
                    pixels.data[idx + 1] +
                    pixels.data[idx + 2]) /
                3;
            greyscale.push(avg);
        }
    }
    return greyscale;
}

function imageData(err, pixels) {
    if (err) {
        console.log("Invalid image path..");
        console.log(err);
        return;
    }

    const { shape } = pixels;
    const greyscale = toGreyscale(pixels);

    const gif = new gifEncoder(shape[0], shape[1]);
    const outputFile = fs.createWriteStream(outputFilename);
    gif.pipe(outputFile);

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

        return (result = arr[x + y * shape[0]]);
    }

    colours.forEach(function(c, colourIndex) {
        const offset = partyOffset[colourIndex];
        const p = [];

        for (var y = 0; y < shape[1]; y += 1) {
            for (var x = 0; x < shape[0]; x += 1) {
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

const input = getPixels(inputFilename, imageData);
