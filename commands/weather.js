const{ MessageEmbed } = require("discord.js");
const{ API } = require('../config.json');
const fetch = require("node-fetch");
let exampleEmbed = {};
let lastRun = 0;
const updateTime = 2000;

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

async function postWeather(city) {
	const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&lang=TR&units=metric`);
	const data = await response.json();
	if('message' in data) {
		if(data.message === 'city not found') {
			return exampleEmbed = "Şehir bulunamadı.";
		}
	}
	exampleEmbed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Hava Durumu')
		.setDescription(`${data.name} için hava durumu.`)
		.addFields(
			{ name: 'Hava Durumu:', value: capitalizeFirstLetter(data.weather[0].description) },
			{ name: 'Sıcaklık:', value: `${data.main.temp}°C` },
			{ name: 'Hissedilen Sıcaklık:', value: `${data.main.feels_like}°C` },
		);
}
module.exports = {
	name: 'weather',
	description: 'Weather Forecast!',
	async execute(message, args) {
		if (!args.length) {
			return message.channel.send(`Herhangi bir şehir belirtmediniz, ${message.author}!`);
		}
		if(Date.now() - lastRun < updateTime) {
			return message.channel.send(`Bu komutu ${updateTime / 1000} saniyede bir kullanabilirsiniz.`);
		}
		try {
			await postWeather(encodeURI(args));
			message.channel.send(exampleEmbed);
		}
		catch(e) {
			console.error(`[ERROR] Error while executing command: ${e.stack || e}`);
		}
		lastRun = Date.now();
	},
};