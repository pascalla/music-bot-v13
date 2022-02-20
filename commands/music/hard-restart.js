const { Message, Client } = require("discord.js");
const { createAudioResource, StreamType } = require("@discordjs/voice");

const player = require('../../client/player');

module.exports = {
    name: "hard-restart",
    aliases: ['hr'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    hasPermission: async (client, message) => {
        const owners = [
            '156560379089125376',
            '167585966838513673',
            '130038716260417536',
            '150987570715688960',
            '447792982284959744',
            '232271241224912896',
            '192952609206829057',
            '187647689448488961',
            '401390613595160576',
            '336221319618363394',
            '247113141945630721'
        ];

        return owners.includes(message.member.id);
    },
    run: async (client, message, args) => {
        player.resource = createAudioResource('http://radio.truckers.fm/radio-ogg', {
            inputType: StreamType.OggOpus,
        });
        player.player.play(player.resource)
        message.reply(`Successfully restarted audio resource on voice connections.`);
    },
};
