//////////////////////////////////////////////////////////////////////////
// JWee JavaScript Framework & Toolkit 
// Copyright (c) 2010 AUTHORS (mrspoonzy@gmail.com)
// Licensed under the MIT and GPL (for now). 
// http://www.wee.org
//////////////////////////////////////////////////////////////////////////
// Element
/***
@@namespace wee

@@toolkit elem
@desc All element related functions.

@@namespace wee.elem
@desc All element related functions.
@alias Elem

@@function create ( string tag, [object attributes], [string css], [element parent] )
@usage 1
@desc Create a new HTML element on the fly.
@arg {string} The tag name (such as ['div']), with optional ID (['div#mydiv']) or class added (['div.box'])
@arg (optional) {object} object containing properties to set 
@arg (optional) {string} valid string of CSS code
@arg (optional) {element} where to append new element 
@note Arguments 2 and 3 are reversable.
@returns the new element

@@function create (element elementToCopy)
@usage 4
@desc Create a new element just like the ''elementToCopy''
@arg {element} Element to copy
@returns the new element

@@function create (string html, [parent / attributes / css . . . ])
@usage 3
@desc Create a new element from an snippit of HTML
@arg {string} A string of raw HTML
@ret {element} The new element

@@function createFromHTML (string html)
@desc Create new element from straight HTML code. 
@arg {string} Just plain HTML
@ret {element} A reference to the new element, not yet appended to the page.
@ex var ele = Elem.createFromHTML('<div class="left"><img src="image.png" border=0></div>');


@@function addMethods (object methods)
@desc Extend HTML elements with new methods. Uses DOM extensions if supported.
@arg An object containing functions
@advanced

***/
///////////////////////////////////////////////////


var $new, Elem = wee.elem = 
{
		methods: {},
		
		// We must determine weather the browser supports exendable DOM prototypes 
		
		addMethods:
				(function(){
					var Elem = wee.elem, type, w = window, span;
					if( w.HTMLElement ) type = "W3C";
					else if( w.Element ) {
						w.HTMLElement = w.Element;
						type = "IE8";
					}	else {
						span = document.createElement('span');
						if( span['__proto__'] ) {
							type = "__proto__";				
							w.HTMLElement = {prototype:span['__proto__']};
						}	else if( span.constructor && span.constructor.prototype ) {
							type = "constructor";
							w.HTMLElement = {prototype:span.constructor.prototype};
						} else {
							type = "none"
						}
						span = null;
					}
					if( w.HTMLElement && typeof w.HTMLElement.prototype == 'object' ) {
						type = "NATIVE (" + type + ")";
						w.HTMLElement.prototype._jwee_ = true;
						if( document.createElement('span')['_jwee_'] ) type += " : OK";
						else type += " : FAILED";
						wee.ua.nativeDOMPrototypes = true;
					} else {
						type = "SIMULATED (" + type + ")";
						w.HTMLElement = {prototype:{}};
					}
					trace("DOM Extensions: " + type);
					return function(methods) {
						var
						myself = arguments.callee, 
						wrapper = function(f) { 
							return function() { 
									var args = $a(arguments), el = args.shift(), i,  len; 
									if( el instanceof Array ) {
										el.each( function() {
											if( this.tagName ) f.apply(this,args);
										}); 	
									} else {
										return f.apply(el,args);
									}
							};	
						};
						if( typeof myself.counter == 'undefined' ) myself.counter = 0;
						for(var k in methods ) {
							if( !window.HTMLElement.prototype[k] ) {
								myself.counter++;
								window.HTMLElement.prototype[k] = methods[k];
							} else {
								trace('!' + k + '() already is a Element method!');	
							}
							if( !(k in wee.elem.methods) ) wee.elem.methods[k] = methods[k];							
							if( !(k in wee.elem) ) wee.elem[k] = wrapper(methods[k]);
						}
					};
				})(),
				
				
		extend: function(ele) {
			if( ele && ele._jwee_ ) return ele;
			if( /object|embed|applet/i.test(ele.tagName) ) return ele;
			for( var k in wee.elem.methods ) {
				ele[k] = wee.elem.methods[k];
			}
			ele._jwee_ = true;
			return ele;
		},

	
		create: function(tag,attr,css,parent) {
			var t = typeof attr, m = tag.charAt(0) == '<' ?  'html' : tag.match(/([a-zA-Z]+)([.#])(.*)/), o;
			if( typeof css == 'object' && 'tagName' in css ) { parent = css; css = null; }
			if( t != 'object' ) {
				if( t == 'string' ) { css = attr; }
				attr = {};
			}
			if( attr === null ) attr = {};
			if( isElement(attr) ) {
				parent = attr;
				attr = {};
			}
			if( m === 'html' ) {
				o = wee.elem.createFromHTML(tag); 
			} else { 
				if( m ) {
					m.shift();
					tag = m[0];
					if( m[1] == '.' ) attr.className = m[2];
					else attr.id = m[2]; 
				}
				o = wee(document.createElement(tag.toLowerCase()));
			}
			if( 'text' in attr ) {
				o.setText(attr[text]);
				delete attr['text'];
			}
			['className','innerHTML','id','src','name'].each( function(s){ if( s in attr ) { o[s] = attr[s]; delete attr[s]; } } );
			for( var a in attr ) {	
				if( isScalar(attr[a]) ) o.setAttribute(a,""+attr[a]);	
				else o[a] = attr[a];
			}
			if( typeof css == 'string' ) o.style.cssText = css;
			if( parent ) parent.appendChild(o);
			return $new = o;
		},
		
		createFromHTML: function(html) {
			var container = document.createElement('div');
			container.innerHTML = html;
			return wee(container.firstChild);
		},
		
		getBackgroundImage: function(ele) {
			var bg = Elem.getStyle(ele,'backgroundImage');
			if( typeof bg == 'string' ) {
				var m = bg.match(/url\(['"]?([^)'"]+)['"]?\)/)
				if( m ) return m[1];
			} 
			return '';
		},
		
		
		
		insertTo: function(ele,parent) {
			if( parent.firstChild ) parent.insertBefore(ele,parent.firstChild);
			else parent.appendChild(ele);
			return ele;
		},
		
		appendTo: function(ele,parent) {
			parent.appendChild(ele);
			return ele;
		},
		

		updateWithFade: function(ele,content) {
			$.fx.alpha.fadeOut(ele,0.4).andThen( 
				function() { Elem.update(ele,content); $.fx.alpha.fadeIn(ele,0.4); } 
			);
			
			
		},
			
		///////////////////////////////////////////////////
		// Element CSS
		
		getStyle: function( ele, prop ) {
			var m, styles = ele.getStyles();
			prop = prop.camelize();
			if( prop in styles ) return styles[prop];
			switch( prop ) {
				case 'backgroundPositionX':
					m = styles.backgroundPosition.split(' ');
					if( m.length ) return m[0];
				break;
				case 'backgroundPositionY':
					m =styles.backgroundPosition.split(' ');
					if( m.length > 1 ) return m[1];
				break;
			}
			return null;
		},
		
		setStyle: function( ele, prop, val ) {
			var m, styles = ele.getStyles(), css3prefix;			
			prop = prop.camelize();
			if( prop in styles ) {
				 ele.style[prop] = val;
				 return ele;			
			}
			css3prefix = wee.ua.CSS3 ? '' : (wee.ua.firefox ? 'Moz' : ( wee.ua.webkit ? 'Webkit' : '' ) );
			switch( prop ) {
				case 'backgroundPositionX':
					ele.style.backgroundPosition = styles.backgroundPosition.replace(/^(\S+)\s+(\S+)$/, val+" $2");
				break;
				case 'backgroundPositionY':
					ele.style.backgroundPosition = styles.backgroundPosition.replace(/^(\S+)\s+(\S+)$/, "$1 "+val);
				break;
				case 'boxShadow':
				break;				
			}
			return ele;
		},
		

		///////////////////////////////////////////////////
		// Element position
		
		/***
		@@function absoluteCenter
		@desc Positions the element in the absolute center of the page, taking element dimensions and page scroll into consideration.
	  	***/
		
		absoluteCenter: function(ele) {
			ele.style.top = (wee.dom.scrollTop() + (Math.floor((Dom.clientHeight()/2) - (ele.offsetHeight/2)))) + 'px';
			ele.style.left = (wee.dom.scrollLeft() + (Math.floor((Dom.clientWidth()/2) - (ele.offsetWidth/2)))) + 'px';		
			return ele;
		}


	
};

///////////////////////////////////////////////////
;(function(){
//////////////////////////////////////////////////
	wee.ua.CSS3 = 'boxShadow' in wee.camels ? true : (wee.ua.chrome ? true : false);
	wee.elem.css3prefix = wee.ua.CSS3 ? '' : (wee.ua.firefox ? 'Moz' : ( wee.ua.webkit ? 'Webkit' : '' ) );
	
})();
//////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
