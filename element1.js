/*
element1.js

new ajax({
	verb:(default: GET) GET|POST|PUT|DELETE,
	url: "your.url.com",
	url_var:["must","be","array"],
	headers:{"key":"value"},
	json: true|false,
	progress: function(event){
		//event handle
	},
	error: function(event){
		//event handle
	}
}).done(function(data){
	console.log(data);
});

.done = q.done. deffered request via promises.

ajax.send({
	verb:(default: GET) GET|POST|PUT|DELETE,
	url: "your.url.com",
	url_var:["must","be","array"],
	headers:{"key":"value"},
	json: true|false,
	progress: function(event){
		//event handle
	},
	error: function(event){
		//event handle
	}
}, function(data){
	console.log(data);
});

ajax.get|getJSON|post(url, {opt:data}, function(data){
	
});
*/
'use strict';


var ajax = {//usage: oldajax.send();
	//needs error handling, jsonp handling, progress handling, proper post handling
	send: function(args, callback){// args takes object of: {verb, url, headers, json, url_var} note: url_var must be an array
		if (typeof args === "undefined" || typeof callback === "undefined"){
			throw "Missing arguments";
		} else{
			if (typeof args.json === "undefined"){
				args.json = true;
			}
			if (typeof args.verb === "undefined"){//!args.verb.match(/^(get|post|put|delete)$/i) ||
				args.verb = 'get';//defaults to a GET request
			}
		}
		if (typeof args.url_var !== "undefined"){//sets url vars
			var parts = args.url_var;
			args.url_var = "?"
			for (var i = 0; i < parts.length; i++) {
				if (i === 0) {
					args.url_var += encodeURI(parts[i]);
				} else {
					args.url_var += "&" + encodeURI(parts[i]);
				}
			}
			args.url += args.url_var;
		}
		//add http:// to url if ommited

		//add check for support(lol) and ie activex
		var req = new XMLHttpRequest();
		/*
		progress handlers
		*/
		if(typeof args.progress !== "undefined"){
			req.addEventListener("progress", args.progress, false);
		}
		if(typeof args.progress !== "undefined"){
			req.addEventListener("error", args.error, false);
		}
		
		req.open(args.verb, args.url);
		if(typeof args.headers !== "undefined"){
			headers.forEach(function(value, key){
				req.setRequestHeader(key, value);
			});
		}

		//set ready state
		req.onload = res;
		req.send();
		function res(){
			if (args.json === true){
				callback(JSON.parse(this.response), this.status);
			} else {
				callback(this.response, this.status);
			}
		}
	}
};
