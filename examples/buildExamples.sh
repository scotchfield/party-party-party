# Default party
echo "Building default party-smile.gif"
../bin/ppp smile.png party-smile.gif party

# Color speed party - TODO Figure out how to do transforms like this
#echo "Building color-speed-party-smile.gif"
#./bin/ppp --colorSpeed=0.5 smile.png color-speed-party-smile.gif

# Background party
echo "Building backgound-party-smile.gif"
../bin/ppp smile.png background-party-smile.gif background-party

# Radius
echo "Building radius-smile.gif"
../bin/ppp smile.png radius-smile.gif radius:5

# Rotating
echo "Building rotating-smile.gif"
../bin/ppp smile.png rotating-smile.gif rotate

# Bouncing
echo "Building bouncing-smile.gif"
../bin/ppp smile.png bouncing-smile.gif bounce:8

# Static
echo "Building static-smile.gif"
../bin/ppp smile.png static-smile.gif static:1.5

# Bouncing Party
echo "Building bouncing-party-smile.gif"
../bin/ppp smile.png bouncing-party-smile.gif bounce:8 party

# Rotating Bouncing Radius Party
echo "Building everything-smile.gif"
../bin/ppp smile.png everything-smile.gif static:1.5 rotate bounce:8 radius:5 background-party
