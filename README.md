ajax.js
===========

ajax.js intends to be a nice, lightweight, AJAX library.
Unminified the library is 3kb, minification takes it down to ~2kb.

Download the minified release [here](https://github.com/hansolo669/ajax.js/releases/download/v1.0.0/ajax.min.js).

#About

ajax.js supports CommonJS/AMD and will fall back to declaring a single global ajax function.  
We support all evergreen browsers, and tentatively IE 10+.

#Usage:
####Simple GET request
```javascript
ajax("http://url.com").send(callback(data, status, headers));
```
notes: 

- We dont try to guess the protocol so the http(s):// portion of the url is essential.
- By default `data` will be parsed as json.
- If the url isn't supplied we default to the current page.
- We also default to GET requests, more below.
- `.send()` bundles everything up and preforms the request.

####GETing some raw data
```javascript
ajax("http://picture.org").raw().send(callback(data, status, headers));
```
notes:

- Adding in `.raw()` will disable JSON parsing and simply pass the raw data to the callback. 

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
	.raw(true|false)
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
Expects an object as it's only parameter. It will unpack the object into a argument string and append that to the request URL.

###.raw(boolean)
`.raw()`  
When used with no parameters it disables JSON parsing on the request data. When given a boolean it will enable (false) or disable (true) JSON parsing.

###.headers(object)
`.headers({'x-some-header':'some-value'})`  
Expects an object as it's only parameter. The unpacking of the header object is delayed until the request has being preformed due to the requirements of XMLHttpRequest, namely that headers can only be appended after open() has been called.

###.progress(function)
`.progress(function(e){ //handle event })`  
Binds the given function to the progress event, the callback will receive ProgressEvents - See [this](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent) for more detail.

###.error(function)
`.error(function(e){ //handle event })`  
Binds the given function to the error event, the callback will receive ProgressEvents - See [this](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent) for more detail.

###.xdr()
Enables XDomainRequest on IE's that support it - not recommended if you can avoid it. Read [the MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest) and [this IEInternals post](http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx) to understand the limitations of XDomainRequest.
