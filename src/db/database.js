const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://user1:user1@twatch-wpnwy.mongodb.net/test?retryWrites=true";
const dbName = "channels";

var database;

function connect(callback) {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, res) => {
        const db = res.db(dbName);
        database = db;
        return callback(err);
    })
}

function getDB() {
    return database;
}

async function getChannels() {
    try {
        const channels = await database.collection("channels").find({}).toArray();

        const pruned = channels.map(e => {
            return e.channel;
        })
        return pruned;
    }
    catch(err) {
        console.log(err);
    }
}
async function addChannel(channel) {
    const channelObj = {
        channel: channel,
        allowedUsers: [`${channel}`],
        commands: {}
    }
    try {
        const doc = await database.collection("channels").findOne({channel: channel});
        if(doc) {
            const msg = `User ${channel} has already been added!`;
            return msg;
        }
        else {
            const res = await database.collection("channels").insertOne(channelObj);
            console.log(res);
            const msg = `User ${channel} has been added!`;
            return msg;
        }
    }
    catch(err) {
        console.log(err);
    }
   
}

async function addAllowedUser(channel, user) {
    try {
        const chan = await database.collection("channels").findOne({channel: channel});
        var users = chan.allowedUsers;
        if(users.includes(user)) {
            const msg = `${user} is already an authorized user!`;
            return msg;
        }
        else {
            users.push(user);
            const update = await database.collection("channels").findOneAndUpdate({channel: channel}, {$set: {allowedUsers: users}});
            if(update.ok) {
                const msg = `${user} has successfully been added as an authorized user!`;
                return msg;
            }
            else {
                const msg = "Something went wrong";
                return msg;
            }
        }
    }
    catch(err) {
        console.log(err);
    }
}

async function removeAllowedUser(channel, user) {
    try {
        const chan = await database.collection("channels").findOne({channel: channel});
        var users = chan.allowedUsers;
        if(users.includes(user)) {
            users.splice(users.indexOf(user), 1);
            const update = await database.collection("channels").findOneAndUpdate({channel: channel}, {$set: {allowedUsers: users}});
            if(update.ok) {
                const msg = `${user} has been removed as an authorized user.`;
                return msg;
            }
            else {
                const msg = "Something went wrong";
                return msg;
            }
        }
    }
    catch(err) {
        console.log(err);
    }
}

async function getChannel(channel) {
    try {
        const chan = await database.collection("channels").findOne({channel: channel});
        if(chan) {
            return chan;
        }
    }
    catch(err) {
        console.log(err);
    }
}
async function removeChannel(channel) {
    try {
        const remove = await database.collection("channels").removeOne({channel: channel});
        console.log(remove);
        if(remove.result.ok) {
            const msg = `Channel ${channel} has been removed from the bot.`;
            return msg;
        }
        else {
            const msg = "Something went wrong";
            return msg;
        }
    }
    catch(err) {
        console.log(err);
    }

}

async function addCommand(channel, command, resp) {

    try {
        console.log(1);
        const user = await database.collection("channels").findOne({channel: channel});
        var doc = user.commands;
        doc[command] = resp;
        console.log(doc);
        const add = await database.collection("channels").findOneAndUpdate({channel: channel}, {$set: {commands : doc}});
        console.log(add);
        if(add.ok) {
            const msg = `${command} has been successfully added.`;
            return msg;
        }
        else {
            const msg = "Something went wrong";
            return msg;
        }
    }
    catch(err) {

    }
}

async function editCommand(channel, command, resp) {
    try {
        const user = await database.collection("channels").findOne({channel: channel});
        var doc = user.commands;
        doc[command] = resp;
        const add = await database.collection("channels").findOneAndUpdate({channel: channel}, {$set: {commands: doc}});
        console.log(add);
        if(add.ok) {
            const msg = `${command} successfully changed to: ${resp}`;
            return msg;
        }
        else {
            const msg = "Something went wrong";
            return msg;
        }
    }
    catch(err) {
        console.log(err);
    }
    
}

async function removeCommand(channel, command) {
    try {
        const user = await database.collection("channels").findOne({channel: channel});
        var doc = user.commands;
        delete doc[command];

        const remove = await database.collection("channels").findOneAndUpdate({channel: channel}, {$set: {commands: doc}});
        console.log(remove);
        if(remove.ok) {
            const msg = `${command} has successfully been removed.`;
            console.log(msg);
            return msg;
        }
        else {
            const msg = "Something went wrong";
            return msg;
        }
    }
    catch(err) {
        console.log(err);
    }

}

async function getCommand(channel, command) {
    try {
        const chan = await database.collection("channels").findOne({channel: channel});
        const res = chan.commands[command];
        return res;
    }
    catch(err) {
        console.log(err);
    }
}

module.exports = {
    connect: connect,
    db: getDB,
    addChannel: addChannel,
    getChannel: getChannel,
    getChannels: getChannels,
    removeChannel: removeChannel,
    addAllowedUser: addAllowedUser,
    removeAllowedUser: removeAllowedUser,
    addCommand: addCommand,
    editCommand: editCommand,
    removeCommand: removeCommand,
    getCommand: getCommand
}