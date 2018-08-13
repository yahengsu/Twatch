var rp = require("request-promise-native");
var constants = require("./constants.js");

module.exports = {
    followage: followage,
    getIDByUsername: getIDByUsername
};

function followage(channel, user, resp) {
    var channelName = channel.substring(1);
    getIDByUsername(channelName, (res) => {
        var channelID = res.data[0].id;
        var fromID = user["user-id"];
        var baseURL = "https://api.twitch.tv/helix/users/follows";
        var param = "?from_id=" + fromID + "&to_id=" + channelID;
        var totalURL = baseURL + param;
        var options = {
            uri: totalURL,
            headers: {
                "Client-ID" : constants.ClientID,
                "from_id" : fromID,
                "to_id" : channelID
            },
            json: true
        };
        rp(options)
            .then(resp)
            .catch((err) => {
                console.log(err);
            })
        });
    

}

function uptime(channel, user, resp) {
    var channelName = channel.substring(1);

    var baseURL = "https://api.twitch.tv/helix/streams";

}

function getIDByUsername(username, res) {
    var baseURL = "https://api.twitch.tv/helix/users";
    var param = "?login=" + username;
    var totalURL = baseURL + param;
    var options = {
        uri: totalURL,
        headers: {
            "Client-ID" : constants.ClientID
        },
        json: true
    };
    rp(options)
        .then(res)
        .catch((err) => {
            console.log(err);
        })
}