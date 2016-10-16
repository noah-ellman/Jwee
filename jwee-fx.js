//////////////////////////////////////////////////////////////////////////
// JWee JavaScript Framework & Toolkit 
// Copyright (c) 2010 AUTHORS (mrspoonzy@gmail.com)
// Licensed under the MIT and GPL (for now). 
// http://www.jwee.org
//////////////////////////////////////////////////////////////////////////
// FX
//////////////////////////////////////////////////////////////////////////
/***
@@namespace wee
@@toolkit fx
@desc The tweening engine and a toolkit of other special effects and animation 

@@namespace wee.fx
@alias FX
@desc The tweening engine and a toolkit of other special effects and animation 

@@object easing 
@desc Object containing all the tweening equations (motion styles, like bouncy etc)
@advanced
@internal

***/
//////////////////////////////////////////////////////////////////////////
wee.cfg.TWEEN_FRAME_RATE = wee.ua.chrome ? 50 : (wee.ua.firefox ? 35 : (wee.ua.ie > 8 ? 50 : 60));
wee.cfg.DEFAULT_EASE_EQUATION = 'easeBoth';
wee.cfg.BLACKOUT_WITH_FADE = true;
wee.cfg.BLACKOUT_OPACITY = 75;
///////////////////////////////////////////////////
var FX = wee.fx = {};
///////////////////////////////////////////////////
;(function(){
///////////////////////////////////////////////////
	var
	PI = 3.1416, floor=Math.floor, Elem=wee.elem,
	Easing = {
    	easeNone: function (t, b, c, d) { return c*t/d+b; },
		easeIn: function(t,b,c,d) { return c*(t/=d)*t+b; },
		easeOut: function(t,b,c,d) { return -c*(t/=d)*(t-2)+b;	},
		easeBoth: function(t,b,c,d) { if ((t/=d/2) < 1) return c/2*t*t+b; return -c/2*((--t)*(t-2)-1)+b;	},		
		easeInCirc: function(t,b,c,d) { return -c*(Math.sqrt(1-(t/=d)*t)-1)+b; },
		easeOutCirc: function(t,b,c,d) { return c*Math.sqrt(1-(t=t/d-1)*t)+b; },
		easeBothCirc: function(t,b,c,d) { if ((t/=d/2)<1) return -c/2*(Math.sqrt(1-t*t)-1)+b; return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b; },		
		easeInSine: function(t,b,c,d) { return -c*Math.cos(t/d*(1.5708))+c+b; },
		easeOutSine: function(t,b,c,d) { return c* Math.sin(t/d*(1.5708))+b; },
		easeBothSine: function(t,b,c,d) { return -c/2 * (Math.cos(PI*t/d) - 1)+b; }	,
		easeInBack: function(t,b,c,d) { var s=1.57; return c*(t/=d)*t*((s+1)*t - s)+b; },
		easeOutBack: function(t,b,c,d) { return c*((t=t/d-1)*t*((2.57)*t+1.57)+1)+b; },
		easeBothBack: function(t,b,c,d) {	
			var s=1.57; if ((t/=d/2)<1) return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b; 
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;	
		},
		easeOutBounce: function(t,b,c,d) {
			if ((t/=d) < (1/2.75)) { return c*(7.5625*t*t) + b; } 
			else if (t < (2/2.75)) { return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b; } 
			else if (t < (2.5/2.75)) { return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b; } 
			else { return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b; }
		},		
		easeOutElastic: function (t,b,c,d) {
			var s=1.70158, p=0, a=c;
			if (t===0) return b; 
			if ((t/=d)===1) return b+c; 
			if (!p) p=d*0.3;
			if (a < Math.abs(c)) { a=c; s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*PI)/p ) + c + b;
		},
		easeInQuad: function (t, b, c, d) { t /= d; return c*t*t + b; },
		easeOutQuad: function (t, b, c, d) { t /= d; return -c * t*(t-2) + b; },
		easeBothQuad: function (t, b, c, d) {
			t /= d/2;
			if (t < 1) return c/2*t*t + b;
			t--;
			return -c/2 * (t*(t-2) - 1) + b;
		}

	};


	///////////////////////////////////////////////////
	Easing.easeDefault = Easing[wee.cfg.DEFAULT_EASE_EQUATION];
	FX.easing = Easing;	
	///////////////////////////////////////////////////
	/***
		@@class Tween ( element, string property, [number startValue] or null, number endValue, [float duration], [object options] )
		@desc The Tween class is the brains of the animation engine.
		@arg The element of subject.
		@arg The element's property to animate. Assumed to be a style property. Ex: "width" would mean "style.width". If you want to animate a html attribute like the "width" attribute on a IMG element, prefix the string with a period, like ".width".
		@arg (optional) The start value for the animation. You can just put "null" here, and Jwee will figure the value out automatically!
		@arg The end value of the animation, such as 300 for "300px". You can also specify "auto", or "+50" or even "25%" !
		@arg (optional) The duration of the animation, in seconds, such as "5.5" for 5 and a half seconds.
		@arg (optional) An object containing more options you can control.
		@ret new instance of Tween class
		
		@@namespace wee.fx.Tween
		@alias FX.Tween
		
		@@method start
		@desc Start the animation
		@ret itself
		
		@@method stop ( boolean )
		@arg {boolean}
		@desc Haults an animation in progress. 
		
		@@method continueTo ( number value, [float duration] )
		@desc Continue the animation with new values.
		
		@@method yoyo
		@desc Run the opposite of the last animation, just like a yoyo.
				
		@@method reset
		@method Tween.restart
		
		@@event onComplete
		@desc You can assign a custom function to this if you want to react to this event.
		
		@@event onStart
		@desc You can assign a custom function to this if you want to react to this event.
		
		@@boolean running
		@desc Is the animating currently going?
		
		@@property value
		@desc The animated property's current value, in real-time.
		
		@@property startValue
		@@property endValue
		
		
	***/
	///////////////////////////////////////////////////
	FX.Tween = Class.create('Tween', (function() {
															 
		///////////////////////////////////////////////////
		// TweenManager
		// Only used internally by the tween engine to coordinate concurrent animations with a single loop.
		var TweenManager = new (function() {
			var	
				fps = Math.floor(1000/wee.cfg.TWEEN_FRAME_RATE),
				tweens = [], running = false, timer = null, length = 0,
				start = function() { timer = setInterval(process,fps); running = true;},
				stop = function() { clearInterval(timer); running = false; timer = null; },
				recycle = function(i) { tweens[i] = null; tweens.splice(i,1); if( --length < 1 ) stop(); },
				process = function() { 
					var t = (new Date).getTime(), i = length; 
					while( i-- ) {  
						try { if( !tweens[i](t) ) recycle(i); }
						catch(e) { recycle(i); }
					}
				};
			this.recycle = function(tween) { var idx = tweens.search(tween); if( idx !== null ) recycle(idx); };
			this.add = function(f) { length = tweens.push(f); if( !running ) start(); return f; };
			this.length = function() { return tweens.length; };
		})();
																 
		// Other private methods
		var parseEndValue = function(Xf,Xi) {
			if( typeof Xf == 'string' ) {
				if( Xf == "auto" ) {
					Xf = this.element['scroll'+this.prop.capitalize()] || null;
				} else {
					var m = Xf.match(/^([\d+\-]+)(\D+)$/), suf = '';		
					if( m ) { Xf = m[1]; suf = m[2]; }
					var op = Xf.charAt(0);
					if( op == '-' || op == '+' ) {
						Xf = parseInt(Xf.substring(1));
						if( suf == '%' ) {
							if( op == '+' ) Xf = Xi + Math.round(Xi * (Xf/100));
							else Xf = Xi - Math.round(Xi * (Xf/100));
						} else {
							if( op == '+' ) Xf = Xi + Xf;
							else if( op == '-' ) Xf = Xi - Xf;
						}
					} else {
						if( suf.length ) this.suffix = suf;
					}
				}
			}			
			return parseInt(Xf);
		};
	
		///////////////////////////////////////////////////
		// EXPOSE
		return {
			
			element: null, obj: null, 	prop: null, 
			suffix: 'px',	type: 'style',
			value: 0, 	startValue: null, 	endValue: 0,
			running: false, prepared: false,
			onComplete: null, onStart: null, onFrame: null,
			
			construct: function(obj,prop,startValue,endValue,duration,misc) {
				if( !obj ) return;
				var l = arguments.length;
				Object.extend(this, FX.Tween.defaults);
				if( l === 3 ) { endValue = startValue; startValue = null; }
				if( typeof arguments[l-1] == 'object' && typeof misc == undef ) misc = arguments[l-1];
				if( typeof misc == 'object' ) Object.extend(this,misc);
				if( typeof obj != 'function' ) obj = wee(obj);
				if( typeof obj == 'object' && obj !== null ) {
					if( 'tagName' in obj && prop) { 
						if( !obj.tweens ) obj.tweens = {}; 
						if( prop in obj.tweens ) {
							if( obj.tweens[prop].running ) obj.tweens[prop].stop(false);
							delete obj.tweens[prop];
						}
						obj.tweens[prop] = this;			
					}
					this.element = obj;
				}
				this.obj = obj;
				this.prop = prop || '';
				if( typeof this.prop == 'string' ) this.prop = this.prop.camelize();
				this.startValue = startValue || null;
				this.endValue = endValue;
				if( typeof duration =='number' ) this.duration = duration;
			},
			
			prepare: function() {
				if( /alpha|opacity/.test(this.prop) ) { this.type = 'alpha'; this.suffix = ''; this.ease = Easing.easeNone; } 
				else if( typeof this.obj == 'function' ) {
					 this.setValue = this.obj;
					 this.type = 'function'; this.suffix = 0; 
				}
				else if( typeof this.prop == 'function' ) {
					 this.getValue = this.prop;
					 this.type = 'function'; this.suffix = 0; 
				}
				else if( this.prop.charAt(0) == '.' ) {
					this.prop = this.prop.substr(1); this.suffix = 0; this.type = '';
				}
				else if( this.obj.style && this.prop in this.obj.style ) { this.obj = this.obj.style; this.type = 'style'; }
				else { this.type = ''; this.suffix = 0; }
				if( typeof this.ease == 'string' ) this.ease = Easing[this.ease] || Easing.easeDefault;
				if( wee.ua.ie && this.element ) {
					try { 
						if( ! this.element.currentStyle.hasLayout ) this.element.runtimeStyle.zoom=1;
					} catch(e) { }
				}
				if( typeof this.onFrame == 'function' ) this.onFrame.bind(this);
				if( typeof this.onStart == 'function' ) this.onStart.bind(this);
				if( typeof this.onComplete == 'function' ) this.onComplete.bind(this);
				
				this.prepared = true;
			},
			
			start: function(Xi,Xf,Td) {
				if( this.running ) this.stop(false);			
				if( !this.obj ) return;			
				if( !this.prepared ) this.prepare();
				if( typeof Xi == undef ) Xi = this.startValue || null;
				if( typeof Xf == undef ) Xf = this.endValue;
				this.duration = Td = Math.max(0.1, Td || this.duration);
				if( Xi === null ) {
					if( this.type === 'function' ) Xi = 0;
					else if( this.type === '' ) Xi = parseInt(this.obj[this.prop]);
					else Xi = this.value || this.element.getStyle(this.prop) || 0;
					if( Xi == '' || Xi == 0 || Xi ==  'auto' ) {
						if( /width|height|left|top/.test(this.prop) ) {
							Xi = this.element['offset' + this.prop.capitalize()];
						}
					}
				}
				Xi = parseInt(Xi);			
				this.value = this.startValue = Xi;
				this.endValue = Xf = parseEndValue.call(this,Xf,Xi);
				if( Xi === Xf ) return this;			
				if( this.type == 'alpha' ) {
					this.element.setOpacity(Xi);
					if( this.element.styles().visibility=='hidden' ) this.element.style.visibility='visible';
				}
				else if( this.type == 'style' ) this.obj[this.prop] = Xi + this.suffix;
				this.running = true;		
				var		me = this, ease = me.ease, ty = this.type, o = this.obj, e = this.element, s = this.suffix, 
							p = this.prop, Ti = Date.stamp(), Xd = Xf - Xi, fe = this.onFrame ? true : false,  
							t3 = ty == 'function' ? true : false, t1 = t3 || ty == 'alpha' ? false : true;
				this.f = TweenManager.add(function _tick_(t) { 
					var chnge, v;
					t = (t - Ti) / 1000;
					if( t >= Td ) { me.stop(true); return false; }
					v = floor(ease(t,Xi,Xd,Td));
					if( v === me.value ) return true;
					me.value = v;
					if( fe ) chnge = me.onFrame(e,v);
					if( typeof chnge == typeof v ) v = chnge;
					else if (chnge === false) return false;
					if( t1) {
						if ( p in o ) o[p] = v + s;
						else wee.elem.setStyle(e,p,v+s);
					}
					else if( t3 ) o(v);
					else e.setOpacity(v);
					return true;
				});
				if( typeof this.onStart == 'function' ) this.onStart(this);
				return this;
			},
			
			continueTo: function(Xf,Td) {	return this.start(this.value || null, Xf, Td || this.duration); },	
			yoyo: function() { return this.start(this.value, this.startValue, this.duration); },
			restart: function() { this.stop(); return this.start(this.startValue,this.endValue); },
			reset: function() {
				if( this.type == 'style' ) this.obj[this.prop] = this.startValue + this.suffix;
				return this;
			},
			
			stop: function(ok) {
				var oc = this.onComplete, next;
				if( !this.running ) return false;
				this.running = false;
				if( ok ) {
					try {
						if( this.type == 'alpha' ) this.element.setOpacity(this.endValue);
						else if( this.type == 'style' ) this.obj[this.prop] = this.endValue+this.suffix;					
						else if( this.type == 'function' ) this.obj(this.endValue);
						this.value = this.endValue;
					} catch(e) { trace("Error in tween.stop : " + e.message); }
					if( this.onComplete ) {
						if( typeof oc == 'string' ) {
							var words = oc.split(/[, ]+/), word = words.shift(), wordslen = words.length;
							if( words.length === 1 && words[0] == '*' ) words.unshift(word);
							this.onComplete = words.length ? words.join(',') : null;
							if( word == 'yoyo' ) { this.yoyo.callLater(1,this); }
							else if( word == 'repeat' || word == 'restart' ) this.restart.bind(this).later(); 
							else if( word == 'reset' ) this.reset();
							else trace("invalid onComplete string parameter on tween: " + word);
						}
						else if( oc instanceof Array ) {
							if( oc.length ) {
								if( oc[0] instanceof Array ) {
									next = oc.shift();
								} else {
									next = oc;
									this.onComplete = [];
								}
								this.start.apply(this,next);
							}
						}
						else if( oc instanceof FX.Tween ) oc.start();
						else if( typeof oc == 'function' ) try { oc(this.element, this); } catch(e) { trace("tween.onComplete error trapped"); }
						else trace("invalid onComplete parameter on tween");
					}
				} else {
					TweenManager.recycle(this.f);
				}
				if( this.f ) {	this.f = null; delete this.f; }
				return false;
			},
			
			queue: function() {
				if( this.running ) {
					if( !(this.onComplete instanceof Array) ) this.onComplete = [];
					this.onComplete.push($a(arguments));
				} else {
					this.start.apply(this, $a(arguments));
				}
				return this;
			},
			
			andThen : function(f) {
				if( this.onComplete ) {
					return this.queue(f);
				} else {
					this.onComplete = f;
				}
				return this;
			},
			
			toString: function() { return 'tween-' + ((this.element.identify && this.element.identify()) || 'unknown') + '-' + this.prop; 	}
			
		}
		
	})()
);
///////////////////////////////////////////////////

FX.Tween.defaults = { duration: 1, ease: FX.easing.easeDefault }

	
})();
///////////////////////////////////////////////////
;(function() { 
			  
	///////////////////////////////////////////////////
	// FADE EFFECT
	
	///////////////////////////////////////////////////			  
	wee.fx.alpha = {
		fadeIn: function(ele,t,xtra) {
			wee.fx.alpha.set(ele,0);
			t = typeof t == 'number' ? t : 0.7;
			if( !xtra ) xtra = {};
			if( !xtra.onComplete ) xtra.onComplete = Elem.clearOpacity;
			return new wee.fx.Tween(ele,'alpha',0,100,t,xtra).start();
		},
		fadeOut: function(ele,t,xtra) {
			t = typeof t == 'number' ? t : 0.7;	
			if( !xtra ) xtra = {};
//			if( !xtra.onComplete ) xtra.onComplete = wee.elem.clearAlpha;			
			return new wee.fx.Tween(ele,'alpha',Elem.getOpacity(ele) || 100,0,t,xtra).start();
		},
		fadeOutRemove: function(ele,t) {
			wee.fx.alpha.fadeOut(ele,t,{onComplete:Elem.recycle});
		},	
		fadeTo: function(ele,a,t) {
			a = typeof a == 'number'  ? a : 100;
			t = typeof t == 'number' ? t : 0.7;	
			new wee.fx.Tween(ele,'alpha',null,a,t).start();		
		},
		set : wee.elem.setOpacity,
		get : wee.elem.getOpacity
	};
	
	///////////////////////////////////////////////////
	// SHAKE EFFECT
	/***
		@@namespace wee.fx
		@@function shake ( element )
		@desc Do the shake special effect on the specified element.
	
	***/
	///////////////////////////////////////////////////
	FX.shake = function(ele) {
		ele = wee(ele);
		var pos = ele.styles().position;
		if( pos != 'absolute' ) {
			ele.style.position='relative';
			ele.style.top='0px';
			ele.style.left='0px';
		}
		ele.parentNode.overflow='visible';
		var f = function(n,a,b) {
			var me = arguments.callee;			
			try {
				if( n > 20 ) {
					ele.style.position=pos;
					return;
				}
				else n++;
				if( a > 0 ) a = a * -1;
				else { a = 0; while( a === 0 ) { a = Math.ceil(Math.random()*4)-5}; }
				if( b > 0 ) b = b * -1;
				else { b = 0; while( b === 0 ) { b = Math.ceil(Math.random()*4)-5 }; }
				with( ele.style ) {  top=a+'px'; left=b+'px'; }
				setTimeout(function() { me(n,a,b); },25);
			} catch(e) {}
		};
		f(0,0,0);	
	};
	
})();
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// BLACKOUT EFFECT
/***
@@namespace wee.fx.blackout
@@function summon ( [string color] )
@desc Show the screen dimming effect with the color specified (black is default).
@@function castoff
@desc Fade off the screen dimming effect.
***/
///////////////////////////////////////////////////
;(function(){
	
	wee.fx.blackout = new (function(){
										 
		var flashtags = null,
		flashOnOff = function(onoff) {
			onoff = onoff ? '' : 'hidden';
			if( !flashtags ) {
				var b = wee.dom.body();			
				flashtags = $$$('iframe',b).concat($$$('embed',b)).concat($$$('object',b));
			}
			flashtags.each( function(o) { o.style.visibility=onoff; } );		
		};
		
		Object.extend(this,{
						  
			ANIMATE: wee.cfg.BLACKOUT_WITH_FADE,
			OPACITY: wee.cfg.BLACKOUT_OPACITY,
			
			running: false,
			color: '#000000',
			
			text: function(txt) {
				var ele = wee('__blackout'), txtbox = wee('__blackout_txt');
				if( !ele ) {
					wee.fx.blackout.summon();
					wee.fx.blackout.text.callLater(this,500,txt);
					return this;	
				}
				if( !txtbox ) {
					ele.style.textAlign='center';
					ele.style.verticalAlign='middle';
					ele.style.display='inline-block';
					txtbox = wee.elem.create('span#__blackout_txt');
					ele.appendChild(txtbox);
					txtbox.css("display:block;margin:auto;text-align:center;width:auto;height:auto;overflow:visible;visibility:visible;vertical-align:middle;font-size:25px;color:#ffffff;font-weight:bold;")
					txtbox.style.marginTop = Math.round((ele.offsetHeight / 2) - 200).px();
				}
				txtbox.setText(txt);
				return this;
			},
			
			summon: function(color) {
				if( this.running ) return;
				var b = wee.dom.body();
				flashOnOff(false);
				this.running = true;
				if( typeof color == 'string' ) this.color = color;
				color = this.color;
				var ele = wee('__blackout'), h = Dom.clientHeight()+200, t = wee.dom.scrollTop()-100;
				ele = wee.elem.create('div#__blackout','position:absolute;z-index:999;top:' + t + 'px;left:0px;width:100%;height:'+h+'px;margin:0;padding:0;display:block;background-color:'+color+';');
				b.appendChild(ele);
				if( this.ANIMATE ) {
					wee.fx.alpha.set(ele,0);
					wee.fx.alpha.fadeTo(ele,this.OPACITY,0.20);
				} else {
					wee.fx.alpha.set(ele,this.OPACITY);
				}
				var currentScroll = wee.dom.scrollTop();
			/***	window.onscroll = function(e) { 
					e = window.event || e;
					this.scrollTo(0,currentScroll);
					if( e ) {
						e.returnValue = false;
						e.preventDefault && e.preventDefault();
					}
					return false;
				};
				window.onresize = function() {
					wee.elem.absoluteCenter(wee('__blackout'));
				};
			***/
				return this;
			},
			
			castoff: function() {
				this.running = false;				
				window.onscroll = null;
				window.onresize = null;
				var ele = wee('__blackout'); if( !ele ) return;
				if( wee.cfg.BLACKOUT_WITH_FADE ) {
					wee.fx.alpha.fadeOut(ele,0.25, {onComplete:
						function() { ele.recycle(); flashOnOff.callLater(500,null,true); }
					});
				} else {
					wee('__blackout').recycle();
					flashOnOff.callLater(500,null,true);
				}
				return this;		
			}.bind(this)
	  });	

	})();
	
})();
///////////////////////////////////////////////////

FX.createGradient = function(options) {
	
		if( typeof arguments.callee.loaded == undef ) {
			"span.weeGradLine { display:block;width:100%;border:0;padding:0;margin:0; }".parse();		
			arguments.callee.loaded = true;	
		}
		
		options = typeof options == 'object'  ? options : {};

		var
		 gradient = new wee.Color(options.color || Colors.random() ), 
		 container = wee.elem.create('div.weeGradientBox'),
		 height = options.height || -3,
		 gline, i = height * -1;
	
		while( !gradient.isWhite()  ) {
			gline = wee.elem.create('span.weeGradLine','height:'+height+'px',container);
			gradient = gradient.lighten(1);
			gline.style.backgroundColor = gradient + '';

		}
		
		container.style.backgroundColor = gradient + '';
		return container;
	
}