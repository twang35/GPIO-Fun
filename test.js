var querystring = require('querystring');
var http = require('http');

var data = querystring.stringify({
  nameCommand: 'open all',
  otherStuff: 'hi tony'
});



var url = "http://216.243.7.206:8080";

http.get(url, function(res) {
    console.log("Got response: " + res.statusCode);

    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log("body: " + chunk);
    });
    
    // requestCallback(null);
}).on('error', function (e) {
    console.log("Got error: ", e);
});


console.log('I think it worked...');