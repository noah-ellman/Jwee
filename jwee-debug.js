//////////////////////////////////////////////////////////////////////////
// JWee JavaScript Framework & Toolkit 
// Copyright (c) 2010 AUTHORS (mrspoonzy@gmail.com)
// Licensed under the MIT and GPL (for now). 
// http://www.wee.org
//////////////////////////////////////////////////////////////////////////
// Debugging 
//////////////////////////////////////////////////////////////////////////
/*
@@function trace (mixed msg, [mixed . . . ])
@desc For your debugging pleasure. Writes messages to browser's console or firebug, and also to jwee's own console.


var str = '';
[wee,wee.dom,wee.fx,wee.AjaxClass.prototype,String.prototype,Function.prototype,Object,Event,wee.elem.methods,FX.Tween.prototype,wee.ua,Key].each(
function(c,k) { 
	Object.each(this,
		function(a,b) { 
			if( typeof b != 'function' )
			 str += '<keyword>' + a + '</keyword>\r'; 
		})
	 });
str

*/

///////////////////////////////////////////////////
;(function() { 
///////////////////////////////////////////////////

	var $this = null;
	var Debug = window.Debug = {
		consoleOpen: false	
	};
	window.wee.debug = Debug;
			

	trace("Debugging: ON");
			  
	wee.event.onReady( function() {
		wee.evalStyle(
			'#weeConsole { position:absolute; z-index:99205; top:-60px; left:0px; width:100%; background:#AAAAA;text-align:left; overflow: hidden; height:38px;'
			+'#weeConsoleInput { background: #FFFFFF !important; font-size:18px; line-height:22px; color:#114477; border:1px solid #005522;  width:500px;  height:auto; margin:0px; outline:none; text-align:left  font-weight:bold; font-family:"Arial"; text-align:left; }'
			+'#weeTrace { position:absolute; top:40px; left:-700px; padding:5px; z-index:99201; height:auto; overflow:hidden; text-align:left; font-size:12px; line-height:13px; white-space:normal; background-color:white; color:#444; border:2px solid #555; border-left:0; width:500px; font-family:Calibri,Arial; }' 	
			+'#weeTrace b { color: blue; }'			
			+'#weeTrace i { color: green; font-weight:bold; }'						
			+'#weeTrace i b, #weeTrace b i { color: yellow; }'									
			+'#weeTrace small { color: #AAA; font-size:10px; }'												
			+'#weeInspect { position:absolute; background:#111; color:#F60; top:40px; left:-600px; z-index:11202; height:auto; overflow:auto; text-align:left; font-weight:normal; font-size:12px; line-height:13px; white-space:normal; padding:5px; border:2px solid #777;  width:450px; min-height:400px; max-height:500px; overflow:auto; overflow-x:hidden !important;  }'
			+'#weeInspect div { margin:5px; padding:5px; color:#BBBBBB; font-size:11px; line-height:12px; }'
			+'#weeInspect br { clear:both; }'
			+'#weeInspect var { float:right; text-align:right; color:#939; font-weight:normal; font-size:11px; font-style:normal; font-family:Calibri,Arial; }'
			+'#weeInspect var u { text-decoration:none; color: #666666; font-style:italic; font-weight:normal;}'
			+'#weeInspect var em { font-style:normal; color: #FC3; }'
			+'#weeInspect b { color:#093; white-space:nowrap; font-size:12px;  }'
			+'#weeInspect i { color: #6C3; font-weight:bold; font-style:normal; font-size:11px; }'
			+'#weeInspect a:hover s { text-decoration:none !important; color:yellow; background:#000; }'
			+'#weeInspect a { text-decoration:none;  }'
			+'#weeInspect s { font-size: 11px;  color: #683; font-family:"Arial Black", Gadget, sans-serif; text-decoration:none;background:none;display:inline;font-style:normal; border:none;}'
			+'#weeInspect s, #weeInspect var, #weeInspect b, #weeInspect i, #weeInspect a { display:inline;margin:0;padding:0;border:0; }'
		);
		document.observe('keydown',function(e) {
				var kc = wee.event.getKeyCode(), k = wee.event.getKey();
				if( (e.altKey && e.ctrlKey) || (e.shiftKey && e.altKey)  ) {
					switch(k) {
						case 'w':
						case 'd':
							wee.debug.showConsole.call(wee.debug); 
							return false; 
						break;
						case 'p': 
							if( window['console'] && window['console']['profile'] ) {
								trace("Profiling. . .");
								setTimeout(function() { console.profileEnd(); },1000);
								console.profile();							
							}
							return false;
						case 's': Debug.toggleHoverInspector(); 
							return false;
						break;
						case 'v': 
							wee.event.verbose = !wee.event.verbose;
							trace("Event verbosity is now: " + wee.event.verbose);
							return false;
							break;
						
					} 
				}	else if( kc == Key.ESC ) { wee.debug.hideConsole.call(wee.debug); return false; }
				return;
		});
	});
	
	///////////////////////////////////////////////////
	Debug.toggleHoverInspector = function(off) {
		var myself = arguments.callee, weeHoverBox;
		if( typeof off == undef ) off = true;
		if( typeof myself.enabled == undef ) myself.enabled = false;
		if( !off || myself.enabled ) {
			myself.enabled = false;
			wee.event.recycle('hoverInspector');
			wee.event.recycle('hoverInspector2');
			weeHoverBox = wee('weeHoverBox');			
			if( weeHoverBox ) weeHoverBox.recycle();
		} else if( !myself.enabled ) {	
			Dom.body().insert(Elem.create('div#weeHoverBox',"position:absolute;display:height:auto;block;top:-10px;left:0px;border:2px solid #7777FF; color:#000;background:#FFFFBB;font-size:13px;padding:3px;font-weight:bold;"));
			wee('weeHoverBox').onmousedown = function() { this.style.display='none'; };
			document.observe('mouseover#hoverInspector',	function(ev) {
				var target = wee.event.getTarget(), pos, box = wee('weeHoverBox');
				if( !box ) return;
				if( target === myself.activeElement ) return;
				pos = target.getRect();
				box.setRect(pos.left,pos.top-box.offsetHeight,pos.width).setText(wee(target).fullName());
				target.borderLeft = target.style.borderLeft;
				target.borderBottom = target.style.borderBottom;
				target.style.borderLeft = '2px solid #AAAAFF';
				target.style.borderBottom = '2px solid #AAAAFF';
				if( myself.activeElement ) { 
					myself.activeElement.style.borderLeft = myself.activeElement.borderLeft;
					myself.activeElement.style.borderBottom = myself.activeElement.borderBottom;
				}
				myself.activeElement = target;
			});
			document.observe('click#hoverInspector2',	function(ev) {
				wee.debug.showConsole.call(wee.debug);
				wee('weeConsoleInput').value = 'wee("' + wee(myself.activeElement).identify() + '")';
				myself(false);			
			});	
			myself.enabled = true;
				
		}
		
		
	};

				 

	Debug.init = function() {
		var o, b = Dom.body(), savedData;
		Debug.init = false;		
		if( !wee('weeTrace') ) b.insertBefore( wee.elem.create('div#weeTrace','display:none'), b.firstChild );
		if( !wee('weeInspect') ) b.insertBefore( wee.elem.create('div#weeInspect','display:none;visibility:visible'), b.firstChild );
		o = wee.elem.create('div#weeConsole','display:none');	
		var prompt = wee.elem.create('span','color:white;font-weight:bold;font-size:12px;font-family:monospace;');
		prompt.innerHTML = '&nbsp;&nbsp;jwee:&nbsp;&nbsp;';
		o.appendChild(prompt);
		
		var cmdbox = wee.elem.create('input#weeConsoleInput',{type:'text'});
		o.appendChild(cmdbox);
		b.insertBefore(o, b.firstChild);	
		var cmdbox = wee('weeConsoleInput'), inspect = wee('weeInspect');
		if( cmdbox.getUserData ) {
			savedData = cmdbox.getUserData("default");
			if( typeof savedData == 'string' ) cmdbox.value = savedData;
		}
		inspect.onmousescroll = function(e) { e.preventDefault(); };
		var hist = cmdbox.hist = [];
		hist.current = -1;
		cmdbox.observe('keydown', function() {
			var k = wee.event.getKeyCode();
			if( k == Key.DOWN ) {
				if( hist.current < 0 ) return;
				hist.current--;
				if( hist.current < 0 ) { cmdbox.value = '';				return; }
				if( hist.current > 0 ) cmdbox.value = hist[hist.current];
				else cmdbox.value = '';
				return false;
			} else if( k == Key.UP ) {
				if( hist.current >= hist.length ) return;
				hist.current++;
				if( hist.current >= hist.length ) return;
				cmdbox.value = hist[hist.current];
				return false;
			} else if( k == Key.ENTER ) {
				Debug.consoleCmd();
				return false;
			}
		 });
		var jse = wee('weeTrace'), jsd = wee('weeInspect');
		Debug.setupTweens();
		trace("Debugger initalized.");		
	};
	
	Debug.setupTweens = function() {
		var top = wee.dom.scrollTop() || 0, el = wee('weeConsole'), el2 = wee('weeTrace'), el3 = wee('weeInspect'), speed = 0.3;
		el.show = (function() { this.style.display=''; try { this.blur(); window.focus(); } catch(e) {} this.tween('top',null,document.documentElement.scrollTop,speed);this.hidden = false; Debug.consoleOpen = true; }).bind(el);
		el.hide = (function() { try { this.blur(); window.blur(); window.focus(); } catch(e) {} this.tween('top',null, -10 - el.offsetHeight ,speed);  this.hidden = true; Debug.consoleOpen = false; }).bind(el);
		el2.show = (function() { this.style.display=''; this.style.top = document.documentElement.scrollTop + 35 + 'px'; this.tween('left',null,0,speed); this.hidden = false; }) .bind(el2);
		el2.hide = (function() { this.tween('left',null,-50 - el2.offsetWidth,speed); this.hidden = true; }).bind(el2);
		el3.show = (function() {  this.style.display='block';  this.style.top = document.documentElement.scrollTop + el.offsetHeight + 'px'; this.tween('left',null, 10,speed); this.hidden = false; }).bind(el3);
		el3.hide = (function() { this.tween('left',null,-25 - el3.offsetWidth,speed,{onComplete:function() { el3.innerHTML = ''; }}); this.hidden = true; }).bind(el3);		
		el.hidden = el2.hidden = el3.hidden =  true;
		
	};
	
	Debug.hideConsole = function() {
		var o = wee('weeConsole'), o2 = wee('weeInspect'), o3 = wee('weeTrace');
		if( !o2.hidden  ) {
			try { wee('weeConsoleInput').blur(); } catch(e) { }
			o2.hide();
			return;
		}
		if( !o.hidden ) {
			if( !o3.hidden ) o3.hide();
			o.hide();
			return;
		}		
		if( !o3.hidden  ) {
			o3.hide();
//			o3.style.visibility = 'hidden';
		} else {
			//o3.style.display = 'block';
			//o3.style.visibility = 'visible';
			//o3.show();
			//wee.debug.showConsole.call(wee.debug)			
		}
//		wee(Dom.select('iframe, object')).each('.show()');		
	};
			 
	Debug.showConsole= function() {
		if( this.init ) this.init();
		var o = wee('weeConsole'), tb = wee('weeConsoleInput');		
		if( !o ) return;
		var scrollTop = Dom.scrollTop();
//		with(o.style) { display='block'; visibility = 'visible'; top = (scrollTop+1).px(); }		
		o.style.display='block';
		o.style.visibility='visible';
		o.show();
		wee('weeTrace').show();		
		setTimeout(function() { try { tb.select(); }catch(e){} },1010);				
		//wee(Dom.select('iframe, object')).each(function(ele) { this.style.visibility='hidden'; });
	};
	
	Debug.consoleCmd = function() {
		var input = wee('weeConsoleInput'), val = input.value.trim(), result = Debug._(val);
		input.setAttribute("value",val);		
		if( input.setUserData ) {
			input.setUserData("default",val,nully);
		}		
		if( result !== false ) {
			if( !input.hist.length || (input.hist.length && input.hist[input.hist.length-1] != val) ) input.hist.unshift(val);
			input.hist.current=0;
		}
		if( result === false || result === null ) {
			wee('weeTrace').show();
			wee('weeInspect').hide();
		} else {
			wee('weeTrace').hide();
			wee('weeInspect').style.visibility='visible';
			wee('weeInspect').style.display='block';
			wee('weeInspect').show();
			setTimeout(function() { wee('weeConsoleInput').select(); },100);

		}
		
		
	};
	
	Debug._ = function(msg) {
		var name, js = wee('weeInspect'), msgt = typeof msg;	
		$this = null;
		if( msgt == 'undefined' || msgt === null ) {
			trace(msgt+'');
			return null;
		}
		if( msgt == 'string' ) {
			msg = msg.trim().match(/(.*?);?$/)[1];
			try {
				$this = eval(msg);
			} catch(e) { trace("!(console)", e.message); return false; }
			var t = typeof $this;
			if( t == 'undefined' ) {
					trace('(console) undefined');	
					return null;		
			} else if( $this === null ) {
					trace('(console) null');	
					return null;
			} else if( t != 'object' && t != 'function' ) {
					trace('(console) ' + $this);
					return null;
			} else {
				name = msg;
				msg = $this;
			}
		}
		if( !js ) js = wee('weeTrace');
		if( typeof js.innerHTML_OLD == 'undefined' ) js.innerHTML_OLD = [];
		if( !js.hidden && js.innerHTML_OLD ) {
			js.innerHTML_OLD.push(js.innerHTML);		
		}			
		var html = Debug.__Dump(msg,name);
		if( !html ) return;
		js.innerHTML = html;
		if( typeof js.innerHTML_OLD != 'object' || js.innerHTML_OLD === null ) {
			js.innerHTML_OLD = [];
		}
		if( !js.onclick )
		js.onclick = 
			function() {
				var e = window.event || arguments[0];
				e.cancelBubble = true;
				e.returnValue = false;
				if( e.stopPropagation ) e.stopPropagation();
				
				if( this.id != 'weeInspect' ) return false;
				if( this.innerHTML_OLD.length ) {
					this.innerHTML = this.innerHTML_OLD.pop();
				}	else {
					this.hide();
					this.innerHTML_OLD = null;
				}
				return false;
			};
		js.onmousescroll = function() { return false; };
		if( !js.onkeydown )
		js.onkeydown = 
			function() {
				var e = window.event || arguments[0], key = e.keyCode || e.which;
				if( key == Key.LEFT ) this.onclick.call(this);
				e.cancelBubble = true;
				e.returnValue = false;
				if( e.stopPropagation ) e.stopPropagation();
				return false;
			};			
			js.style.display = 'block';
			js.show();
	};

	Debug.__ = function(s1,s2) {
		var s;
		wee('weeInspect').onclick = null;
		if( typeof s2 == 'number' || s2 == parseInt(s2).toString() ) {
			s = s1 + '[' + s2 + ']';
		} else {
			s = s1 + '[\'' + s2 + '\']';
		}
		setTimeout(function() { Debug._(s); },100);
		return false;
	};

	Debug.__Dump = function(obj, name, depth,i) {
		var buf = '', out1 = [], out2 = [], out3 = [], aria = /^aria/, prop2, name2;
		var nn, pad = '&nbsp;&nbsp;', pad2 = pad+pad+'&nbsp;', isOwnProp = false;		
		var s = '', rnd  = '', output = [], type = typeof obj, child = null,tmp;
		if( typeof name == undef ) name = typeof obj;
		if( typeof i == undef ) i = 0;
		if( !depth )  { window._dump_obj_name = name; depth = 1; }
		if( obj === null ) type = 'null';	
		if( type == 'function' && typeof obj.prototype == 'object' ) { 
			type = 'object';
		}
		if (type.indexOf('object') === -1 ) return '<i>' + String(obj) + '</i>&nbsp;&nbsp;(' + type + ')<br>';
		output.push('<div style="border:1px solid #444;background:#222;"><var>' + Debug.getClass(obj) + '</var><span style="font-size:13px;font-weight:bold;color:yellow;">' + name +'</span></div><div>');
		if( typeof obj.length != undef && obj.length > 1000 ) return output + 'Too big</div>';
		// If obj contains properties
		for (var prop in obj) { 
			buf = '';
			tmp = null;
			i++;
			if( aria.test(prop) ) continue;
//			isOwnProp = obj.hasOwnProperty && obj.hasOwnProperty(prop) ? true : false;
//			if( isOwnProp ) trace(prop + ' isOwnProperty');
			if( i > 500 ) break;		
			try { child = obj[prop]; } catch (e) { child = '<i style="color:red;">??????</i>';  }
			try {
				if( obj === child ) {
						output.push(pad2 +'<i style="color:#FF5555;">' + prop + '<s>:</s>&nbsp;&nbsp;this</i><br>');				
						continue;
				}
			} catch(e) { }
			type = typeof child; prop2 = prop; name2 = name;
			if( type == 'number' ) type = '#';
			else if( type == 'boolean' ) type = '!';
			else if( type == 'string' ) type = '';
			else if( type == 'function' && nully[prop] ) { continue; }
			else if( type == 'function' ) {
				
				tmp = Object.keysOwn(child);
				if( tmp.length > 0 && !(tmp.length === 1 && tmp[0] == 'prototype') ) type = 'object';
				if(  child.constructor && child.constructor.prototype && !child.bind ) type = 'object class';
			} 
		//	else if( type == 'function' && child.prototype && child.constructor.toString().match(/native/i)  ) {
		//		try { nn = new child(); if( !nn.bind )  type = 'object proto'; name2 = name + '[\'' + prop + '\']'; prop2 = 'prototype'; } catch(e) { }
		//	} 
//			else if( type == 'function' && child.prototype && child.prototype != Function.prototype ) { 
//				type = 'object proto';
//			}
	//		else if( type == 'function' && child.constructor && child.constructor.prototype && !child.bind  ) {
//				type = 'object class';
//			}
			if( prop.substr(0,2) == 'on' && (type == 'object' || type == 'function') && child === null ) type = 'event';
			if( type == 'event' ) {
				 out3.push(pad2 + '<i style="color:#555555;">' + prop + '()</i><br>'); 
			} else if( type == 'undefined' ) {
					out2.push( pad2 + '<i>' + prop + '</i><s>:</s>&nbsp;&nbsp;<span style="color:#994444;">undefined</span><br>');
			} else if ( child === null ) { 
				out2.push(pad2 + '<i>' + prop + '</i><s>:</s>&nbsp;&nbsp;<span style="color:#444444;">NULL</span><br>');
			} else if (type.indexOf("object") != -1 )  { 
				buf += '<var>' + Debug.getClass(obj[prop]) + '</var>';
				buf +=  '<a href="javascript:;" onclick="return window.Debug.__(\''+name2.replace(/'/g,'\\\'')+'\',\''+prop2.replace(/'/g,'\\\'')+'\');"><s>+</s>&nbsp;&nbsp;';
				if( type == 'object proto' )  buf += '<b>' + prop + ' *</b></a><br>';	
				else if( type == 'object class' )  buf += '<b>' + prop + ' **</b></a><br>';	
				else buf += '<b>' + prop + '</b></a><br>';											
				out1.push(buf);								
			} else if( type == 'function' ) {
				//if( nully.prototype == child.prototype ) continue;
				buf = pad2 + '<i style="color:#AA66AA;">' + prop + '()</i><br>';
				out3.push(buf);					
			} else if( type == 'unknown' ) {
				out2.push('<var>UNKNOWN</var>' + pad2 +'<i>' + prop + '</i><br>');
			} else { 
				buf = '<var>' + type + '</var>' + pad2 +'<i>' + prop + '</i><s>:</s>&nbsp;&nbsp;' + ( (prop != 'innerHTML' && prop != 'innerText' && prop != 'textContent' && prop != 'outerHTML' ) ? String(child).substr(0,40) : '***') + "<br>";
				out2.push(buf);
			}
		}
		output.push(out1.join(''), out2.join(''), out3.join(''), '</div>');
		if( i == 0 ) output.push('<s>[empty]</s>');
		if( i > 500 ) output.push('<br><s>TRUNCATED</s>');
		return output.join('');
	};

	Debug.getClass = function(o) {
		try {
		var type = typeof o, out = '';
		if( o === null || type == 'undefined' ) return '';
		if( type != 'object' ) return type;
		if( o instanceof Array || ('length' in o && 'item' in o) ) return '[ ' + o.length + ' ]';				
		if( o.constructor === Object ) return '{ . . . }';
		if( o.nodeName ) {
			var name = o.nodeName.toUpperCase()
			if( o.id && typeof o.id == 'string' && o.id.length ) name += ' #' + o.id;
			else if( o.className ) name += '.' + o.className;
			out = '<em>&lt;' + name + '&gt;</em>';
		}
		type = o.constructor ? o.constructor.toString() : o + '';
		if( type != 'undefined' ) {
			var m = type.match(/\[object (\w+)/);
			if( m !== null ) m = '	{ ' + m[1] + ' }';
			else m = type.match(/(\w*)/)[1];
			if( m == 'function' ) {
				if( typeof o.prototype == 'object' && Object.size(o.prototype) > 1 ) m = '<em>prototype</em>';
				else if( o.constructor ) m = 'class instance';
			}
			m = "<u>" + m + "</u>";
			return out + m;
		}
		} catch(e) { return '?'; }
		return '';
	};
	

	Debug.trace = function(e,str) {
		var len, span;
		if( !document.loaded ) return;
		if( !str ) { str = ''; }
		if( typeof e  == 'object'  ) { 
			if( e.message ) { 	e = e.message; } 
			else { e = Object.toString(e); }
		}
		if( Debug.init ) Debug.init();
		var o = wee('weeTrace');
		if( o ) {
			if( typeof o.traces == 'undefined' ) { o.traces = 2; }
			e = e.replace(/\[/g,'&nbsp;&nbsp;<b>[').replace(/\]/g,']</b>');
			e = e.replace(/\(/g,'(<i>').replace(/\)/g,'</i>)');
			e = e.replace(/^!/,"<u>Error</u> - ");
			o.traces++;
			if( o.lastmsg === e ) { 
				if( o.last2msg === e ) return;
				o.last2msg = e;
			} else {
				o.last2msg = false;
			}
			o.lastmsg = e;
			if( o.last2msg ) e += ' (repeating)';
			span = document.createElement('span');
			span.innerHTML = '- ' + (str.length ? '(' + str + ') ' : '') + e + '<br>';
			if( o.traces > 50 ) o.removeChild(o.lastChild);
			o.insertBefore(span,o.firstChild);
	//		if( str.length < 1 ) { o.innerHTML = e + '<br>' + o.innerHTML; }
//			else {o.innerHTML =  '<span>' + '(' + str + ') ' + e + '</span><br>' + o.innerHTML ; }			
			//if( o.traces % 20 === 0 ){
			//	len = o.children.length;
			//	while( --len > 20 ) 	o.removeChild(o.childNodes[len]);
			//}
		}
		return false;
	};
	
	window.err = Debug.trace;
	
	if( !document.all ) { window.onerror = null; }
	window.debugLoaded = true;
	window.$isDev = true;
	
	
	Debug.stopWatch = function stopWatch(onoff) {
		var now = Date.stamp(), result;
		if( typeof onoff == 'function' ) {
			stopWatch(true);
			onoff();
			return stopWatch(false);
		} else if( onoff ) {
			stopWatch.time = now;
			return;
		} else {
			result = now - stopWatch.time
			stopWatch.time = now;
			return result;
		}
	};
	
	

})();
///////////////////////////////////////////////////
