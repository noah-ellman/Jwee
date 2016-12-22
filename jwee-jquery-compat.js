
wee.elem.addMethods( {
	
	html: function(v) {
		if( typeof v == undef ) return this.innerHTML;
		else return this.update(v); 
	},
	remove: wee.elem.methods.recyle,
	val: function() { return this.value; },
	/*height: function() { return this.getRect().height; },
	width: function() { return this.getRect().width; },*/
	position: function() { return this.getRect(); }
	
	
	
} );