const xdg = require('xdg-basedir')
const irc = require('irc');

const programName = 'dogbot';
const configFile = `${xdg.config}/${programName}/config.json`
const defaults = {
    'server': 'irc.server.com',
    'nick': 'doggie',
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

const handleNotice = (from, to, message) => {
  console.log(from + ' => ' + to + ': ' + message);
  const match = message.match(/do+g/gi);
  match && client.notice(to, match.map(() => '🐶').join(' '));
  message.includes('🐈') && client.action(to, '🐕 bork bork!');
};

client.addListener('message', handleMessage);
client.addListener('action', handleMessage);
client.addListener('notice', handleNotice);

client.addListener('error', function(message) {
    console.log('error: ', message);
});

process.on('SIGTERM', () => {
  config.channels.every(channel => {
    client.action(channel, 'wanders off looking for dogsnacks');
  });
  process.exit();
});
