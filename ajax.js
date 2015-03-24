(function(window){
	"use strict";
	var Ajax = function(url, verb){
		this.req_verb = verb;
		this.url = url;
		return this;
	};

	Ajax.prototype.send = function(callback){
		var promise = (typeof callback === "undefined")?true:false;

		//default to current page if no url is specified
		typeof this.url === "undefined" && (this.url = window.location.href);

		typeof this.parse_json === "undefined" && (this.parse_json = false);

		if (typeof this.req_verb === "undefined" || !this.req_verb.match(/^(get|post|put|delete)$/i)){
			this.req_verb = "get";
		}

		if (typeof this.url_var !== "undefined"){
			var parts = this.url_var;
			this.url_var = "?";
			var keys = Object.keys(parts);
			for (var i = 0; i < keys.length; i++) {
				var k = keys[i];
				var v = parts[keys[i]];
				if (i === 0) {
					this.url_var += encodeURI(k) + "=" + encodeURI(v);
				} else {
					this.url_var += "&" + encodeURI(k) + "=" + encodeURI(v);
				}
			}
			this.url += this.url_var;
		}

		var req = new XMLHttpRequest();

		//Bind event listeners
		if(typeof this.progress !== "undefined"){
			req.addEventListener("progress", this.progress, false);
		}

		if(typeof this.error !== "undefined"){
			req.addEventListener("error", this.error, false);
		}
		
		req.open(this.req_verb, this.url);
		if(typeof this.headers !== "undefined"){
			var keys = Object.keys(this.headers);
			for (var i = 0; i < keys.length; i++) {
				req.setRequestHeader(keys[i], this.headers[keys[i]]);
			}
		}
		var parse_json = this.parse_json;
		if (promise){
			return new Promise(function(resolve, reject){
				req.onload = function() {
					//on error - reject
					if (parse_json === true){
						return resolve(JSON.parse(this.response), this.status, this.getAllResponseHeaders());
					} else {
						return resolve(this.response, this.status, this.getAllResponseHeaders());
					}
				};
				req.onerror = function() {
					return reject(this.error_callback);
				};
				req.send();
			});
		} else {
			req.onload = function(){
				if (parse_json === true){
					callback(JSON.parse(this.response), this.status, this.getAllResponseHeaders());
				} else {
					callback(this.response, this.status, this.getAllResponseHeaders());
				}
			};
			req.send();
		}
	};

	Ajax.prototype.verb = function(verb){
		this.req_verb = verb;
		return this;
	};

	Ajax.prototype.vars = function(vars){
		this.url_var = vars;
		return this;
	};

	Ajax.prototype.json = function(json){
		this.parse_json = typeof(json === "undefined")?true:json;
		return this;
	};

	Ajax.prototype.headers = function(headers){
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
		window.ajax = function(url, verb) {
			return new Ajax(url, verb);
		}
	}
})(window);