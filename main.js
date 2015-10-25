'use strict';
var TwitterConnect = require('./modules/twitterIntegration.js'),
	expressApp = require('express')();
var App = {
	connection: null,
	init: function () {
		this.connection = TwitterConnect.getTwitterConnection();
		console.info('Services Started');
		return App;
	},
	startTwitterProcess: function () {
		var promise = new Promise((resolve, reject) => {
			this.twitterExecution(resolve);
		});
		
		promise.then(() => {			
			App.startTwitterProcess();
		});
		return App;
	},
	twitterExecution : function(resolve){
		this.connection.get('/statuses/user_timeline.json', {			
			count : 1,
			screen_name :  "@[twitter name]",
			exclude_replies : true,
			include_rts : false
		}, function (error, tweets, response) {
			let tweet = tweets[0].text;
			if(tweet.includes('#turnDeviceOnInteropmix')){
				TwitterConnect.SmartPlug.turnOn();
			} else if(tweet.includes('#turnDeviceOffInteropmix')){
				TwitterConnect.SmartPlug.turnOff();
			}
			
			if(resolve && typeof resolve === 'function'){
				resolve();
			}			
		});
		return App;
	}
};

var server = expressApp.listen(process.env.PORT || 1337, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.info(server.address());
	App.init().startTwitterProcess();
	console.log('Listening at: http://%s:%s', host, port);
});