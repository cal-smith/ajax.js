/*
element1.js

ajax.send(args, callback)

ajax.get|getJSON|post(url|args, callback);

args = {
	verb:"GET|POST|PUT|DELETE", //defaults to GET
	url: "http://url.com",
	url_var:{"key":"value"},
	headers:{"key":"value"},
	json: true|false,
	progress: event,
	error: event
}

ajax.send({
	verb:"GET",
	url: "your.url.com",
	url_var:{"key":"value"},
	headers:{"key":"value"},
	json: true,
	progress: function(event){
		//event handle
	},
	error: function(event){
		//event handle
	}
}, function(data){
	console.log(data);
});
*/

(function(window){
	'use strict';
	//add responseType arg setting
	//needs jsonp handling, proper post handling(?)
	var ajax = function(){

	};

	function makeXHR(){//this should let IE have properish suport
		if (!window.XMLHttpRequest) {
			return new window.ActiveXObject("Microsoft.XMLHTTP");
		} else if (window.XMLHttpRequest) {//for normal browsers
			return new XMLHttpRequest();
		}
	}

	ajax.prototype.send = function(args, callback){
		//args takes object of: {verb, url, headers, json, url_var} note: url_var must be an object
		if (typeof args === "undefined" || typeof callback === "undefined"){
			throw "Missing arguments";
		} else{
			if (typeof args.json === "undefined"){
				args.json = false;
			}
			if (typeof args.verb === "undefined" || !args.verb.match(/^(get|post|put|delete)$/i)){
				args.verb = 'get';//defaults to a GET request
			}
		}
		if (typeof args.url_var !== "undefined"){//sets url vars
			var parts = args.url_var;
			args.url_var = "?";
			for (var i = 0; i < Object.keys(parts).length; i++) {
				var k = Object.keys(parts)[i];
				var v = parts[Object.keys(parts)[i]];
				if (i === 0) {
					args.url_var += encodeURI(k) + "=" + encodeURI(v);
				} else {
					args.url_var += "&" + encodeURI(k) + "=" + encodeURI(v);
				}
			}
			args.url += args.url_var;
		}
		//add http:// to url if ommited?

		var req = makeXHR();

		/*Bind event listeners*/
		if(typeof args.progress !== "undefined"){//adds progress listener
			req.addEventListener("progress", args.progress, false);
		}
		if(typeof args.progress !== "undefined"){//adds error listener
			req.addEventListener("error", args.error, false);
		}
		
		req.open(args.verb, args.url);
		if(typeof args.headers !== "undefined"){//sets headers
			args.headers.forEach(function(value, key){
				req.setRequestHeader(key, value);
			});
		}

		req.onload = res;
		req.send();//sends the request
		function res(){//callback function
			if (args.json === true){
				callback(JSON.parse(this.response), this.status);
			} else {
				callback(this.response, this.status);
			}
		}
	};

	/*ajax.prototype.get = function(args, callback){
		if (typeof args === "string") {
			args = {
				url: args
			};
		}
		args.verb = "GET";
		return ajax.prototype.send(args, callback);
	};

	ajax.prototype.post = function(args, callback){
		if (typeof args === "string") {
			args = {
				url: args
			};
		}
		args.verb = "POST";
		return ajax.prototype.send(args, callback);
	};*/

	var types = ["get", "post", "put", "delete"];
	for (var i = 0; i < types.length; i++) {
		ajax.prototype[types[i]] = function(args, callback){
			if (typeof args === "string") {
				args = {
					url: args
				};
			}
			args.verb = types[i];
			return ajax.prototype.send(args, callback);
		};
	};
	

	ajax.prototype.getJSON = function(args, callback){
		if (typeof args === "string") {
			args = {
				url: args
			};
		}
		args.verb = "GET";
		args.json = true;
		return ajax.prototype.send(args, callback);
	};

	if (typeof window.ajax === "undefined") {
		window.ajax = new ajax();
	}
})(window);
