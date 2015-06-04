(function(){
	"use strict";

	var global = typeof self === "object"?self:global;

	var Ajax = function(url, verb) {
		this.req = new XMLHttpRequest();
		this.req_verb = (typeof verb === "undefined")?"get":verb;
		this.url = (typeof url === "undefined")?global.location.href:url;
		this.parse_json = false;
		return this;
	};

	Ajax.prototype.send = function(callback) {
		var promise = (typeof callback === "undefined")?true:false;

		this.req.open(this.req_verb, this.url);
		
		/*this has to be here, because it can only be called after open() is called*/
		if(typeof this.set_headers !== "undefined"){
			var keys = Object.keys(this.set_headers);
			for (var i = 0; i < keys.length; i++) {
				this.req.setRequestHeader(keys[i], this.set_headers[key[i]]);
			}
		}
		var parse_json = this.parse_json;
		if (promise){
			return new Promise(function(resolve, reject){
				this.req.onload = function() {
					//Old IE doesn't support the .response property, or .getAllResponseHeaders()
					var res = (typeof this.response === "undefined")?this.responseText:this.response;
					var headers = (typeof this.getAllResponseHeaders === "undefined")?{}:this.getAllResponseHeaders();
					if (parse_json === true){
						return resolve(JSON.parse(res), this.status, this.getAllResponseHeaders());
					} else {
						return resolve(res, this.status, headers);
					}
				};
				this.req.onerror = function() {
					//TODO: more info to reject than just the status?
					return reject(this.status);
				};
				this.req.send();
			});
		} else {
			this.req.onload = function(){
				//Old IE doesn't support the .response property, or .getAllResponseHeaders()
				var res = (typeof this.response === "undefined")?this.responseText:this.response;
				var headers = (typeof this.getAllResponseHeaders === "undefined")?{}:this.getAllResponseHeaders();
				if (parse_json === true){
					callback(JSON.parse(res), this.status, this.getAllResponseHeaders());
				} else {
					callback(res, this.status, headers);
				}
			};
			this.req.send();
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

	Ajax.prototype.json = function(json) {
		this.parse_json = (typeof json === "undefined")?true:json;
		return this;
	};

	Ajax.prototype.headers = function(headers) {
		this.set_headers = headers;
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
		global.XDomainRequest && (this.req = new XDomainRequest());
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