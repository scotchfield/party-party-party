# party-party-party

Turn a source image into an animated party emoji!

This smiling emoji is pretty cool:

![Smiling Emoji](./smile.png 'Smiling Emoji')

However, it might be jealous of all those parrots and their parties. Let's help out our emoji friend.

![Party Smiling Emoji](./party-smile.gif 'Party Smiling Emoji')

Note: If you'd like to create emojis for Slack, make sure your input image is 128x128 (or less).

## Usage

### CLI

```sh
bin/ppp smile.png party.gif
```

#### Default Options

By default, this will just colorize your image.

```sh
./bin/ppp smile.png party-smile.gif
```

![Party Smiling Emoji](./party-smile.gif 'Party Smiling Emoji')

#### Color Speed

Setting the color speed will make your image cycle through its colors at varying rates. The default is 1. We recommend numbers between 0 and 2.

```sh
./bin/ppp --colorSpeed=0.5 smile.png color-speed-smile.png
```

![Color Speed Party Smile Emoji](./color-speed-party-smile.gif 'Color Speed Party Smile Emoji')

#### Radius

Setting a radius will cause your image to move in a circle. The value is the number of pixels for the offset. Note that this may make the image clip with the boundaries.

```sh
./bin/ppp smile.png --radius=10 radius-party-smile.gif
```

![Radius Party Smile Emoji](./radius-party-smile.gif 'Radius Party Smile Emoji')

#### Rotation

Setting a rotation will cause your image to spin. We recommend setting values between 0 and 2. Some fractional values may appear jerky, so experiment with different ones. (Numbers like 0.25, 0.5, 1, and 2 work well.)
You may also set a negative value to rotate the other direction

```sh
./bin/ppp smile.png --rotate=0.5 rotating-party-smile.gif
```

![Rotating Party Smile Emoji](./rotating-party-smile.gif 'Rotating Party Smile Emoji')

#### Bouncing Party

Seeing a bounce speed will make the image bounce up and down. We recommend values between 5 and 15.

```sh
./bin/ppp smile.png --bounceSpeed=8 bouncing-party-smile.gif
```

![Bouncing Party Smile Emoji](./bouncing-party-smile.gif 'Bouncing Party Smile Emoji')

#### Background Party

Setting `backgroundParty=true` will cause the background (transparent part) of the image to flash party colors instead of the main image.

```sh
./bin/ppp smile.png --backgroundParty=true background-party-smile.gif
```

![Background Party Smile Emoji](./background-party-smile.gif 'Background Party Smile Emoji')

#### No Party

If you wish to disable the party and just simply have the original colors, that's cool too, I guess. Probably want to set one of the other options though.

```sh
./bin/ppp --noParty=true --rotate=-0.5 smile.png no-party-smile.gif
```

![No Party Smile Emoji](./no-party-smile.gif 'No Party Smile Emoji')
