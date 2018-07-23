var tmi = require("tmi.js");
var fs = require('fs');
let fileName = 'temp.txt';

var options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: "yasungBot",
        password: "oauth:pfoa7y2gdrq927a56k01imcwrb3z7f"
    },
    channels: ["#imaqtpie"]
};

var client = new tmi.client(options);

var intervalMessages = 0;
var delta = 0;

var previousAverage = 0;
var currentAverage = 0;
var maxAverage = 0;

var spikeConstant = 2.3;

var uniqueChatMessages = 0;
var totalChatMessages = 0;

var chatMessagesRaw = [];

fs.readFile(fileName, function(err, buf) {
    console.log(buf.toString());
  });

  var data = "New File Contents";

fs.writeFile('temp.txt', data, function(err, data){
    if (err) console.log(err);
    console.log("Successfully Written to File.");
});

setInterval(getAverage, 8000);

function getAverage() {
    previousAverage = currentAverage;
    currentAverage = intervalMessages/5;
    if(currentAverage > maxAverage) {
        maxAverage = currentAverage;
    }
    if((currentAverage/spikeConstant) > previousAverage) {
        detectHotspot();
    }
    intervalMessages = 0;
}
var intervalLog = setInterval( () => {
    console.log("prevAvg: " + previousAverage + " currAvg: " + currentAverage + " maxAvg: " + maxAverage);
    console.log("totalMsgs: " + totalChatMessages + " uniqueMsgs: " + uniqueChatMessages);
}, 8000);


//trimmed mean = take middle 80% values and forget about top/bottom 10%

// Connect the client to the server..
client.connect();

client.on("chat", (channel, userstate, message, self) => {
    // Don't listen to my own messages..
    if (self) return;
    
    if(message === "!help") {
        client.action(channel, "I'm just a bot, sorry!");
    }
    
    if (chatMessagesRaw.indexOf(message) > -1) {
        totalChatMessages++;
    }
    else {
        uniqueChatMessages++;
        totalChatMessages++;
        chatMessagesRaw.push(message)
    }
    intervalMessages++;
});

client.on("join", (channel, username, self) => {
    // Do your stuff.
    console.log(username + "has joined the channel")
});

client.on("logon", () => {
    // Do your stuff.
});

client.on("disconnected", (reason) => {
    // Do your stuff.
});


function emoteGraph() {
    //
}

function detectHotspot() {
 /*
    Determine real time chat hotspots
    Surge in chat activity after good/bad play is made, can be useful for detecting highlights 
 */
    console.log("chat spike detected");
}

function isUniqueMessage() {

}
