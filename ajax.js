(function(window){
	"use strict";
	var Ajax = function(url, verb){
		this.req = new XMLHttpRequest();
		this.req_verb = typeof(verb ==== "undefined")?"get":verb;
		this.url = typeof(url === "undefined")?window.location.href:url;
		this.parse_json = false;
		return this;
	};

	Ajax.prototype.send = function(callback){
		var promise = (typeof callback === "undefined")?true:false;

		this.req.open(this.req_verb, this.url);
		/*this has to be here, because it can only be called after open() is called*/
		if(typeof this.headers !== "undefined"){
			var keys = Object.keys(this.headers);
			for (var i = 0; i < keys.length; i++) {
				this.req.setRequestHeader(keys[i], this.headers[keys[i]]);
			}
		}
		var parse_json = this.parse_json;
		if (promise){
			return new Promise(function(resolve, reject){
				this.req.onload = function() {
					//on error - reject
					if (parse_json === true){
						return resolve(JSON.parse(this.response), this.status, this.getAllResponseHeaders());
					} else {
						return resolve(this.response, this.status, this.getAllResponseHeaders());
					}
				};
				this.req.onerror = function() {
					//TODO: give reject some kind of error state
					return reject(this.status);
				};
				this.req.send();
			});
		} else {
			this.req.onload = function(){
				if (parse_json === true){
					callback(JSON.parse(this.response), this.status, this.getAllResponseHeaders());
				} else {
					callback(this.response, this.status, this.getAllResponseHeaders());
				}
			};
			this.req.send();
		}
	};

	Ajax.prototype.get = function(){
		this.req_verb = "get";
		return this;
	};

	Ajax.prototype.post = function(){
		this.req_verb = "post";
		return this;
	};

	Ajax.prototype.put = function(){
		this.req_verb = "put";
		return this;
	};

	Ajax.prototype.delete = function(){
		this.req_verb = "delete";
		return this;
	};

	Ajax.prototype.vars = function(vars){
		var parts = "?";
		var keys = Object.keys(vars);
		for (var i = 0; i < keys.length; i++) {
			var k = keys[i];
			var v = vars[keys[i]];
			if (i === 0) {
				this.url_var += encodeURI(k) + "=" + encodeURI(v);
			} else {
				this.url_var += "&" + encodeURI(k) + "=" + encodeURI(v);
			}
		}
		this.url += parts;
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
		this.req.addEventListener("progress", callback, false);
		return this;
	};

	Ajax.prototype.error = function(callback){
		this.req.addEventListener("error", callback, false);
		return this;
	};

	if (typeof window.ajax === "undefined") {
		window.ajax = function(url, verb) {
			return new Ajax(url, verb);
		}
	}
})(window);