/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */

require('dotenv').config();
const { env } = require('process');
const Discord = require('discord.js');
const intents = new Discord.Intents([
    Discord.Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
    'GUILD_MEMBERS', // lets you request guild members (i.e. fixes the issue)
]);
const client = new Discord.Client({ws: {intents}});
const prefix = '.';
const token = env['CLIENT_TOKEN'];
const owner = env['OWNER_ID'];
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
    case 'edit':
        /* args[0] => action: add, set, remove
           args[1] =>
           args[2]        
           args[3]
        */
        if (msg.author.id === owner) {
            if (args.length >= 4) {
                let action = args[0]; // what does the command do
                let modifier = args[1]; // what does the command change or add
                let target = record.find(status => status.name === args[3] || status.uuid === args[3]); // who does the command change to
                switch(action) {
                case'add':
                    if (modifier === 'skill') {
                        // command to add skill to status 
                        // 1st -> confirm that skill exist, if not return an error
                        // 2nd -> copy skill from akashic record and append it to target skill array
                        // 3rd -> if need, adjust stats according to skill effect
                        // args[2] -> 'skill name'
                        // args[3] -> either 'username' or 'uuid' or akashic record
                    } else if (modifier === 'title') {
                        // command to add title to status 
                        // args[2] -> 'title name'
                        // args[3] -> either 'username' or 'uuid' or akashic record
                    } else {
                        msg.channel.send('Incorrect or incomplete query.');
                    }
                    break;
                case'set':
                    if (modifier === 'stat') {
                    // command to set stats to status 
                    // args[2] -> 'stat array'
                    // args[3] -> either 'username' or 'uuid'
                    } else if (modifier === 'lvl') {
                    // command to set lvl to status 
                    // args[2] -> 'lvl value'
                    // args[3] -> either 'username' or 'uuid'
                    } else if (modifier === 'skill') {
                    // command to set skill level to status 
                    // args[2] -> 'skill name'
                    // args[3] -> skill level
                    // args[4] -> either 'username' or 'uuid'
                    } else{
                        msg.channel.send('Incorrect or incomplete query.');
                    }
                }
            } else {
                msg.channel.send('Insufficient permission.');
            }
        }
        break;
    case'status':
        if(uuid.some((id) => id === msg.member.id)) {
            let user = record.find(status => status.uuid === msg.member.id);
            msg.channel.send(`Displaying ${msg.member.user.username}'s profile.\n` + JSON.stringify(user));
        } else {
            msg.channel.send('Soul not connected to System.');
        }
        break;
    default:
        msg.channel.send('Available commands are :\n    !status');
        break;
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
        let user = new status(member.id, member.user.username);
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