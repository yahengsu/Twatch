const tmi = require("tmi.js");
const vars = require("./variables");
const requests = require("./requests");
const client = new tmi.client(vars.tmi);
const mongo = require('./db/database');

mongo.connect((err) => {
    if(err) {
        throw err;
    }
    else {
        console.log("Successfully connected to Database");
        addChannel("Yasung");
    }
})


client.on("message", onMessage);
client.on("connected", onConnect);

client.connect();
function onConnect(add, port) {
    console.log(`connected to ${add}:${port}`);
}

const prefix = "!";
const COMMAND_INTERVAL = 900000; // - 15 minute interval
// const COMMAND_INTERVAL = 1000;
// setInterval(twitchPrimeReminder, COMMAND_INTERVAL);
// setInterval(waterReminder, COMMAND_INTERVAL * 2);

//METHOD IS RUN EVERY TIME A NEW MESSAGE IS TYPED IN CHAT
function onMessage(chan, userstate, message, self) {
    const channel = chan.substring(1);
    if (self) {
        return;
    }
    const msg = message.trim();
    if (msg === "#title") {
        titleHandler(channel, userstate);
    }
    else if (msg === "#followage") {
        followageHandler(channel, userstate);
    }
    else if (msg === "#uptime") {
        uptimeHandler(channel, userstate);
    }
    else if (msg === "#clear") {
        clearChatHandler(channel);
    }
    else if (msg === "#help") {
        helpHandler(channel, userstate);
    }
    else if (msg === "#prime") {
        twitchPrimeReminder(channel);
    }
    else if (msg === "#clip") {
        twitchClipHandler(channel, userstate);
    }
    else if (msg.startsWith("#rank")) {
        getRankHandler(channel, userstate, msg);
    }
    else if (msg.startsWith("#cmd")) {
        commandHandler(channel, userstate, msg);
    }
    else if (msg.startsWith("#opgg")) {
        getOPGGHandler(channel, userstate, msg);
    }
    else if (msg.startsWith("#addchannel")) {
        addChannelHandler();
    }
    else if (msg.startsWith("#")) {
        customCommandHandler(channel, userstate, msg);
    }
}


/* SCHEDULED CHAT MESSAGES */

//TWITCH PRIME REMINDER !prime

function twitchPrimeReminder(channel) {
    const msg = `Did you know you get a free subscription to your favourite streamer every 30 days with your Amazon Prime membership? Learn more here https://twitch.tv/prime`;
    client.say(channel, msg);
}

async function waterReminder(channel) {
    const obj = await requests.waterHandler(channel);
    if(obj !== -1) {
        const waterML = (obj.hours * 250) + (obj.minutes * 4); // water amount in mL
        const waterOZ = (waterML / 29.574).toFixed(2);
        const msg = `@${channel}, you have been streaming for ${obj.hours} hours and ${obj.minutes} minutes. By now you should have consumed ${waterML} mL / ${waterOZ} oz. of water to for optimal hydration.`;
        client.say(channel, msg);
        console.log(msg);
    }
    
}

function stretchReminder(channel) {
    const msg = `A reminder to everyone to get up and stretch every once in a while! Also make sure your posture is `;
}

/* TWITCH API REQUESTS */

//STREAM TITLE COMMAND !title

async function titleHandler(channel, userstate) {
    const msg = await requests.getTitle(channel, userstate);
    client.say(channel,msg);
}


//FOLLOWAGE COMMAND !followage
async function followageHandler(channel, userstate) {
    const msg = await requests.getFollowage(channel, userstate);
    client.say(channel,msg);
}

//UPTIME COMMAND !uptime
async function uptimeHandler(channel, userstate) {
   const msg = await requests.getUptime(channel, userstate);
   client.say(channel, msg);
}


//CLEAR CHAT COMMAND !clear

function clearChatHandler(channel) {
    client.clear(channel)
    .then(() => {
        console.log("CHAT CLEARED");
    }).catch((err) => {
        console.log(err);
    }); 
}


function twitchClipHandler(channel) {
    const url = await requests.twitchClipHandler(channel);
    const msg = "";
    client.say(channel, msg);
}


//CHAT HELP COMMAND !help

function helpHandler(channel, userstate) {
    const msg = `@${userstate.username}, command documentation can be found here: https://github.com/yahengsu/Twatch`;
    client.say(channel, msg);
}

/* LEAGUE OF LEGENDS API REQUESTS */


async function getRankHandler(channel, userstate, msg) {
    const summonerName = msg.split(" ")[1];
    const reply = await requests.getSummonerRank(summonerName);
    client.say(channel,`@${userstate.username}, ${reply}`);
}


function getOPGGHandler(channel, userstate, msg) {
    const username = msg.split(" ")[1];
    const region = opts.region;
    const link = `@${userstate.username}, https://${region}.op.gg/summoner/userName=${username}`
    client.say(channel, link);
}

// commandHandler("asdf", "123", "!cmd add test this is a test message");

function commandHandler(channel, userstate, msg) {
    //CHECK IF CHANNEL EXISTS
    var db = mongo.db();
    
    //CHECK IF USER IS ALLOWED USER
    const msgSplit = msg.split(" ");
    const operation = msgSplit[1];
    if (operation === "add") {
        const id = "!" + msgSplit[2];
        var message = msgSplit.slice(3).join(" ");
        mongo.addCommand(channel,id,message);
    }
    //!cmd edit test this is the new message
    else if (operation === "edit") {
        //edit the command
        const id = "!" + msgSplit[2];
        const message = msgSplit.slice(3).join(" ");
        mongo.editCommand(channel,id,message);
    }
    //!cmd remove test
    else if (operation === "remove") {
        //remove the command
        const id = "!" + msgSplit[2];
        mongo.removeCommand(channel, id);
    }
}


function customCommandHandler(channel, userstate, msg) {

}

/* DATABSE FUNCTIONS */

function addChannel(channel) {
    console.log(1);
    mongo.addChannel(channel);
    console.log(2);
}