var irc = require('irc');
var title = require('url-to-title');

var config = {
	server: 'chat.freenode.net',
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
			if (from == config.ignore.nicks[ignored]) {
				console.log('ignoring from: '+from);
				return;
			}
		}

		if (from != client.nick && (url = message.match(/https?\:\/\/[^\s]+/))) {
			for (ignored in config.ignore.urls) {
				if (String(url).match(config.ignore.urls[ignored])) {
					console.log('ignoring url: '+url);
					return;
				}
			}

			title(url).then(function(title) {
				client.say(to, url+': '+title);
			});
		}
	});
})();