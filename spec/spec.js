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
		var a = ajax("http://test.url", "POST").vars({test1:"test"}).data({test2:"test"});
		expect(a.req_body).toBe("test2=test");
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
});