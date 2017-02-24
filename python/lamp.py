from sys import argv
import pigpio

pi = pigpio.pi()

script, red, green, blue = argv

redPin = 17
greenPin = 22
bluePin = 24

if (red == 0 and blue == 0 and green == 0):
  pi.stop()
else:
  pi.set_PWM_dutycycle(redPin, red)
  pi.set_PWM_dutycycle(greenPin, green)
  pi.set_PWM_dutycycle(bluePin, blue)


print "Red: %s, Green: %s, Blue: %s" % (red, green, blue)