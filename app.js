var tmi = require("tmi.js");
var fs = require('fs');
var constants = require('./constants.js');
var requests = require("./requests.js");
var plotly = require("plotly")(constants.plotlyUser, constants.plotlyKey);

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

let spikeConstant = 2.5;

var uniqueChatMessages = 0;
var totalChatMessages = 0;


var chatMessagesRaw = [];
var newUsers = [];

var chatMsgs = [];

setInterval(getAverage, 8000);
setInterval(debugLog, 8000);

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
    console.log(chatMsgs);
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
        followageDateHandler(channel, userstate);
    }
    if(message === "#uptime") {
        uptimeHandler(channel, userstate);
    }
    if(message === "#title") {
        streamTitleHandler(channel, userstate);
    }
    if(message === "#blackfr0st" && channel === "#yasung") {
        client.say(channel, "https://imgur.com/0I3W6fQ");
    }

    chatMsgs.forEach((element) => {
        if (element.message == message) {
            element.count++;
        }
    });
    if(chatMsgs.includes()) {
        chatMsgs[message] += 1;
    }
    else {
       chatMsgs[message] = 1;
       uniqueChatMessages++;
    }
    intervalMessages++;
} 

function followageDateHandler(channel, userstate) {
    var prefix = "@" + userstate.username + ", ";
    requests.followage(channel, userstate, (res) => {
        if(res.total < 1) {
            client.say(channel, prefix + userstate.username + " is not following " + channel.substring(1) + "!");
        }
        else if (res.total == 1) {
            var followDate = new Date(res.data[0].followed_at);
            var currentDate = new Date();
            var difference = (currentDate.getTime() - followDate.getTime()) / 1000; //difference in date in seconds
            var days = difference/60/60/24;
            var daysFloored = Math.floor(days);
            var hours = Math.round((days - daysFloored) * 24);
            client.say(channel, prefix + userstate.username + " has been following " + channel.substring(1) + " for " + daysFloored + " days and " + hours + " hours!");
        }
    });
    
}

function uptimeHandler(channel) {
    var prefix = "@" + userstate.username + ", ";
    requests.uptime(channel, (res) => {
        if(res.data === undefined || res.data.length == 0) {
            client.say(channel, prefix + channel.substring(1) + " is not live!");
        }
        else if(res.data[0].type === "live") {
            var startTime = new Date(res.data[0].started_at);
            var currentDate = new Date();
            var difference = (currentDate.getTime() - startTime.getTime()) / 1000;
            var hours = difference /60/60;
            var hoursFloored = Math.floor(hours);
            var minutes = Math.round((hours - hoursFloored) * 60);
            client.say(channel, prefix + channel.substring(1) + " has been streaming for " + hoursFloored + " hours and " + minutes + " minutes!");
        }
    });
}

function streamTitleHandler(channel, userstate) {
    var prefix = "@" + userstate.username + ", ";
    requests.streamTitle(channel, (res) => {
        if(res.data === undefined || res.data.length == 0) {
            client.say(channel, prefix + channel.substring(1) + " is not live!");
        }
        else if(res.data[0].type === "live") {
            var title = res.data[0].title;
            client.say(channel, prefix + "Current Stream Title: " + title);
        }
    });
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
    //plot to graph
    console.log("chat spike detected");
}


function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, function(err){
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    });
}
