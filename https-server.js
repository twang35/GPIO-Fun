// curl -k https://localhost:8000/
const PORT=443;

const https = require('https');
const fs = require('fs');
var count = 0;

var stringResponse = '{"version": "1.0","sessionAttributes": {},"response": {"outputSpeech": {"type": "PlainText","text": "lights open all"},"card": {"type": "Simple","title": "open all","content": "Output: lights open all"},"reprompt": {"outputSpeech": {"type": "PlainText","text": ""}},"shouldEndSession": true}}';

const options = {
  key: fs.readFileSync('certs/private-key.pem'),
  cert: fs.readFileSync('certs/cert.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end(stringResponse);
  console.log(count);
}).listen(PORT);

console.log("Server listening on: https://localhost:%s", PORT);