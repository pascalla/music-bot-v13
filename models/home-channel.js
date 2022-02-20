const mongoose = require ("mongoose");

const homeChannelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    shardId: String,
    guildId: String,
    channelId: String
});

module.exports = mongoose.model("HomeChannel", homeChannelSchema);
