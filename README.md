ajax.js
===========

ajax.js is intented to be a nice lightweight AJAX library.  
Unminified the library is 5kb, minification takes it down to ~3kb.

#Usage:
```javascript

//args object
args = {
	verb:"GET|POST|PUT|DELETE", //defaults to GET
	url: "http://url.com", //defaults to the current page
	url_var:{"key":"value"},
	headers:{"key":"value"},
	json: true|false, //defaults to false
	progress: function(event),
	error: function(event)
}

//basic send method
ajax.send({args}, callback)

//the four HTTP verbs are aliased as helper functions the verbJSON variants expect a JSON formatted response
ajax.verb|verbJSON('url', callback(data))

//also with optional args object
ajax.verb|verbJSON('url', {args}, callback(data))

//method chaining style, everything supported in the args object is aliased as a function
ajax.verb|verbJSON('url')
	.vars({url:vars})
	.json(true|false)
	.headers({req:headers})
	.progress(function(event))
	.error(function(event))
	.send(callback(data))

//basic send usage
ajax.send({
	verb:"GET",
	url: "your.url.com",
	url_var:{"key":"value"},
	headers:{"key":"value"},
	json: true,
	progress: function(event){
		//progress event handler
	},
	error: function(event){
		//error event handler
	}
}, function(data){
	console.log(data);
});

//basic .verb() usage
ajax.get("your.url.com", function(data){
	console.log(data);
});

//basic .verbJSON usage
ajax.getJSON("your.url.com", function(data){
	console.log(data);
});

//basic chaining usage
ajax.get("your.url.com").send(function(data){
	console.log(data);
});

ajax.get("your.url.com")
	.vars({url:var})
	.json()//enables JSON parsing, optionally takes true|false as an argument
	.progress(function(event){
		//progress event
	})
	.error(function(event){
		//error event
	})
	.send(function(data){
		console.log(data);
	});
```