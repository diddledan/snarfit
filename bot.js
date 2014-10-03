var irc = require('irc');
var title = require('url-to-title');

var config = {
	server: 'cortana.freech.at',
	nickname: 'snarfit',
	options: {
		userName: 'SnarfIT',
		realName: 'SnarfIT',
		port: 6667,
		autoRejoin: true,
		autoConnect: true,
		channels: [
			'#ubuntu-uk'
		]
	},
	ignore: {
		nicks: [
			'lubotu3'
		],
		urls: [
			/launchpad\.net.*\/bugs\//
		]
	}
};

(function() {
	var client = new irc.Client(config.server, config.nickname, config.options);

	client.addListener('ctcp-version', function(from, to, message) {
		client.ctcp(from, 'notice', 'VERSION ' + config.options.realName);
	});

	client.addListener('message', function(from, to, message) {
		var params = message.split(' ').slice(1).join(' ');

		if (to == client.nick) {
			to = from;
		}

		for (var ignored in config.ignore.nicks) {
			if (from == ignored) {
				return;
			}
		}

		if (from != client.nick && (url = message.match(/https?\:\/\/[^\s]+/))) {
			for (ignored in config.ignore.strings) {
				if (ignored.match(url)) {
					return;
				}
			}
			title(url).then(function(title) {
				console.log(url+': '+title);
				client.say(to, url+': '+title);
			});
		}
	});
})();