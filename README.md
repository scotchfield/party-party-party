# party-party-party
Turn a source image into an animated party emoji

This smiling emoji is pretty cool:

![Smiling Emoji](https://raw.githubusercontent.com/scotchfield/party-party-party/master/smile.png "Smiling Emoji")

However, it might be jealous of all those parrots and their parties. Let's help out our emoji friend.

![Party Smiling Emoji](https://raw.githubusercontent.com/scotchfield/party-party-party/master/party-smile.gif "Party Smiling Emoji")

If you'd like to create emojis for Slack, make sure your input image is 128x128 (or less). If you want to tune the radius of the animating circle, you can change the following line: (larger values indicate more distance from the origin, i.e. a wider circle)

`const partyRadius = 10;`

## Usage
`node index.js smile.png party.gif`
