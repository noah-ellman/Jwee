//////////////////////////////////////////////////////////////////////////
// JWee JavaScript Framework & Toolkit 
// Copyright (c) 2010 AUTHORS (mrspoonzy@gmail.com)
// Licensed under the MIT and GPL (for now). 
// http://www.jwee.org
//////////////////////////////////////////////////////////////////////////
// Event
//////////////////////////////////////////////////////////////////////////



/***
@@namespace wee.event

@@toolkit key
@alias Key

@@toolkit mouse
@alias Mouse
@desc Easily get mouse position or mouse button status at any time in real-time from anywhere in your code.

***/
///////////////////////////////////////////////////
// Key
/***
@@object Key
@desc Contains constants like Key.ENTER so you dont need to remember ascii values.
@@function Key
@desc Returns the key code of the active event.
***/
///////////////////////////////////////////////


var Key =  function(k) { var e = wee.event.getEvent(); return e ? e.keyCode || e.which || 0 : 0 };
Object.extend(Key, {
		BACKSPACE: 8, TAB: 9, RETURN: 13, ENTER: 13, ESC: 27, LEFT: 37, UP: 38,
		RIGHT: 39, DOWN: 40, DELETE: 46, HOME: 36, END: 35, PAGEUP: 33,
		PAGEDOWN: 34, INSERT: 45, SHIFT: 16, ALT: 18 } );

///////////////////////////////////////////////////
/***
@@object Keyboard
@desc Not used yet
***/
///////////////////////////////////////////////

var Keyboard =  {
		start: function() {
			wee.event.add(document,'keydown#weeKeyDown',
					function() {
					});
			wee.event.add(document,'keyup#weeKeyUp',
					function() {
					});			
		},
		stop: function() {
			wee.event.remove('weeKeyDown');
			wee.event.remove('weeKeyUp');
		}
};


///////////////////////////////////////////////////
// Mouse
/***
	@@namespace wee.event.mouse
	@desc Easily get mouse position or mouse button status at any time in real-time from anywhere in your code.
	
	@@namespace wee.event.mouse
	@desc Easily get mouse position or mouse button status at any time in real-time from anywhere in your code.
		
	
	@@function start
	@desc Start tracking mouse events. Must be called first, at least once to start the tracking.
	
	@@function stop
	@desc Stop tracking mouse events.
	
	@@object point
	@desc Mouse coordinates as x and y
	
	@@number x
	@desc Mouse X position.
	
	@@number y
	@desc Mouse Y position.
	
	@@boolean pressed
	@desc [true] if mouse button is down, [false] if not 
	
***/

var Mouse =  {
		point: {x:0,y:0},
		x: 0, y: 0,
		pressed: false,
		start: function() {
			wee.event.add(document, 'mousemove#weeMouseMove', 
					function() { 
						var pt = Mouse.point = wee.event.getMousePos();
						Mouse.X = Mouse.x = pt.x;
						Mouse.Y = Mouse.y = pt.y;
					}, {bubble:true});
			wee.event.add(document,'mousedown#weeMouseDown',
					function() {
						Mouse.pressed = true;
					}, {bubble:true});
			wee.event.add(document,'mouseup#weeMouseUp',
					function() {
						Mouse.pressed = false;
					}, {bubble:true});			
		},
		stop: function() {
			wee.event.remove('weeMouseMove');
			wee.event.remove('weeMouseDown');
			wee.event.remove('weeMouseUp');
		}
};

///////////////////////////////////////////////////
// Event
///////////////////////////////////////////////////
/***
@@namespace wee.event

@@function add (element/string id, string type, function handler)
@desc Start observing a new event on [element], document, or window.
@arg {element|string} The id of an element or the actual element, or window/document.
@arg {string} A string of the event type, with or without the "on", such as "click".
@arg {function} Your event handling function.
@ret A numeric id you can use to remove the event later.
@important

@@function remove (string id / number id)
@desc Remove an event
@arg {string|number} The id or name assigned to the event when you created it.

@@function onReady ( function )
@desc Run a function the moment the DOM is ready (happens before onLoad).
@arg {function} A function to be run on page ready.
@important

@@function onLoad ( function f )
@desc This is a the classic onLoad functionality.
@arg A function to be run on page load.
@important 

@@function onLoadLazy ( function f )
@desc These functions will execute in a lazy manner a couple seconds after the page has displayed and the browser is no longer cpu hogging.
@arg A function to be run lazily after page load.
@important 

@@function onMouseWheel ( element or id,  function handler )
@desc Capture mouse wheel scrolling. Special event.
@arg {element} The element
@arg {function} Your function that will be called on mouse wheel activity.
@notes Your function handler will be called with two parmeters. (1) the event object itself  (2) a numeric value representing the direction and speed of the scrolling. Negative number means down and positive means up.

@@function returnTrue
@desc Returns the event as true, not canceling default action or stopping the event chain
@ex return Event.returnTrue();  // Inside your event handler

@@function returnFalse
@desc Returns the event as false, canceling any default browser action and haulting the event chain
@ex return Event.returnFalse();  // Inside your event handler

@@function trace
@desc Log the event to the console, for debugging

@@function trace_extra
@desc Log the event to the console, for debugging (more details)

@@function onRollIn
@desc Special event that triggers only ONCE when mouse enters element's area 

@@function onRollOut
@desc Special event that triggers only ONCE when mouse leaves element's area 



***/

wee.event = new (function(){

	var
		Event = this,
		Dom = wee.dom,
		me = this,
		event = null,
		eventOwner = null,
		eventListener = null,
		W3C = window['addEventListener'] ? true: false,
		
		//// onLoad stuff ////
		onLoaders = [[],[],[]],
		
		addLoader= function(type, f) {
			if( Dom.loaded ) {
				try { 
					if( typeof f != 'function' ) {
						trace("onLoader type " + type + " is not a function");
					} else {
						if( 'tagName' in f ) return false;
						f.call(null); 
					}
				} catch(e) { }
			} else {
				onLoaders[type].push(f);
			}
		},		
		
		runLoaders = function(type) {
			var a, tstr;
			switch(type) {
				case 1:  tstr='onReady'; a = onLoaders[0]; break;
				case 2:  tstr='onLoad'; if( onLoaders[0].length ) runLoaders(1); a = onLoaders[1]; break;
				case 3:  tstr='onLoadLazy'; a = onLoaders[2]; break;
				default: return;
			}
			trace("(event) " + tstr + "  (" + Stopwatch.getElapsed() + ")");
			document.loaded = Dom.loaded = type;
			while( a.length ) try { (a.shift())(); } catch(e) { trace("!Error in " + tstr + " function:", e.message); }
			if( type === 2  && onLoaders[2].length ) {
				if( onLoaders[2].length ) arguments.callee.callLater(1000,null,3);
			} else document.loaded = Dom.loaded = 3;
		},



		callUserListener = function(element, eventType, userListener, options) {
			var args = [event], ret;
			if( eventType.contains('key') ) args.push(me.getKey())
			try {
				ret = userListener.apply(element,args);
			} catch(e) {
				trace("!Error in " + eventType + " event handler (" + e.message + ")");
			}
			return ret;
		},

		// Creates the real event listener that wraps around the user's event listener

		createListener = function(element, eventType, userListener, options) {
			var f = function() {
					var 
						myself = arguments.callee,
						ele = myself.element, 
						options = myself.options,
						e = arguments.length ? arguments[0] : window.event,					
						cancel = false,
						target, ret, related, output;
						
					if( !ele ) { trace("!Orphaned event handler!"); return false; }
					event = e;
					eventOwner = ele;
					eventListener = myself;
					if( !('target' in e) ) e.target = e.srcElement;
					if( !('element' in e) ) e.element = e.srcElement;
					if( !('srcElement' in e) ) e.srcElement = e.target;
					target = e.target;
					related = wee.event.getRelated();
					if( options.mouseenter || options.mouseleave ) {
						cancel = true;
						if( options.mouseenter ) {
							if( !ele.mouseIsOver && (!related || (related && related != ele))) {
								cancel = false;
								ele.mouseIsOver = true;								
							}
						} else if ( options.mouseleave ) {
							 if( related && (related === window || related === document || (/HTML|BODY/i).test(related.nodeName) ) ) { cancel = false; }
							 else if( target && target === ele && ( !related || (related && !ele.contains(related) ) ) ) cancel = false; 
							 if( !cancel )  ele.mouseIsOver = false;							 
						}
						output = me.trace_extra(true);
						trace(cancel  ? "<small>" + output  + '</small>' : output);			
					} else {
						if( wee.event.verbose ) me.trace_extra();
					}
					if( cancel ) {
						return me.returnFalse();
					}
					ret = callUserListener(myself.element, myself.type, myself.userListener, myself.options);
					if( ret === true ) return me.returnTrue();
					else if( ret === false ) return me.returnFalse();
					return me.returnMe(ret);
			};
			// Store the information about the event IN the event listenster function itself.
			f.options = options;
			f.type = eventType;
			f.element = element;
			f.userListener = userListener;
			return f;
		};

	///////////////////////////////////////////////////
	Object.extend(this,
	{
		events: [], eventsById: {},
		onReady: function(f) { addLoader(0,f); },
		onLoad: function(f) { addLoader(1,f); },
		onLoadLazy: function(f) { addLoader(2,f); },
		mouse: Mouse,
		key: Key,
		verbose: false
	});

	///////////////////////////////////////////////////
	this.add = function(element, eventType, listener, options) {
		var eventName = "", wrapListener, m;
		eventType = eventType.toLowerCase();
		if( (!document || !document.loaded) && (/load/).test(eventType) === false) {
			// Add the event when the DOM is actually ready
			return this.onReady ( this.add.bind(this, element, eventType, listener, options) );
		}
		options = options || {};
		element = wee(element);
		if( !element ) { trace("!Cannot add event - no such element"); return false; };
		//  jquery suggests this ie fix
		if( element.setInterval && element != window ) element = window;
		if( eventType.contains('#') ) {
			m = eventType.split("#");
			eventType = m[0];
			eventName = m[1].toLowerCase();
			if( eventName in this.eventsById ) {
				trace("!addEvent failed! (the event ", eventName, " already exists)");
				return false;	
			}
		}
		trace("(event) Added ", eventType, '#' + eventName,"on" ,element.nodeName);
		if( eventType.substr(0,2) == 'on' ) eventType = eventType.substr(2);
		if( W3C ) {
			if( eventType == 'mouseenter' ) {
				options.mouseenter = true;
				eventType = 'mouseover';
			}	else if( eventType == 'mouseleave' ) {
				options.mouseleave = true;
				eventType = 'mouseout';
			}
		}
		wrapListener = createListener(element, eventType, listener, options);
		wrapListener.id = eventName;
		wrapListener.type = eventType;
		if( W3C ) {
			wrapListener.removeThisEvent = function() { return element.removeEventListener(eventType, wrapListener, options.bubble || false); };
			element.addEventListener(eventType, wrapListener, options.bubble || false );
		} else {
			wrapListener.removeThisEvent = function() { return element.detachEvent('on' + eventType, wrapListener); };			
			element.attachEvent('on' + eventType, wrapListener);
		}
		this.events.push(wrapListener);
		wrapListener.weeEventID = this.events.length - 1
		if( eventName.length ) this.eventsById[eventName] = wrapListener.weeEventID;
		return wrapListener.weeEventID;
	};

	///////////////////////////////////////////////////
	this.recycle = this.remove = function(id) {
		var t = typeof id, id_num = id, handler=null, element, eventType;
		if( t == 'string' ) {
			id	 = id.toLowerCase();
			var i = this.events.length;
			if( id.charAt(0) == '#' ) id = id.substr(1);			
			while( --i ) if( this.events[i].id == id ) break;
			id_num = i;
			delete this.eventsById[id];
		} 
		trace("Removing event id", id_num);
		trace("# of current events:", this.events.length);
		if( typeof id_num == 'number' ) handler = this.events[id_num];
		if( !handler ) {
			trace("!event [" + id + "] not found", id_num);
			return false;
		}
		try {
			if( handler.removeThisEvent() ) {
				trace('(event) event removed');	
			}
		} catch(e) { trace(e.emssage); }
		element = handler.element;
		eventType = handler.type;
		if( !element || typeof element.nodeName	 == undef ) {
			trace("!Error moving event", eventName, "because the element is gone!");
			return;	
		}
		try {
			if(element.removeEventListener) element.removeEventListener(eventType, handler);
			else element.detachEvent("on" + eventType, handler);
		} catch(e) { trace(e.message); } 
		this.events.recycle(id_num);		
	};

	///////////////////////////////////////////////////
	this.onMouseWheel = function(where,how) {
		var handler = function(e) {
			event = e = e || window.event || {};
			if( e.wheelDelta ) d = e.wheelDelta / -120;
			else if( e.detail ) d = e.detail / 3;
			d = Math.ceil(d) * 2;
			var r = how.call(where,e,d);
			if( r === true ) return wee.event.returnTrue(e);
			else if( r === false ) return wee.event.returnFalse(e);
			else return;
		};
		if( where.addEventListener ) {
			 where.addEventListener('DOMMouseScroll', handler, false);
		} else {
			where.attachEvent('onmousewheel',handler);
		}
		return handler;
	};


	this.returnFalse = function(e) {
		e = e || event || {};
		e.returnValue = false;
		e.cancelBubble = true;
		if( 'result' in e ) e.result = false;
		e.stopPropagation && e.stopPropagation();
		e.preventDefault && e.preventDefault();
		event = eventOwner = null;
		return false;
	};
	this.returnMe = function(value) {
		event = eventOwner = null;
		return value;
	};
	this.returnTrue = function(e) {
		e = e || event || {};
		e.returnValue = true;
		e.cancelBubble = true;
		if( 'result' in e ) e.result = true;	
		e.stopPropagation && e.stopPropagation();
		event = eventOwner = null;
		return true;
	};

	///////////////////////////////////////////////////
	this.onRollIn = function(where, how) {
		if( W3C ) return this.add(where,'mouseover',how,{mouseenter:true});
		else return this.add(where,'mouseenter',how);
	};

	this.onRollOut = function(where, how) {
		if( W3C ) return this.add(where,'mouseout',how,{mouseleave:true});
		else return this.add(where,'mouseleave',how);
	};
	///////////////////////////////////////////////////

	/***
		@@function getEvent
		@desc Get current Event object.

		@@function getOwner
		@desc Get the current event's owner element. This is the element the event is initially attached to.

		@@function getTarget
		@desc Get the current's event's target element, which may or may not be the owning element.

		@@function getRelated
		@desc Gets the ""related"" element if applicable.

		@@function getKeyCode
		@desc Get the current key event's key code.

		@@function getKey
		@desc Get the current event's key as a letter if applicable.

		@@function getMousePos
		@desc Get the current event's mouse position.
		@returns An object containing the x and y properties.
	***/

	Object.extend(this,
	{
		getEvent: function() { return event; },
		getOwner: function() { return eventOwner; },
		getTarget: function() { var o = event.srcElement || event.target || document; if( o && o.nodeType && o.nodeType === 3 ) o = o.parentNode; return wee(o); },
		getRelated: function() { var o = event.relatedTarget || event.fromElement || null; if( o && o.nodeType && o.nodeType === 3 ) o = o.parentNode; return wee(o); },
		getKeyCode: function() { return event.keyCode || event.which; },
		getKey: function() {
			var code = event.keyCode || event.which || 0;
			if( code < 32 || code >= 126 ) return code;
			else return String.fromCharCode(code).toLowerCase();
		},
   		getMousePos: function() {
	      if (event.pageX || event.pageY) return { x: event.pageX, y: event.pageY };
	      else return { x: event.clientX + document.documentElement.scrollLeft - document.body.clientLeft,
							  y: event.clientY + document.documentElement.scrollTop  - document.body.clientTop };
		}
	});
	
	this.removeThisEvent = function() {
		trace("removeThisEvent");
		if( eventListener ) {
			this.remove(eventListener.weeEventID);
		}
		return true;
	};

	this.trace = function() {
		trace("(event) [",event.type,']', 'on [', this.getOwner().nodeName, '@', this.getTarget().nodeName, ']');
	};

	this.trace_extra = function(silent) {
		var element = this.getOwner(), target = this.getTarget(), related = this.getRelated(), name1 = '', name2 = '', name3 = '', str;
		name1 = typeof element.fullName == 'function' ? element.fullName() : element.nodeName;
		name2 = target && target.fullName ? target.fullName() : toStringNative(target);
		name2 = '[Target]: ' + name2;
		name3 = related && related.fullName ? related.fullName() : toStringNative(related);
		name3 = '[Related]: ' + name3;
		str = event.type.toUpperCase() + ' (@' + name1 + ') ' + name2 + ' ' + name3;
		if( silent ) return str;
		else return trace(str);
	};



	///////////////////////////////////////////////////
	// onReady
	if( window.attachEvent && wee.ua.ie != 9 ) {
		window.attachEvent('onload',function() { runLoaders(2); });
		setTimeout((function(){
			try { document.documentElement.doScroll("left"); }
			catch(e) { setTimeout(arguments.callee,10); return; }
			runLoaders(1);
		 }),50);
	} else if( window.addEventListener ) {
		window.addEventListener('load',function() { runLoaders(2); },false);
		window.addEventListener('DOMContentLoaded',function() { runLoaders(1);  },false);
	}  else {
		var tmp = window.onload || nully;
		window.onload = function() { runLoaders(2); try { tmp.call(window); } catch(e) {} };
	}


})();
///////////////////////////////////////////////////////////////////////////////////////
var Event = wee.event;
///////////////////////////////////////////////
