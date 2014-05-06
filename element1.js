/*
element1.js
*/
'use strict';
ajax = {//class for ajax interaction. as a bonus you can do basic requests via: ajax.send('VERB', url, function(var){ //etc });
	//needs error handling, jsonp handling, non json request handling, progress handling, proper post handling
	send: function(args, callback){// args takes object of: {verb, url, headers, json}
		if (typeof args.json === "undefined"){
			args.json = true;
		}
		var req = new XMLHttpRequest();
		req.open(args.verb, args.url);
		//req.setRequestHeader('Content-Type', 'text/xml');
		if(typeof args.headers !== "undefined"){
			headers.forEach(function(value, key){
				req.setRequestHeader(key, value);
			});
		}
		//set ready state
		req.onload = res;
		req.send();
		function res(){
			if (args.json){
				callback(JSON.parse(this.response), this.status);
			} else {
				callback(this.response, this.status);
			}
		}
	}
};