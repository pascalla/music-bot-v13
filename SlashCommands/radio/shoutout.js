const axios = require('axios');

module.exports = {
    name: "shoutout",
    description: "Send in a shoutout to TruckersFM.",
    options: [
        {
            name: "message",
            description: "The message you want to send to the presenter.",
            type: "STRING",
            required: true
        }
    ],
    hasPermission: async (client, interaction) => {
        return true;
    },
    run: async (client, interaction) => {
        const message = interaction.options.getString("message");

        axios.post('https://radiocloud.pro/api/public/v1/messages', {
            name: interaction.member.user.username,
            message_type: 'shoutout',
            platform: 'discord-bot',
            identifier: interaction.member.id,
            message: message,
        })
            .then((response) => {
                interaction.followUp({ content: response.data.msg });
            })
            .catch((error) => {
                interaction.followUp({ content: response.data.msg });
            });
    },
};

// function upFirst(string)
// {
//     return string.charAt(0).toUpperCase() + string.slice(1);
// }
//
// function convertToId(string) {
//     switch(upFirst(string)) {
//         case 'Shoutout':
//             return 1;
//         case 'Request':
//             return 2;
//         case 'Competition':
//             return 3;
//         case 'Joke':
//             return 4;
//         case 'Other':
//             return 5;
//         case 'Traffic':
//             return 7;
//     };
//
// }

