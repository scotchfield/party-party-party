# party-party-party
Turn a source image into an animated party emoji!

This smiling emoji is pretty cool:

![Smiling Emoji](./smile.png "Smiling Emoji")

However, it might be jealous of all those parrots and their parties. Let's help out our emoji friend.

![Party Smiling Emoji](./party-smile.gif "Party Smiling Emoji")

Note: If you'd like to create emojis for Slack, make sure your input image is 128x128 (or less).

## Usage
### CLI
`bin/ppp smile.png party.gif`

#### Radius
If you want to tune the radius of the animating circle, you can use the `--radius=<n>` option. The default for this is `10`.

For example, `bin/ppp --radius=0 smile.png party.gif` will create a party version of `smile.png` where the image has an ounce or two less party.

![Still Party Smile Emoji](./still-party-smile.gif "Still Party Smile Emoji")

#### Rotation
If you want the part emoji to rotate instead of (or in addition to!) moving, pass `--rotate=1`.  If you want it to rotate extra fast, try `--rotate=2` or more!
Numbers less than 0 are also allowed: `--roate=0.5`!

![Rotating Party Smile Emoji](./rotating-party-smile.gif "Rotating Party Smile Emoji")

#### Color Speed
If you want to cycle through colors faster or slower, set this:
```sh
./bin/ppp --colorSpeed=0.5 smile.png color-speed-smile.png
```
![Color Speed Party Smile Emoji](./color-speed-smile.gif "Color Speed Party Smile Emoji")

The default value is `1`. Set to a smaller number (like `0.5`) to make it cycle colors slower, and set to a higher speed to cycle faster.

#### Disabling Party
If you wish to disable the party and just simply have the original colors, that's cool too, I guess.
```sh
./bin/ppp --noParty=true smile.png no-party-smile.png
```

### Node
```
const fs = require("fs");
const PartyPartyParty = require("party-party-party");

const outputFileStream = fs.createWriteStream("my-output-file.gif");
PartyPartyParty("my-input.png", outputFileStream, 10);
```

![Party Heart Emoji](./heart.gif "Party Heart Emoji")
