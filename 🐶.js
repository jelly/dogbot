const xdg = require('xdg-basedir')
const irc = require('irc');

const programName = 'dogbot';
const configFile = `${xdg.config}/${programName}/config.json`
const defaults = {
    'server': 'irc.server.com',
    'nick': 'doggie',
    'owner': 'cat',
    'channels': ['dogs']
};
const config = Object.assign({}, defaults, require(configFile));

const client = new irc.Client(config.server, config.nick, {
    channels: config.channels,
});

const handleMessage = (from, to, message) => {
  console.log(from + ' => ' + to + ': ' + message);
  const match = message.match(/do+g/gi);
  match && client.say(to, match.map(() => '🐶').join(' '));
  message.includes('🐈') && client.action(to, '🐕 woof woof!');
};

const handlePM = (nick, text, message) => {
  if (nick !== config.owner) {
    return;
  }

  if (text !== 'nick') {
    return;
  }

  if (client.nick === config.nick) {
    return;
  }

  client.send("NICK", config.nick);
}

client.addListener('message', handleMessage);
client.addListener('action', handleMessage);
client.addListener('pm', handlePM);

client.addListener('error', function(message) {
    console.log('error: ', message);
});

process.on('SIGTERM', () => {
  config.channels.every(channel => {
    client.action(channel, 'wanders off looking for dogsnacks');
  });
  process.exit();
});
