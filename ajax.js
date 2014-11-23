/*
ajax.js

ajax.send(args, callback)

ajax.verb|verbJSON("url", callback(data))

ajax.verb|verbJSON("url", {args}, callback(data))

ajax.verb|verbJSON("url")
	.vars({url:vars})
	.json(true|false)
	.headers({req:headers})
	.progress(function(event))
	.error(function(event))
	.send(callback(data))

args = {
	verb:"GET|POST|PUT|DELETE", //defaults to GET
	url: "http://url.com",
	url_var:{"key":"value"},
	headers:{"key":"value"},
	json: true|false,
	progress: function(event),
	error: function(event)
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
	"use strict";
	//add responseType arg setting
	//needs jsonp handling, proper post handling(?)
	var Ajax = function(){
		
	};

	function makeXHR(){//this should let IE have properish suport
		if (!window.XMLHttpRequest) {
			return new window.ActiveXObject("Microsoft.XMLHTTP");
		} else if (window.XMLHttpRequest) {//for normal browsers
			return new XMLHttpRequest();
		}
	}

	Ajax.prototype.send = function(args, callback){
		var promise = ((typeof args === "object" || typeof args === "undefined") && typeof callback === "undefined")?true:false;
		if (typeof args === "function" || ((typeof args === "object" || typeof args === "undefined") && typeof callback === "undefined")) {
			if (typeof args === "function") { callback = args; };
			if (typeof args === "undefined") { args = {}; }
			typeof args.verb === "undefined" && (args.verb = this.verb);
			typeof args.url_var === "undefined" && (args.url_var = this.url_var);
			typeof args.url === "undefined" && (args.url = this.url);
			typeof args.json === "undefined" && (args.json = this.parse_json);
			typeof args.headers === "undefined" && (args.headers = this.set_headers);
			typeof args.progress === "undefined" && (args.progress = this.progress_callback);
			typeof args.error === "undefined" && (args.error = this.error_callback);
		}

		//default to current page if no url is specified
		typeof args.url === "undefined" && (args.url = window.location.href);
		//truthy && dothings() is like if(truthy){ dothings() }

		typeof args.json === "undefined" && (args.json = false);
		if (typeof args.verb === "undefined" || !args.verb.match(/^(get|post|put|delete)$/i)){
			args.verb = "get";//default to a GET request
		}

		//set url vars
		if (typeof args.url_var !== "undefined"){
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

		//Bind event listeners
		if(typeof args.progress !== "undefined"){//adds progress listener
			req.addEventListener("progress", args.progress, false);
		}

		if(typeof args.error !== "undefined"){//adds error listener
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
				callback(JSON.parse(this.response), this.status, this.getAllResponseHeaders());
			} else {
				callback(this.response, this.status, this.getAllResponseHeaders());
			}
		}
		if (promise){
			return new Promise(function(resolve, reject){
				callback = function(response){
					return resolve(response);
				};

				req.addEventListener("error", reject, false);
			});
		}
	};

	//helps us make helper functions... yay!
	function helperhelper(thisarg, json, verb, url, args, callback){
		if (typeof args === "object" || typeof args === "undefined" && typeof callback === "undefined") {
			thisarg.url = url;
			thisarg.verb = verb;
			thisarg.parse_json = json;
			return thisarg;
		} else {
			if (typeof args === "function") {
				callback = args;
				args = {};
			}
			typeof url === "object"?args = url:
			args.url = url;
			args.verb = verb;
			args.json = json;
			return Ajax.prototype.send(args, callback);
		}
	}

	//nice big block of method defs.
	Ajax.prototype.post = function(url, args, callback) { return helperhelper(this, false, "post" , url, args, callback); };
	Ajax.prototype.get = function(url, args, callback) { return helperhelper(this, false, "get" , url, args, callback); };
	Ajax.prototype.put = function(url, args, callback) { return helperhelper(this, false, "put" , url, args, callback); };
	Ajax.prototype.delete = function(url, args, callback) { return helperhelper(this, false, "delete" , url, args, callback); };
	Ajax.prototype.postJSON = function(url, args, callback) { return helperhelper(this, true, "post" , url, args, callback); };
	Ajax.prototype.getJSON = function(url, args, callback) { return helperhelper(this, true, "get" , url, args, callback); };
	Ajax.prototype.putJSON = function(url, args, callback) { return helperhelper(this, true, "put" , url, args, callback); };
	Ajax.prototype.deleteJSON = function(url, args, callback) { return helperhelper(this, true, "delete" , url, args, callback); };

	Ajax.prototype.vars = function(vars){
		//object of url vars
		this.url_var = vars;
		return this;
	};

	Ajax.prototype.json = function(json){
		//true|false for json parsing
		typeof(json === "undefined") ? this.parse_json = true : this.parse_json = json;
		return this;
	};

	Ajax.prototype.headers = function(headers){
		//headers
		this.set_headers = headers;
		return this;
	};

	Ajax.prototype.progress = function(callback){
		this.progress_callback = callback;
		return this;
	};

	Ajax.prototype.error = function(callback){
		this.error_callback = callback;
		return this;
	};

	if (typeof window.ajax === "undefined") {
		Object.defineProperty(window, "ajax", {
			get: function(){
				return new Ajax();
			}
		});
	}
})(window);