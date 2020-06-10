# Default party
echo "Building default party-smile.gif"
./bin/ppp smile.png party-smile.gif

# Color speed party
echo "Building color-speed-party-smile.gif"
./bin/ppp --colorSpeed=0.5 smile.png color-speed-party-smile.gif

# Radius party
echo "Building radius-party-smile.gif"
./bin/ppp smile.png --radius=10 radius-party-smile.gif

# Rotating party
echo "Building rotating-party-smile.gif"
./bin/ppp smile.png --rotate=0.5 rotating-party-smile.gif

# Background party
echo "Building backgound-party-smile.gif"
./bin/ppp smile.png --backgroundParty=true background-party-smile.gif

# No party
echo "Building no-party-smile.gif"
./bin/ppp --noParty=true --rotate=-0.5 smile.png no-party-smile.gif
