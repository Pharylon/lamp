from sys import argv
import pigpio

pi = pigpio.pi()

script, red, green, blue = argv

redPin = 17
greenPin = 24
bluePin = 22

green = float(green)
blue = float(blue)


if (green > 0):
  green = green * .8
  green = int(green)

if (blue > 0):
  blue = blue * .7
  blue = int(blue)

if (red == 0 and blue == 0 and green == 0):
  pi.stop()
else:
  pi.set_PWM_dutycycle(redPin, red)
  pi.set_PWM_dutycycle(greenPin, green)
  pi.set_PWM_dutycycle(bluePin, blue)


print "Red: %s, Green: %s, Blue: %s" % (red, green, blue)
