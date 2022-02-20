const axios = require('axios');
const moment = require('moment');

module.exports = {
    name: "recently-played",
    description: "The recently played songs on TruckersFM.",
    options: [],
    hasPermission: async (client, interaction) => {
        return true;
    },
    run: async (client, interaction) => {
        axios.get('https://radiocloud.pro/api/public/v1/song/recent?limit=6')
            .then(response => {
                const embed = new MessageEmbed()
                    .setColor("fe28a0")
                    .setTitle("TruckersFM - Recently Played (GMT)")
                    .setThumbnail("https://truckersfm.s3.fr-par.scw.cloud/static/tfm-2020.png")
                    .setFooter("This Recently played was generated at " + moment().format("HH:mm") + " (GMT)", "https://truckersfm.s3.fr-par.scw.cloud/static/tfm-2020.png");
                response.data.data.reverse().forEach(function(song) {
                    embed.addField(moment.unix(song.played_at).format("HH:mm"), song.artist + " - " + song.title);
                });

                interaction.followUp({ embeds: [embed] });
            })
            .catch(error => {
                console.log(error);
            });
    },
};
