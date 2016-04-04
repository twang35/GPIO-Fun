import sys
import serial

serPort = serial.Serial('/dev/ttyACM0', 19200, timeout=1)


serPort.write("gpio set 0\r")
# serPort.write("gpio read 0\r")
# serport.write("gpio clear 0\r")
