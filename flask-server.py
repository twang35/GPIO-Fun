from flask import Flask, request, jsonify, make_response
#import GPIO_Controller

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