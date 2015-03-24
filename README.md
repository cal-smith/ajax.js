ajax.js
===========

ajax.js is intented to be a nice lightweight AJAX library.  
Unminified the library is 3kb, minification takes it down to ~2kb.

#Usage:
```javascript

//basic useage method
ajax(url).send(callback(data, status, headers));

//avliable options
ajax('url')
	.vars({url:vars})
	.json(true|false)
	.headers({req:headers})
	.progress(function(event))
	.error(function(event))
	.send(callback(data))

//example
ajax.get("http://your.url.com").send(function(data){
	console.log(data);
});

ajax.get("http://your.url.com")
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

//promises
ajax.get("your.url.com").send()
	.then(function(data){
		//resolve
	},
	function(error){
		//reject
	});
```