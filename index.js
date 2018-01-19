const fs = require('fs');
const getPixels = require("get-pixels");
const gifEncoder = require('gif-encoder');

const filename = '/Users/scottgrant/Downloads/5611966.png';

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
	[255, 105, 104],
]

function imageData(err, pixels) {
	if (err) {
		console.log('Invalid image path..');
		return;
	}

	const greyscale = [];
	for (var i = 0; i < pixels.data.length / 4; i += 1) {
		const idx = i * 4;
		const avg = (
			pixels.data[idx] + pixels.data[idx + 1] +
			pixels.data[idx + 2] + 255
		) / 4;
		greyscale.push(avg)
	}

	const gif = new gifEncoder(128, 128);
	const file = fs.createWriteStream('img.gif');
	gif.pipe(file);
	gif.setDelay(100);
	gif.setRepeat(0);
	gif.writeHeader();
	gif.on('readable', function () {
	  gif.read();
	});

	colours.forEach(function (c) {
		var p = [];
		greyscale.forEach(function (x) {
			p.push(x * c[0] / 255);
			p.push(x * c[1] / 255);
			p.push(x * c[2] / 255);
			p.push(255);
		})
		gif.addFrame(p);
		gif.flushData();
	});

	gif.finish();

}

const input = getPixels(filename, imageData);

