module.exports = {
        tmi: {
            options: {
                debug: true
            },
            connection: {
                reconnect: true
            },
            identity: {
                username: "", //BOT USERNAME
                password: "" //OATH TOKEN RETRIEVED FROM https://twitchapps.com/tmi/ 
            },
            channels: [], // LIST OF CHANNELS TO JOIN ON BOT START ["#channel1", "#channel2", etc]
        },
        clientID: "", // CLIENT ID FOR API CALLS FROM https://dev.twitch.tv/
        oauthToken: "", //OAUTH TOKEN FOR API CALLS FROM https://dev.twitch.tv/ from OAuth 2.0 Authorization Code Flow
        region: "na", //REGION TO GET OP.GG PROFILE FROM
        riotToken: "", // RIOT GAMES API TOKEN FOR LEAGUE OF LEGENDS API CALLS FROM https://developer.riotgames.com/
        dbLink: "" // MONGODB ATLAS DATABASE LINK
};