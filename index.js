import dotenv from 'dotenv'
dotenv.config()
import * as pw from './palworld/palworld.js'
import * as osu from './osu/osu.js'

import { GatewayIntentBits, Client, REST, Routes } from 'discord.js';

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'pw',
        description: 'Palworld Commands',
        options : [{
            name : "item",
            description : "Searches for an item",
            type: 1,
            options : [{
                name : "item",
                description : "Item to search for",
                type : 3,
                required : true
            }]
        },
        {
            name : "pal",
            description : "Searches for a given pal by number or name",
            type: 1,
            options : [{
                name : "pal",
                description : "Pal to search for",
                type : 3,
                required : true
            }]
        },
        {
            name : "attribute",
            description : "Searches for a given attribute in the format \"attribute\" \"value\"",
            type: 1,
            options : [{
                name : "attribute",
                description : "Attribute to search for",
                type : 3,
                required : true
            }]
        }]

    }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(Routes.applicationCommands(process.env.APP_ID), { body: commands });

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} 
catch (error) {
    console.error(error);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
});

client.on("messageCreate", async (message) => {
    console.log(message)
    const words = message.content.toLowerCase().split(' ')
    if (!message?.author.bot) {
        if (words[0] =="palworld" || words[0] == "pal" || words[0] == "pw") {
            if ((words[1] == "fast" && words[2] == "travel") || words[1] == "ft" || words[1] == "map") {
                message.channel.send({files: ["https://cdn.discordapp.com/attachments/1201470825547714591/1201471067731017778/palworld-map.png"]});
            }
            else if (words[1] == 'item') {
                var temp = ""
                for (let i = 2; i < words.length; i++){
                    temp += words[i]
                    if (i < words.length - 1) temp += ' '
                }
                pw.searchItem(temp, message)
                temp = null;
            }
            else if (words[1] == 'attr' || words[1] == 'attribute') {
                if (words.length > 3 && /^\d/.test(words[3])) pw.searchAttr(`${words[2]} ${words[3]}`, message)
                else pw.searchAttr(words[2], message);
            }
            else {
                var temp = ""
                for (let i = 1; i < words.length; i++){
                    temp += words[i]
                    if (i < words.length - 1) temp += ' '
                }
                pw.searchPal(temp, message)
                temp = null;
            }
        }
        else if (words[0] == "osu") {
            if (words[1] == "recent" || words[1] == "rs") {
                if (/^\d/.test(words[3])) {
                    osu.getRecent(words[2], words[3])
                }
                else {
                    osu.getRecent(words[2], 1)
                }
            }
            else if (words[1] == "beatmap" || words[1] == "bm") {
                osu.getBeatmap(words[2], message)
            }
        }
    }
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }

    if (interaction.commandName === 'pw') {
        if (interaction.options.getSubcommand() == "pal") {
            await interaction.reply(await pw.searchPal(interaction.options.getString("pal")))
        }
        if (interaction.options.getSubcommand() == "item") {
            await interaction.reply(await pw.searchItem(interaction.options.getString("item")))
        }
        if (interaction.options.getSubcommand() == "attribute") {
            await interaction.reply(await pw.searchAttr(interaction.options.getString("attribute")))
        }
    }
});

client.login(process.env.DISCORD_TOKEN);