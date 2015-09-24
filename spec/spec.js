var ajax = require("../ajax.js");
XMLHttpRequest = require("xhr2");

describe("Option Setting Tests", function(){
	it("sets a url", function(){
		var a = ajax("http://test.url");
		expect(a.url).toBe("http://test.url");
	});

	it("doesnt set a request method", function(){
		var a = ajax("http://test.url");
		expect(a.req_verb).toBe("get");
	});

	it("sets a var object", function(){
		var a = ajax("http://test.url").vars({test1:"test", test2:"testtest"});
		expect(a.url).toBe("http://test.url?test1=test&test2=testtest");
	});

	it("starts a POST request and sets vars", function(){
		var a = ajax("http://test.url", "POST").vars({test1:"test", test2:"testtest"});
		expect(a.post_vars).toBe(true);
	});

	it("sets raw data return", function(){
		var a = ajax("http://test.url").raw();
		expect(a.parse_json).toBe(false);
	});

	it("sets headers", function(){
		var headers = {header:"one"};
		var a = ajax("http://test.url").headers(headers);
		expect(a.set_headers).toBe(headers);
	});

	it("sets a body", function(){
		var a = ajax("http://test.url").body("some data");
		expect(a.req_body).toBe("some data");
	});

	it("sets a progress callback", function(){
		var cb = function(){};
		var a = ajax("http://test.url").progress(cb);
		expect(a.req._listeners.progress[0]).toBe(cb);
	});

	it("sets an error callback", function(){
		var cb = function(){};
		var a = ajax("http://test.url").error(cb);
		expect(a.req._listeners.error[0]).toBe(cb);
	});

	it("creates an xdomain request object", function(){
		XDomainRequest = function(){this.xdr_faker = true};
		var a = ajax("http://test.url").xdr();
		expect(a.req.xdr_faker).toBe(true);
	});
});