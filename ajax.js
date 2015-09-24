(function() {
	"use strict";

	var global = typeof self === "object"?self:global;

	var Ajax = function(url, verb) {
		this.req = new XMLHttpRequest();
		this.req_verb = (verb === undefined)?"get":verb;
		this.url = (url === undefined)?global.location.href:url;
		this.parse_json = true;
		this.req_body = null;
		return this;
	};

	Ajax.prototype.send = function(callback) {
		var self = this;//fixes the issues of "this" scope
		var promise = (callback === undefined)?true:false;

		self.req.open(self.req_verb, self.url);
		
		/*this has to be here, because it can only be called after open() is called*/
		if(self.set_headers !== undefined) {
			var keys = Object.keys(self.set_headers);
			for (var i = 0; i < keys.length; i++) {
				self.req.setRequestHeader(keys[i], self.set_headers[key[i]]);
			}
		}
		var parse_json = self.parse_json;
		if (promise) {	
			return new Promise(function(resolve, reject) {
				self.req.onload = function() {
					//Old IE doesn't support the .response property, or .getAllResponseHeaders()
					var headers = (this.getAllResponseHeaders === undefined)?"":this.getAllResponseHeaders();
					if (parse_json === true) {
						//promises can only ever take a single argument
						return resolve(JSON.parse(res));
					} else {
						return resolve(res);
					}
				};
				self.req.onerror = function() {
					//TODO: more info to reject than just the status?
					return reject(this.status);
				};
				self.req.send(self.req_body);
			});
		} else {
			this.req.onload = function() {
				//Old IE doesn't support the .response property, or .getAllResponseHeaders()
				var res = (this.response === undefined)?this.responseText:this.response;
				var headers = (this.getAllResponseHeaders === undefined)?"":this.getAllResponseHeaders();
				if (parse_json === true) {
					callback(JSON.parse(res), this.status, this.getAllResponseHeaders());
				} else {
					callback(res, this.status, headers);
				}
			};
			self.req.send(self.req_body);
		}
	};

	Ajax.prototype.vars = function(vars) {
		this.url_var = "";
		var keys = Object.keys(vars);
		for (var i = 0; i < keys.length; i++) {
			if (i > 0) this.url_var += "&";
			this.url_var += encodeURIComponent(keys[i]) + "=" + encodeURIComponent(vars[keys[i]]);
		}
		this.url += "?" + this.url_var;
		return this;
	};

	Ajax.prototype.raw = function(bool) {
		this.parse_json = (bool === undefined)?false:bool;
		return this;
	};

	Ajax.prototype.headers = function(headers) {
		this.set_headers = headers;
		return this;
	};

	Ajax.prototype.body = function(body) {
		this.req_body = body;
		return this;
	};

	Ajax.prototype.progress = function(callback) {
		this.req.addEventListener("progress", callback, false);
		return this;
	};

	Ajax.prototype.error = function(callback) {
		this.req.addEventListener("error", callback, false);
		return this;
	};

	Ajax.prototype.xdr = function() {
		XDomainRequest && (this.req = new XDomainRequest());
		return this;
	};

	//export as a commonjs compatible module, or as a global function in the browser
	if (typeof module !== "undefined" && module.exports) {
		module.exports = function(url, verb) {
			return new Ajax(url, verb);
		}
	} else {
		if (typeof global.ajax === "undefined") {
			global.ajax = function(url, verb) {
				return new Ajax(url, verb);
			}
		}
	}

	//also export for AMDjs
	if (typeof define === "function" && define.amd) {
		define({
			ajax: function(url, verb) {
				return new Ajax(url, verb);
			}
		});
	}
})();
