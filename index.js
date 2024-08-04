require('events').EventEmitter.prototype._maxListeners = 20;
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
require('./keep_alive'); // Import keep_alive.js to keep the bot alive

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// Log in to Discord with your app's token
client.login(process.env.ASHE_KEY);

let leaveTimer; // Global timer variable
const MIN_DURATION = 3 * 60 * 1000; // 3 minutes in milliseconds

// Load event handlers
fs.readdir('./events/', (err, files) => {
  if (err) {
    console.error('Error loading events:', err);
    return;
  }

  files.forEach(file => {
    const eventHandler = require(`./events/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, (...args) => eventHandler(client, ...args));
  });
});

// Consolidated message handler for both text and voice commands
client.on('messageCreate', async message => {
  if (message.author.bot) return; // Ignore bot messages

  // Text commands
  if (message.content === 'ping') {
    message.channel.send('Pong!');
  } else if (message.content === 'beep') {
    message.channel.send('Boop!');
  } else if (message.content === 'boop') {
    message.channel.send('Beep!');
  } else if (message.content === 'pong') {
    message.channel.send('Ping!');
  } else if (message.content === 'present') {
    message.channel.send('Hello World!');
  } else if (message.content === 'server') {
    if (message.guild) {
      const serverEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setThumbnail(message.guild.iconURL())
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
        .addFields(
          { name: 'ID', value: message.guild.id, inline: true },
          { name: 'Region', value: message.guild.region || 'Unknown', inline: true },
          { name: 'Created on', value: message.guild.joinedAt ? message.guild.joinedAt.toDateString() : 'Unknown', inline: true },
          { name: 'Admin', value: message.guild.ownerId ? (await message.guild.members.fetch(message.guild.ownerId)).user.tag : 'Unknown' },
          { name: 'Members', value: message.guild.memberCount.toString(), inline: true }
        );

      message.channel.send({ embeds: [serverEmbed] });
    } else {
      message.channel.send('This command can only be used in a server.');
    }
  } else if (message.content === 'user') {
    let user = message.mentions.users.first() || message.author;
    const embed = new EmbedBuilder()
      .setThumbnail(user.displayAvatarURL())
      .setColor('#0099ff')
      .setTitle(user.username)
      .addFields(
        { name: 'ID', value: user.id, inline: true }
      );

    message.channel.send({ embeds: [embed] });
  } else if (message.content === 'author') {
    const authorEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setAuthor({ name: 'Skyknight Beoulve', iconURL: 'http://celestialbeing.org.uk/audio/sky_icon.png', url: 'https://www.twitch.tv/skyknightb' });

    message.channel.send({ embeds: [authorEmbed] });
  } else if (message.content === 'help') {
    const helpEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Project:Ashe Commands')
      .setDescription('Simple Ashe bot for Discord')
      .setThumbnail('http://celestialbeing.org.uk/audio/Ashe_Icon.png')
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
      .addFields(
        { name: 'Voice Commands', value: 'Make Project:Ashe say some lines', inline: true },
        { name: 'join', value: 'Makes Project:Ashe join your voice channel and say hello', inline: false },
        { name: 'identity', value: 'Who is Project:Ashe?', inline: false },
        { name: 'proof', value: 'She will provide you with some proof of her existence', inline: false },
        { name: 'quote', value: 'Her iconic quote', inline: false }
      )
      .setAuthor({ name: 'Skyknight Beoulve', iconURL: 'http://celestialbeing.org.uk/audio/sky_icon.png', url: 'https://www.twitch.tv/skyknightb' })
      .setTimestamp()
      .setFooter({ text: 'Celestial Being © 2020', iconURL: 'http://celestialbeing.org.uk/audio/LogoCB-ICON_512.png' });

    message.channel.send({ embeds: [helpEmbed] });
  } else if (message.content === 'user-info') {
    const userEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('User Info')
      .setDescription('Here is some information about you:')
      .addFields(
        { name: 'Username', value: message.author.username, inline: true },
        { name: 'ID', value: message.author.id, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'User Info' });

    message.channel.send({ embeds: [userEmbed] });
  } else if (message.content === 'join') {
    if (message.member.voice.channel) {
      const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
      });

      const player = createAudioPlayer();
      const resource = createAudioResource('https://static.wikia.nocookie.net/leagueoflegends/images/c/c7/Ashe_Original_FirstEncounter_2.ogg');

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        // Keep the connection open until the timer triggers
      });

      // Start the timer
      if (leaveTimer) {
        clearTimeout(leaveTimer);
      }
      leaveTimer = setTimeout(() => {
        if (connection.state.status === VoiceConnectionStatus.Ready) {
          connection.destroy();
        }
      }, MIN_DURATION);

    } else {
      message.reply('You need to join a voice channel first!');
    }
  } else if (message.content === 'identity') {
    if (message.member.voice.channel) {
      const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
      });

      const player = createAudioPlayer();
      const resource = createAudioResource('https://static.wikia.nocookie.net/leagueoflegends/images/7/72/Ashe_Original_FirstEncounter_1.ogg');

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        // Keep the connection open until the timer triggers
      });

      // Reset the timer
      if (leaveTimer) {
        clearTimeout(leaveTimer);
      }
      leaveTimer = setTimeout(() => {
        if (connection.state.status === VoiceConnectionStatus.Ready) {
          connection.destroy();
        }
      }, MIN_DURATION);

    } else {
      message.reply('You need to join a voice channel first!');
    }
  } else if (message.content === 'proof') {
    if (message.member.voice.channel) {
      const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
      });

      const player = createAudioPlayer();
      const resource = createAudioResource('https://static.wikia.nocookie.net/leagueoflegends/images/e/ec/Ashe_Original_R_0.ogg');

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        // Keep the connection open until the timer triggers
      });

      // Reset the timer
      if (leaveTimer) {
        clearTimeout(leaveTimer);
      }
      leaveTimer = setTimeout(() => {
        if (connection.state.status === VoiceConnectionStatus.Ready) {
          connection.destroy();
        }
      }, MIN_DURATION);

    } else {
      message.reply('You need to join a voice channel first!');
    }
  } else if (message.content === 'quote') {
    if (message.member.voice.channel) {
      const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
      });

      const player = createAudioPlayer();
      const resource = createAudioResource('https://static.wikia.nocookie.net/leagueoflegends/images/9/99/Ashe_Select.ogg');

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        // Keep the connection open until the timer triggers
      });

      // Reset the timer
      if (leaveTimer) {
        clearTimeout(leaveTimer);
      }
      leaveTimer = setTimeout(() => {
        if (connection.state.status === VoiceConnectionStatus.Ready) {
          connection.destroy();
        }
      }, MIN_DURATION);

    } else {
      message.reply('You need to join a voice channel first!');
    }
  } else if (message.content.startsWith('stone') || message.content.startsWith('paper') || message.content.startsWith('scissors')) {
    const choices = ['stone', 'paper', 'scissors'];
    const userChoice = message.content.toLowerCase();
    if (!choices.includes(userChoice)) {
      return message.channel.send('Invalid choice! Please choose stone, paper, or scissors.');
    }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    let result;

    if (userChoice === botChoice) {
      result = `It's a tie! We both chose ${botChoice}.`;
    } else if (
      (userChoice === 'stone' && botChoice === 'scissors') ||
      (userChoice === 'paper' && botChoice === 'stone') ||
      (userChoice === 'scissors' && botChoice === 'paper')
    ) {
      result = `You win! I chose ${botChoice}.`;
    } else {
      result = `You lose! I chose ${botChoice}.`;
    }

    message.channel.send(result);
  } else if (message.content === 'info') {
    message.channel.send('Project:Ashe is an interactive bot with various commands.');
  }
});