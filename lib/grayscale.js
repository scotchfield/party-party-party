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

module.exports = toGreyscale;