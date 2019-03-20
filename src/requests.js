const axios = require('axios');
const vars = require("./variables");


/* TWITCH API REQUESTS */
const twitchHeader = {
    headers: {
        "Client-ID": vars.clientID,
        "Authorization": `Bearer ${vars.oauthToken}`
    }
};

async function getTitle(channel, userstate) {
    const url = `https://api.twitch.tv/helix/streams/?user_login=${channel}`;
    try {
        const response = await axios.get(url, twitchHeader);
        const res = await response.data;

        if(res.data === undefined || res.data.length == 0) {
            const msg = `@${userstate.username}, ${channel} is currently offline!`;
            return msg;
        }
        else if(res.data !== undefined && res.data.length != 0) {
            const msg = `@${userstate.username}, ${res.data[0].title}`;
            return msg;
        }
    }
    catch(e) {
        commonCatch(e);
    }

}

async function getFollowage(channel, userstate) {
    const url = `https://2g.be/twitch/following.php?user=${userstate.username}&channel=${channel}&format=ymwd`;
    try {
        const response = await axios.get(url);
        const res = await response.data;
        console.log(data);
    
        const msg = `@${res}!`;
        return msg;
    }
    catch(e) {
        commonCatch(e);
    }
}

async function getUptime(channel, userstate) {
    const url = `https://api.twitch.tv/helix/streams?user_login=${channel}`;
    try {
        const response = await axios.get(url, twitchHeader);
        const res = await response.data;
        if(res.data === undefined || res.data.length == 0) {
            var notLiveMsg = `@${userstate.username}, ${channel} is currently offline!`;
            return notLiveMsg;
        }
        else if(res.data !== undefined && res.data[0].type === "live") {
            var startTime = new Date(res.data[0].started_at);
            var currentDate = new Date();
            var difference = (currentDate.getTime() - startTime.getTime()) / 1000;
            var hours = difference/3600;
            var hoursFloored = Math.floor(hours);
            var minutes = Math.round((hours - hoursFloored) * 60);
            var msg = `@${userstate.username}, ${channel} has been streaming for ${hoursFloored} hours and ${minutes} minutes!`
            return msg;
        }
    }
    catch(e) {
        commonCatch(e);
    }
   
}

async function waterHandler(channel) {
    const url = `https://api.twitch.tv/helix/streams?user_login=${channel}`;
    
    try {
        const response = await axios.get(url, twitchHeader);
        const res = await response.data;
        if(res.data === undefined || res.data.length == 0) {
            return -1;
        }
        else if(res.data !== undefined && res.data[0].type === "live") {
            var startTime = new Date(res.data[0].started_at);
            var currentTime = new Date();
            var diff = (currentTime.getTime() - startTime.getTime()) / 1000;
            var hours = diff/3600;
            var minutes = Math.round((hours - Math.floor(hours)) * 60);
            const obj = {
                hours: Math.floor(hours),
                minutes: minutes
            }
            return obj;
        }
    }
    catch(e) {
        commonCatch(e);
    }
}

async function getUserID(username) {
    const url = `https://api.twitch.tv/helix/users?login=${username}`;
    try {
        const response = await axios.get(url, twitchHeader);
        const res = await response.data;
        if(res.data === undefined || res.data.length == 0) {
            return -1;
        }
        else if(res.data !== undefined && res.data[0].id !== undefined) {
            const userID = res.data[0].id;

            return userID;
        }
    }
    catch(e) {
        commonCatch(e);
    }

}


async function twitchClipHandler(channel) {
    const userID = await getUserID(channel);
    const url = `https://api.twitch.tv/helix/clips?broadcaster_id=${userID}`;

    try {
        const response = await axios.post(url,null,twitchHeader);
        const res = await response.data;
        if(res.data === undefined || res.data.length == 0) {
            return -1;
        }
        else if(res.status == 401) {
            return -2;
        }
        else if(res.data !== undefined && res.data[0].id !== undefined) {
            console.log(res.data);
            const url = res.data[0].edit_url;
            return url;
        }
    }
    catch(e) {
        commonCatch(e);
    }
}

async function getTwitchClip(clip_id) {
    const url = `https://api.twitch.tv/helix/clips?id=${clip_id}`;

    try {
        const response = await axios.get(url, twitchHeader);
        const res = await response.data;
        if(res.data === undefined || res.data.length == 0) {
            return -1;
        }
        else if(res.data !== undefined && res.data[0].url !== undefined) {
            const clip = res.data[0];
            return clip;
        }
    }
    catch(e) {
        commonCatch(e);
    }

}

/* RIOT GAMES API REQUESTS */

async function getRiotID(summonerName) {

    const headers = {
        "X-Riot-Token": vars.riotToken
    };
    const url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`;
    try {
        const response = await axios.get(url, {headers});
        const res = await response.data;
        const id = res.id;

        return id;
    }
    catch(e) {
        commonCatch(e);
    }
}

async function getSummonerRank(summonerName) {
    const summonerID = await getRiotID(summonerName);
    const headers = {
        "X-Riot-Token": vars.riotToken
    }
    const url = `https://${vars.region}1.api.riotgames.com/lol/league/v4/positions/by-summoner/${summonerID}`;
    try {
        const response = await axios.get(url, {headers});
        const res = await response.data;
        const msg = `${res[0].summonerName} current rank: ${res[0].tier} ${res[0].rank} ${res[0].leaguePoints}LP`;
        return msg;

    } catch (e) {
        commonCatch(e);
    }
}




/* MISC FUNCTIONS */

function commonCatch(e) {
    console.log(e.config);
    if(e.response) {
        console.log("RESPONSE");
        console.log(e.response.data);
        console.log(e.response.status);
        console.log(e.response.headers);
        return "-1";
    }
    else if(e.request) {
        console.log("REQUEST");
        console.log(e.request);
        return "-2";
    }
    else {
        console.log("ERROR", e.message);
        return "-3";
    }
}


function validResponse(res) {
    if (res.data !== undefined) {
        return true;
    }
}


module.exports = {
    getTitle: getTitle,
    getFollowage: getFollowage, 
    getUptime: getUptime,
    getSummonerRank: getSummonerRank,
    waterHandler: waterHandler,
    getTwitchClip: getTwitchClip,
    twitchClipHandler: twitchClipHandler
};