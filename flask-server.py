from flask import Flask, request, jsonify, make_response

import sys
import serial
from time import sleep

# Config
serPort = serial.Serial('/dev/ttyACM0', 19200, timeout=1)
sleepTime = 0.25
nameCommandMap = {	'on': 		[0,2],
					'all on':	[0,2],
					'off':		[1,3],
					'all off':	[1,3],
					'open all':	[0,2],
					'close all':[1,3]
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
	serPort.write("gpio set " + num + "\r")
	sleep(sleepTime)
	serPort.write("gpio clear " + num + "\r")
	return


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
