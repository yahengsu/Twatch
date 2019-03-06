const MongoClient = require('mongodb').MongoClient;

var _db;

function connect(callback) {
    MongoClient.connect('mongodb://localhost:27017/channels', {useNewUrlParser: true}, (err, db) => {
        _db = db;
        return callback(err);
    });
}

function db() {
    return _db;
}

function insertChannel(channel) {
    console.log("INSERT CHANNEL");
    var channelObj = {
        channel: channel,
        allowedUsers: [],
        commands: {}
    }

    _db.collection("channels").insertOne(channelObj, (err, res) => {
        if (err) {
            throw err;
        }
        console.log("DOCUMENT INSERTED");
        console.log(res);
    });
}
module.exports = {
    connect: connect,
    db: db,
    insertChannel: insertChannel
}