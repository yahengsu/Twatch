var tmi = require("tmi.js");
var fs = require('fs');
var constants = require('./constants.js');
var requests = require("./requests.js");
let fileName = 'temp';
let fileNameConst = 1;
var options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: constants.username,
        password: constants.password
    },
    channels: constants.channels
};

var client = new tmi.client(options);

var intervalMessages = 0;
var delta = 0;

let spikeConstant = 2.5;

var uniqueChatMessages = 0;
var totalChatMessages = 0;


var chatMessagesRaw = [];
var newUsers = [];
var data = "New File Contents";

var chatMsgs = {};

setInterval(getAverage, 8000);
setInterval(debugLog, 600000);

var prevAvg = 0;
var currAvg = 0;
var maxAvg = 0;

function getAverage() {
    prevAvg = currAvg;
    currAvg = intervalMessages/5;
    if(currAvg > maxAvg) {
        maxAvg = currAvg;
    }
    if((currAvg/spikeConstant) > prevAvg) {
        handleHotspot();
    }
    intervalMessages = 0;
}


function debugLog() {
    console.log("prevAvg: " + prevAvg + " currAvg: " + currAvg + " maxAvg: " + maxAvg);
    console.log("totalMsgs: " + totalChatMessages + " uniqueMsgs: " + uniqueChatMessages);
    //writeToFile(fileName + fileNameConst + ".txt", chatMessagesRaw)
    // fileNameConst++;
}



//trimmed mean = take middle 80% values and forget about top/bottom 10%

// Connect the client to the server..
client.connect();

client.on("chat", onChatHandler);

function onChatHandler(channel, userstate, message,self) {
    if (self) return;
    
    if(message === "#followage") {
       requests.followage(channel, userstate, (res) => {
           if(res.total < 1) {
               client.say(channel, userstate.username + " is not following " + channel + "!");
           }
           else if (res.total >= 1) {
               console.log(res.data[0].followed_at);
               client.say(channel, userstate.username + " has been following " + channel + " for " + res.data[0].followed_at + "!");
           }
       })
    }
    if(chatMsgs.hasOwnProperty(message)) {
        chatMsgs[message] += 1;
    }
    else {
        chatMsgs[message] = 0 ?  chatMsgs[message] = 1 : chatMsgs[message] += 1;
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
    // console.log(chatMsgs);
} 

function followageCommand(channel, username) {

}

client.on("join", onJoinHandler);

function onJoinHandler(channel, username, self) {
    
    newUsers.push(username)
}

client.on("logon", () => {
    // Do your stuff.
});

client.on("disconnected", (reason) => {
   console.log("Disconnected: ${reason}");
});

function emoteGraph() {
    
}

function handleHotspot() {
    console.log("chat spike detected");
}


function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, function(err){
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    });
}
