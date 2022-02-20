const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const moment = require('moment');

module.exports = {
    name: "upcoming",
    description: "The upcoming live presenters on TruckersFM.",
    options: [],
    hasPermission: async (client, interaction) => {
        return true;
    },
    run: async (client, interaction) => {
        axios.get('https://radiocloud.pro/api/public/v1/presenter/summary')
            .then((response) => {
                const upcoming = response.data.data.upcoming;
                const later = response.data.data.later;

                const embed = new MessageEmbed()
                    .setTitle('Upcoming')
                    .setColor("fe28a0")
                    .addField(upcoming.user.name, upcoming.description)
                    .addField("From", `<t:${upcoming.start}:f>`, true)
                    .addField("Until", `<t:${upcoming.end}:t>`, true)
                    .setThumbnail(upcoming.image)
                    .addField("\u200B", "\u200B")
                    .addField(later.user.name, later.description)
                    .addField("From", `<t:${later.start}:f>`, true)
                    .addField("Until", `<t:${later.end}:t>`, true)

                interaction.followUp({ embeds: [embed] });
            })
    },
};
