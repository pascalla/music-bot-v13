const { Client, Collection } = require("discord.js");

const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]
});
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./config.json");

client.on('error', (err) => console.log(err));

// Initializing the project
require("./handler")(client);

client.login(client.config.token);
