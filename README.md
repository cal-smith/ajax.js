ajax.js
===========

ajax.js is intended to be a nice lightweight AJAX library.  
Unminified the library is 3kb, minification takes it down to ~2kb.

ajax.js supports CommonJS/AMD and will fallback to declaring a single ajax function on window.
We support all evergreen browsers and IE 10+.

"but why not use/polyfill `fetch()`? why not jQuery?"
ajax.js was created because including jQuery (~93kb) just to preform some AJAX requests seems a little silly.

`fetch()` is great and generally does fill much of the same role ajax.js was created to fill, however ajax.js brings more to the table as an abstraction of XMLHttpRequest.

#Usage:

##Basic Usage

```javascript
ajax("http://url.com").send(callback(data, status, headers));
```
notes: 

- We dont try to guess the protocol so the http(s):// portion of the url is essential.
- By default `data` will be filled with the raw response text, json/xml/etc parsing is up to you.
- If the url doesn't exist (i.e: `ajax()`) we default to the current page.
- We also default to GET requests, more below.

```javascript
ajax("http://somejson.org").json().send(callback(data, status, headers));
```
notes:

- adding in `.json()` will parse the result as JSON and fill data with the resulting object. Naturally this will explode if the request is actually HTML/XML/etc.

```javascript
ajax("http://postingvars.name", "post").vars({'name':'bob'}).send(callback(data, status, headers));
```
notes: 

- As mentioned above we default to GET requests, however `ajax()` takes any valid HTTP method as it's second argument.
- `.vars()` can naturally be used for any request type, it simply generates URL variables from a valid JS object: `{key:value}` becomes `?key=value` which is appended to the URL.



##Available Options

```javascript
ajax('url', 'get|post|put|delete')
	.vars({'some':'variables'})
	.json(true|false)
	.headers({'req':'headers'})
	.progress(function(event))
	.error(function(event))
	.send(callback(data, status, headers));
```

###.send(function)
Sends the request and either invokes the function passed as a callback on completion, or if no callback function is provided, it returns a Promise. Be sure to polyfill Promises if you need support in older browsers.
This is the only non-optional 'option', and doesn't return `this`.

###.vars(object)
Expects an object as it's only parameter, which is then converted to a URL variable string. We do escape the components.
returns `this`.

###.json(boolean)
When used with no parameters it enables JSON parsing on the request data. When given a boolean it will enable (true) or disable (false) JSON parsing.

###.headers(object)
Expects an object as it's only parameter, which is used to set the request headers.

###.progress(function)
Binds the function to the progress event. See [this](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent) for detail on progress events.

###.error(function)
Binds the function to the error event. See [this](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent) for detail on progress events.