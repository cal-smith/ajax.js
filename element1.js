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
	//add responseType arg setting
	//needs error handling, jsonp handling, proper post handling
	send: function(args, callback){// args takes object of: {verb, url, headers, json, url_var} note: url_var must be an array
		if (typeof args === "undefined" || typeof callback === "undefined"){
			throw "Missing arguments";
		} else{
			if (typeof args.json === "undefined"){
				args.json = false;
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

		function makeXHR(){//this should let IE have properish suport
			if (!window.XMLHttpRequest) {
				return new window.ActiveXObject("Microsoft.XMLHTTP");
			} else if (window.XMLHttpRequest) {//for normal browsers
				return new XMLHttpRequest();
			}
		}
		var req = makeXHR();
		req.withCredentials = true;

		/*Event listeners*/
		if(typeof args.progress !== "undefined"){//adds progress listener if progress callback is defined
			req.addEventListener("progress", args.progress, false);
		}
		if(typeof args.progress !== "undefined"){//adds error listener if callback is defined
			req.addEventListener("error", args.error, false);
		}
		//oReq.addEventListener("abort", transferCanceled, false);
		
		req.open(args.verb, args.url);
		if(typeof args.headers !== "undefined"){//sets headers
			headers.forEach(function(value, key){
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
	}
};
