const { Client, CommandInteraction } = require("discord.js");

module.exports = {
    name: "ping",
    description: "returns websocket ping",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    hasPermission: async (client, interaction) => {
        return true;
    },
    run: async (client, interaction, args) => {
        interaction.followUp({ content: `${client.ws.ping}ms!` });
    },
};
