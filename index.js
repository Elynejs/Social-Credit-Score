/* eslint-disable no-unused-vars */

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
    client.user.setActivity('Watching your every movement.');
    console.log('Bot has been launched without issues!');
});

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.content.indexOf(config.token.prefix) !== 0) return;
    const args = msg.content.slice(config.token.prefix.length).trim().split(/ /);
    const command = args.shift().toLowerCase();
});