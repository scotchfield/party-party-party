# party-party-party
Turn a source image into an animated party emoji!

This smiling emoji is pretty cool:

![Smiling Emoji](./smile.png "Smiling Emoji")

However, it might be jealous of all those parrots and their parties. Let's help out our emoji friend.

![Party Smiling Emoji](./party-smile.gif "Party Smiling Emoji")

## Usage
`node index.js smile.png party.gif`

Note: If you'd like to create emojis for Slack, make sure your input image is 128x128 (or less).

### Radius
If you want to tune the radius of the animating circle, you can use the `--radius=<n>` option. The default for this is `10`.

For example, `node index.js --radius=0 smile.png party.gif` will create a party version of `smile.png` where the image has an ounce or two less party.

![Still Party Smile Emoji](./still-party-smile.gif "Still Party Smile Emoji")

![Party Heart Emoji](./heart.gif "Party Heart Emoji")
