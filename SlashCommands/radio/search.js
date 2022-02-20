const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: "search",
    description: "Find out about songs played on TruckersFM",
    options: [
        {
            name: "search",
            description: "Song title or artist",
            type: "STRING",
            required: true
        }
    ],
    hasPermission: async (client, interaction) => {
        return true;
    },
    run: async (client, interaction) => {
        const search = interaction.options.getString("search");

        axios.get('https://radiocloud.pro/api/public/v1/songs?search='+ search +'&limit=5')
            .then((response) => {
                let results = response.data.data;
                const embed = new MessageEmbed()
                    .setColor("fe28a0")
                    .setTitle("Search results for '"+ search + "'")
                    .setFooter("The top 5 most played results for " + search + ".");

                if(results[0]?.album_art) {
                    embed.setThumbnail(results[0].album_art)
                }

                results.forEach(function(song) {
                    embed.addField("Played " + song.playcount + " times!", song.artist + " - " + song.title);
                });

                interaction.followUp({ embeds: [embed] });
            })
            .catch(error => {
                console.log(error);
            });


    },
};
