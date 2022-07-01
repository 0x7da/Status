const { Client, Collection, Intents} = require("discord.js")
const client = new Client({intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})
const { MessageEmbed } = require("discord.js");
const axios = require("axios");

channelID = "991745469854265344"; //CHANNEL ID
let haystack = [
	{
		"url": "YOUR SITE",
		"name": "Website"
	},
	{
		"url": "DISCORD INVITE",
		"name": "Invite"
	},
	{
		"url": "YOUR SITE/",
		"name": "Status"
	},
];
const description = new Set();

client.once('ready', ()=>{
    console.log("Bot is Active!");

    let state = 0;
    const presences = [
        { type: 'PLAYING',  message:'WhitePlugins.com' },
        { type: 'PLAYING', message: 'ExothDE' },
        { type: 'WATCHING', message: 'Javascript' },
        { type: 'PLAYING', message: '24/7 Hosting' }
    ];
    setInterval(() => {
        state = (state + 1) % presences.length;
        const presence = presences[state];
        client.user.setActivity(presence.message, { type: presence.type });
    }, 10000);

    checkStatus();
    setInterval(checkStatus, 20000);
});
async function checkStatus() {
    client.channels.cache.get(channelID).messages.fetch('991745474136649768').then(async msg => { //MESSAGE ID

        for (let haystackKey in haystack) {
            let data = haystack[haystackKey];

            let start = Date.now();
            let response = await axios.get(data.url);
            if (!response.status > 400) {
                description.add(":red_circle:" + " **" + data.name + "** - " + response.statusText);
            } else {
                let millis = Date.now() - start;
                let emoji = ":red_circle:";
                if (millis <= 200) emoji = ":green_circle:";
                else if (millis <= 1000) emoji = ":yellow_circle:";
                else emoji = ":orange_circle:";

                description.add(emoji + " **" + data.name + "** - `" + millis + "ms` - " + data.url);
                delete millis;
            }
        }

        let embed = new MessageEmbed();
        embed.setTitle("Status");
        embed.setDescription(Array.from(description).join("\n"));
        embed.setColor("GREEN");
        embed.setFooter({text:"Last Updated"});
        embed.setTimestamp();
        embed.setAuthor({name: msg.channel.guild.name, iconURL: msg.channel.iconURL});
        msg.edit({embeds: [embed], content: null}).then(() => {
            description.clear();
        });
    });
}

client.login('XXX-XXX-XXX');
