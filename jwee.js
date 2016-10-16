//////////////////////////////////////////////////////////////////////////
// JWee JavaScript Framework & Toolkit 
// Copyright (c) 2010 AUTHORS (mrspoonzy@gmail.com)
// Licensed under the MIT and GPL (for now). 
// http://www.jwee.org
// Contributed to by: XymonSinclair
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
/***
@@@namespace global
@desc Also known as [window]

@@function wee (string or element or array)
@alias $
@desc Gets an element by ID / ensures an element has extended properties.
@arg Pass a element id, an element, or an array of either of these
@returns the extended element or false if error
@important


@@function $a ( array-like object )
@desc Utility function to convert an array-like object to a plain javascript array
@arg Anything that has [length], such as a DOM array or [arguments] within a function
@ret Normal javascript array
@important

@@function isScalar ( mixed )
@desc Check if variable is a "primitive" type (string, number, or boolean)
@ret true/false

@@function isElement ( mixed )
@desc Check if variable is a DOM element.`
@ret true/false

@@function isNothing ( mixed )
@desc Check if the variable is nothing ("undefined", "null", or a empty string).
@ret true/false

@@function trace ( mixed )
@desc Output something to debugging console or wee's console. 


***/
//////////////////////////////////////////////////////////////////////////

var
	wee = window.wee =
		function wee(id) {
			var t = typeof id, i, len;
			if( t === 'string' ) {
				if( id.charAt(0) == '#' ) id = id.substr(1);
				id = document.getElementById(id) || false;
			}
			else if( t === 'object' && id !== null ) {
				if( id === window || id === document) return $_ = id;
				else if( 'caller' in id ) return Array.from(id);
				else if	( id instanceof Array ) {
					for( i=0, len = id.length; i < len; i++ ) id[i] = wee(id[i]);
					return id;
				}
			}
			else if( t === 'function' ) {
				return wee.event.onReady(id);
			} 
			if( !id ) return false;
			return $_ = id['_jwee_'] ? id : wee.elem.extend(id);
		},
	jwee = wee,
	$before = $,
	$ = wee,
	frodo = wee, 
	jwarp = wee,
	jw = wee,
	$_ = null,
	undef = 'undefined',
	Node = { ELEMENT: 1, ATTRIBUTE: 2, TEXT: 3 },
	nully = new Function(),
	// variable type checking
	isScalar = function(x) { var t = typeof x; return t != undef && t != 'object' && t != 'function' ? true: false; },
	isElement = function(x) { return typeof x == 'object' && x !== null && x.nodeName ? true : false; },
	isNothing = function(x) { var t = typeof x; return t == undef || x === null || ( t == 'string' && x == '' ) ? true : false; },
	isString = function(x) { return typeof x == 'string' },
	defined = function(x) { return typeof x == undef; },
	parseString = function(x) { var m = (''+x).match(/(\D+)$/); return m ? m[1] : x; },
	toStringNative = (function(){ 
			var f = Object.prototype.toString; 
			return function(x) { f.call(x); }
	})(),
	
	// toArray
	$a = function(o) {
		var i, a;
		if(  o === a || o === null || !('length' in o)  ) return [];
		if( o instanceof Array ) return o;
		a = new Array(i = o.length || 0);
		while (i--) { a[i] = o[i]; }
		return a;
	},

	$$$ = function(tag,parent,having) {
		parent = parent ? parent : document;
		var className = false;
		if( tag.contains('.') ) {
			 var m = tag.split('.');
			 tag = m[0]; className = m[1];
		}
		var a = [], items = parent.getElementsByTagName(tag.toLowerCase()), len = items.length, t = typeof having;
		if( t == undef ) t = 0;
		else if( t == 'string' ) t = 1;
		else if( t == 'function' ) t = 2;
		while(len--) {
			if( t == 1 && items[len].className != having) continue;
			else if( t == 2 && !having(items[len]) ) continue;
			a.push(items[len]);
		}
		return a;
	},

	// textnode shortcut
	$text = function(str) { return document.createTextNode(str+''); },

	// this is jwee's console.log
	trace = function(str) {
		var me = arguments.callee, caller = arguments.caller, w = window, con = w['console'], pre, t, i, a, strcopy = str, callerName, m;
		if( arguments.length > 1 ) str = $a(arguments).join(" ");
		if( !document.loaded ) {
			if( typeof me.buf == undef ) {
				me.buf = [];
				try {
					if( typeof w['loadFirebugConsole'] != 'undefined' ) loadFirebugConsole();
				} catch(e) {}
			}
			me.buf.push(str);
	  } else if( me.buf ) {
			a = []; for( i=0; i<me.buf.length;i++ ) a.push(me.buf[i]);
			me.buf = false;
			a.each(function(s){me(s);});
			return me(str);
	  }
		if( str === null ) str = 'null';
		t = typeof str;
		if( t == 'object' ) {
			if( str.nodeName ) str = str.nodeName;
			else if( str.message ) str = str.message;
		}
		str = str + '';
		try {
			if( caller ) {
				if( caller.name ) callerName = caller.name + '';
				else if( caller.toSource ) {
					callerName = caller.toSource().substr(0,20);
				}
			}
		} catch(e) { }
		if( callerName ) callerName = ' (' + callerName + ')';
		if( con ) {
			pre = str.charAt(0);
			if( pre == '!' && con.warn ) {
				con.warn('[wee] ' + str.substr(1) + callerName);
				con.trace && console.trace();
			} else if( pre == '*' && con.info ) {
				con.info('[wee] ' + str.substr(1));
			} else {
				con.log('[wee] ' + str);
			}
			if( !document.loaded ) { me.buf.pop(); }
		}
		if( 'debug' in wee && 'trace' in wee.debug ) return wee.debug.trace(str);
		return strcopy;
};

//////////////////////////////////////////////////////////////////////////
////	SEPCIAL-CASE WRITELN's
// Put IE in IE8 mode. Probably has no effect though.
//document.writeln(unescape("%3Cmeta%20http-equiv%3D%22X-UA-Compatible%22%20content%3D%22IE%3D8%22%20/%3E"));
// Empty script and style tags for internal use.
//if( !document.getElementsByTagName('body').length ) {
//	document.writeln(unescape("%3Cstyle%20type%3D%22text/css%22%20media%3D%22all%22%20id%3D%22_jweestyle_%22%3E%3C/style%3E"));
//	document.writeln(unescape("%3Cscript%20type%3D%22text/javascript%22%20id%3D%22_jweescript_%22%3E%3C/script%3E"));
//} else {

	// Google Analytics style of injecting scripts	
	// no more writeln()'s.
	
	(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.setAttribute('id','_jweescript_');
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	var gs = document.createElement('style'); gs.type = 'text/css'; gs.setAttribute('id','_jweestyle_');
    s.parentNode.insertBefore(gs, ga);	
  })();
	
//}
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// START OF NATIVE PROTOTYPES
//////////////////////////////////////////////////////////////////////////

Function.prototype.bind = function() {
		var me = this, args = $a(arguments), scope = this.scope = args.shift();
		return function() { return me.apply(scope,args.concat($a(arguments))); };
};

// Add .implement to all native types
(function(){
	var a=[String,Function,Array,Number,RegExp,Date], i = a.length,
	f =  function(o) { for( var k in o ) this.prototype[k] = o[k]; };
	while(i--) { a[i].implement = f.bind(a[i]); }
})();

/*(function(){
	var map = {'Boolean':Boolean, 'Number':Number, 'String':String, 'Function':Function, 'Array':Array, 'Date':Date, 'RegExp':RegExp};
	for( var k in map ) {  map[k].prototype.toString = function() { return '[object ' + k + ']'; }; }
})();*/

//////////////////////////////////////////////////////////////////////////
// Object
///////////////////////////////////////////////////
/***
@@@namespace Object

@@function extend (object to, object from)
@desc Add all the properties/methods of the second object to the first one. (Overwrites).
@arg {object} The object that will be extended
@arg {object} Any object with properties or methods
@ret The first object is passed back

@@function each( object, function )
@desc Run function passing each key/value in the object. Like the .each for arrays.
@arg {object} The object to iterate
@arg {function} Callback. Receives arguments, key and value.

@@function merge (object, [ object . . . ])
@desc Merge the properties and values from multiple objects.
@arg Unlimited number of objects
@ret A *new* object is returned with everything

@@function keys ()

@@function keysOwn () 
@desc Returns the property of the object, but only its OWN properties, not ones it came with.

@@function values ( object )
@desc Returns an array of all the values in the object.
@arg Any object with properties or functions

@@function size (object)
@desc Get the length or number of properties in the object
@arg Any object with properties or functions
@ret number

@@function recycle (object)
@desc Delete the variable and its contents, freeing resources. (theoretically).
@arg Any object with properties or functions

@@function toJSON (mixed)
@desc Retun JSON encoding representation of the argument.
@arg Any object with properties or functions

@@function toString
@desc Return string representation of the argument.
@arg Any object with properties or functions

***/

Object.extend = function(to, from) { 
	for( var k in from ) {
		to[k] = from[k]; 
	} 
	return to; 
};

Object.extend( Object,
{
	each:	function(obj, func) {
		var keys = Object.keys(obj), len = keys.length, i=0;
		for( i; i < len; i++ ) {
			func(keys[i], obj[keys[i]]);
		}
	},
	merge: function() {
		var args = $a(arguments), len = args.length, o = {}, i;
		for( i=0; i < len; i++ ) Object.extend(o,args[i]);
		return o;
	},
	clone: function(obj) { return Object.extend({ }, obj); },
	keys: function(obj) {
		var keys = [];
		for( var k in obj ) keys.push(k);
		return typeof obj == 'function' ? keys.filter( function(k){return nully[k]?false:true;} ) : keys;
	},
	keysOwn: function(obj, noFunctions ) {
		var keys = [];
		if( obj.hasOwnProperty ) {
			for( var k in obj ) if( obj.hasOwnProperty(k) && (!noFunctions || typeof obj[k] != 'function')) keys.push(k);
		} else {
			keys = Object.keys(obj);
		}
		return keys;
	},
	values: function(obj) {	var values = [];	for( var k in obj ) values.push(obj[k]); return values; },
	size: function(obj) {	var i = 0; for( var k in obj ) i++; return i; },
	recycle: function(obj) { try{ for( var k in obj ) { obj[k] = null; delete obj[k]; } } catch(e){} return obj; },
	toObject: function(obj) {
		var o = {};
		Object.keysOwn(obj, true).each( function(k) { o[k] = obj[k]; });
		return o;
	},
	toQueryString:	function(o) {
			if( typeof o == 'string' ) return o;
			if( !o ) return '';
			var a=[], enc = encodeURIComponent||escape;
			for( var p in o ) 	if( isScalar(o[p]) ) 	a.push(p+'='+enc(o[p]));
			return a.join('&');
		},
	sort:	function(obj) {
			var o = {}, a = [], k;
			for( k in obj ) a.push(k);
			a.sort().each(function(k){o[k] = obj[k];});
			return o;
		}
});

Object.toJSON = function(obj) {
			var t = typeof obj;
			if( t == 'function' ) return '"function"';
			else if( t == undef ) return '"undefined"';
			else if( t == 'unknown' ) return '"unknown"'
			else if( obj === null ) return 'null';
			else if( t == 'object' && !(obj instanceof Array) && !('toJSON' in obj) )  {
				var str = [], v;
				for( var k in obj ) {
					t = typeof obj[k]; v=obj[k];
					if( t == 'function' ) continue;
					if( t  == 'object' && v !== null && ( v.nodeName || v.setInterval ) ) continue;
					str.push(k+":"+Object.toJSON(v));
				}
				return '{' + str.join(',') + '}'
			}
			return obj.toJSON ? obj.toJSON() : "" + obj;
};

Object.toString =
		function(obj,done) {
			var val, t = typeof obj, str = obj + '',  members;
			if( t == undef ) return 'undefined';
			else if( t == 'unknown' ) return 'unknown'
			else if( obj === null ) return 'null';
			if( t == 'function' ) {
					members = Function.members(obj);
					//if( !members.length && obj.prototype ) {
					//	for( var test in obj.prototype )  '[object [' + obj.constructor + ' ' + obj.prototype.constructor + ']]';
					//	return '[object Function]';
					//}
					if( obj.className ) str = '[object [prototype ' + obj.className + ']]'; 
					else if( !members.length && ('bind' in obj) ) { str = '[object Function]'; }
					if( done ) return str;
					else if( members.length ) return str + '{\r\n' + members.map( function(k) { return k + ': ' + Object.toString(obj[k],true); } ).join(', \r\n') + ' }';
					return str;
			}
			if( done ) {
				if( t instanceof Array ) return '[...]';
				if( t == 'object' && obj.nodeName ) return obj.nodeName + '';
				else if( t == 'object' ) return '{...}';
			} else {
				if(  t == 'object' && !(obj instanceof Array) && (typeof obj['length'] != undef && typeof obj['namedItem'] != undef) ) obj = $a(obj);
				if(  t == 'object' && !(obj instanceof Array) ) {
					var vals = [], i = 1;
					try { ('nodeName' in obj) } catch(e) { return 'native'; }
					for( var o in obj )	{
						try {
						val = obj[o] + ''; //Object.toString(obj[o],true);
						vals.push(o + ':  ' + val + '\r\n');
						}catch(e){}
					}
					return str + '{\r\n' + vals.join('') + '}\r\n';
				}
			}
			if( typeof obj == 'string' && done ) return obj.substr(0,99999);
			if( typeof obj != undef & obj !== null  ) return obj.toJSON ? obj.toJSON() : (obj.toString ? obj.toString() : ''+obj);
			else return '';
		};

Object.functions = function(obj) { var a = [], k; for( k in obj ) { if( typeof obj[k] == 'function' ) a.push(k); } return a; };

//////////////////////////////////////////////////////////////////////////
// Function.prototype
///////////////////////////////////////////////////
/***
@@@namespace Function
@desc Extra methods on Javascript functions.

@@method bind (object thisVariable) 
@desc Permanently set what the variable [this] refers to in the function. If you are making your own class you can use bind to lock any function to your class. Also, once you called [bind], the function itself is bound when you call your function with the [.fire()] method.
@arg The object to become the [this] variable.
@ret A new function with the binded [this].
@important

@@method later ( number millaseconds )
@desc Executes function after xx millaseconds. 
@arg Millaseconds delays before running function.
@important

@@method interval ( number millaseconds )
@desc Executes this  after xx millaseconds, *repeatedly*. Use method .cancel() to stop.
@arg Millaseconds delays before running function.

@@method passing ( arguments )
@desc Get the same function back but with your arguments permanently set.
@arg Arguments to pass to functions
@ret The new function

@@method cancel 
@desc Cancels the previous timeout or interval set with [later()]
@note No arguments needed, because the timer information is stored interally within the function.
@returns self

@@method toSource
@desc Returns the source code of the function. Browser dependent.

***/

Function.implement(
{
	extend: function(o) { Object.extend(this,o); },
	callLater: function() {
		var me = this, args = $a(arguments), t = args.shift(), o = args.shift();
		return this.timer = setTimeout( function() { return me.apply(o,args); }, t);
	},
	applyLater: function(t,obj,args) { var me = this; return this.timer = setTimeout( function() { return me.apply(obj,args); }, t); },
	later: function(t) { return this.timer = setTimeout(this,+t || 1); },
	timeout: function(t) { return this.timer = setTimeout(this,+t || 1); },	
	interval: function(t) { return this.timer = setInterval(this,+t || 25); },		
	cancel: function() { if( this.timer ) { clearTimeout(this.timer); delete this.timer; } return this; },
	passing: function(arg) { var me = this; return function() { return me.apply(this,[arg].concat($a(arguments))); }; },
	fire: function() { return this.apply(this.scope||this,$a(arguments));},
	toJSON: function() { return '\'[object Function]\''; },
	toSource: (Function.prototype.toSource || Function.prototype.toString),
	functionName: function() { return this.name ? this.name : 'noname'; }
});
Function.prototype.toString = 	function() { return '[object Function]'; };
Function.members = function(f) { var a = []; try{ for( var k in f ) { if( typeof nully[k] == undef ) a.push(k); } } catch(e){} return a; };

//////////////////////////////////////////////////////////////////////////
// Array.prototype
///////////////////////////////////////////////////
/***

@@namespace Array
@desc Extra methods on Javascript Arrays.

@@function from ( mixed )
@desc Converts an array-like object to a normal array
@arg Array-like object (anything with .length and numeric indexes)
@returns A normal array
@important

@@method each ( function | string )
@desc Run through every item in the array and do something.
@arg The function to apply to each item in the array.
@note  The "this" in your function is current item in the array. The first argument of your function is also the item, and the 2nd argument is the array position.
@important

@@method indexOf ( mixed needle )
@desc Search the array for [needle]
@arg A value of any type to search the array for
@returns Returns [index] of [-1] if not found

@@method search ( mixed needle )
@desc Search the array for [needle]
@arg A value of any type to search the array for
@returns Returns index or [null] if not found

@@method contains ( mixed needle )
@desc Search the array for [needle]
@arg A value of any type to search the array for
@returns [true] if needle is found or [false] if not found

@@method last
@desc Get the last value in this array

@@method insert ( int position, [mixed values ...] )
@desc Insert values into this array at position.  This is done in-place, preserving the array.
@ret Itself

@@method random
@desc Get a random value from the array

***/

Array.from = $a;
Array.implement(
{
	each:
		function(f) {
			var len = this.length, t = typeof f, i;
			if( t == 'function' ) {
				for( i=0 ; i<len ; i++) {
					f.call(this[i],this[i],i);
				}
			} else if( t == 'string' ) {
				var m = f.match(/\.(\w+)\(\)/);
				if( m ) {
					m = m[1];
					while(len--) (this[len][m])();
				}
			}
			return this;
		},
	clone: function() { return [].concat(this); },
	search: function(what) { var i=0, len = this.length; for( i ; i < len ; i++ ) if( this[i] === what ) return i; return null; },
	contains: function(what) { return this.search(what) !== null ? true : false; },
	filter: function(f,inv) {
		var i = 0, len = this.length, arr = [], a = false,
			 type = typeof f == 'object' && f instanceof Array ? true: false;
		for( i; i < len; i++ ) {
			if( type ) { a = f.contains(this[i]); if( (a && !!inv) || (!a && !inv) )  arr.push(this[i]); }
			else {
				try { if( f.call(this[i],this[i]) ) arr.push(this[i]); } catch(e) { trace("Error in Array#filter()"); }
			}
		}
		return arr;
	},
	random: function() { return this[Math.rand(0,this.length-1)]; },
	last: function() { return this.length ? this[this.length-1] : null; },
	truncate: function() { while( this.length ) this.pop(); return this; }
});
if( typeof [].indexOf == undef ) {
	Array.prototype.indexOf = function(what) { for( var i=0, len=this.length; i < len ; i++ ) if( this[i] == what ) return i; return -1; };
}
Array.prototype.recycle = function(what) {
	if( typeof what != 'number' ) what = this.search(what);
	if( what !== null ) return this.splice(what,1);
	return null;
};

/*Array.prototype.toString = function() {
	var len = this.length, vals = [];
	for( var i = 0; i<len; i++ ) vals.push(Object.toString(this[i]));
	return '[' + vals.join(', ') + ']';
};*/
Array.prototype.insert = function() {
	var args = $a(arguments), where = args.shift();
	if( args[0] instanceof Array ) args = args[0];
	this.splice.apply(this,[where,0].concat(args));
	return this;
};
Array.prototype.toJSON = Array.prototype.toString;
if( typeof [].map != 'function' ) {
	Array.prototype.map = function(f) {
		var len = this.length, i=0;
		for(i; i<len; i++) this[i] = f(this[i],i,this);
		return this;
	}
};
Array.prototype.swap = function(a, b) { var tmp=this[a]; this[a]=this[b]; this[b]=tmp; };


//////////////////////////////////////////////////////////////////////////
// String
///////////////////////////////////////////////////
/***
@@@namespace String
@desc Extra String methods. (Note: String methods return a <u>new</u> string.)

@@method trim
@desc Removes any leading or trailing whitespace (if any) from string.
@ret {string} new string

@@method test (RegExp pattern)
@desc Test is a the string matches the provided regular expression
@ret {true|false}
@ex $('mydiv').className.test(/ ?hover/)


@@method contains (string needle)
@desc Check if passed string is contained in string.
@returns {true|false}

@@method suffix
@desc Like parseInt() but the opposite, gets the alphabetic part of a string, like "px" from "200px"
@ret {string} new string 

@@method capitalize
@desc Capitalize the string. Makes "foObAr" into "Foobar".
@returns {string} new string

@@method entities
@desc Convert special chars like ['<'] to their HTML entities, like ['<']
@returns {string} new string

@@method camelize
@desc Converts a CSS property string to its javascript equvalent, such as "font-size" to  "fontSize".
@returns {string} new string


***/

String.implement( 
{
	trim: function() { return this.replace(/^\s+/, '').replace(/\s+$/, ''); },
	test: function(reg) { return this.search(reg) != -1; },
	contains: function(needle)  { return this.indexOf(needle) !== -1; },
	right: function(index,len) { var p = this.length - index; return this.substring(p, (typeof len == 'number' ? p+len : this.length)); },
	times: function(n) { if( n < 1 ) return ''; var c = this.valueOf(), s = new String(this); while(--n) s = s.concat(c); return s; },
	toNumber: function() { return parseInt(this.valueOf()); },
	capitalize: function() { return this.toLowerCase().replace(/^./,this.charAt(0).toUpperCase()); },
	suffix: function() { var m = this.match(/[^\D]*$/); return m ? m[1] : ""; },
	parse: function() {
		if( this.contains('{') && this.lastIndexOf('}') > 0 ) return wee.evalStyle(this);
	},
	camelize: function() {
	  	if( wee.camels[this] ) return wee.camels[this];
	    var parts = this.split('-'), len = parts.length;
	    if (len == 1) return parts[0];
	    var camelized = this.charAt(0) == '-'
	      ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1)
	      : parts[0];
	    for (var i = 1; i < len; i++)
	      camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1)
	    return camelized;
	},
	entities: function() {
		var p = document.createElement('p'), text = document.createTextNode(this), str;
		p.appendChild(text);
		str = "" + p.innerHTML;
		p.removeChild(text);
		text = null; p = null;
		return str;
	},
	
	toJSON: function() { return '"' + this.trim().replace(/\r?\n/g,"\\n").replace(/"/g,'\\"') + '"'; }
});

//////////////////////////////////////////////////////////////////////////
// Number
///////////////////////////////////////////////////
/***
@@namespace Number

@@method isFloat
@desc See if the number is a float (decimal number)
@ret {true | false}

@@method toPaddedString ( int length, int radix )
@advanced

***/

Number.implement(
{
	toPaddedString: function(len, radix) { var s = this.toString(radix || 10); return '0'.times(len-s.length) + s; },
	floor: function() { return Math.floor(this.valueOf()); },
	round: function() { return Math.round(this.valueOf()); },
	px: function() { return this.toString(10) + 'px'; },
	isFloat: function() { return Math.floor(this) != this.valueOf(); }
});

//////////////////////////////////////////////////////////////////////////
// Date
///////////////////////////////////////////////////
/***
@@@namespace Date

@@function stamp

@@function create ( string )
@desc Get dates by saying things like ""now + 1 day""
@arg {string} Something like: "now+2days", "2 hours ago", "+1month"
@ret {Date} A new Date object set with your specified datetime.
@ex Date.create("now+15mins");

@@method getUnixTime
@desc Get unix time, same as [time()] in PHP.
@ret {number} seconds since 1970

***/

Date.stamp = function() { return new Date().getTime(); };
Date.prototype.toJSON = function() {
  return '"' + this.getUTCFullYear() + '-' +
    (this.getUTCMonth() + 1).toPaddedString(2) + '-' +
    this.getUTCDate().toPaddedString(2) + 'T' +
    this.getUTCHours().toPaddedString(2) + ':' +
    this.getUTCMinutes().toPaddedString(2) + ':' +
    this.getUTCSeconds().toPaddedString(2) + 'Z"';
};
Date.create = function(str) {
	var d = new Date(), m, reg = /(\+|-)?\s*(\d+)\s*(\w+)/;
	m = reg.exec(str);
	if( m ) {
		m[2] = +m[2];
		if( (m[1] && m[1] == '-') || str.right(3) == 'ago' ) m[2] *= -1;		
		switch(m[3].substr(0,3)) {
			case 'sec': d.setSeconds(d.getSeconds()+m[2]); break;
			case 'min': d.setMinutes(d.getMinutes()+m[2]); break;
			case 'hou': d.setHours(d.getHours()+m[2]); break;		
			case 'day': d.setDate(d.getDate()+m[2]); break;
			case 'mon': d.setMonth(d.getMonth()+m[2]); break;
			case 'yea': d.setYear(d.getYFullYear()+m[2]); break;		
		}
	}
	return d;
};
Date.prototype.getUnixTime = function() { return Math.floor(this.getTime() / 1000) };
Date.getUnixTime = function() { return new Date().getUnixTime(); };
Date.now = function() { return new Date().getTime(); };

// Static class to measured time passed 
var Stopwatch = new (function() {
			var startTime = Date.now();
			this.start = function() { startTime =  Date.now(); };
			this.stop = function() { var elapsed = this.getElapsed; startTime = 0; return elapsed; };
			this.isRunning = function() { return startTime == 0 ? false : true; };
			this.getElapsed = function() { return startTime ? Date.now() - startTime : 0; };
})();
///////////////////////////////////////////////////
// Math
///////////////////////////////////////////////////
/***
@@namespace Math

@@function rand ( number or float min, number or float max)
@desc Get a random number between |min| 5uand [max]. Accepts decimals too.
@arg {number | float} Minimum
@arg {number | float} Maximum
@returns {number | float}
***/

Math.rand = function(min,max) {
	var a = Math.min(min,max), b = Math.max(min,max), r = Math.random(), d = b - a, n;
	if( d === 0 ) return a; n = (r * d) + a;	return d.isFloat() || a.isFloat()  ? n : Math.round(n);
};

//////////////////////////////////////////////////////////////////////////
// END OF NATIVE PROOTYPES
//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
/// Class factory
//////////////////////////////////////////////////////////////////////////
/***
@@@namespace wee

@@class Class
@desc Create new class
@arg {string} Class name
@arg {object} Object containing methods and properties. The constuctor should be called "construct" or "initialize"
@ret The new javascript class

***/

var Class = wee.Class = {};
Class.create = function(name, proto ) {
	var className = name ? name : 'Class',
	klass = function() {
//		if( this === window ) { return new klass.constructor.apply(null,$a(arguments)); }
		if( this === window ) { return new arguments.callee.apply(null,$a(arguments)); }
		if( this.construct ) { this.construct.apply(this,$a(arguments)); }
		else if( this[className] ) { this[className].apply(this,$a(arguments)); }
		else if( this.initialize ) { this['initialize'].apply(this,$a(arguments)); }
	};
	//klass.constructor = Function.constructor;
	klass.prototype = {};
	klass.prototype.constructor = klass;
	klass.className = className;
	klass.toString = function() { return '[object [prototype ' + className + ']]' };
	klass.prototype.toString = function() { return '[object [class ' + className + ']]'; }
	for( var k in proto ) {
		Object.extend(klass.prototype, proto);
		// IE doesn't iterate over toString
		if( typeof proto.toString == 'function' ) klass.prototype.toString = proto.toString;
	}
	return klass;
};
/*Class.extend = function(superc,klass) {
	klass.prototype.constructor = superc;
}
Class.singleton = function(construct,proto) {
	construct.prototype = {};
	return Object.extend(construct,proto);
};*/

//////////////////////////////////////////////////////////////////////////
/// jwee
//////////////////////////////////////////////////////////////////////////
/***
@@@namespace wee

@@toolkit wee
@desc The main JWee object.

@@function require ( string feature )

@@function getUniqueId ( [string prefix] )
@desc Create a new unique identifier with optionally supplied prefix
@arg (optional) {string} a prefix such as "apple"
@ret {string} a new unique id, such as ['apple_1'], ['apple_2'], and so on

@@function addScript ( string url )
@desc Add a SCRIPT tag to the page.
@arg The URL to a valid .js file.


@@function addStyle ( string path )
@desc Add a STYLE tag to the page.
@arg The URL to a valid .css file.

@@function evalScript ( string code )
@desc This is like [eval()] except faster and executes globally
@arg {string} any amount of javascript code

@@function evalStyle ( string code )
@desc Dynamically add CSS code to the document
@arg {string} valid CSS code of any lenfth

@@function navigate ( string url )
@desc Redirect browser to a new URL
@arg {string} a URL to redirect browser to


***/

(function(){

var
	cache = {}, 
	class2type = [],	
	window = this;
	
	/*JWEEDOMAIN*/

	// Populate the class2type map
	"Boolean Number String Function Array Date RegExp Object".split(" ").each( function(name, i) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});

wee.extend( { 

	version: '0.9.1',
	
	class2type: class2type,
	
	nully: new Function(),

	cfg: {	
		SCRIPT_PATH: typeof window.JWEE_PATH != undef ? JWEE_PATH : '/jwee/' 
	},

	require: function(feature) {
		if( feature in jwee ) return;
		var path = (typeof JWEE_DOMAIN == 'string' ? JWEE_DOMAIN : '') + wee.cfg.SCRIPT_PATH + 'jwee-' + feature + '.js';
		if( document.loaded ) { return wee.addScript(path); }
		var str = '<scr' + 'ipt ' + 'type="text/javascript" src="';
		str += path;
		str += '"></scr' + 'ipt>';
		document.writeln(str);
	},
	
	isArray: function(arg) { return arg instanceof Array; },

	json:
		typeof JSON == 'object' && JSON.stringify ? JSON.stringify : Object.toJSON,

	getUniqueId : (function() {
		var ids = {uid:0}; return function(prefix) { prefix = prefix || 'uid'; if( !(prefix in ids) ) ids[prefix] = 0; return prefix + '_' + ids[prefix]++; };
	})(),

	navigate: function(url) { var loc = window.location || document.location; if( loc.replace ) loc.replace(url); else loc.href=url; },
	
	now: Date.now,

	each: function(obj, func) {
		if( obj instanceof Array ) {
			return obj.each(func);
		} else {
			return Object.each( obj, func );
		}
	},

	addScript: function(path, cb) {
		var ele = Elem.create('script',{type:'text/javascript',language:'JavaScript'});
		if( typeof cb != 'function' ) cb = function(){};
		var f = function() { try { cb(ele); } catch(e) {} trace((this.readyState||"") + " : " + path);  };
		ele.onreadystatechange = f;
		ele.onload = f;
		ele.onerror = function() { trace("!Error loading script " + path); }
		ele.src = path;
		wee.dom.head().appendChild(ele);
		return ele;
	},

	addStyle: function(path) { return Elem.create('link',{type:'text/css',rel:'stylesheet',href:path}, wee.dom.head()); },

	// Inspired by jQuery
	evalScript: function(code) {
		var ele, head;
		if( window.execScript ) {
			try {	window.execScript(code); }
			catch(e) { trace("!(evalScript) error in script",e.message); }
		} else {
			ele = wee.elem.create('script');
			head = wee.dom.head();
			ele.type = 'text/javascript';
			ele.text = code;
			try {
				head.insertBefore(ele,head.firstchild);
			} catch(e) {
				head.appendChild(ele);
			}
			ele.recycle();
		}
		return true;
	},
	
	// From jQuery - Awesome new method recently discovered
	globalEval: function( data ) {
		if ( data ) {
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},


	evalStyle: function(code) {
		if( !document.loaded ) {
			return wee.event.onReady(arguments.callee.passing(code));
		};
		var sheet = wee('_jweestyle_'), lines = code.replace(/[\r\n\t]/gm,' ').split(/}/);
		if( !sheet ) { return; }
		sheet = sheet.styleSheet || sheet.sheet || sheet;
		lines.each( function(str) {
			str = str.trim() +  '}';
			var m = str.match(/(.+?)\{(.*?)}/), m1, m2;
			if( m ) {
				m1 = m[1].trim();
				m2 = m[2].trim();
				try {
					if( sheet.insertRule ) sheet.insertRule(m1 + '{' + m2 + '}',sheet.cssRules.length);
					else sheet.addRule(m1, m2);
				} catch(e) { trace("!ERROR in css rule: " + e.message); }
			}
		});
	},

	camels:
		(function() {
			var props = {}, el = document.createElement('p'), css = el.style, p,
			f = function(m) { return ('-' + m.charAt(0).toLowerCase()); };
			for( p in css ) {
				if( isNaN(p) && p != 'length' && typeof css[p] != 'function' ) {	props[p.toLowerCase()] = props[p] =  p.replace(/[A-Z]/g, f); }
			}
			props['float'] = 'styleFloat' in css ? 'styleFloat' : 'cssFloat';
			props.cssFloat = props['float'];
			el = css = null;
			return props;
		})(),
		
		
	rand: function(x,y) {
		if( typeof x == undef ) {
			y = +x; x = 0;
		}
		return Math.rand(x,y);
	},

	///////////////////////////////////////////////////
	// User Agent
	/***
	
		@@toolkit ua
		@desc Object containing information about the browser (user agent).

	***/

	ua:
		(function() {
			var o = {ie:0,firefox:0,gecko:0,safari:0,opera:0,webkit:0,windows:0,mac:0,vista:0,chrome:0,x64:false},
			m, ua = o.ua = navigator.userAgent.toLowerCase();
			o.quirks = document.compatMode && document.compatMode == 'BackCompat' ? true : false;
			if ( /windows|win32/.test(ua) ) { o.windows = true; if( ua.contains("nt 6.") ) o.vista = true; }
			else if ( ua.contains('macintosh') ) { o.mac = true; }
			if( ua.contains('gecko') ) o.gecko = true;
			if( ua.contains('webkit') ) o.webkit = true;
			if( ua.contains('chrome') ) o.chrome = true;
			if( ua.contains('x64') ) o.x64 = true;
			else if( ua.contains('firefox') ) o.firefox = true;
			else if( ua.contains('safari') ) o.safari = true;
			else if( ua.contains('opera') ) o.opera = true;
			else { m = ua.match(/msie (\d)/); if( m !== null ) o.ie = m[1]; }
			o.version = navigator.appVersion.match(/[\d.]+/);
			if( o.version ) o.version = o.version[0];
			o.ieVersion = document.documentMode ? document.documentMode : o.ie;
			o.nativeQuerySelector = document.querySelectorAll ? true : false;
			o.nativeJSON = typeof JSON == 'object' && JSON.stringify ? true : false;
			o.nativeDOMPrototypes = false;
			return o;
		})(),

		///////////////////////////////////////////////////
		// DOM
		/***
		
			@@toolkit dom 
			@desc DOM related functions and selecting elements.
			
			@@namespace wee.dom
			@desc DOM related functions and selecting elements.
			@alias Dom

			@@function id (string element_id)
			@desc Get element by ID. This is the same as [[wee()]] and the [[$()]] function if enabled.
			@arg An HTML element's ID, such as "#header". The # sign is NOT required.
			@ret {element} The single element or false if invalid

			
			@@function tag (string tag)
			@desc Get elements by HTML tag name.
			@arg HTML tag, such as "div" or "p".
			@ret {array} The selected elements 
			
			@@function select (string selector)
			@desc Get elements by CSS selector, the same as jQuery() way.
			@arg {string} Valid CSS selector, using #id, .class, and tag names. 
			@ret {array} The selected elements 
			@note Selecting is processed by the browser, which is much more effecient. However, CSS3 or non-compliant selectors will not work reliably. 
			@ex Dom.select("form#myForm input");  Dom.select("#header a.navLink");

			@@function body 
			@desc Get the document's BODY tag
			@ret {element} BODY element

			
			@@function head
			@desc Get the document's HEAD tag
			@ret {element} HEA element
			
			@@function clientHeight
			@desc Get document (page) height
		
			
			@@function clientWidth
			@desc Get document (page) width
			@ret {number} 

			
			@@function scrollTop
			@desc Get the window's scroll position
			@ret {number} 

			
			@@function scrollLeft
			@desc Get the window's scroll position
			@ret {number} 
			
			@@boolean loaded
			@desc Status (or readyState) of the page. Greater then 0 means DOM is rendered.	
			@ret {number} 
			
		***/

		dom: {
				loaded:false,
				id: wee,
				tag: $$$,
				name: function(name) {
					return wee($a(document.getElementsByName(name)));
				},
				select: (function() {
					var errstr = "!Query selector error:";
					return document.querySelectorAll ?
						function(q,p) { try { return wee($a((p||document).querySelectorAll(q))); } catch(e) { trace(errstr, q); return null; } } :
						function(q,p) { try { return wee(jwee['sizzle'](q,p)); } catch(e) { trace(errstr,q); return null; } };
				})(),
				body: function() { return cache.body ? cache.body : cache.body = (document.getElementsByTagName('body')[0] || document.documentElement); },
				head: function() { return cache.head ? cache.head : cache.head = document.getElementsByTagName('head')[0]; },
				clientWidth: function() {
					if( typeof window.innerWidth == 'number' ) return window.innerWidth - 12;
					else if(document.documentElement && document.documentElement.clientWidth) return document.documentElement.clientWidth;
					else return document.body.clientWidth;
				},
				clientHeight: function() {
					if( typeof window.innerHeight == 'number' ) return window.innerHeight - 12;
					else if(document.documentElement && document.documentElement.clientHeight) return document.documentElement.clientHeight;
					else return document.body.clientHeight;
				},
				scrollTop: function() {
					// Chrome's documentElement scrollTop is ZERO. WTF?
					if( wee.ua.chrome ) return window.scrollY;
					return document.documentElement.scrollTop || window.pageYoffset || 0;
				},
				scrollLeft: function() {
					// Chrome's documentElement scrollTop is ZERO. WTF?
					if( wee.ua.chrome ) return window.scrollX;
					return document.documentElement.scrollLeft || window.pageXoffset || 0;
				}
		}

});


wee.toString = function() { return '[jwee ' + wee.version + ']'; };
if( !document.querySelectorAll ) wee.require('sizzle');
if( typeof JWEE_REQUIRE === 'string' ) JWEE_REQUIRE.split(/, ?|\s/).each(function(s){wee.require(s);});


///////////////////////////////////////////////////////////////////////////////////////
////	Cookie
/***
@@namespace wee
@@toolkit cookie
@desc Cookie handling functions. Setting, Getting, simple to use

@@namespace wee.cookie

@@function get ( string name )
@desc Get a cookie.
@arg {string} the cookie name
@ret {string} the cookie value, or undefined

@@function set ( string name, string value, [string date] )
@desc Set a cookie.
@arg {string} the cookie name
@arg {string} the cookie's value
@arg optional (string) a value such as: "1 hour" or "5 days", for when the cookie should expire

@@function unset ( string name ) 
@desc Delete a cookie
@arg (string) the cookie name 


***/

(function(){

	var initialized = false;

	wee.cookie =
	{
		init:
			function() {
				var me = this;
				document.cookie.split('; ').each( function(cookie) {
					var parts = cookie.split('=');
					me[parts[0]] = decodeURIComponent(parts[1]);
				});
				initialized = true;
			},

		get:
			function (name) {
				if( !initialized ) this.init();
				return this[name];
			},
			
			
		set:
			function(name, val, date) {
				if( !initialized ) this.init();				
				var str = name + "=" + encodeURIComponent(val);
				if( date ) str += ';expires=' + Date.create(date).toGMTString();
				document.cookie = str;
				this[name] = val;
				return true;
			},
			
		unset:
			function(name) {
				if( !initialized ) this.init();								
				this.set(name,this[name],"-1day");
				delete this[name];
				return true;
			},

		toJSON: function() { if( !initialized ) this.init(); return Object.toJSON(Object.toObject(this)); },
		toString: function() { return document.cookie; }
			
			
		
	};

})();
///////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////
})();
///////////////////////////////////////////////////////////////////////////////////////
/***
@@namespace wee

@function parseURL ( string URL )
@desc Parse a complex URL into an object representating with all the parts, including the individual query string variables
@ret {object} Return an object with properties

***/

///////////////////////////////////////////////////////////////////////////////////////
// URL parseing
// CREDITS: Thanks to the dood at blog.stevenlevithan.com for this!
wee.parseURL = function(url) {
	var a = document.createElement('a'), file;
	a.href = url;
	file =  (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1];
	return {
		source: url,
		protocol: a.protocol.replace(':',''),
		host: a.hostname,
		port: a.port,
		query: a.search,
		params: (function(){
			var ret = {},
			seg = a.search.replace(/^\?/,'').split('&'),
			len = seg.length, i = 0, s;
			for (;i<len;i++) {
				if (!seg[i]) { continue; }
				s = seg[i].split('=');
				ret[s[0]] = s[1];
			}
			return ret;
		})(),
		file: file,
		hash: a.hash.replace('#',''),
		path: a.pathname.replace(/^([^\/])/,'/$1').replace( new RegExp(file+ '$'), ''),
		relative: (a.href.match(/tp:\/\/[^\/]+(.+)/) || [,''])[1],
		segments: a.pathname.replace(/^\//,'').split('/')
	};
}

wee.URL = Class.create('URL', {
		construct: function(url) {
			Object.extend(this,wee.parseURL(url || document.location.href+''));
		},
		setParam: function(param, value) {
			if( value === null ) delete this.params[param];
			else this.params[param] = value;
			return this;
		},
		navigate: function() {
			document.location.href = '' + this;
			return this;
		},
		toString: function() {
			var  query = Object.toQueryString(this.params);
			return [
				this.protocol,
				'://',
				this.host, 
				this.path,
				this.file,
				query.length ? '?': '',
				query,
				this.hash.length ? '#' : '',
				this.hash
			].join("");
			
		}
});
////////////////////////////////////////////////////////////////////////////////////
var Dom = wee.dom;
var UA = wee.ua;
///////////////////////////////////////////////////////////////////////////////////////
if( typeof $before != 'undefined' ) { $ = $before; }
///////////////////////////////////////////////