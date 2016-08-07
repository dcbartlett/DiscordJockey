var discord = require('discordie');
var Discordie = require("discordie");
var discordClient = new Discordie();
var config = require('./config.json');

discordClient.connect({ token: config.discordKey });

discordClient.Dispatcher.on("GATEWAY_READY", e => {
	console.log("Connected as: " + discordClient.User.username);
	console.log("Joined the following guilds:");
	discordClient.Guilds.forEach(function(guild){
		console.log('   ' + guild.name);
	});
});

discordClient.Dispatcher.on("MESSAGE_CREATE", e => {
	// console.log(e);

	if (e.message.content == "ping") {
		e.message.channel.sendMessage("pong");
	}

	if (e.message.content == "!summon") {
		getVoiceChannel(discordClient.Channels.get(e.message.channel_id), e.message.author, function(channel) {
			connectToVoiceChannel(channel);
		});
 
		// console.log(discordClient.VoiceConnections);
		// e.message.VoiceChannel.join(true, false);
	}

	if (e.message.content.indexOf("!play") > -1) {
		var message = e.message.content.split(' ').slice(1,e.message.content.length-1);
		getAudio({
			videoId: 'Xl2iBl7nHE8'
		}, console.log)
	}
});

function getVoiceChannel(channel, user, callback) {
	discordClient.Guilds.forEach(function(guild){
		console.log(user);
		console.log(guild);
		console.log(channel);
		console.log(guild.id);
		if (user.memberOf(guild) && channel.guild_id == guild.id) {
			console.log('gtv', user.getVoiceChannel(guild.id));
			callback(user.getVoiceChannel(guild.id));
		}
	})
}

function connectToVoiceChannel(channel) {
	console.log('ctvc', channel);
	channel.join(false, false).then(function(channelInfo, err){
		getVoiceEncoder(channelInfo);
	});
}