const fs = require("fs");
const minimist = require("minimist");
const party = require("../index");

function run(launchFilePath) {
    // Process the arguments we're launched with and get rid of anything we won't be using.
    args = minimist(process.argv, {
        default: {
            'radius': '0', // 0 = regular stationary party
            'rotate': '0', // don't rotate by default
            'colorSpeed': '1.0',
            'noParty': 'false',
        },
        unknown: arg => {
            // Filter out node and our index.js.
            // This ensures that the args._ array will just be the files we process
            if (arg === process.execPath) return false;
            if (arg === (launchFilePath || __filename)) return false;
            return true;
        }
    });

    //TODO(somewhatabstract): Consider adding some scaling or a --fitslack option?
    //TODO(somewhatabstract): Add ability to specify lots of different files at once.
    //TODO(somewhatabstract): Add error checks and useful help text.
    if (args._.length !== 2) {
        console.log("Usage: " + (launchFilePath || __filename) + " input.png output.gif");
        process.exit(-1);
    }

    const inputFilename = args._[0];
    const outputFilename = args._[1];

    party({
        inputFilename, 
        outputStream: fs.createWriteStream(outputFilename), 
        partyRadius: parseInt(args.radius), 
        rotationSpeed: parseFloat(args.rotate),
        colorSpeed: parseFloat(args.colorSpeed),
        noParty: args.noParty === 'true'
    });
}

module.exports = {
    run
}
