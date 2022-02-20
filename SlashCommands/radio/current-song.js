const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: "current-song",
    description: "The current song playing live on TruckersFM.",
    options: [],
    hasPermission: async (client, interaction) => {
        return true;
    },
    run: async (client, interaction) => {
        axios.get('https://radiocloud.pro/api/public/v1/song/current')
            .then(response => {

                const embed = new MessageEmbed()
                    .setColor("fe28a0")
                    .setTitle("TruckersFM - Currently Playing")
                    .setThumbnail(response.data.data.album_art)
                    .addField(response.data.data.title, response.data.data.artist)
                    .setFooter("This song has been played " + response.data.data.playcount + " times!", "https://truckersfm.s3.fr-par.scw.cloud/static/tfm-2020.png");

                interaction.followUp({ embeds: [embed] });
            })
            .catch(error => {
                console.log(error);
            });
    },
};
