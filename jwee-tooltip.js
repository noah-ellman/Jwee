//////////////////////////////////////////////////////////////////////////
// JWee JavaScript Framework & Toolkit 
// Copyright (c) 2010 AUTHORS (mrspoonzy@gmail.com)
// Licensed under the MIT and GPL (for now). 
// http://www.jwee.org
//////////////////////////////////////////////////////////////////////////
// Tooltips
//////////////////////////////////////////////////////////////////////////

/*

@@namespace wee

@@toolkit tooltip
@desc Add tooltips to any element with html attribute "tip"

@@namespace wee.tooltip

@@function enable
@desc Enable tooltips. Run anytime or add to your startup scripts.

@@function disable
@desc Disable tooltips if enabled.

@@object tips
@desc You can create an object with id and values, in javascript, and refer to them in HTML by tip="#myTipID", instead of putting large amount of text directly in the HTML attribute.

*/
//////////////////////////////////////////////////////////////////////////
wee.cfg.TOOLTIP_ARROWSIZE = 20;
wee.cfg.TOOLTIP_HOVER_DELAY = 0;
wee.cfg.TOOLTIP_HTML_ATTRIBUTE = "tip";
wee.cfg.TOOLTIP_HAS_ARROW = true;
///////////////////////////////////////////////////
var Tooltip = wee.tooltip = new (function(){
															
	var 
		Elem = wee.elem,
		Dom = wee.dom,
		me = this,
		TOOLTIP_HAS_ARROW = wee.cfg.TOOLTIP_HAS_ARROW,
		tipElement = null, 
		tipElementArrow = null,
		tipElementShadow = null,
		currentTip = null, 
		///////////////////////////////////////////////////
		createTip = function() {
			if( tipElement !== null ) return tipElement;

			var		tip = tipElement, 
						shadow = tipElementShadow, 
						el;

			// TIP ELEMENT
			tip = Elem.create('div#tipElement',"position:absolute;top:-100px;left:-100px;z-index:1113;visibility:hidden", Dom.body());
			el = Elem.create("span","display:inline-block", tip);
			el.style.backgroundColor = tip.getStyle('backgroundColor') || '';	
			tip.tiptween = new wee.fx.Tween(tip,'alpha',0,0);
			tip.setOpacity(0);
			
			// SHADOW ELEMENT
			shadow = Elem.create('div#tipElementShadow',"position:absolute;top:-100px;left:-100px;z-index:1111;visibility:hidden;background:#000000;", Dom.body());			
			shadow.tiptween = new wee.fx.Tween(shadow,'alpha',0,0);			
			shadow.setOpacity(0);
			
			tipElement = tip;
			tipElementShadow = shadow;
						
			createTipArrow(false);
			return tip;
		},		
		
		///////////////////////////////////////////////////
		createTipArrow = function(up) {
			up = !!up;
			if( tipElementArrow  ) {
				if( tipElementArrow.isUpArrow === up ) return tipElementArrow;
				else tipElementArrow.innerHTML = '';
			}
			
			var
				arrowSize = wee.cfg.TOOLTIP_ARROWSIZE,
				css = "position:absolute;visibility:hidden;top:-100px;left:-100px;z-index:1114;width:"+(arrowSize+12)+"px;height:"+(arrowSize+2)+"px;border:0;padding:0;margin:0;display:block;background:none;line-height:1px;",
				cssdiv = "margin:auto;height:1px;display:block;padding:0;line-height:1px;font-size:1px;",
				arrow = tipElementArrow === null ? Elem.create('div#tipElementArrow',css) : tipElementArrow,
				i = up ? 0 : arrowSize,
				div, cssmore;
				
			wee.evalStyle("div.jwee_tooltip_arrow { " + css + " } div.jwee_tooltip_arrow div { " + cssdiv + " }");
			arrow.className="jwee_tooltip_arrow";
				
			while(--arrowSize) {
				i = up ? i+1 : i-1;
				if( i > 1 ) 	cssmore = 'width:' + (i-2) + 'px;margin-right:' + (Math.floor(i/3)) + 'px';
				else cssmore = 'width:' + (i) + 'px;margin-right:' + (Math.floor(i/3)-1) + 'px;border-left-size:'+(i+1)+'px;border-right:none;'
				Elem.create('div',cssmore,arrow);
			}
			arrow.isUpArrow = up;
			if( tipElementArrow === null ) {
				Dom.body().appendChild(arrow);
				arrow.tiptween = new wee.fx.Tween(arrow,'alpha');
				arrow.setOpacity(0);		
				tipElementArrow = arrow;
			}
			return tipElementArrow;
		},
		
		///////////////////////////////////////////////////
		onTipHide = function() {
			tipElement.style.visibility='hidden';		
			tipElementArrow.style.visibility='hidden';
			tipElementShadow.style.visibility='hidden';
			tipElement.style.left = '-300px';
			tipElementShadow.style.left = '-300px';
			tipElementArrow.style.left = '-300px';			
		},
		
		///////////////////////////////////////////////////
		onTipShow = function() {

		},
		
		///////////////////////////////////////////////////
		hideTip = function() {
			currentTip = null;
			if( me.options.nofadeout ) {
				tipElement.tiptween.continueTo(10,0.1);
				tipElementArrow.tiptween.continueTo(10,0.1);
				tipElementShadow.tiptween.continueTo(0,0.1);		
				onTipHide();
			} else {
				tipElementArrow.tiptween.onComplete = onTipHide;
				tipElement.tiptween.continueTo(10,0.11);
				tipElementArrow.tiptween.continueTo(10,0.12);
				tipElementShadow.tiptween.continueTo(0,0.11);			
			}
		},
		
		///////////////////////////////////////////////////
		positionTip = function(mX,mY,rect) {
			var box = tipElement.firstChild,
					h = tipElement.offsetHeight, 
					w = box.offsetWidth,
					h2 = tipElementArrow.offsetHeight, 
					ratio = w / h,
					x = rect.left, y = rect.top,
					up = false, x2, diff,
					pt, pl, ph, pw;
					
			if( ratio > 10 ) {
				diff = Math.ceil(ratio-15);
				w = Math.floor(w - (w / diff));
			} else if( ratio < 2 ) {
				w = Math.floor(w*1.25);		
			}
			tipElement.style.width = w  + 'px';			
			y = (y - h - h2 -5 ); 
			x = (x + 10);		
			if( y - Dom.scrollTop() < 0 ) {
				up = true;
				y = y +  h + h2 + h2 + 20;
			}
			x2 = Math.max(10, x -  Math.round(w / 3));
			//x2 -= Math.floor((mX - x2)/4);
			createTipArrow(up);		
			if( up ) y = Math.max(rect.top+rect.height+10, y + 20);
			else y = Math.min(rect.top - 15, y - 10);
			tipElement.style.top = y + 'px';
			tipElement.style.left = Math.min((Dom.clientWidth()+Dom.scrollLeft())-tipElement.offsetWidth-20, x2) + 'px';
			
			if( TOOLTIP_HAS_ARROW ) {
				if( up ) tipElementArrow.style.top = (y - h2 + 5) + 'px';
				else tipElementArrow.style.top = (y + h - 2) + 'px';
				tipElementArrow.style.left = x+Math.floor(rect.width/4) + 'px';
			} else {
				tipElementArrow.style.display = 'none';
			}
			//tipElementArrow.style.left = Math.min(x + eleW - 30, Math.max(x2+10,mX - 20))+ 'px';//(Math.max(x-20,x2+10)) + 'px';
			pt =  (y+5).px();
			pl = (x2+5).px();
			ph = (tipElement.offsetHeight).px();
			pw = (tipElement.offsetWidth).px();
			tipElementShadow.css('top:' + pt + ';left:' + pl + ';width:' + pw + ';height:' + ph);
		}, 
		
		///////////////////////////////////////////////////	
		showTip = function(elem,x,y) {
			if( currentTip == elem ) return false;
			if( currentTip !== null ) return false;
			if( !elem || typeof elem != 'object' ) return false;
			if( !('getAttribute' in elem) ) return false;
			var text = me.parseTipAttribute(elem.getAttribute('tip') || elem.tip);
			var tip = createTip(), eleX, eleY;
			tip.firstChild.innerHTML = text;
			var rect = Elem.getRect(elem);
			eleY = rect.top; eleX = rect.left;
			positionTip(x,y,Elem.getRect(elem));
			tipElementShadow.style.visibility='visible';
			tip.style.visibility='visible';			
			tipElementArrow.style.visibility='visible';			
			tipElementArrow.tiptween.onComplete = null;			
			tip.tiptween.continueTo(100,0.1);
			tipElementArrow.tiptween.continueTo(100,0.1);
			tipElementShadow.tiptween.continueTo(20,0.5);
			currentTip = elem;
			currentTip.style.cursor = "hand";
			return true;
		},
		
		///////////////////////////////////////////////////
		onmouseover = function(e) {
			var target = wee.event.getTarget(), mouseX = e.mouseX || e.pageX;
			var hideme = false;
			if( !target || typeof target != 'object' || target === window.console ) return false;
			if( !('getAttribute' in target) ) return false;
			if( currentTip !== null && target != currentTip ) {
				hideme = true;
				if( target.parentNode === currentTip ) hideme = false;
				if( target.parentNode && target.parentNode.parentNode === currentTip ) hideme = false;
				if( hideme === false ) return;
	 		}
			if( target.tagName && target.getAttribute ) {
				var tip = target.getAttribute('tip');
				if( !tip ) target = target.parentNode;
				tip = (target.getAttribute && target.getAttribute('tip')) || false;
				if( tip ) {
					hideme = false;
					currentTip = null;
					showTip(target,mouseX,e.clientY);				
				}
			}
			if( hideme ) hideTip();
			return true;
		};
		
		
		///////////////////////////////////////////////////
		///////////////////////////////////////////////////
		this.options = {};
		this.tips = {};
		
		this.parseTipAttribute = function(attr) {
			var text = attr = attr.trim();
			var attr2, len = attr.length;
			if( !len ) return;
			if( attr.charAt(0) == '#' ) {
				attr2 = attr.substr(1);
				if( this.tips[attr2] ) text = this.tips[attr2];
				else if( typeof this[attr2] == 'string' ) text = this[attr2];
				else text = 'Tip ID ' + attr2 + ' invalid';
			}
			//text = text.replace(/([^\\])\[/g,'$1<').replace(/([^\\])\]/g,'$1>');
			text = text.replace(/\[/g,'<').replace(/\]/g,'>');
			return text;
		},		
		

		this.enable = function() {
			wee.event.add(document,'mouseover#tooltipEvent',onmouseover);	
			//wee.event.mouse.start();
			trace("Tooltips enabled");			
		};
		this.disable = function() {
			wee.event.recycle("tooltipEvent");
			trace("Tooltips disabled");			
		};
		
})();

///////////////////////////////////////////////
