(function(window){
	"use strict";
	var Ajax = function(url, verb){
		this.req = new XMLHttpRequest();
		this.req_verb = (typeof verb === "undefined")?"get":verb;
		this.url = (typeof url === "undefined")?window.location.href:url;
		this.parse_json = false;
		return this;
	};

	Ajax.prototype.send = function(callback){
		var promise = (typeof callback === "undefined")?true:false;

		this.req.open(this.req_verb, this.url);
		
		/*this has to be here, because it can only be called after open() is called*/
		if(typeof this.headers !== "undefined"){
			for (var key in this.headers) {
				this.req.setRequestHeader(key, this.headers.key);
			}
		}
		var parse_json = this.parse_json;
		if (promise){
			return new Promise(function(resolve, reject){
				this.req.onload = function() {
					//IE9 doesn't support the .response property
					var res = (typeof this.response === "undefined")?this.responseText:this.response;
					if (parse_json === true){
						return resolve(JSON.parse(res), this.status, this.getAllResponseHeaders());
					} else {
						return resolve(res, this.status, this.getAllResponseHeaders());
					}
				};
				this.req.onerror = function() {
					//TODO: give reject some better kind of error state(?)
					return reject(this.status);
				};
				this.req.send();
			});
		} else {
			this.req.onload = function(){
				//IE9 doesn't support the .response property
				var res = (typeof this.response === "undefined")?this.responseText:this.response;
				if (parse_json === true){
					callback(JSON.parse(res), this.status, this.getAllResponseHeaders());
				} else {
					callback(res, this.status, this.getAllResponseHeaders());
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

	//fix because IE8 won't parse this correctly
	//additionally,  I doubt this method would work at all in IE8
	Ajax.prototype["delete"] = function(){
		this.req_verb = "delete";
		return this;
	};

	Ajax.prototype.vars = function(vars){
		this.url_var = "";
		for (var key in vars) {
			this.url_var += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(vars.key);
		}
		this.url += "?" + this.url_var.slice(1);
		return this;
	};

	Ajax.prototype.json = function(json){
		this.parse_json = (typeof json === "undefined")?true:json;
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