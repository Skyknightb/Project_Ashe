require('events').EventEmitter.prototype._maxListeners = 20;
require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const { OpusEncoder } = require('@discordjs/opus');
const path = require('path');

// Create the encoder.
// Specify 48kHz sampling rate and 2 channel size.
const encoder = new OpusEncoder(48000, 2);

client.login(process.env.BOT_TOKEN);

fs.readdir("./events/", (err, files) => {
  files.forEach(file => {
    const eventHandler = require(`./events/${file}`);
    const eventName = file.split(".")[0];
    client.on(eventName, (...args) => eventHandler(client, ...args));
  });
});

//Normal Commands
client.on('message', async message => {
  if (message.content === `ping`) {
		message.channel.send('Pong!');
	} else if (message.content === `beep`) {
		message.channel.send('Boop!');
  } else if (message.content === `boop`) {
		message.channel.send('Beep!');
  } else if (message.content === `pong`) {
		message.channel.send('Ping!');
  } else if (message.content === `present`) {
		message.channel.send('Hello World!');
	} else if (message.content === `server`) {
    const serverEmbed = new Discord.MessageEmbed()
	   .setColor('#0099ff')
     .setThumbnail(message.guild.iconURL())
     .setAuthor(message.guild.name, message.guild.iconURL())
     .addField('ID', message.guild.id, true)
     .addField('Region', message.guild.region, true)
     .addField('Created on', message.guild.joinedAt.toDateString(), true)
     .addField('Admin', message.guild.owner.user.tag)
     .addField('Members', message.guild.memberCount, true)
		message.channel.send(serverEmbed);
	} else if (message.content === `user`) {
    let user = message.mentions.users.first()
      const embed = new Discord.MessageEmbed()
        .setThumbnail(`${message.author.displayAvatarURL()}`)
        .setColor('#0099ff')
        .setTitle(`${message.author.username}`)
        .addField('ID', message.author.id, true);
      message.channel.send(embed);
  } else if (message.content === `author`) {
    const authorEmbed = new Discord.MessageEmbed()
	   .setColor('#0099ff')
     .setAuthor('Skyknight Beoulve', 'http://celestialbeing.org.uk/audio/sky_icon.png', 'https://www.twitch.tv/skyknightb')
    message.channel.send(authorEmbed);
  } else if (message.content === `help`) {
    const helpEmbed = new Discord.MessageEmbed()
	   .setColor('#0099ff')
	   .setTitle('Project:Ashe Commands')
	   .setDescription('Simple Ashe bot for Discord')
     .setThumbnail('http://celestialbeing.org.uk/audio/Ashe_Icon.png')
     .addField('\u200b', '\u200b')
	   .addFields(
		     { name: 'Commands list', value: 'This is a list of commands you can use with Project:Ashe' },
		     { name: 'ping/pong', value: 'Returns "Pong!/Ping!"', inline: true },
		     { name: 'beep/boop', value: 'Returns "Boop!/Beep!"', inline: true },
         { name: 'present', value: 'As everything in programming, she will salute', inline: false },
         { name: 'server', value: 'Gives you the name of the server you are currently in and its total members', inline: false },
         { name: 'user-info', value: 'Returns your username and your ID', inline: false },
         { name: 'author', value: 'Gives you the name of her creator', inline: false },
         { name: 'stone/paper/scissors', value: 'Lets Project:Ashe play with you.', inline: false },
	   )
     .addField('\u200b', '\u200b')
     .addField('Voice Commands', 'Make Project:Ashe say some lines', true)
     .addFields(
		     { name: 'join', value: 'Makes Project:Ashe join your voice channel and say hello', inline: false },
		     { name: 'identity', value: 'Who is Project:Ashe?', inline: false },
         { name: 'proof', value: 'She will provide you with some proof of her existence', inline: false },
         { name: 'quote', value: 'Her iconic quote', inline: false },
	   )
     .addField('\u200b', '\u200b')
     .setAuthor('Skyknight Beoulve', 'http://celestialbeing.org.uk/audio/sky_icon.png', 'https://www.twitch.tv/skyknightb')
	   .setTimestamp()
	   .setFooter('Celestial Being © 2020', 'http://celestialbeing.org.uk/audio/LogoCB-ICON_512.png');
    message.channel.send(helpEmbed);
  }
});

//Voice Commands
client.on('message', async message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content === 'join') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const dispatcher = connection.play('https://static.wikia.nocookie.net/leagueoflegends/images/4/4a/Ashe03.encounterGeneric.03.ogg');
      dispatcher.on('start', () => {
        console.log('audio.mp3 is now playing!');
      });

      dispatcher.on('finish', () => {
        console.log('audio.mp3 has finished playing!');
      });

      // Always remember to handle errors appropriately!
      dispatcher.on('error', console.error);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }

  if (message.content === 'identity') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const dispatcher = connection.play('https://static.wikia.nocookie.net/leagueoflegends/images/6/63/Ashe_Select_new.ogg');
      dispatcher.on('start', () => {
        console.log('audio.mp3 is now playing!');
      });

      dispatcher.on('finish', () => {
        console.log('audio.mp3 has finished playing!');
      });

      // Always remember to handle errors appropriately!
      dispatcher.on('error', console.error);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }

  if (message.content === 'proof') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const dispatcher = connection.play('https://static.wikia.nocookie.net/leagueoflegends/images/6/6e/Ashe03.encounterGeneric.01.ogg');
      dispatcher.on('start', () => {
        console.log('audio.mp3 is now playing!');
      });

      dispatcher.on('finish', () => {
        console.log('audio.mp3 has finished playing!');
      });

      // Always remember to handle errors appropriately!
      dispatcher.on('error', console.error);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }

  if (message.content === 'quote') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const dispatcher = connection.play('https://static.wikia.nocookie.net/leagueoflegends/images/6/63/Ashe_Select_new.ogg');
      dispatcher.on('start', () => {
        console.log('audio.mp3 is now playing!');
      });

      dispatcher.on('finish', () => {
        console.log('audio.mp3 has finished playing!');
      });

      // Always remember to handle errors appropriately!
      dispatcher.on('error', console.error);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
});

client.on('message', async message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  let voiceChannel = message.member.voice.channel;
  if (!message.guild) return;

  if (message.content === "leave") {
    if (message.member.voice.channel) {
      voiceChannel.leave();
      message.channel.send(`GG!`);
    }
  }
});

//Rock, paper, scissors
client.on("message", message => {
  var messages = [
    "<@" +
      message.member.id +
      "> You won! :rage:\nI got scissors. :scissors:",
    "<@" +
      message.member.id +
      "> Yes!! I won.\nI got paper :roll_of_paper:",
    "<@" +
      message.member.id +
      ">Draw! :neutral_face:\nI also got a stone.:unamused: :new_moon: "
  ];

  var rng = Math.floor(Math.random() * messages.length);
  if (message.content === "stone") {
    message.channel.send(messages[rng]);
  }

  var messagespaper = [
    "<@" +
      message.member.id +
      "> Yes, I won!! \nI got scissors.:scissors:",
    "<@" +
      message.member.id +
      "> Really? You won:unamused::angry:\nI got a stone.:new_moon:",
    "<@" +
      message.member.id +
      "> No way! A draw, I also got paper.:roll_of_paper:"
  ];
  var rng = Math.floor(Math.random() * messagespaper.length);
  if (message.content === "paper") {
    message.channel.send(messagespaper[rng]);
  }

  var messagesscissors = [
    "<@" +
      message.member.id +
      "> Yes, I won!! \nI got a stone.:laughing::new_moon:",
    "<@" +
      message.member.id +
      "> What the f...? You won...\nI got paper:unamused:roll_of_paper",
    "<@" + message.member.id + "> Nah! a draw\n We both got scissors.:scissors:"
  ];
  var rng = Math.floor(Math.random() * messagesscissors.length);
  if (message.content === "scissors") {
    message.channel.send(messagesscissors[rng]);
  }
});
