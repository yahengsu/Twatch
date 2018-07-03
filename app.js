var tmi = require("tmi.js");

var options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: "yasungBot",
        password: "oauth:pfoa7y2gdrq927a56k01imcwrb3z7f"
    },
    channels: ["#yasung"]
};

var client = new tmi.client(options);

// Connect the client to the server..
client.connect();

client.on("chat", (channel, userstate, message, self) => {
    // Don't listen to my own messages..
    if (self) return;
    
    if(message === "!help") {
        
    }
});