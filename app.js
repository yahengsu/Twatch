const tmi = require("tmi.js");
const vars = require("./variables");
const requests = require("./requests");
const client = new tmi.client(vars.tmi);
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/channels";
var channels;
MongoClient.connect(url, {useNewUrlParser: true}, (err, db) => {
    if (err) {
        throw err;
    }
    console.log("Database created");
    channels = db;
});

addChannel("Yasung");

client.on("message", onMessage);
client.on("connected", onConnect);

client.connect();
function onConnect(add, port) {
    console.log(`connected to ${add}:${port}`);
}

const COMMAND_INTERVAL = 900000; // - 15 minute interval
// const COMMAND_INTERVAL = 1000;
setInterval(twitchPrimeReminder, COMMAND_INTERVAL);
setInterval(waterReminder, COMMAND_INTERVAL * 2);

//METHOD IS RUN EVERY TIME A NEW MESSAGE IS TYPED IN CHAT
function onMessage(chan, userstate, message, self) {
    var channel = chan.substring(1);
    if (self) {
        return;
    }
    const msg = message.trim();
    if (msg === "#title") {
        titleHandler(channel, userstate);
    }
    if (msg === "#followage") {
        followageHandler(channel, userstate);
    }
    if (msg === "#uptime") {
        uptimeHandler(channel, userstate);
    }
    if (msg === "#clear") {
        clearChatHandler(channel);
    }
    if (msg === "#help") {
        const message = `gist.github.com`;
        client.say(channel, message);
    }
    if (msg === "#prime") {
        twitchPrimeReminder(channel);
    }
    if (msg.startsWith("#rank")) {
        getRankHandler(channel, userstate, msg);
    }
    if (msg.startsWith("#set")) {
        setCommandHandler(channel);
    }
    if (msg.startsWith("#opgg")) {
        getOPGGHandler(channel, userstate, msg);
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
    const msg = `It's been a while since `;
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



/* DATABSE FUNCTIONS */

function addChannel(channel) {
    var db = mongo.db();

    var channelObj = {
        channel: channel,
        allowedUsers: [],
        commands: {}
    }
    db.collection("channels").insertOne(channelObj, (err, res) => {
        if (err) {
            throw err;
        }
        console.log(res);
    });
    // mongo.insertChannel(channel);
}