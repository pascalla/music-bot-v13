const mongoose = require("mongoose");
const GuildPermission = require("../../models/guild-permission");

const flags = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'PRIORITY_SPEAKER',
    'STREAM',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
];

module.exports = {
    name: "set-permission",
    description: "The TruckersFM bot will set this Discord permission flag as allowed to manage the bot in this server",
    options: [
        {
            name: "permission",
            description: "Discord Permission Flag",
            type: "STRING",
            required: true,
        },
    ],
    hasPermission: async (client, interaction) => {
        const guildPermission = await GuildPermission.findOne({guildId: interaction.guildId, permissionType: 'permissionFlag'}).exec().permissionId  ?? 'ADMINISTRATOR';

        return interaction.member.permissions.has(guildPermission, true);
    },
    run: async (client, interaction) => {
        const permissionFlag = interaction.options.getString("permission");

        if(!flags.includes(permissionFlag)) {
            return interaction.followUp({ content: `'${permissionFlag}' is not a valid Discord Bitfield.` });
        }

        let guildPermission = await GuildPermission.findOne({guildId: interaction.guildId, permissionType: 'permissionFlag'}).exec();

        if(guildPermission) {
            await guildPermission.updateOne({permissionId: permissionFlag}).exec();
        } else {
            const guildPermission = new GuildPermission({
                _id: mongoose.Types.ObjectId(),
                guildId: interaction.guildId,
                permissionId: permissionFlag,
                permissionType: 'permissionFlag'
            })

            guildPermission.save()
                .then()
                .catch(err => console.log(err));
        }

        interaction.followUp({ content: `You have set the TruckersFM Bot permission to '${permissionFlag}'` });
    },
};
