const { getVoiceConnection } = require('@discordjs/voice');
const GuildPermission = require("../../models/guild-permission");
module.exports = {
    name: "leave",
    description: "The TruckersFM bot will leave your guilds voice channels.",
    options: [],
    hasPermission: async (client, interaction) => {
        const guildPermission = await GuildPermission.findOne({guildId: interaction.guildId, permissionType: 'permissionFlag'}).exec().permissionId ?? 'ADMINISTRATOR';
        const guildRole = await GuildPermission.findOne({guildId: interaction.guildId, permissionType: 'roleId'}).exec();
        const hasRole = guildRole ? interaction.member.roles.cache.find(r => r.id === guildRole.permissionId) : false;

        return interaction.member.permissions.has(guildPermission) || hasRole;
    },
    run: async (client, interaction) => {
        const connection = getVoiceConnection(interaction.guildId)

        if(connection) {
            connection.destroy();
            return interaction.followUp({ content: `The bot has left your guild's voice channel.` });
        }

        return interaction.followUp({ content: `The bot is not currently in a voice channel within your guild.` });

    },
};
