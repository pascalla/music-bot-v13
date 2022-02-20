const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const GuildPermission = require("../../models/guild-permission");
const player = require('../../client/player');

module.exports = {
    name: "join",
    description: "The TruckersFM bot will join your current voice channel, and play music.",
    options: [],
    hasPermission: async (client, interaction) => {
        const guildPermission = await GuildPermission.findOne({guildId: interaction.guildId, permissionType: 'permissionFlag'}).exec().permissionId ?? 'ADMINISTRATOR';
        const guildRole = await GuildPermission.findOne({guildId: interaction.guildId, permissionType: 'roleId'}).exec();
        const hasRole = guildRole ? interaction.member.roles.cache.find(r => r.id === guildRole.permissionId) : false;

        return interaction.member.permissions.has(guildPermission) || hasRole;
    },
    run: async (client, interaction) => {
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        connection.subscribe(player.player);

        connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
            try {
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                ]);
                // Seems to be reconnecting to a new channel - ignore disconnect
            } catch (error) {
                // Seems to be a real disconnect which SHOULDN'T be recovered from
                connection.destroy();
            }
        });

        interaction.followUp({ content: `You are now tuned into TruckersFM!` });
    },
};
