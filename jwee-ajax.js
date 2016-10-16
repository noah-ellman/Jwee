//////////////////////////////////////////////////////////////////////////
// JWee JavaScript Framework & Toolkit 
// Copyright (c) 2010 AUTHORS (jweeframework@gmail.com)
// Licensed under the MIT and GPL (for now). 
// http://www.jwee.org
//////////////////////////////////////////////////////////////////////////
// Ajax
//////////////////////////////////////////////////////////////////////////
/*
@@namespace wee
@@class AjaxClass

@@namespace wee.AjaxClass 

@@class AjaxClass
@desc The ajax class shouldn't be directly accessed except if you know what you are doing. Instead use the [wee.ajax] instance.

@@method get (string URL, [callback or element], [object query_parameters])
@desc Make an ajax request.
@arg string The URL to call, such as [/ajax/foo.php] for example.
@arg (optional) Your function callback that jwee should call when ajax request is complete. You can also pass an html element instead.
@arg (optional) Additional query variables that you would like to have encoded and appended to the URL.
@returns true or false/null if an error occured

@@method post (string URL, [callback or element], [object query_parameters])
@desc Make an ajax request.
@arg string The URL to call, such as [/ajax/foo.php] for example.
@arg (optional) Your function callback that jwee should call when ajax request is complete. You can also pass an html element instead.
@arg (optional) Additional query variables that you would like to have encoded and appended to the URL.
@returns true or false/null if an error occured

@@method getHeader (string header)
@desc Fetch a HTTP header from the ajax result.
@arg string The name of the header,  such as [content-length] or a custom header if you sent one.
@returns true or false/null if header does not exist

@@method setHeader (string header, string value)
@desc Set a HTTP header for the next the ajax request.
@arg string The name of the header,  such as [content-length] or a custom header if you sent one.
@arg The string value of the header.

@@boolean running
@desc Indicates whether an ajax call is currently running.
@advanced

@@number status
@desc The HTTP status returned by the web server, such as 200 for success, or 500 for server error.

@@object response

@@object request
@desc An object of properties pertaining to your ajax request

@@object http
@desc The actual XmlHttpRequest object, available to access directly for custom implementation.
@advanced

@@string text
@desc The body of the current / last ajax response you have made. This could be html, json string, or javascript code - whatever the server returned.

*/
//////////////////////////////////////////////////////////////////////////
wee.AjaxClass = (function(){

	var XHR = window.XMLHttpRequest ?
		function() { return new window.XMLHttpRequest(); } :
		function() {
			var a = ["Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP.4.0", "Msxml2.XMLHTTP.5.0", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP"], i=4;
			do {	try{ return new ActiveXObject(a[i]); }catch(e){} } while(i--);
			return false;
		},
		
		requestParams = {
			method: 'GET',
			contentType: "application/x-www-form-urlencoded",
			path: '',
			data: null,
			callback: null,
			element: null
		};

		return Class.create( "AjaxClass",
		{
			construct:
				function() {
					this.http = null;
					this.running = false;
					this.request = null;
					this.queue = [];
					this.onRSC = this.onRSC.bind(this);
					this.onTimeout = this.onTimeout.bind(this);
				},

			get:	 function(path, callback, data) {
				if( this.prepare( $a(arguments) ) ) return this.run();
			},

			post:	 function(path, callback, data) {
				if( this.prepare( [path, callback, data, {method:'POST'} ] ) ) 	return this.run();
			},


/*			return : function( target ) {
				wee.ajax.get( target , function( response ){  
					var data = response.text; 
					eval( " ajax_data = data " );
				}); 
				return ajax_data;
			},
			
*/
			prepareWithObject: function(obj) {			
			},
			
			prepareWithArray: function(arr) {
			},

			prepare: function(args) {
				var count = args.length;
				if( this.running ) {
					var now = Date.stamp()/1000;
					if( now - this.request.when > 10 ) {
						this.onTimeout();
					} else {
						trace("(ajax call queued)");
						this.queue.push(args);	return false;
					}
				}
				if( this.http === null ) this.http = XHR();
				this.request = Object.clone(requestParams);
				this.request.path = args[0];
				this.request.callback = count > 1 ? args[1] : null;
				if( count > 2 ) 	this.request.data = args[2];
				if( count > 3 && typeof args[3] == 'object' ) Object.extend(this.request,args[3]);
				if( this.request.data && typeof this.request.data == 'object' ) {
					if( this.request.tagName && this.request.tagName.toLowerCase() === 'form' ) this.request.data = wee.form.toQueryString(this.request.data);
					else this.request.data = Object.toQueryString(this.request.data);
				}
				this.request.when = Math.floor(Date.stamp()/1000);
				return true;
			},

			run: function(args) {
				if( args && !this.prepare(args) ) return;
				var req = this.request;
				this.running = true;
				if( req.method === 'GET' && req.data ) {
					if( req.path.contains('?') ) req.path = req.path + '&' + req.data;
					else req.path = req.path + '?' + req.data;
				}
				this.http.open(req.method, req.path, true);
				if( req.method === 'POST' ) {
					this.http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					this.http.setRequestHeader("Content-length", req.data.length);
				}
				this.http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				try {
					this.http.timeout = 10000;
					this.http.ontimeout = this.onTimeout;
				} catch(e) { }
				this.http.onreadystatechange = this.onRSC;
				this.http.send(req.data || null);
				trace('(ajax)','[' + req.method + ']', req.path);
				return true;
			},

			setHeader: function(name,value,perm) {
				try {
					this.http.setRequestHeader(name,value);
				} catch(e) { }
				return this;
			},

			getHeader:  function(name) {
				if( this.http ) {
					try { return this.http.getResponseHeader(name); }
					catch(e) { trace("(ajax) No such header:", name); }
				}
				return null;
			},

			onTimeout: function() {
				trace("(ajax) HTTP timed out!");
				try { this.http.abort(); } catch(e) {};
				this.http = null;
				this.running = false;
				if( this.queue.length ) this.run.callLater(100,this,this.queue.shift());
			},

			onRSC: function() {
				if( this.http === null ) return false;
				if( this.http.readyState < 4 ) { return true; }
				this.text = this.response = this.http.responseText + '';
				this.status = this.http.status + '';
				this.contentType = this.http.getResponseHeader('Content-Type') + '';
				if( +this.status >  305 ) trace("!(ajax) Web server error.");
				trace("(ajax) HTTP", this.status);
				trace("(ajax)",this.text.length,"bytes received");
				this.http.onreadystatechange = nully;
				if( this.request.callback !== null ) {
					try {
						if( typeof this.request.callback == 'function' ) this.request.callback(this);
						else if( isElement(this.request.callback) ) this.request.callback.innerHTML = this.text;
					} catch(e) { trace("!(ajax) error in callback: " + e.message); }
				}
				Object.recycle(this.request);
				this.response = null;
				this.running = false;
				if( this.queue.length ) this.run.callLater(100,this,this.queue.shift());
				return true;
			}

	});

})();
///////////////////////////////////////////////////
var Ajax = wee.ajax = new wee.AjaxClass();
//////////////////////////////////////////////////////////////////////////