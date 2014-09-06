element1.js
===========

Lighter than Hydrogen! Its an AJAX library!

element1 is intented to be a nice lightweight AJAX library.  
Unminified the library is 4kb, minification takes it down to ~2kb.

Usage:
```javascript
ajax.send(args, callback)

ajax.get|getJSON|post(url|args, callback)

args = {
	verb:"GET|POST|PUT|DELETE", //defaults to GET
	url: "http://url.com",
	url_var:{"key":"value"},
	headers:{"key":"value"},
	json: true|false,
	progress: event,
	error: event
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

ajax.get("your.url.com", function(data){ //Same idea for post, put, and delete
	console.log(data)
});

ajax.getJSON({url: "your.url.com"}, function(data){ //same idea as get above, but showing you can still pass an args object
	console.log(data)
});
```