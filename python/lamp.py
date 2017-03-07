from sys import argv
import pigpio

pi = pigpio.pi()

script, red, green, blue = argv

redPin = 17
greenPin = 24
bluePin = 22

if (red == 0 and blue == 0 and green == 0):
  pi.stop()
else:
  redStart = pi.get_PWM_dutycycle(redPin)
  greenStart = pi.get_PWM_dutycycle(greenPin)
  blueStart = pi.get_PWM_dutycycle(redPin)


  pi.set_PWM_dutycycle(redPin, red)
  pi.set_PWM_dutycycle(greenPin, green)
  pi.set_PWM_dutycycle(bluePin, blue)


print "Red: %s, Green: %s, Blue: %s" % (red, green, blue)