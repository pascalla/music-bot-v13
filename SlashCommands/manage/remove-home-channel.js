const mongoose = require("mongoose");
const HomeChannel = require("../../models/home-channel");
const GuildPermission = require("../../models/guild-permission");

module.exports = {
    name: "remove-home-channel",
    description: "Remove the home channel of the TruckersFM Bot from your guild.",
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
            await homeChannel.deleteOne({channelId: interaction.member.voice.channelId}).exec();
            interaction.followUp({ content: `You have now removed the bot's home channel.` });
        } else {
            interaction.followUp({ content: `The bot does not have a home channel in the guild..` });
        }
    },
};
