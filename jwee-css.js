//////////////////////////////////////////////////////////////////////////
// JWee JavaScript Framework & Toolkit 
// Copyright (c) 2010 AUTHORS (mrspoonzy@gmail.com)
// Licensed under the MIT and GPL (for now). 
// http://www.jwee.org
//////////////////////////////////////////////////////////////////////////
// ** UNDER CONSTRUCTION **
//////////////////////////////////////////////////////////////////////////

(function() {
	
	wee.css = {};
	
	wee.css.rgb2Hex = function() {
		var args = $a(arguments), len = args.length, hex = [], i, bit;
		if( len === 1 ) { 
			if( typeof args[0] == 'string' ) args = args[0].match(/\d+/g);
			else args = args[0];;
		} 
		if (args.length < 3) return null;
		if (args.length == 4 && args[3] == 0 && !array) return 'transparent';
		for (i = 0; i < 3; i++){
			bit = (args[i] - 0).toString(16);
			hex.push((bit.length == 1) ? '0' + bit : bit);
		}
		return '#' + hex.join('');		
	};
	
})();	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
})();