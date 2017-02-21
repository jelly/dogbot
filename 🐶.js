const xdg = require('xdg-basedir')
const irc = require('irc');

const programName = 'dogbot';
const configFile = `${xdg.config}/${programName}/config.json`
const defaults = {
    'server': 'irc.server.com',
    'nick': 'doggie',
    'channels': ['dogs']
}
const config = Object.assign({}, defaults, require(configFile));

var client = new irc.Client(config.server, config.nick, {
    channels: config.channels,
});

client.addListener('message', function (from, to, message) {
    console.log(from + ' => ' + to + ': ' + message);
    if (message.startsWith('dogbot')) {
        if (message.endsWith('chee')) {
            client.say(to, 'yes, master');
        } else {
            client.say(to, '🐶');
        }
    }
});

client.addListener('error', function(message) {
    console.log('error: ', message);
});
