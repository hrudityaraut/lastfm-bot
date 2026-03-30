const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = 'MTQ4ODAxMzczNzk5MzQzNzM0Ng.GVkO1x.UGAABV7p41gZdsVVz91WeBeHAocsV_7xYfhJTg';
const LASTFM_API_KEY = 'd162ed01e52848786700f06d9f9e63df';
const USERNAME = 'nguyenjason21';
const CHANNEL_ID = '1488025431952199680';

let lastTrack = null;

async function getLatestTrack() {
  const url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;

  const res = await axios.get(url);

  if (!res.data.recenttracks.track || res.data.recenttracks.track.length === 0) {
    return null;
  }

  return res.data.recenttracks.track[0];
}

async function checkTrack() {
  try {
    const track = await getLatestTrack();
    if (!track) return;

    const trackName = `${track.name} - ${track.artist['#text']}`;

    if (trackName !== lastTrack) {
      lastTrack = trackName;

      const channel = await client.channels.fetch(CHANNEL_ID);

      const isNowPlaying = track['@attr'] && track['@attr'].nowplaying;

      if (isNowPlaying) {
        channel.send(`🎧 Now playing: **${track.name}** by **${track.artist['#text']}**`);
      } else {
        channel.send(`✅ Scrobbled: **${track.name}** by **${track.artist['#text']}**`);
      }
    }

  } catch (err) {
    console.error(err.message);
  }
}

client.once('ready', () => {
  console.log(`Bot is online as ${client.user.tag}`);

  // 🔁 check every 20 seconds
  setInterval(checkTrack, 20000);
});

client.login(TOKEN);