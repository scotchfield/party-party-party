# party-party-party

Turn a source image into an animated party emoji!

This smiling emoji is pretty cool:

![Smiling Emoji](./examples/smile.png 'Smiling Emoji')

However, it might be jealous of all those parrots and their parties. Let's help out our emoji friend.

![Party Smiling Emoji](./examples/party-smile.gif 'Party Smiling Emoji')

Note: If you'd like to create emojis for Slack, make sure your input image is 128x128 (or less) and is max 128kb. Slack is pretty limited.

# Usage

- The first two arguments are always the source image filename, and the file name of the the gif you're creating.
- After that, you can provide an ordered list of transformations. Some transformations take in 1 or more parameters. See the following examples.

## Available transformations

#### Basic Party

The `party` transformation will turn all foreground (non-transparent) pixels multiple colors. This does not take any parameters.

```sh
./bin/ppp smile.png party-smile.gif party
```

---

![Party Smiling Emoji](./examples/party-smile.gif 'Party Smiling Emoji')

#### Background Party

The `background-party` transformation will turn all background (transparent) pixels multiple colors. This does not take any parameters.

```sh
./bin/ppp smile.png background-party-smile.gif background-party
```

![Background Party Smiling Emoji](./examples/background-party-smile.gif 'Background Party Smiling Emoji')

#### Radius

The `radius` transformation will cause your image to move in a circle. It requires one parameter, which is the radius of the circle.
Note that this may make the image clip with the boundaries.

```sh
./bin/ppp smile.png radius-smile.gif radius:5
```

---

![Radius Party Smile Emoji](./examples/radius-smile.gif 'Radius Smile Emoji')

#### Rotate

The `rotate` transformation will cause your image to spin. This does not take any parameters.

```sh
./bin/ppp smile.png rotating-smile.gif rotate
```

---

![Rotating Party Smile Emoji](./examples/rotating-smile.gif 'Rotating Smile Emoji')

#### Bounce

The `bounce` transformation will cause your image to move up and down. This takes in one parameter, which is the max height from the center it will bounce.

```sh
./bin/ppp smile.png bouncing-smile.gif bounce:8
```

![Bouncing Smile Emoji](./examples/bouncing-smile.gif 'Bouncing Smile Emoji')

---

## Combining transformations

Multiple transformations may be combined by simply adding more to the arguments list. Be aware that the ordering of transformations may affect how things look.

```sh
./bin/ppp smile.png bouncing-party-smile.gif bounce:8 party
```

![Bouncing Party Smile Emoji](./examples/bouncing-party-smile.gif 'Bouncing Party Smile Emoji')

---

```sh
./bin/ppp smile.png everything-smile.gif rotate bounce:8 radius:5 background-party
```

![Everything Smile Emoji](./examples/everything-smile.gif 'Everything Smile Emoji')
