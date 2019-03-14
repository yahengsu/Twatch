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

function addChannel(channel) {
    const channelObj = {
        channel: channel,
        allowedUsers: [`${channel}`],
        commands: {}
    }

    database.collection("channels").insertOne(channelObj, (err, res) => {
        if (err) {
            throw err;
        }
        console.log("Document inserted for user: " + channel);
    });
}

function addCommand(channel, command, resp) {

}

function editCommand(channel, command, resp) {

}

function removeCommand(channel, command) {
    
}

module.exports = {
    connect: connect,
    db: getDB,
    addChannel: addChannel,
    addCommand: addCommand,
    editCommand: editCommand,
    removeCommand: removeCommand
}