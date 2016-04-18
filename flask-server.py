from flask import Flask, request, jsonify, make_response

import sys
import serial
from time import sleep

# Config
serPort = serial.Serial('/dev/ttyACM0', 19200, timeout=1)
sleepTime = 0.25
powerPorts = [0,1,2,3]
on1 = 7
on2 = 5
off1 = 6
off2 = 4
nameCommandMap = {	'on': 		[on1,on2],
					'all on':	[on1,on2],
					'off':		[off1,off2],
					'all off':	[off1,off2],
					'open all':	[on1,on2],
					'close all':[off1,off2],
					'on 1':		[on1],
					'on 2':		[on2],
					'on to':	[on2],
					'off 1':	[off1],
					'off 2':	[off2],
					'off to':	[off2]
				}

def handlePOST(nameCommand):
	if nameCommand in nameCommandMap:
		cycleThrough(nameCommandMap[nameCommand])
		return True
	else:
		return False

def cycleThrough(ports):
	for port in ports:
		click(port)
	return

def click(num):
	num = str(num)
	serPort.write("gpio clear " + num + "\r")
	sleep(sleepTime)
	serPort.write("gpio set " + num + "\r")
	return

def powerOn(ports):
	for port in ports:
		serPort.write("gpio set " + str(port) + "\r")
	return

def powerOff(ports):
	for port in ports:
		serPort.write("gpio clear " + str(port) + "\r")
	return

powerOn(powerPorts)

app = Flask(__name__)

@app.route('/API', methods=['POST', 'GET'])
def controller():
	if request.method == 'POST':
		if handlePOST(request.args.get('nameCommand')):
			return 'Success'
		else:
			return make_response(jsonify({'error': 'NameCommand not found'}), 405)
	else:
		return 'foo'

if __name__ == '__main__':
	app.debug=True
	app.run(port=8080, host='0.0.0.0')
