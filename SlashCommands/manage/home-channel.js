const mongoose = require("mongoose");
const HomeChannel = require("../../models/home-channel");
const GuildPermission = require("../../models/guild-permission");

module.exports = {
    name: "home-channel",
    description: "The TruckersFM bot will set the channel you are currently in as the home channel.",
    options: [],
    hasPermission: async (client, interaction) => {
        const guildPermission = await GuildPermission.findOne({guildId: interaction.guildId, permissionType: 'permissionFlag'}).exec().permissionId ?? 'ADMINISTRATOR';
        const guildRole = await GuildPermission.findOne({guildId: interaction.guildId, permissionType: 'roleId'}).exec();
        const hasRole = guildRole ? interaction.member.roles.cache.find(r => r.id === guildRole.permissionId) : false;

        return interaction.member.permissions.has(guildPermission) || hasRole;
    },
    run: async (client, interaction) => {

        let homeChannel = await HomeChannel.findOne({guildId: interaction.guildId}).exec();

        if(homeChannel) {
            await homeChannel.updateOne({channelId: interaction.member.voice.channelId}).exec();
        } else {
            homeChannel = new HomeChannel({
                _id: mongoose.Types.ObjectId(),
                guildId: interaction.guildId,
                shardId: interaction.guild.shardId,
                channelId: interaction.member.voice.channelId
            })

            homeChannel.save()
                .then(() => {})
                .catch(err => console.log(err));
        }

        interaction.followUp({ content: `You have now set the home channel.` });
    },
};
