const mongoose = require("mongoose");
const GuildPermission = require("../../models/guild-permission");

module.exports = {
    name: "set-role",
    description: "The TruckersFM bot will set this role as allowed to manage the bot in this server",
    options: [
        {
            name: "role",
            description: "Role",
            type: "ROLE",
            required: true,
        },
    ],
    hasPermission: async (client, interaction) => {
        const guildPermission = await GuildPermission.findOne({guildId: interaction.guildId, permissionType: 'permissionFlag'}).exec().permissionId  ?? 'ADMINISTRATOR';

        return interaction.member.permissions.has(guildPermission, true);
    },
    run: async (client, interaction) => {
        const role = interaction.options.getRole("role");

        let guildPermission = await GuildPermission.findOne({guildId: interaction.guildId, permissionType: 'roleId'}).exec();

        if(guildPermission) {
            await guildPermission.updateOne({permissionId: role.id}).exec();
        } else {
            const guildPermission = new GuildPermission({
                _id: mongoose.Types.ObjectId(),
                guildId: interaction.guildId,
                permissionId: role.id,
                permissionType: 'roleId'
            })

            guildPermission.save()
                .then()
                .catch(err => console.log(err));
        }

        interaction.followUp({ content: `You have set the TruckersFM Bot role to <@&${role.id}>.` });
    },
};
