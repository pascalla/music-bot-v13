const axios = require('axios');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "schedule",
    description: "The schedule of presenters live today on TruckersFM.",
    options: [],
    hasPermission: async (client, interaction) => {
        return true;
    },
    run: async (client, interaction) => {
        let start = moment().startOf("day").unix();
        let end = moment().startOf("day").add(1, 'days').unix();

        axios.get(`https://radiocloud.pro/api/public/v1/slots/${start}/${end}`)
            .then((response) => {
                let shows = response.data.data;
                let now = moment().unix();

                const embed = new MessageEmbed()
                    .setColor("fe28a0")
                    .setTitle("Schedule")
                    .setFooter(`This schedule was generated at <t:${now}:t>`, "https://truckersfm.s3.fr-par.scw.cloud/static/tfm-2020.png");

                shows.forEach(function(show) {
                    embed.addField(show.user.name, `<t:${show.start}:t> until <t:${show.end}:t>`, true);
                });

                interaction.followUp({ embeds: [ embed ]});
            })
            .catch(error => {
                console.log(error);
            });
    },
};
