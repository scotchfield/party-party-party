const fs = require("fs");
const getPixels = require("get-pixels");
const gifEncoder = require("gif-encoder");

if (process.argv.length <= 3) {
    console.log("Usage: " + __filename + " input.png output.gif");
    process.exit(-1);
}

const inputFilename = process.argv[2];
const outputFilename = process.argv[3];

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

function imageData(err, pixels) {
    if (err) {
        console.log("Invalid image path..");
        return;
    }

    const { shape } = pixels;
    const greyscale = [];

    for (var i = 0; i < pixels.data.length / 4; i += 1) {
        const idx = i * 4;
        if (pixels.data[idx + 3] === 0) {
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

    const gif = new gifEncoder(shape[0], shape[1]);
    const outputFile = fs.createWriteStream(outputFilename);
    gif.pipe(outputFile);

    gif.setDelay(100);
    gif.setRepeat(0);
    gif.setTransparent("0x00FF00");
    gif.writeHeader();
    gif.on("readable", function() {
        gif.read();
    });

    colours.forEach(function(c) {
        var p = [];

        greyscale.forEach(g => {
            if (g === -1) {
                p.push(0);
                p.push(255);
                p.push(0);
                p.push(0);
            } else {
                if (g < 32) {
                    g = 32;
                }
                p.push(g * c[0] / 255);
                p.push(g * c[1] / 255);
                p.push(g * c[2] / 255);
                p.push(255);
            }
        });

        gif.addFrame(p);
        gif.flushData();
    });

    gif.finish();
}

const input = getPixels(inputFilename, imageData);
