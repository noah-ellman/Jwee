//////////////////////////////////////////////////////////////////////////
// wee JavaScript Framework & Toolkit 
// Copyright (c) 2010 AUTHORS (mrspoonzy@gmail.com)
// Licensed under the MIT and GPL (for now). 
// http://www.wee.org
//////////////////////////////////////////////////////////////////////////
/*
@@@namespace wee

@@class Hotbox ( [id], [className], [args] )
@desc Create a new instance of hotbox.
@arg (optional) {string} Javascript ID for your hotbox, if special.
@arg (optional) {string} CSS class name for hotbox, if you need.
@alias Weebox

@@@namespace wee.Hotbox
@alias wee.Weebox

@@method create
@desc Call this to actually render and display the box.
@ret itself, so you can chain with loadContent()

@@method loadContent ( string url )
@desc Loads the HTML from a URL (via ajax) and sets the hotbox content.
@arg {string} A ajax URL that returns HTML content
@ret itself

@@method setContent ( string html )  
@desc Set the box content to your HTML code.
@arg {string} Valid HTML as a string.
@ret itself

@@method setTitle ( string title )
@desc Set the title of the box (the text in the top left)
@arg {string} Your title text
@ret itself


@@event onClose
@desc Assign your own function to this property, to catch when the user hits the close button.



@@event onReady
@desc Assign your own function to this property. Triggers when content has completely loaded and faded in.

*/


//////////////////////////////////////////////////////////////////////////
wee.cfg.HOTBOX_WITH_BLACKOUT = true;
wee.cfg.HOTBOX_SPINNER_IMAGE = 'http://www.jwee.org/i/spinner2.gif';

//////////////////////////////////////////////////////////////////////////
;(function(){ 
///////////////////////////////////////////////////
var Elem = wee.elem;
var FX = wee.fx;
var Dom = wee.dom;
///////////////////////////////////////////////////
var Weebox = wee.Weebox = 
Class.create("Hotbox",
{
	construct: 
		function(id,className,args) { 
			if( typeof args == 'object' ) for( var p in args ) this[p] = args[p];
			this.id = typeof id == 'string' ? id : '__hotbox'; 
			this.className = typeof className == 'string' ? className : 'hotbox'; 	
			this.create = this.create.bind(this);	
			this.create2 = this.create2.bind(this);	
			this.resize = this.resize.bind(this);
			this.reveal = this.reveal.bind(this);
			this.reset  = this.reset.bind(this);
			this.setContent = this.setContent.bind(this);
			this.loadContent = this.loadContent.bind(this);			
			this.http = new wee.AjaxClass();
			this.title = 'Weebox';
			return this;
		},
	
/*	id: null,	className: null,
	onClose: null,
	element: null,	contentElement: null, titleElement: null, title: '',
	ready: false,
	contentURL:null,
	contentPending:null,*/
	
	create : function(s) {
		var me = this;
		if( !s ) { 
			if( wee.cfg.HOTBOX_WITH_BLACKOUT ) wee.fx.blackout.summon();
			if( document.all ) this.create.callLater(50,this,true);
			else this.create.callLater(50,this,true);
			return this;
		};
		if( wee(this.id) ) Elem.recycle(wee(this.id) );
		var ele = this.element = Elem.create('div',{id:this.id,className:this.className},'position:absolute;z-index:1001;top:0;left:0px;width:220px;height:120px;visibility:hidden;',Dom.body());
		//this.element.style.borderRadius='200px';
		var cls = this.className === null ? 'hotbox' : this.className;
		var bar = this.titlebar = Elem.create('div.' + cls + '-top','visibility:hidden;width:auto;height:25px;overflow:visible;white-space:nowrap;');
		var btn = Elem.create('div.hotbox-btn','float:right;width:40px;text-align:center;border:1px solid #888;margin:auto;padding:3px 0px 3px 0px;font-size:10px;font-family:"Arial Black",Arial;font-weight:normal;cursor:pointer;color:#555;background:#EEE;',bar);
		var title = Elem.create('div.' + cls + '-title','float:left;width:auto;white-space:nowrap;height:20px;overflow:hidden;',bar); 
		this.titleElement = title;
		btn.appendChild(document.createTextNode(' X '));
		title.appendChild(document.createTextNode(this.title));		
		bar.appendChild(Elem.create('br.cls'));		
		var wrapper = this.containerElement = Elem.create('div.' + cls + '-container');
		wrapper.appendChild(bar);
		var table = Elem.create('table',{cellpadding:0,cellspacing:0,border:0,align:'center'});
		this.contentElement = table.insertRow(0).insertCell(0);
		this.contentElement.align='center';
		wrapper.appendChild(table);		
		this.element.appendChild(wrapper);
		btn.onmouseover = function() { this.addClass('hotbox-btn-over'); }
		btn.onmouseout = function() {  this.removeClass('hotbox-btn-over'); }
		btn.onclick = function() { me.close.call(me); }		
		this.contentElement.innerHTML = '<br><div align=center style="vertical-align:middle;margin:auto;text-align:center;width:' + this.containerElement.offsetWidth + 'px"><img src="' + wee.cfg.HOTBOX_SPINNER_IMAGE + '" align=center style="margin:auto;text-align:center;"></div>';		
		Elem.absoluteCenter(ele);
		ele.style.visibility="visible";
		ele.hotbox = this;		
		wee.fx.alpha.fadeIn(ele,0.30,{onComplete:this.create2});
		//Event.add(window,'scroll#hotboxonresize',function() { trace("scrolling"); Elem.absoluteCenter(wee('__hotbox')); });		
		return this;
	},
	
	getElement: function() {
		return wee(this.id);	
	},
	
	create2 : function() {
		this.ready = true;
		if( this.pendingContent ) { this.setContent(this.pendingContent); this.pendingContent = null; }
		this.onOpen && this.onOpen();
		return this;
	},	
	
	setTitle : function(str) {
		str = str || this.title;
		this.title = str;
		if( this.titleElement ) { 
			wee(this.titleElement).setText(str);
		}
		return this;
	},
	
	close : function() {
			var me = this;
			//Event.recycle("hotboxonresize");
			this.element.truncate();
			var id = this.id;
			var onComplete = function(ele) {
				ele.style.visibility='hidden';
				Elem.recycle.callLater(0,null,ele);
			 	wee.fx.blackout.castoff.later();
				if( me.onClose ) {
					trace("Calling weebox.onClose");
					me.onClose.later();
				}
				me.reset();
			};
			wee.fx.alpha.fadeOut(this.element,0.25,{onComplete:onComplete});
			this.ready = false;
			return this;
	},
	
	reset : function() {
		this.element = null;
	},
	
	loadContent : function(url) {
		var me = this, data;
		if( url instanceof Array ) { 
			data = url[1]; url = url[0];
		}
		if( this.ready ) {
			this.titleElement.innerHTML = '<img src="http://www.jwee.org/i/spinner2.gif" width=20 height=20 align=left style="margin:0px;">';
		}		
		this.http.get(url, 
			function(response) {
				var html  = response.text;
				me.setContent.call(me,html); 
			} , data);
		return this;
	},
	
	
	setContent : function(html) { 
		var me = this, ele = this.contentElement;
		if( !this.ready ) { this.pendingContent = html.replace(/>\s+</gm,'><').trim(); return; }
//		this.setTitle();
		if( !html ) html = this.pendingContent ? this.pendingContent : 'No content.';
		wee.fx.alpha.fadeOut(this.contentElement,0.25);
		var f = function() {
				ele.style.visibility='hidden';				
//				ele.truncate();
				ele.innerHTML = html;
				me.resize.callLater(10,me,true);
				//if( me.onReady ) me.onReady.later(300);
		};
		f.later(350);
		//this.element.animate('borderRadius',100,0,1);
//		me.resize.callLater(100,me,true);		
		return this;
	},
	
	reveal : function() {
		if( this.contentElement.style.visibility=='visible' ) return;
		this.titlebar.style.visibility='visible';
		this.contentElement.style.display = 'block';
		this.contentElement.style.visibility='visible';
		var me = this;
//		var f = function() {
//			me.setTitle.call(me);
	//	}
		this.setTitle();
		wee.fx.alpha.fadeIn(this.contentElement,0.25);
		if( me.onReady ) me.onReady.later(500);		
		
		
	},
	
	resize : function(again) {
		again = again || false;
		var me = this, ele = this.element, sty = ele.style, content = this.contentElement,  container = this.containerElement;
		var h = content.scrollHeight + this.titlebar.offsetHeight + 2, w =content.scrollWidth + 2;	
		if( h < 50 ) {
			return this.resize.later(1000);			
		}
		var rh = parseInt(sty.height), rw = parseInt(sty.width), top = parseInt(sty.top), left = parseInt(sty.left);
		if(Math.abs( h - rh ) < 40 && Math.abs( w - rw ) < 40  )	{ this.reveal(); return; }
		this.contentElement.style.display = 'none';
		var 	ease = {},speed=0.3,
				leftdif = left - Math.round((w - rw)/2),
				topdif = top - Math.round((h - rh)/2);
		[	new wee.fx.Tween(ele,'left',left,leftdif,speed,ease),
			new wee.fx.Tween(ele,'top',top,topdif,speed,ease),
			new wee.fx.Tween(ele,'height',rh,h,speed,ease),
			new wee.fx.Tween(ele,'width',rw,w,speed+0.1,{onComplete:this.reveal})
		].each('.start()');
		if( again ) {
			this.resize.later(500);
		}
	},
	
	hideContent: function() {
		
		
	}
});
///////////////////////////////////////////////////

wee.event.onLoadLazy( function() { (new Image).src=wee.cfg.HOTBOX_SPINNER_IMAGE; } );
///////////////////////////////////////////////////
})();


var Hotbox = wee.Hotbox = wee.Weebox;