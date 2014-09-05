element1.js
===========

Lighter than Hydrogen! Its an AJAX library!

element1 is intented to be a nice lightweight AJAX library.

Current syntax:
```javascript
ajax.send({
	verb:(default: GET) GET|POST|PUT|DELETE,
	url: "your.url.com",
	url_var:["must","be","array"],
	headers:{"key":"value"},
	json: true|false,
	progress: function(event){
		//event handle
	},
	error: function(event){
		//event handle
	}
}, function(data){
	console.log(data);
});
```