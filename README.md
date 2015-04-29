ajax.js
===========

ajax.js is intented to be a nice lightweight AJAX library.  
Unminified the library is 3kb, minification takes it down to ~2kb.

#Usage:
```javascript

//basic usage
ajax(url).send(callback(data, status, headers));

//avliable options
ajax('url', 'get|post|put|delete')
	.get()
	.put()
	.post()
	.delete()
	.vars({url:vars})
	.json(true|false)
	.headers({req:headers})
	.progress(function(event))
	.error(function(event))
	.send(callback(data));

//examples//
ajax('http://your.url.com', 'get').send(function(data){
	console.log(data);
});

ajax('http://your.url.com')
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
ajax("your.url.com").send()
	.then(function(data){
		//resolve
	},
	function(error){
		//reject
	});
```