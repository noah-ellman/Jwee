//////////////////////////////////////////////////////////////////////////
// JWee JavaScript Framework & Toolkit 
// Copyright (c) 2010 AUTHORS (mrspoonzy@gmail.com)
// Licensed under the MIT and GPL (for now). 
// http://www.jwee.org
//////////////////////////////////////////////////////////////////////////
// Elements
//////////////////////////////////////////////////////////////////////////
/***

@@@namespace HTMLElement
@desc New magic methods that Jwee adds to all 

///////////////////////////////////////////////////

@@method extend
@advanced

@@method identify
@desc Returns a valid unique ID for the element. If the element already has an id attribute assigned to it then it will be returned. If no id is assigned the element it will get a new unique id assigned to it, and that will be returned.
@ret The element's ID

@@method tag ( [string tag] )
@desc Get the element's tagName, lowercased, or compare the element against a list of tags. 
@arg (optional) {string} A tag name or multiple tag names, like ['td, th'].
@ret Calling this function without any arguments, returns the element's tagName lowercase. Calling this function with a string returns true if the the tagname you passed matches the element's tagname.

@@method fullName
@desc Mostly for debugging purchases, returns a long name for the element, with its style class and id.
@ret {string} String with element's tag name, class name, and id.

@@method truncate
@desc Remove all the the elements children, thus emptying the element.
@ret [this]

@@method recycle
@desc Remove this element from the DOM. 
@ret The now removed element and its contents.

@@method update ( string html )
@desc Like "innerHTML", but better. Replace the html contents of a element with your argument.
@arg {string} Some HTML
@ret [this]

@@method readAttribute ( string attr )
@desc Get the value of attribute on an element.
@arg A string of the attribute name.
@returns The atrribute value.

@@method writeAttribute ( string attr, value )
@desc Set an attribute on the element
@arg A String of the attribute name
@arg A String of the attribute value
@returns [this]


@@method getData ( string key )
@desc HTML 5.0 support element's new custom attributes,

@@method setData ( string key, mixed value )
@desc HTML 5.0 support element's new custom attributes,

@@method cleanWhitespace 

@@method observe ( string event, function handler) 
@desc Attach and event handler. Same as [Event.add], but just a shortcut.
@arg The type of event, such as [click] or [mouseover].
@arg Your event handling function.

@@method stopObserving ( string id ) 
@desc Remove an event handler you previously added with a special name.

@@method setText
@desc Sets the text inside an element. This is pure text only and any HTML will appear literally.

///////////////////////////////////////////////////

@@method animate ( string property, startValue, endValue, float duration )
@desc Run a animation/tween on the element
@arg A CSS property, such as width, top, opacity, font-size. You can use dashes or camel-cases.
@arg Starting value for the style property. If you just specify NULL however, Jwee will figure it out for you, and begin the animation from the styles current value. 
@arg Ending value for the style property. You can also enter a value such as "auto", if you are animating height, for example!
@arg Number of seconds like 3 or a float like 1.2. This effects the speed and smoothness of the animation.

@@method show
@desc Show element. This is a shortcut for setting [style.visibility] to [visible].
@ret [this]

@@method hide
@desc Hide element. This is a shorcut for setting [style.visibility] to [hidden].
@ret [this]

@@method addClass ( string className )
@desc Add an additional stylesheet class name to the element.
@arg style class name
@ret [this]

@@method removeClass ( string className ) : self
@desc Remove the stylesheet class name from the element.
@arg style class name
@ret [this]


@@method hasClass ( string className ) : boolean
@desc Returns true if the element has this className or false if it doesn't.
@arg style class name

@@method toggleClass ( string className ) : self
@desc If the element has the class, then remove it. If it doesn't, then add it.
@arg style class name
@ret [this]

@@method getStyle ( string attr ) 
@desc Retreives the computed style of [attr]. For fetching explicit inline styles, use the normal [element.style].
@arg {string} A style sheet property, in the hyphenated *or* camelcase syntax ( [font-size] or [fontSize] )

@@method setStyle ( string attr, value ) 
@desc Change a element's style. This function supports additional features and style properties not supported otherwise.
@arg {string} A style sheet property, in the hyphenated *or* camelcase syntax ( [font-size] or [fontSize] )
@arg {mixed} Value to set the property to


@@method getStyles
@desc Gets the computed styles object. Calling this multiple times uses no overhead, as [getStyles()] caches itself as the [currentStyle] property of the element.
@ret Returns the computed styles object for the element. 
@alias styles


@@method css
@desc Update the element's style in an easy way, just using normal CSS syntax like in a stylesheet file.
@arg {string} Plain ol' CSS string, like "font-size:10px;color:blue;".  The new style propeties will be added to (or updating) the element's current style.
@important

@@method opacity ( [number value] )
@desc Get/set/clear the opacity on the elelment.
@arg Passing nothing return the element's opacity. Passing a numeric value sets the element's opacity. Passing [null] clear all opacity filters from element.
@ret Mixed

@@method getOpacity : number

@@method setOpacity ( number ) : self

@@method clearOpacity : self

@@method getRect
@desc Get the element's global (absolute) position in pixels on the page. 
@returns {object} An object containing top, left, right, bottom, width, and height values.
@ex wee("#content").style.top = wee("div#header").getRect().bottom + 'px';

@@method setRect ( object or number, [number], [number], [number] ) 
@arg First parameter can be an object containing a [left, right, top, or bottom] propeties, or can just be top pixel as number.
@arg optional Right pixel
@arg optional Bottom pixel
@arg optional Left pixel

///////////////////////////////////////////////////

@@method query ( string query ) 
@desc Just like [[Dom.select]], but starting from here. Pass a css expression or tag name.
@ret Array of elements
@alias get
@alias find 

@@method isChildOf ( element ) 
@@method isInsideOf

@@method contains ( element ) 
@desc See if this element contains another element.
@arg An element or ID.
@ret {true|false}

@@method insert
@@method append

@@method parent ( [tagName] )
@desc Get the parent element that contains this element, like [.parentNode] but better. ). 
@arg (optional) {string} Give a tagname such as "div" to get the closest parent element of that element type.
@ret {element} or null

@@method next
@desc Get the next element (sibling), after this one.
@ret {element} or null

@@method previous
@desc Get the previous element (sibling), before this one.
@ret {element} or null

@@method childs
@desc Get an array of the element's children, elements only - whitespace or text nodes
@ret {array} Array of elements

***/
///////////////////////////////////////////////////
;(function(){
//////////////////////////////////////////////////

	var
	document = window.document,
	foo = document.createElement('p'),
	Dom = wee.dom,
	
	
	methods = {
							  
		extend: function(o,o2) { 
			if( typeof o == 'string' && typeof o2 == 'function' ) {
				this[o] = o2.bind(this);
			} else if( typeof o == 'object' ) {
				for( var k in o ) this[k] = o[k].bind(this);
			}
		},
		
		identify: function(id) { if( typeof id == 'string' ) { this.id = id; return this; } return isNothing(this.id) ? this.id = wee.getUniqueId(this.tagName.toLowerCase()) : this.id; },
				
		tag: function(s) { 
			var t = this.tagName ? this.tagName.toLowerCase() : '', s2, i;
			if( s ) {
				s2 = s.toLowerCase().split(/\W+/);
				i = s2.length;
				while(i--) { if( t === s2[i] ) return s2[i]; }
				return false;
			}
			return t;
		},
						
		fullName: function() { return this.nodeName.toUpperCase() + (this.id ? '#' + this.id : '') + (this.className ? '.' + this.className : '') },
				
		truncate: function() {
			while( this.firstChild ) {
				if( this.firstChild._jwee_ ) this.removeChild( this.firstChild.truncate() );
				else this.removeChild(this.firstChild);
			}
			return this;
		},
		
		recycle: function() { this.truncate(); return this.parentNode ? this.parentNode.removeChild(this) : null; },		
		
		update: function(content) { this.truncate().innerHTML = content;	return this; },
		
		readAttribute: function(attr,def) {
			if( attr == 'style' ) return this.style.cssText;
			if( /href|src/.test(attr) ) return this.getAttribute(attr);
			return this[attr] || def;
		},
		writeAttribute: function(attr,value) { value = ""+value; this.setAttribute(attr,value); this[attr] = value; return this; },
		
		
		attr: function(attr,val) {
			return typeof val == undef ? this.readAttribute(attr) : this.writeAttribute(attr,val);
		},
		
		mouseIn: function(f) {
			this.observe('mouseenter',f);
		},
		
		
		mouseOut: function(f) {
			this.observe('mouseleave',f);
		},
		
		getData: function(key) {
			return typeof this.dataset == 'object' ? dataset[key] : this.getAttribute('data-' + key);
		},
		setData: function(key,value) {
			if( typeof this.dataset == 'object' ) this.dataset[key] = value;
			else this.setAttribute('data-' + key, value);
			return this;
		},
	
		cleanWhitespace: function() {
			var me = this;
			this.normalize && this.normallize();
			$a(this.children).each( function(ele) { if( ele.nodeType === 3 ) me.removeChild(ele); } );
		},
		
		observe: function() { 
			var args = $a(arguments);
			if( args[0] == 'rollin' ) { args.shift(); args.unshift(this); wee.event.onRollIn.apply(wee.event,args); }
			else if( args[0] == 'rollout' )  { args.shift(); args.unshift(this); wee.event.onRollOut.apply(wee.event,args); }
			else return wee.event.add.apply(wee.event,[this].concat(args));
		},
		
		addEvent: function() { 
			var args = $a(arguments);
			if( args[0] == 'rollin' ) { args.shift(); args.unshift(this); wee.event.onRollIn.apply(wee.event,args); }
			else if( args[0] == 'rollout' )  { args.shift(); args.unshift(this); wee.event.onRollOut.apply(wee.event,args); }
			else return wee.event.add.apply(wee.event,[this].concat(args));
		},
		
		
		stopObserving: function() { return wee.event.remove.apply(wee.event,[this].concat($a(arguments))); },		

		setText: function(str) { 
			this.truncate().appendChild(document.createTextNode(str));
			return this;
		},
				
		text: function() {
			if( arguments.length ) return this.setText(arguments[0]);
			else return this.innerText || this.textContent || "";
		},
		
		getText: function() {  return this.innerText || this.textContent || "" },
	
		
		///////////////////////////////////////////////////
		// CSS related methods
		
		tween: function() {
			var o = new wee.fx.Tween(), args1 = $a(arguments), args2 = args1.length === 2 ? [this, args1.shift(), null] : [this]; 
			o.construct.apply(o, args2.concat(args1));
			return o.start();		
		},
		
		show: function() { this.style.visibility= 'visible'; if( this.style.display =='none' ) this.style.display=''; this.hidden = false; return this; },

		hide: function() { 
			if( this.hidden ) this.style.display='none';
			this.style.visibility = 'hidden'; 
			this.hidden = true; 
			return this; 
		},
		
		hasClass: function(cls) { return (this.className.length > 0 && (this.className == cls || new RegExp("(^|\\s)" + cls + "(\\s|$)").test(this.className))); },
		addClass: function(cls) { if (!this.hasClass(cls)) this.className += (this.className.length>0 ? ' ' : '') + cls; return this; },
		removeClass: function(cls) { this.className = this.className.replace(new RegExp("(^|\\s+)" + cls + "(\\s+|$)"), ' ').trim(); return this; },
		toggleClass: function(cls) { if( !this.hasClass(cls) ) this.addClass(cls); else this.removeClass(cls); return this; },
	  	
		getStyles: function() { return this.currentStyle ? this.currentStyle : this.currentStyle = document.defaultView.getComputedStyle(this,null); },
		styles: function(prop) { return this.currentStyle ? this.currentStyle : this.currentStyle = document.defaultView.getComputedStyle(this,null); },		
		getStyle: function(prop) {
			if( /opacity|alpha/.test(prop) ) return this.getOpacity(); 
			if( prop in this.style ) return this.currentStyle ? this.currentStyle[prop] : this.getStyles()[prop]; 
			else return wee.elem.getStyle(this,prop); 
		},
		setStyle: function(prop, val) {
			return wee.elem(this, prop, val);
		},
		css: function(css) { 
			if( typeof css == 'string' )
			this.style.cssText+=css;
			return this;
		},
		
		opacity: function(x) {
			if( typeof x == 'number' ) return this.setOpacity(x);
			else if( x === null ) return this.clearOpacity();
			else return this.getOpacity();
		},
		
		getOpacity: function() {
			if( this.filters ) return this.filters.alpha ? this.filters.alpha.opacity : 100;
			else return Math.round(this.getStyles()['opacity']*100)
		},
		
		setOpacity: function(value) {
			value = parseInt(value);
			if( this.filters ) {
				if( this.filters.alpha ) this.filters.alpha.opacity = value;
				else {
					if( +this.currentStyle.hasLayout<1 ) this.runtimeStyle.zoom = 1;
					this.runtimeStyle.filter='alpha(opacity=' + value + ')';
				}
			} else {
				this.style.opacity=parseFloat(value/100);
			}
			return this;
		},
		
		clearOpacity: function() {
			 if( this.filters ) { this.runtimeStyle.filter = ''; this.runtimeStyle.zoom = ''; this.style.filter = ''; this.style.zoom = ''; }
			 else this.style.opacity = ''; 
			 return this;
		},
		
		getRect: function() {
			var pt = {top:0,left:0,height:0,width:0}, scrollT = Dom.scrollTop(), scrollL = Dom.scrollLeft();
			if( this.getBoundingClientRect ) { 
				var rect =  this.getBoundingClientRect();
				pt.top = Math.round(rect.top) + scrollT;
				pt.left = Math.round(rect.left) + scrollL;
				pt.right = Math.round(rect.right) + scrollL;
				pt.bottom = Math.round(rect.bottom) + scrollT;
				pt.width = pt.right - pt.left;
				pt.height = pt.bottom - pt.top;
			} else {
				var e = this;
				 do {
					pt.top += e.offsetTop  || 0;
					pt.left += e.offsetLeft || 0;
				 } while (e=e.offsetParent);
				 pt.width = ele.offsetWidth;
				 pt.height = ele.offsetHeight;
				 pt.right = pt.left + pt.width;
				 pt.bottom = pt.top + pt.height;
			}
			return pt;
		},
		
		setRect: function(l, t, w, h ) {
			var r;
			if( typeof l == 'object' ) {
				if( isElement(l) ) r = wee(l).getRect();
				else r = l;
				l = r.left; t = r.top; w = r.width; h = r.height;
			}
			this.style.left = l + 'px';
			this.style.top = t + 'px';
			if( w ) this.style.width = typeof w == 'number' ? w + 'px' : w;
			if( h ) this.style.height = typeof h == 'number' ? h + 'px' : h;
			return this;
		},
		

		
		///////////////////////////////////////////////////
		// DOM-related methods
		
		query: function(q) { return Dom.select(q,this); },
		get: function(q) { return Dom.select(q,this); },
		find: function(q) { return Dom.select(q,this); },
		
		isChildOf: function(ele) { return this.parentNode == ele ? true : false; },
		isInsideOf: function(ele) { 
			var node = this;
			while( node.parentNode ) { node = node.parentNode; if( node === ele ) return true; }
			return false;
		},
		contains: function(ele) { return wee(ele).isInsideOf(this); },
		
		append: function(x) {
			if( isElement(x) ) this.appendChild(x);
			else if( typeof x == 'string' ) this.appendChild($text(x));
			return this;
			
		},
		
		insert: function(x) {
			if( this.firstChild ) 	this.insertBefore(x,this.firstChild);
			else this.appendChild(x);
			return this;
		},
		
		parent: function(options) {
			var tag = typeof options == 'string' ? options.toLowerCase() : false, klass = null, m, node = this;
			if( !options ) { return wee(node.parentNode); }
			if( tag && tag.contains('.') ) {
				m = options.split('.');
				tag = m[0].length ? m[0] : null;
				klass = m[1];
			}
			while( node = (('parentNode' in node) ? node.parentNode : false)  ) {
				if( !('tagName' in node) ) continue;
				if( (tag === null || (tag && tag == node.tagName.toLowerCase()))
						&& (klass === null || (klass && node.className == klass)) ) 
					return wee(node);
			}
			return null;
		},
		
		next: function() {
			var node = this;
			if( this.nextElementSibling ) return this.nextElementSibling;
			while( node = node.nextSibling ) {
				if( node.nodeType === 1 ) return wee(node);
			}
			return null;
		},
		
		previous: function() {
			var node = this;
			if( this.previousElementSibling ) return this.previousElementSibling;
			while( node = node.previousSibling ) {
				if( node.nodeType === 1 ) return wee(node);
			}
			return null;
		},
		
		childs: function() {	return wee($a(this.childNodes).filter(function() { return this.nodeType === 1; })); }
		
	};
	
	if( typeof foo.hasAttribute == undef ) {
		methods.hasAttribute = function(attr) {
			return !(this.getAttribute(attr) === null);
		};
	}
	
	wee.elem.addMethods(methods);
	
	///////////////////////////////////////////////////
	////	Setup document and windows specially
	window.identify = window.fullName = function() { return '#window'; };
	document.identify = document.fullName = function() { return '#document'; };
	document.observe =  function() { return wee.event.add.apply(wee.event,[document].concat($a(arguments))); };
	document.stopObserving = function() { return wee.event.remove.apply(wee.event,[document].concat($a(arguments))); };
	window.observe = function() { return wee.event.add.apply(wee.event,[window].concat($a(arguments))); };
	window.stopObserving = function() { return wee.event.remove.apply(wee.event,[window].concat($a(arguments))); };
	
///////////////////////////////////////////////////
})();
//////////////////////////////////////////////////////////////////////////
