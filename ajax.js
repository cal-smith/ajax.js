(function() {
	"use strict";

	var root = typeof self === "object"?self:global;

	var Ajax = function(url, verb) {
		this.req = new XMLHttpRequest();
		this.req_verb = (verb === undefined)?"get":verb;
		this.url = (url === undefined)?root.location.href:url;
		this.parse_json = true;
		this.req_body = null;
		return this;
	};

	Ajax.prototype.send = function(callback) {
		/* 
		 "this" in javascript can be problamatic. By 
		  assigning it to another variable ("self" here)
		  we can treat the current scopes "this" as we
		  would any other variable.
		*/
		var self = this;
		var promise = (callback === undefined)?true:false;

		self.req.open(self.req_verb, self.url, true);
		
		//Headers can only be set after open() is called
		if(self.set_headers !== undefined) {
			var keys = Object.keys(self.set_headers);
			for (var i = 0; i < keys.length; i++) {
				self.req.setRequestHeader(keys[i], self.set_headers[keys[i]]);
			}
		}

		if (self.body_headers === "urlencoded") {
			self.req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}

		var parse_json = self.parse_json;
		if (promise) {	
			return new Promise(function(resolve, reject) {
				self.req.onload = function() {
					var res = (this.response === undefined)?this.responseText:this.response;
					if (parse_json === true) {
						/*
						 Promises can only ever resolve (take) a single argument,
						 similar to how functions can only return a single value.
						*/
						return resolve(JSON.parse(res));
					} else {
						return resolve(res);
					}
				};
				self.req.onerror = function() {
					return reject(this.status);
				};
				self.req.send(self.req_body);
			});
		} else {
			this.req.onload = function() {
				//Old IE doesn't support the .response property, or .getAllResponseHeaders()
				// As we are aiming to support only more modern IE, this may be dropped in the future
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

	Ajax.prototype.data = function(data) {
		if (data instanceof FormData
			|| data instanceof Blob
			|| data instanceof String) {
			//XMLHttpRequest specifies behaviour for
			// FormData, Bolb, and String so naturally
			// we make use of this to make our lives
			// easier.
			this.req_body = data;
		} else if (data instanceof Object) {
			//We transform Objects to a key=value 
			// urlencoded string, and we set
			// the appropriate headers.
			var body = "";
			var keys = Object.keys(data);
			for (var i = 0; i < keys.length; i++) {
				if (i > 0) body += "&";
				body += encodeURIComponent(keys[i]) + "=" + encodeURIComponent(data[keys[i]]);
			}
			this.req_body = body;
			this.body_headers = "urlencoded";
		} else {
			throw "Invalid data";
		}
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

	//export as a commonjs compatible module, or as a global function in the browser
	if (typeof module !== "undefined" && module.exports) {
		module.exports = function(url, verb) {
			return new Ajax(url, verb);
		}
	} else {
		if (typeof root.ajax === "undefined") {
			root.ajax = function(url, verb) {
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
