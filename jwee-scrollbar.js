wee.Scrollbar = (function() {
			 
	var wee = window.wee;
	
	var O =  function(view, bar)  {
		this.view = wee(view);
		this.bar = wee(bar);
	};
	
	O.prototype = {
	
		view: null, bar: null, face: null,
		dragging: false, 	lastMouseY: null, lastScrollPos: null,
		viewHeight: 0, contentHeight: 0, maxScroll: 0, ratio: 0,
		ie6mode:false,
		
		initializeIE6 : function() {
			this.ie6mode = true;
			this.bar.style.width='0px';
			this.bar.style.display='none';
			this.view.style.overflow='auto';		
			return this;
		},
		
		initialize : function() {
			if( /MSIE [67]/.test(navigator.userAgent) ) { return this.initializeIE6(); }
//			return this.initializeIE6();
			this.bar.className = 'scrollbar';
			this.bar.style.position='relative';
			this.bar.style.top = '0px';
			this.bar.style.padding='0px';
			this.bar.style.display='block';
			this.bar.style.overflow='hidden';
			if( this.bar.tagName.toLowerCase() == 'td' ) {
				this.bar.style.tableLayout = 'fixed';
				this.bar.setAttribute('valign','top');
			} 
			this.face = document.createElement('div');
			if( this.bar.id ) { this.face.id = this.bar.id + '_face'; }
			this.face.className = 'scrollface';
			this.face.style.cssText='position:relative;top:0px;left:0px;width:auto;';
			this.bar.appendChild(this.face);
			this.update();
			
			var me = this;
			this.face.onmouseover = function() {	if( !me.dragging ) { this.className = 'scrollface-over'; } };
			this.face.onmouseout = function() { if( !me.dragging ) { this.className = 'scrollface'; } };
			this.face.onmousedown = function() {
				var e = window.event || arguments[0];
				if( e ) {
					e.returnValue = false;
					e.cancelBubble = true;
					if( e.stopPropagation ) e.stopPropagation();
					if( e.preventDefault ) e.preventDefault();
				}
				me.setDrag(true);
				return false;
			};
			this.view.scrollTop = 0;			
			setTimeout(function() { me.view.scrollTop = 0; },250);
		//	wee.event.onMouseWheel(function(d) { me.setScrollBy(d*3).sync(); return false; },this.view);		
			this.setupAutoScrolling();
			return this;
		},
		
		setupAutoScrolling : function() {
			
			var data = {d1:null,t1:null,top:0,bottom:0,h:0};
			if( !this.view.getBoundingClientRect ) return;
			var rect = this.view.getBoundingClientRect();
			data.top = Math.round(rect.top);
			data.bottom = Math.round(rect.bottom);			
			var i = Math.round(this.getViewHeight()/5);
			var thresh_top = data.top + i;
			var thresh_bot = data.bottom - i;
			data.h = data.top - thresh_top;
			var me = this;
			var doscroll = function() { trace(data.d1); me.setScrollBy(data.d1).sync(); };
			var f = function(e) {
				var e = e || window.event, y = e.clientY;
				var me2 = me;				
				if( y < thresh_top ) {
					y -= data.top;
					data.d1 = (-4) - Math.min(Math.floor((y/data.h)*4),4);
					if( data.t1 === null ) {	data.t1 = setInterval(doscroll,40); }
				} 	else if( y > thresh_bot ) {
					y -= thresh_bot;
					data.d1 =  -1 * Math.min(Math.floor((y/data.h)*4),4);
					if( data.t1 === null ) {	data.t1 = setInterval(doscroll,40); }
				} else {
					if( data.t1 !== null ) { clearInterval(data.t1); data.t1 = null; }
				}
			};
			
			wee.event.add(this.view,'mousemove',f);			
			try {
				wee.event.add(this.view, 'mouseleave',
						  function() { 
						  		if( data.t1 !== null ) {
								  clearInterval(data.t1); data.t1 = null;
								}
						  });
			} catch(e) { }
		},
		
		update : function() { 
			if( this.ie6mode ) {
				this.contentHeight = this.getContentHeight();
				this.viewHeight = this.getViewHeight();
				this.ratio = Math.round(this.contentHeight / this.viewHeight);				
				this.maxScroll = this.getMaxScroll();				
				return;
			}
			this.bar.style.height = this.getViewHeight() + 'px';					
			this.view.style.overflow='auto';
			this.contentHeight = this.getContentHeight();
			this.viewHeight = this.getViewHeight();
			this.ratio = Math.round(this.contentHeight / this.viewHeight);
			this.face.style.height = Math.max(25,Math.round(this.getViewHeight() * (this.getViewHeight() / this.getContentHeight()))) + 'px';							
			this.maxScroll = this.getMaxScroll();
			if( this.contentHeight <= 1 ) this.face.style.visibility='hidden';
			else this.face.style.visibility='visible';
			this.view.style.overflow='hidden';
		},		
		
		setDrag : function(toggle) {
			var me = this;
			return;
			if( toggle && !this.dragging ) {
				this.lastMouseY = null;
				this.lastScrollPos = this.getScroll();
				this.dragging = true;			
				this.face.className = 'scrollface-drag';
				wee.event.add(document, 'mousemove',function() { return me.onmousemove.call(me,window.event || arguments[0]) });
				wee.event.add(document, 'mouseup',function() { return me.onmouseup.call(me,window.event || arguments[0]) });
				document.documentElement.style.cursor = 'pointer';			
			} else {
				this.dragging = false;		
				this.lastScrollPos = this.getScroll();
				this.lastMouseY = null;			
				this.face.className = 'scrollface';
				wee.event.remove(document, 'mousemove',null);
				wee.event.remove(document, 'mouseup',null,document);
				document.documentElement.style.cursor = '';			
			}
		},		
		
		getViewHeight : function() {
			return this.view.offsetHeight > 0  ? this.view.offsetHeight : 1;
		},
		
		getContentHeight : function() {
			return this.view.scrollHeight > 0 ? this.view.scrollHeight : 1;
		},
		
		scrollTo : function(c) {
			if( this.ie6mode ) {
				this.view.scrollTop = c;
			} else {
				this.setScroll(Math.round(c / this.ratio));
				this.sync();
			}
		},
		
		getMaxScroll : function() {
			return this.getViewHeight() - this.face.offsetHeight;
		},
		
		getScroll : function() {
			return this.face.offsetTop;
		},
		
		setScroll : function(c) {
			c = Math.min(Math.max(0,c),this.maxScroll);
			this.face.style.top = c + 'px';
			return this;
		},
		
		setScrollBy : function(i) {
			var c = this.getScroll() + i;
			c = Math.min(Math.max(0,c),this.maxScroll);
			this.face.style.top = c + 'px';
			return this;
		},	
	
		
		sync : function() {
			this.view.scrollTop =  this.face.offsetTop * this.ratio;		
		},
		

		
		onmouseup : function() {
			this.setDrag(false);
			return true;
		},
		
		onmousemove : function(e) {
			if( !this.dragging ) return;
			if( e.stopPropagation ) e.stopPropagation();
			if( e.preventDefault ) e.preventDefault();
			e.returnValue = false;		
			e.cancelBubble = true;		
			var y = e.clientY || 0;
			if( this.lastMouseY === null ) { 
				this.lastMouseY = y;
			} else {
				var d = Math.abs(y - this.lastMouseY);
				if( y < this.lastMouseY ) d = this.lastScrollPos - d;
				else d = this.lastScrollPos + d;
				this.setScroll(d);
				this.sync();
			}
			return false;
		}
	}
	
	return O;
			 
})();