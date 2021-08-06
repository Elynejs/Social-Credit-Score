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
let record = require('./akasha.json');

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
           args[1] => actionnable: skill, title, stat, lvl
           args[2] => name of the actionnable
           args[3] => name or id of the target
        */
        if (msg.author.id === owner) {
            if (args.length >= 4) {
                let a = args[0]; // what does the command do
                let b = args[1]; // what does the command change or add
                let d = record.users.find((status) => status.name === args[args.length-1] || status.id === args[args.length-1]); // who does the command change to
                if (!d) break; // if d is undefined then return
                switch(a) {
                case'add':
                    if (b === 'skill') {
                        if (record.skills.find((skill) => skill.name === args[2] || skill.id === parseInt(args[2]))) {
                            let c = record.skills.find((skill) => skill.name === args[2] || skill.id === parseInt(args[2]));
                            d.skills.push(c.name);
                            fs.writeFile('akasha.json', JSON.stringify(record, undefined, 2), (err) => {
                                if (err) throw err;
                            });
                            msg.channel.send(`Displaying new status of ${d.name}\n${JSON.stringify(d)}`);
                        } else {
                            msg.channel.send('Skill not found.');
                        }
                    } else if (b === 'title') {
                        if (record.titles.find((title) => title.name === args[2] || title.id === parseInt(args[2]))) {
                            let c = record.titles.find((title) => title.name === args[2] || title.id === parseInt(args[2]));
                            d.titles.push(c.name);
                            fs.writeFile('akasha.json', JSON.stringify(record, undefined, 2), (err) => {
                                if (err) throw err;
                            });
                            msg.channel.send(`Displaying new status of ${d.name}\n${JSON.stringify(d)}`);
                        } else {
                            msg.channel.send('Title not found.');
                        }
                    } else {
                        msg.channel.send('Incorrect or incomplete query.');
                    }
                    break;
                case'set':
                    if (b === 'stat') {
                        switch(args[2]) {
                        case'hp': d.stats.hp = parseInt(args[3]);break;
                        case'mp': d.stats.mp = parseInt(args[3]);break;
                        case'vit': d.stats.vit = parseInt(args[3]);break;
                        case'str': d.stats.str = parseInt(args[3]);break;
                        case'dex': d.stats.dex = parseInt(args[3]);break;
                        case'int': d.stats.int = parseInt(args[3]);break;
                        case'wis': d.stats.wis = parseInt(args[3]);break;
                        default: msg.channel.send('Incorrect or incomplete query.');
                        }
                    } else if (b === 'lvl') {
                        d.lvl = parseInt(args[2]);
                        fs.writeFile('akasha.json', JSON.stringify(record, undefined, 2), (err) => {
                            if (err) throw err;
                        });
                        msg.channel.send(`Displaying new status of ${d.name}\n${JSON.stringify(d)}`);
                    } else {
                        msg.channel.send('Incorrect or incomplete query.');
                    }
                }
            } else {
                msg.channel.send('Insufficient permission.');
            }
        }
        break;
    case'status':
        if(record.users.find((user) => user.id === msg.member.id)) {
            let user = record.users.find(status => status.id === msg.member.id);
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
    //const channel = member.guild.channels.cache.find(ch => ch.name === 'system-log');
    if (record.users.find((user) => user.id === member.id)) {
        console.log(`Member ${member.user.username} is already a part of the System.`);
    } else {
        let user = new status(member.id, member.user.username);
        record.users.push(user);
        fs.writeFile('akasha.json', JSON.stringify(record, undefined, 2), (err) => {
            if (err) throw err;
        });
        member.roles.add('869616861069860875');
    }
});

client.login(token);

const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('ok');
});
server.listen(3000);