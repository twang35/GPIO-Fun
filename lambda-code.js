var querystring = require('querystring');
var http = require('http');
var endpoint = "http://216.243.7.206:8080";

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } 
    } catch (e) {
        context.fail("Exception: " + e);
    }
};


function onIntent(intentRequest, session, onIntentCallback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;
    var cardTitle = intent.slots.NameCommand.value;
    var nameCommandSlot = intent.slots.NameCommand;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    var nameCommand = nameCommandSlot.value;

    speechOutput = "lights " + nameCommand;

    var runImmediately = function (intent) {

        // Call requestFunction to make the http.get call.
        // Get response from requestFunction using requestCallback
        requestFunction(function requestCallback(err) {

            // If error occurs during http.get request - respond with console.log
            if (err) {
                console.log('HTTP Error: request not sent');
            }
            else {
                onIntentCallback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }
        });
    }();


}

function requestFunction(requestCallback) {
    var post_data = {Stuff: 'foobar'};
    var post_data_string = querystring.stringify(post_data);

    var post_options = {
        host: '216.243.7.206',
        port: '8080',
        path: '',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data_string)
        }
    };

    var post_req = http.request(post_options, function(res) {
        console.log("Got response: " + res.statusCode);

        // res.setEncoding('utf8');
        // res.on('data', function (chunk) {
        //     console.log("body: " + chunk);
        // });

        console.log('t3');
        
        requestCallback(null);
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });

    console.log("POST data: " + post_data_string);

    post_req.write(post_data_string);
    console.log("t1");
    post_req.end();
    console.log("t2");
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: "Output: " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}