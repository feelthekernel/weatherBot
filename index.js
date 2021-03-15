const fs = require('fs');
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');


client.commands = new Discord.Collection();

client.once('ready', () => {
	console.log('Ready!');
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); //got this from some tutorials
for (const file of commandFiles) {
	try{
		const command = require(`./commands/${file}`);

		if(client.commands.has(command.name)) {
			console.error(`A command named "${command.name}" already exists.`);
			continue;
		}
		client.commands.set(command.name, command);
	}
	catch (e) {
		console.error(`Failed to load "${file}": ${e.message}`);
	}
}

client.on('message', message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(config.token);

