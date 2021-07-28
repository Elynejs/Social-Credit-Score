/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */

const Discord = require('discord.js');
const intents = new Discord.Intents([
    Discord.Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
    'GUILD_MEMBERS', // lets you request guild members (i.e. fixes the issue)
]);
const client = new Discord.Client({ws: {intents}});
const prefix = process.env['prefix'];
const token = process.env['token'];
const status = require('./status.js');
const fs = require('fs');
let uuid = require('./uuid.json');
let record = require('./record.json');

client.on('ready', () => {
    client.user.setStatus('dnd');
    console.log('Bot has been launched without issues!');
});

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.content.indexOf(prefix) !== 0) return;
    const args = msg.content.slice(prefix.length).trim().split(/ /);
    const command = args.shift().toLowerCase();

    switch(command) {
    case'status':
        let mber = msg.mentions.members.first();
        if (!mber) {
            if(uuid.some((id) => id === msg.member.id)) {
                let user = record.find(status => status.uuid === msg.member.id);
                console.log(`Displaying ${msg.member.user.username}'s profile.\n` + JSON.stringify(user));
            } else {
                msg.channel.send('Soul not connected to System.');
            }
        } else {
            if (uuid.some((id) => id === mber.id)) {
                let user = record.find(status => status.uuid === mber.id);
                console.log(`Displaying ${mber.user.username}'s profile.\n` + JSON.stringify(user));
            } else {
                msg.channel.send('Soul not connected to System.');
            }
        }
    }
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'system-log');
    if (uuid.some((id) => id === member.id)) {
        console.log(`Member ${member.user.username} is already a part of the System.`);
    } else {
        channel.send('New User detected.\nSaving unique User ID to database...');
        uuid.push(member.id);
        fs.writeFile('uuid.json', JSON.stringify(uuid, undefined, 2), (err) => {
            if (err) throw err;
        });
        channel.send('UUID successfully added to System database. \nGenerating new status profile...');
        let user = new status(member.id, member.user.username, 0, 'None', 'None');
        channel.send('Profile generated. \nSaving profile to database...');
        record.push(user);
        fs.writeFile('record.json', JSON.stringify(record, undefined, 2), (err) => {
            if (err) throw err;
            channel.send('Profile saved successfully.\n');
        });
        channel.send('Connecting System to User Soul.\n');
        member.roles.add('869616861069860875');
        channel.send(`Displaying profile to User ${member.user.username}\n` + JSON.stringify(user));
    }
});

client.login(token);

const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('ok');
});
server.listen(3000);