const mongoose = require("mongoose");
const client = require("../bot");

const HomeChannel = require("../models/home-channel");
const { joinVoiceChannel, entersState, VoiceConnectionStatus, createAudioResource, StreamType  } = require('@discordjs/voice');
const player = require('../client/player');
const io = require('socket.io-client');
const {ShardClientUtil} = require("discord.js");
const socket = io('https://public-socket.truckers.fm');
const oldSocket = io('https://socket.truckers.fm');


client.on("ready", async () => {
    console.log(`${client.user.tag} is up and ready to go!`);

    // Joining home channels
    // For now lets not use the shard filter, until we have migrated.
    // const homeChannels = await HomeChannel.find({shardId: shardIds}).exec();
    const homeChannels = await HomeChannel.find().exec();

    for await (const homeChannel of homeChannels) {

        const guild = client.guilds.cache.find(g => g.id === homeChannel.guildId)

        if(!guild) {
            // If we dont find the guild, lets try and update the shard its currently on
            console.log(`did not find guild ${homeChannel.guildId}`)
            const shardId = await ShardClientUtil.shardIdForGuildId(homeChannel.guildId, client.shard.ids.length);
            await homeChannel.updateOne({ shardId: shardId }).exec();
            // For now, lets not delete them.
            //await HomeChannel.deleteOne({ _id: homeChannel._id });
            continue;
        }

        const connection = joinVoiceChannel({
            channelId: homeChannel.channelId,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator
        });

        connection.subscribe(player.player);

        try {
            await entersState(connection, VoiceConnectionStatus.Connecting, 5_000);
            // Seems to be reconnecting to a new channel - ignore disconnect
        } catch (error) {
            console.log(`Could not connect to the channel ${homeChannel.channelId}`)
            // Seems to be a real disconnect which SHOULDN'T be recovered from
            connection.destroy();
            // Lets delete the home channel for this guild
            await HomeChannel.deleteOne({ guildId: guild.id });
        }

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

        // Socket listeners
        socket.on('song', function(response){
            let artist = response.current_song.song.artist;
            let title = response.current_song.song.title;
            client.user.setActivity(`${artist} - ${title}`, {type: 2 });

        });

        oldSocket.on('restart', function(){
            player.resource = createAudioResource('http://radio.truckers.fm/radio-ogg', {
                inputType: StreamType.OggOpus,
            });
            player.player.play(player.resource)
        });
    }
});
