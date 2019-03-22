# Twatch - A Twitch.tv Chat Bot

## Introduction

Twatch is a Twitch.tv chat bot made using Node.js. It takes advantage of the Twitch API to provide livestreamers with some useful functionalities, hopefully enchancing the viewer experience and creating a more enjoyable stream.

This project was simply an exploration into creating a functional Twitch.tv chatbot, and is not intended for serious use as a livestreaming tool. People looking for a good Twitch chat bot should take a look at alternatives such as [Nightbot](https://beta.nightbot.tv/) and [StreamElements](https://streamelements.com/).

## Installation

Clone the repository, and run `npm install`. You will have to replace the values in `variables.js` with your own API keys.

## Commands

Command              | Description
---------------------|------------
`!followage`         | Retrieve how long the user has been following the channel.
`!uptime`            | Displays how long the stream has been live for, or an offline messageif the stream is offline.
`!title`             | Retrieve the current stream title.
`!clear`             | Clears all the messages in the chat.
`!prime`             | Displays a Twitch Prime advertisement message.
`!rank SUMMONER_NAME`| Retrieves the rank of the summoner using the Riot Games API and displays it in chat.
`!opgg SUMMONER_NAME`| Returns a link to the summoner's op.gg profile.
`!addchannel CHANNEL_NAME`| Adds the bot to the specified channel.

## Messages On A Scheduled Interval

Some messages will be repeatedly sent to chat in a scheduled manner, with the user able to customize the interval time between each message.

Currently, the only messages that will loop repeatedly are:

`prime` - Sends a Twitch Prime advertisement message

`water` - Sends a reminder to the streamer to drink water, calculating how much water they should drink to maintain optimal hydration by using stream uptime data.

## Custom Commands

CURRENTLY BROKEN

Custom commands can be set by using the following schema:

`!cmd OPERATION ARGS`

Where `OPERATION` is one of `add`, or, `remove`, and `ARGS` depends on the type of operation. Custom commands can only be set by either the broadcaster or an `allowedUser`.

OPERATION | ARGS | EXAMPLE
--- | --- | ---
ADD | `identifier message` | `!cmd add rng Just get the better team 4Head`
REMOVE | `identifier` | `!cmd remove rng`
EDIT | `identifier updatedMessage` | `!cmd edit rng Never luck MonkaS`

## Configuration

There are also some commands that broadcasters and moderators can use to customize their bot experience.

COMMAND | DESCRIPTION |
--- | ---
`!adduser USERNAME` | Adds the specified user to the `allowedUsers` list. `allowedUsers` have elevated bot permissions, and can manage custom commands for the channel. Can only be used by the broadcaster.
`!removeuser USERNAME` | Removes the specified user from the `allowedUsers` list. Can only be used by the broadcaster.
`!listall` | Returns a space-separated string of all of the custom commands that have been created. eg. `!command1 !command2 !command3`


## Todo/Future Features

- Fix CRUD operations for commands
- Deploy to hosting service
- Music integration with Spotify API
- !clip command
