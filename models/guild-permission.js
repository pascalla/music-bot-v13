const mongoose = require ("mongoose");

const guildPermissionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    permissionId: String,
    permissionType: String,
});

module.exports = mongoose.model("GuildPermission", guildPermissionSchema);
