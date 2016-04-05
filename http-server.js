var http = require("http"),
    port = 8080;
var count = 0;

http.createServer(function(request, response) {
	if (request.method == 'POST') {
		response.writeHead(200);
		response.write("hello alexa\n");
		response.end();
		
		request.on('data', function (chunk) {
	        console.log("body: " + chunk);
	    });
	}
}).listen(port);

console.log("Server running on " + port);