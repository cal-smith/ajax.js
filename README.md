ajax.js
===========

ajax.js is intended to be a nice, lightweight, AJAX library.  
Unminified the library is 3kb, minification takes it down to ~2kb.

#About

ajax.js supports CommonJS/AMD and will fall back to declaring a single global ajax function.  
We support all evergreen browsers and IE 10+.

#####"But why not use/polyfill `fetch()`? why not jQuery?"  
ajax.js was created because including jQuery (~93kb) just to preform some AJAX requests seems a little silly. As for `fetch`: ajax.js co-exists as different take on a higher level API for XMLHttpRequest.

#Usage:

##Basic Usage
####Simple GET request
```javascript
ajax("http://url.com").send(callback(data, status, headers));
```
notes: 

- We dont try to guess the protocol so the http(s):// portion of the url is essential.
- By default `data` will be filled with the raw response text, json/xml/etc parsing is up to you.
- If the url isn't supplied we default to the current page.
- We also default to GET requests, more below.

####GETing some JSON
```javascript
ajax("http://somejson.org").json().send(callback(data, status, headers));
```
notes:

- adding in `.json()` will parse the result as JSON and fill data with the resulting object. Naturally this will explode if the request is actually HTML/XML/etc.

####URL vars and POST
```javascript
ajax("http://postingvars.name", "post").vars({'name':'bob'}).send(callback(data, status, headers));
```
notes: 

- As mentioned above we default to GET requests, however `ajax()` takes any valid HTTP method as it's second argument.
- `.vars()` can naturally be used for any request type, it simply generates URL variables from a valid JS object: `{key:value}` becomes `?key=value` (and appended to the URL).

####Events and errors
```javascript
ajax("https://thismightfail.org")
	.progress(function(e) { console.log("progress!"); })
	.error(function(e) { console.log("*BOOM*"); })
	.send(callback(data, status, headers));
```
notes:

- The error callback will be invoked if the request blows up in transit.
- [Check out MDN for some detail on the progress event](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent).
 
####X-HEADERS
```javascript
ajax("http://a_domain.pirate").headers({"X-SAIL":"7-seas"}).send(callback(data, status, headers));
```
notes:

- Headers cannot be set when using [XDomainRequest](#xdr)

##API

```javascript
ajax('url', 'get|post|put|delete')
	.vars({'some':'variables'})
	.json(true|false)
	.headers({'req':'headers'})
	.progress(function(event))
	.error(function(event))
	.send(callback(data, status, headers));
```

###ajax(string, string)
`ajax("http://url.com", "get")`  
The first argument must be a well formed URL, the second argument optionally specifies the HTTP request method (defaults to GET). If no arguments are provided a GET request to the current page will be constructed.

###.send(function)
`.send(function(data, status, headers));`  
Sends the request and either invokes the function passed as a callback on completion, or if no callback function is provided, it returns a Promise. Be sure to polyfill Promises if you need support in older browsers.  
The callback will be supplied with the response `data`, the resulting `status` code, and string of the received `headers`(an empty string on platforms that don't support getting response headers).

###.vars(object)
`.vars({'one':'fish', 'two':'fish', 'red':'fish', 'blue','fish'})`  
Expects an object as it's only parameter.

###.json(boolean)
`.json()`  
When used with no parameters it enables JSON parsing on the request data. When given a boolean it will enable (true) or disable (false) JSON parsing.

###.headers(object)
`.headers({'x-some-header':'some-value'})`  
Expects an object as it's only parameter.

###.progress(function)
`.progress(function(e){ //handle event })`  
Binds the function to the progress event, the callback will receive ProgressEvents - See [this](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent) for more detail.

###.error(function)
`.error(function(e){ //handle event })`  
Binds the function to the error event, the callback will receive ProgressEvents - See [this](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent) for more detail.

###.xdr()
Enables XDomainRequest on IE's that support it - not recommended if you can avoid it. Read [the MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest) and [this IEInternals post](http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx) to understand the limitations of XDomainRequest.
