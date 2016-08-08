var discord = require('discordie');
var Discordie = require("discordie");
var discordClient = new Discordie();
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
var moment = require('moment');
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

	if (e.message.content == "!come") {
		getVoiceChannel(discordClient.Channels.get(e.message.channel_id), e.message.author, function(channel) {
			connectToVoiceChannel(channel);
		});
 	}

 	if (e.message.content == "!time") {
 		e.message.channel.sendMessage(moment().format('LLLL'));
 	}

	if (e.message.content.indexOf("!play2") > -1) {
		var message = e.message.content.split(' ').slice(1,e.message.content.length-1);

		var voiceEncoder = getVoiceEncoder();

		getAudio({
			videoId: 'Xl2iBl7nHE8'
		}, function(stream) {
			ffmpeg()
				.input(stream)
				.audioCodec('copy')
				.save(voiceEncoder)
				.on('error', console.error)
			stream.once('end', () => console.log("stream end"));
		});
	}
});


function getAudio(params, callback) {
	var requestUrl = 'http://youtube.com/watch?v=' + params.videoId
	try {
		callback(ytdl(requestUrl, {
			filter: function(format) {
				return format.container === 'mp4' && !format.encoding;
			}
		}));
	} catch (exception) {
		console.error(exception);
	}
}

function getVoiceChannel(channel, user, callback) {
	discordClient.Guilds.forEach(function(guild){
		if (user.memberOf(guild) && channel.guild_id == guild.id) {
			callback(user.getVoiceChannel(guild.id));
		}
	})
}

function connectToVoiceChannel(channel) {
	channel.join(false, false).then(function(channelInfo, err){});
}

function getVoiceEncoder(options) {

	var options = {
		bitrate: 64000,
		sampleRate: 48000,
		channels: 1
	};

	var info = discordClient.VoiceConnections[0];
	if (!info) {
		return console.log("Voice not connected");
	}

	var encoderStream = info.voiceConnection.getEncoderStream(options);
	if (!encoderStream) {
		return console.log("Connection is disposed");
	}

	return encoderStream
}