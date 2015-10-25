'use strict';
var request = require('request'),
	config = require('../config.js'),
	Twitter = require('twitter');

module.exports = {
	getTwitterConnection: function () {
		return new Twitter(config.configurationData);
	},

	SmartPlug : {
		change: function (status) {
			request({
				method: 'PUT',
				url: `${config.deviceIP}/api/v1/device/power`,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Basic YWRtaW46YWRtaW4='
				},
				body: `{  "power_status" : "${status}"}`
			}, function (error, response, body) {
				console.log('Response:', body);
			});
		},
		turnOn: function () {
			this.change('on');
		},
		turnOff: function () {
			this.change('of');
		}
	}
}
