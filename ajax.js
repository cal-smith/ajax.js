/*
ajax.js

ajax.send(args, callback)

ajax.verb|verbJSON('url', callback(data))

ajax.verb|verbJSON('url', {args}, callback(data))

ajax.verb|verbJSON('url')
	.var({url:vars})
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
	'use strict';
	//add responseType arg setting
	//needs jsonp handling, proper post handling(?)
	var Ajax = function(){};

	function makeXHR(){//this should let IE have properish suport
		if (!window.XMLHttpRequest) {
			return new window.ActiveXObject("Microsoft.XMLHTTP");
		} else if (window.XMLHttpRequest) {//for normal browsers
			return new XMLHttpRequest();
		}
	}

	Ajax.prototype.send = function(args, callback){
		if (typeof args === 'function') {
			callback = args;
			args.verb = this.verb;
			args.url = this.url;
			args.json = this.parse_json;
			typeof this.set_headers !== 'undefined' && (args.headers = this.set_headers);
			typeof this.progress_callback !== 'undefined' && (args.progress = this.progress_callback);
			typeof this.error_callback !== 'undefined' && (args.error = this.error_callback);
		}

		//default to current page if no url is specified
		typeof args.url === 'undefined' && (args.url = window.location.href);
		//truthy && dothings() is like if(truthy){ dothings() }

		if (typeof args === "undefined" || typeof callback === "undefined"){
			if(typeof args === "undefined") { throw "Missing arguments" };
			if(typeof callback === "undefined") { throw "Missing callback" };
		} else{
			typeof args.json === "undefined" && (args.json = false);
			if (typeof args.verb === "undefined" || !args.verb.match(/^(get|post|put|delete)$/i)){
				args.verb = 'get';//default to a GET request
			}
		}

		//set url vars
		if (typeof args.url_var !== "undefined"){
			var parts = args.url_var || this.url_var;
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
				callback(JSON.parse(this.response), this.status);
			} else {
				callback(this.response, this.status);
			}
		}
	};

	var types = ["get", "post", "put", "delete"];
	for (var i = 0; i < types.length; i++) {
		Ajax.prototype[types[i]] = function(url, args, callback){
			if (typeof args === 'undefined' && typeof callback === 'undefined') {
				this.verb = types[i];
				typeof url === 'undefined' ? this.url=window.location.href : this.url = url;
				return this;
			} else {
				typeof args === "function" && (callback = args);
				if (typeof url === 'object') {
					args = url;
				} else {
					typeof url === 'undefined' ? args.url=window.location.href : args.url = url;
				}
				args.verb = types[i];
				return Ajax.prototype.send(args, callback);
			}
		};

		Ajax.prototype[types[i]+"JSON"] = function(url, args, callback){
			if (typeof args === 'undefined' && typeof callback === 'undefined') {
				this.verb = types[i];
				this.parse_json = true;
				typeof url === 'undefined' ? this.url=window.location.href : this.url = url;
				return this;
			} else {
				typeof args === 'function' && (callback = args);
				if (typeof url === 'object') {
					args = url;
				} else {
					typeof url === 'undefined' ? args.url=window.location.href : args.url = url;
				}
				args.verb = types[i];
				args.json = true;
				return Ajax.prototype.send(args, callback);
			}
		};
	}

	Ajax.prototype.var = function(vars){
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
