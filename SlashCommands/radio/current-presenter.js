const { Message, MessageEmbed, Client } = require("discord.js");
const axios = require('axios');
const moment = require ('moment');

module.exports = {
    name: "current-presenter",
    description: "The Current Presenter Live on TruckersFM.",
    aliases: ['live', 'current-dj'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    hasPermission: async (client, interaction) => {
        return true;
    },
    run: async (client, interaction) => {
        axios.get('https://radiocloud.pro/api/public/v1/presenter/live')
            .then(response => {

                let dj = response.data.data.user.name;
                let show = response.data.data.description;
                let avatar = response.data.data.image;
                let from = response.data.data.start;
                var until = response.data.data.end;

                const embed = new MessageEmbed()
                    .setTitle('Currently Live')
                    .setColor("fe28a0")
                    .addField(dj, show)
                    .setThumbnail(avatar)

                if(dj === "AutoDJ"){
                    axios.get('https://radiocloud.pro/api/public/v1/presenter/upcoming')
                        .then(later => {
                            let laterName = later.data.data.user.name;
                            let laterFrom = later.data.data.start;

                            embed.addField("\u200B", "\u200B", true);
                            embed.addField(`Next up at <t:${laterFrom}:t>`, laterName);

                        })
                        .finally(() => {
                            interaction.followUp({ embeds: [embed] });
                        })
                } else {
                    embed.addField("Until",`<t:${until}:t>`);
                    interaction.followUp({ embeds: [embed] });
                }
            })
            .catch(error => {
                console.log(error);
            });
    },
};
