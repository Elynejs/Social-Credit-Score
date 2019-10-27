/* eslint-disable no-unused-vars */

const Discord = require('discord.js');
const client = new Discord.Client();
const guild = new Discord.Guild();
const config = require('./config.json');
const fs = require('fs');

client.on('ready', () => {
    client.user.setActivity('Watching your every movement.');
    console.log('Bot has been launched without issues!');
    if (guild.available) {
        fs.writeFile('users.json', JSON.stringify(guild.fetchMembers(false, 0), undefined, 2));
    }
});

const banned_words = require('./banned_words.json');

client.on('message', msg => {
    if (msg.content.toLowerCase().includes(banned_words.toLowerCase())) {
        guild.fetchMember(msg.author)
            .then();
    }
    const args = msg.content.slice(config.token.prefix.length).trim().split(/ /);
    const command = args.shift().toLowerCase();
});