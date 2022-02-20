const { createAudioResource, createAudioPlayer, StreamType } = require('@discordjs/voice');

const resource = createAudioResource('http://radio.truckers.fm/radio-ogg', {
    inputType: StreamType.OggOpus,
});
const player = createAudioPlayer();

player.on('error', error => {
    console.error('Error:', error.message);
});

resource.playStream.on('error', error => {
    console.error('Error:', error.message);
});

player.play(resource);

module.exports = {player, resource};
