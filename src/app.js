const tmi = require("tmi.js");
const vars = require("./variables");
const dotenv = require("dotenv").config();
const requests = require("./requests");
const client = new tmi.client(vars.tmi);
const mongo = require("./db/database");
mongo.connect(err => {
  if (err) {
    throw err;
  } else {
    console.log("Successfully connected to Database");
  }
});

client.connect();
client.on("message", onMessage);
client.on("connected", onConnect);

function onConnect(add, port) {
  console.log(`connected to ${add}:${port}`);
}

const COMMAND_INTERVAL = 900000; // - 15 minute interval
setInterval(twitchPrimeReminder, COMMAND_INTERVAL);
setInterval(waterReminder, COMMAND_INTERVAL * 2);
setInterval(stretchReminder, COMMAND_INTERVAL * 4);

//METHOD IS RUN EVERY TIME A NEW MESSAGE IS TYPED IN CHAT
function onMessage(chan, userstate, message, self) {
  const channel = chan.substring(1);
  if (self) {
    return;
  }
  const msg = message.trim();
  if (msg === "!title") {
    titleHandler(channel, userstate);
  } else if (msg === "!followage") {
    followageHandler(channel, userstate);
  } else if (msg === "!uptime") {
    uptimeHandler(channel, userstate);
  } else if (msg === "!clear") {
    clearChatHandler(channel);
  } else if (msg === "!help") {
    helpHandler(channel, userstate);
  } else if (msg === "!prime") {
    twitchPrimeReminder(channel);
  } else if (msg === "!clip") {
    twitchClipHandler(channel, userstate);
  } else if (msg === "!addchannel") {
    addChannelHandler(channel, userstate);
  } else if (msg === "!removechannel") {
    removeChannelHandler(channel, userstate);
  } else if (msg === "!listall") {
    listAllCommandsHandler(channel, userstate);
  } else if (msg.startsWith("!adduser")) {
    addUserHandler(channel, userstate, msg);
  } else if (msg.startsWith("!removeuser")) {
    removeUserHandler(channel, userstate, msg);
  } else if (msg.startsWith("!rank")) {
    getRankHandler(channel, userstate, msg);
  } else if (msg.startsWith("!cmd")) {
    commandHandler(channel, userstate, msg);
  } else if (msg.startsWith("!opgg")) {
    getOPGGHandler(channel, userstate, msg);
  } else if (msg.startsWith("!")) {
    customCommandHandler(channel, msg);
  }
}

/* SCHEDULED CHAT MESSAGES */

//TWITCH PRIME REMINDER !prime

function twitchPrimeReminder(channel) {
  const msg = `Did you know you get a free subscription to your favourite streamer every 30 days with your Amazon Prime membership? Learn more here https://twitch.tv/prime`;
  client
    .say(channel, msg)
    .then(channel => console.log(channel))
    .catch(e => console.log(e));
}

async function waterReminder(channel) {
  const obj = await requests.waterHandler(channel);
  if (obj !== -1) {
    const waterML = obj.hours * 250 + obj.minutes * 4; // water amount in mL
    const waterOZ = (waterML / 29.574).toFixed(2);
    const msg = `@${channel}, you have been streaming for ${obj.hours} hours and ${obj.minutes} minutes. By now you should have consumed ${waterML} mL / ${waterOZ} oz. of water to for optimal hydration.`;
    client
      .say(channel, msg)
      .then(channel => console.log(channel))
      .catch(e => console.log(e));
  }
}

function stretchReminder(channel) {
  const msg = `A reminder to everyone to get up and stretch every once in a while! Take breaks to destress and untilt!`;
  client
    .say(channel, msg)
    .then(channel => console.log(channel))
    .catch(e => console.log(e));
}

/* TWITCH API REQUESTS */

//STREAM TITLE COMMAND !title

async function titleHandler(channel, userstate) {
  const msg = await requests.getTitle(channel, userstate);
  client
    .say(channel, msg)
    .then(channel => console.log(channel))
    .catch(e => console.log(e));
}

//FOLLOWAGE COMMAND !followage
async function followageHandler(channel, userstate) {
  if (channel === userstate.username) {
    const msg = "Can't check followage of yourself!";
    client
      .say(channel, msg)
      .then(channel => console.log(channel))
      .catch(e => console.log(e));
  } else {
    const msg = await requests.getFollowage(channel, userstate);
    client
      .say(channel, msg)
      .then(channel => console.log(channel))
      .catch(e => console.log(e));
  }
}

//UPTIME COMMAND !uptime
async function uptimeHandler(channel, userstate) {
  const msg = await requests.getUptime(channel, userstate);
  client
    .say(channel, msg)
    .then(channel => console.log(channel))
    .catch(e => console.log(e));
}

//CLEAR CHAT COMMAND !clear

function clearChatHandler(channel) {
  client
    .clear(channel)
    .then(() => {
      console.log("CHAT CLEARED");
    })
    .catch(err => {
      console.log(err);
    });
}

async function twitchClipHandler(channel, userstate) {
  const url = await requests.twitchClipHandler(channel);
  if (url == -2) {
    const msg = `@${userstate.username}, the clip failed to generate. (401)`;
    client
      .say(channel, msg)
      .then(channel => console.log(channel))
      .catch(e => console.log(e));
  } else {
    const msg = `@${userstate.username}, the clip was successfully generated: ${url}`;
    client
      .say(channel, msg)
      .then(channel => console.log(channel))
      .catch(e => console.log(e));
  }
}

//CHAT HELP COMMAND !help

function helpHandler(channel, userstate) {
  const msg = `@${userstate.username}, command documentation can be found here: https://github.com/yahengsu/Twatch`;
  client
    .say(channel, msg)
    .then(channel => console.log(channel))
    .catch(e => console.log(e));
}

/* LEAGUE OF LEGENDS API REQUESTS */

async function getRankHandler(channel, userstate, msg) {
  const summonerName = msg.split(" ")[1];
  const reply = await requests.getSummonerRank(summonerName);
  const msg = `@${userstate.username}, ${reply}`;
  client
    .say(channel, msg)
    .then(channel => console.log(channel))
    .catch(e => console.log(e));
}

function getOPGGHandler(channel, userstate, msg) {
  const username = msg.split(" ")[1];
  const region = opts.region;
  const msg = `@${userstate.username}, https://${region}.op.gg/summoner/userName=${username}`;
  client
    .say(channel, msg)
    .then(channel => console.log(channel))
    .catch(e => console.log(e));
}

// commandHandler("asdf", "123", "!cmd add test this is a test message");

async function commandHandler(channel, userstate, msg) {
  //CHECK IF CHANNEL EXISTS
  if (!mongo.getChannel(channel)) {
    return;
  } else {
    //allowed user
    const user = userstate.username;
    const chan = await mongo.getChannel(channel);
    if (!chan.allowedUsers.includes(user)) {
      return;
    } else {
      const msgSplit = msg.split(" ");
      const operation = msgSplit[1];
      if (operation === "add") {
        const id = "!" + msgSplit[2];
        var message = msgSplit.slice(3).join(" ");
        const msg = await mongo.addCommand(channel, id, message);
        client
          .say(channel, msg)
          .then(channel => console.log(channel))
          .catch(e => console.log(e));
      }
      //!cmd edit test this is the new message
      else if (operation === "edit") {
        //edit the command
        const id = "!" + msgSplit[2];
        const message = msgSplit.slice(3).join(" ");
        const msg = await mongo.editCommand(channel, id, message);
        client
          .say(channel, msg)
          .then(channel => console.log(channel))
          .catch(e => console.log(e));
      }
      //!cmd remove test
      else if (operation === "remove") {
        //remove the command
        const id = "!" + msgSplit[2];
        const msg = await mongo.removeCommand(channel, id);
        client
          .say(channel, msg)
          .then(channel => console.log(channel))
          .catch(e => console.log(e));
      }
    }
  }
}

async function customCommandHandler(channel, msg) {
  if (!mongo.getChannel(channel)) {
    return;
  } else {
    const chan = await mongo.getChannel(channel);
    const commands = chan.commands;
    if (msg in commands) {
      const msg = commands[msg];
      client
        .say(channel, msg)
        .then(channel => console.log(channel))
        .catch(e => console.log(e));
    }
  }
}

/* DATABSE FUNCTIONS */

async function addChannelHandler(channel, userstate) {
  if (channel !== "yasungbot") {
    return;
  } else {
    const msg = await mongo.addChannel(userstate.username);
    client
      .say(channel, msg)
      .then(channel => console.log(channel))
      .catch(e => console.log(e));
  }
}

async function removeChannelHandler(channel, userstate) {
  if (channel !== "yasungbot") {
    return;
  } else {
    const msg = await mongo.removeChannel(userstate.username);
    client
      .say(channel, msg)
      .then(channel => console.log(channel))
      .catch(e => console.log(e));
  }
}

//TODO
async function addUserHandler(channel, userstate, msg) {
  const user = msg.split(" ")[1];
  if (!mongo.getChannel(channel)) {
    return;
  } else {
    const chan = await mongo.getChannel(channel);
    if (!chan.allowedUsers.includes(userstate.username)) {
      return;
    }
    const msg = await mongo.addAllowedUser(channel, user);
    client
      .say(channel, msg)
      .then(channel => console.log(channel))
      .catch(e => console.log(e));
  }
}

async function removeUserHandler(channel, userstate, msg) {
  const user = msg.split(" ")[1];
  if (!mongo.getChannel(channel)) {
    return;
  } else {
    const chan = await mongo.getChannel(channel);
    if (!chan.allowedUsers.includes(userstate.username)) {
      return;
    }
    const msg = await mongo.removeAllowedUser(channel, user);
    client
      .say(channel, msg)
      .then(channel => console.log(channel))
      .catch(e => console.log(e));
  }
}

async function listAllCommandsHandler(channel, userstate) {
  const res = await mongo.getCommands(channel);
  const msg = `@${userstate.username}, commands: ${res}`;

  client
    .say(channel, msg)
    .then(channel => console.log(channel))
    .catch(e => console.log(e));
}
