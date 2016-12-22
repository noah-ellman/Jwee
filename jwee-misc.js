//////////////////////////////////////////////////////////////////////////
// JWee JavaScript Framework & Toolkit 
// Copyright (c) 2010 AUTHORS (jweeframework@gmail.com)
// Licensed under the MIT and GPL (for now). 
// http://www.jwee.org
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// Misc functions
/*
@@namespace wee.misc
@@function rgb2hex




*/
//////////////////////////////////////////////////////////////////////////
;(function(){
///////////////////////////////////////////////////

jwee.color = {
	rgb2hex: function() {
		if( arguments.length === 3) {
			var m = [0,arguments[0],arguments[1],arguments[2]];
		} else {
			var rgb = arguments[0];
			if( rgb.charAt(0) == '#' ) return rgb;
			var m = rgb.match(/rgb\((\d+),(\d+),(\d+)\)/);
		}
		if( m ) {
			m.shift();
			return '#' + m.map( function(o) { return parseInt(o).toPaddedString(2,16); }).join('');
		}
	}
};
//////////////////////////////////////////////////////////////////////////

 jwee.utils = {
	
	parseScriptAndStyleTags: function(s) {
		var m = s.match(/<script[^>]*>[\s\S]*?<\/script>/img), m2;
		trace(m);
		if( m ) {
			for(var i=0; i < m.length; i++ ) {
				s = s.replace(m[i],'');
				m2 = m[i].match(/>([\S\s]*?)<\/script>/im);
				trace(m2);
				if( m2 && m2[1].length > 5 ) 
					try { jwee.evalScript(m2[1]); } catch(e) { trace("Script error in Eval'd code");}
			}
		}
		m = s.match(/<style[^>]*>[\s\S]*?<\/style>/img);
		if( m ) {
			for(var i=0; i < m.length; i++ ) {
				s = s.replace(m[i],'');
				m2 = m[i].match(/>([\S\s]*?)<\/style>/im);
				if( m2 && m2[1].length > 5 ) 
					try { jwee.evalStyle(m2[1]); } catch(e) { }
			}
		}
		return s;
	}
	
};
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////


wee.misc = {

	IE6PngBGFix:	function(ele, bg) {
		if( wee.isArray(ele) ) {
			return ele.each(function(v) { wee.misc.IE6PngImgFix(v); });
		}		
		bg = bg ? bg : wee.elem.getBackgroundImage(ele);
		if( !bg ) return;
		ele.runtimeStyle.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + bg + "', sizingMethod='crop')";
		ele.style.backgroundImage='';
		$(ele).childs().each(function(ele) { ele.style.position='relative'; ele.style.zIndex=2; });
		return bg;
	},
	
	IE6PngImgFix: function(ele) {
		if( wee.isArray(ele) ) {
			return ele.each(function(v) { wee.misc.IE6PngImgFix(v); });
		}
		var width = ele.width || ele.offsetWidth || null, height = ele.height || ele.offsetHeight || null, src = ele.src;
		if( !src ) return;
		ele.src = "/i/b.gif";
		ele.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "', sizingMethod='image')";
				
	},
	
	IEClearTypeOpacityFix: function(ele, color) {
		color = color || Elem.getStyle(ele,'backgroundColor');
		if( color && color == 'transparent' ) color = '#FFFFFF';
		$$$('*',ele,function(o) { return o.nodeType === 1 && o.parentNode == ele; }).each( function(o) {
			o.style.backgroundColor = color;
		});		
	}
	


};
///////////////////////////////////////////////////
})();

var Colors = wee.colors = {
 	random: function() { return Colors[Object.keys(Colors,true).random()]; },
	aliceblue: "#f0f8ff", antiquewhite: "#faebd7", aqua: "#00ffff", aquamarine: "#7fffd4", azure: "#f0ffff", beige: "#f5f5dc", bisque: "#ffe4c4", black: "#000000",
	blanchedalmond: "#ffebcd", blue: "#0000ff", blueviolet: "#8a2be2", brown: "#a52a2a", burlywood: "#deb887", cadetblue: "#5f9ea0", chartreuse: "#7fff00",
	chocolate: "#d2691e", coral: "#ff7f50", cornflowerblue: "#6495ed", cornsilk: "#fff8dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b",
	darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", darkkhaki: "#bdb76b",
	darkmagenta: "#8b008b", darkolivegreen: "#556b2f", darkorange: "#ff8c00", darkorchid: "#9932cc", darkred: "#8b0000", darksalmon: "#e9967a",
	darkseagreen: "#8fbc8f", darkslateblue: "#483d8b", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", darkturquoise: "#00ced1", darkviolet: "#9400d3",
	deeppink: "#ff1493", deepskyblue: "#00bfff", dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1e90ff", firebrick: "#b22222", floralwhite: "#fffaf0",
	forestgreen: "#228b22", fuchsia: "#ff00ff", gainsboro: "#dcdcdc", ghostwhite: "#f8f8ff", gold: "#ffd700", goldenrod: "#daa520", gray: "#808080",
	green: "#008000", greenyellow: "#adff2f", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", indianred: "#cd5c5c", indigo: "#4b0082",
	ivory: "#fffff0", khaki: "#f0e68c", lavender: "#e6e6fa", lavenderblush: "#fff0f5", lawngreen: "#7cfc00", lemonchiffon: "#fffacd", lightblue: "#add8e6",
	lightcoral: "#f08080", lightcyan: "#e0ffff", lightgoldenrodyellow: "#fafad2", lightgray: "#d3d3d3", lightgreen: "#90ee90", lightgrey: "#d3d3d3",
	lightpink: "#ffb6c1", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", lightskyblue: "#87cefa", lightslategray: "#778899", lightslategrey: "#778899",
	lightsteelblue: "#b0c4de", lightyellow: "#ffffe0", lime: "#00ff00", limegreen: "#32cd32", linen: "#faf0e6", magenta: "#ff00ff", maroon: "#800000",
	mediumaquamarine: "#66cdaa", mediumblue: "#0000cd", mediumorchid: "#ba55d3", mediumpurple: "#9370db", mediumseagreen: "#3cb371",
	mediumslateblue: "#7b68ee", mediumspringgreen: "#00fa9a", mediumturquoise: "#48d1cc", mediumvioletred: "#c71585", midnightblue: "#191970",
	mintcream: "#f5fffa", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", navajowhite: "#ffdead", navy: "#000080", oldlace: "#fdf5e6", olive: "#808000",
	olivedrab: "#6b8e23", orange: "#ffa500", orangered: "#ff4500", orchid: "#da70d6", palegoldenrod: "#eee8aa", palegreen: "#98fb98",
	paleturquoise: "#afeeee", palevioletred: "#db7093", papayawhip: "#ffefd5", peachpuff: "#ffdab9", peru: "#cd853f", pink: "#ffc0cb",
	plum: "#dda0dd", powderblue: "#b0e0e6", purple: "#800080", red: "#ff0000", rosybrown: "#bc8f8f", royalblue: "#4169e1", saddlebrown: "#8b4513",
	salmon: "#fa8072", sandybrown: "#f4a460", seagreen: "#2e8b57", seashell: "#fff5ee", sienna: "#a0522d", silver: "#c0c0c0", skyblue: "#87ceeb",
	slateblue: "#6a5acd", slategray: "#708090", slategrey: "#708090", snow: "#fffafa", springgreen: "#00ff7f", steelblue: "#4682b4", tan: "#d2b48c",
	teal: "#008080", thistle: "#d8bfd8", tomato: "#ff6347", turquoise: "#40e0d0", violet: "#ee82ee", wheat: "#f5deb3", white: "#ffffff", whitesmoke: "#f5f5f5",
	yellow: "#ffff00", yellowgreen: "#9acd32"
};


//////////////////////////////////////////////////////////////////////////
/*
@@namespace wee 

@@class Color
@desc Manipulate colors with this class
@arg {mixed} A value representing a color. Can be a #RRGGBB, a numeric value, or a CSS value.
@ret New color as class instance
@ex var lightblue = new Color("#336699").lighten();


@@namespace wee.Color

@@method lighten
@desc Lighten the color

@@method darken
@desc Darken the color

@@method toString
@desc Get the #RRGGBB string
@ret {string} #RRGGBB

*/

var Color = wee.Color = Class.create('Color', {
	
	value:"#000000", r:0, g:0, b:0,
	
	construct: function() {
		var value, obj;
		 if( arguments.length === 3 ) {
			 obj = {r:arguments[0],g:arguments[1],b:arguments[2]};
			this.value = this.rgb2hex(arguments[0],arguments[1],arguments[2]);
		} else if( arguments.length === 1 ) {
			this.value = arguments[0] + "";
			obj = this.parseString();
		}
		if( obj ) { this.r = obj.r; this.b = obj.b; this.g = obj.g; }
	},
		
	
	toString: function() {
		if( isNaN(this.r) ) return "#FFFFFF";
		return '#' + [this.r,this.g,this.b].map( function(o) { return parseInt(o).toPaddedString(2,16); }).join('');
	},
	

	check: function(){
	    if(this.r>255){this.r=255;}else if(this.r<0){this.r=0;}
 		if(this.g>255){this.g=255;}else if(this.g<0){this.g=0;}
   	 	if(this.b>255){this.b=255;}else if(this.b<0){this.b=0;}
   	 	return this;
	},
	
	isWhite: function() {
		return this.r>=255 && this.g>=255 & this.b>=255 ? true : false;	
	},
	
	isBlack: function() {
		return this.r<=0 && this.g<=0 & this.b<=0 ? true : false;		
	},
	
	lighten: function(d) {
		d = d ? +d : 10;		
		this.r += d; this.g += d; this.b += d;
		return this.check();
	},
	
	darken: function(d) {
		d = d ? +d : 10;
		this.r -= d; this.g -= d; this.b -= d;
		return this.check();
	},	
	
	invert: function(){
		//this.check();
		this.r = 255-this.r;
		this.g = 255-this.g;
		this.b = 255-this.b;
		return this;
	},
	
	
	rgb2hex: function() {
		if( arguments.length === 3) {
			var m = [0,arguments[0],arguments[1],arguments[2]];
		} else {
			var rgb = arguments[0];
			if( rgb.charAt(0) == '#' ) return rgb;
			var m = rgb.match(/rgb\((\d+),(\d+),(\d+)\)/);
		}
		if( m ) {
			m.shift();
			return '#' + m.map( function(o) { return parseInt(o).toPaddedString(2,16); }).join('');
		}
	},
	
	parseString: function(str) {
		str = str ? str : this.value;
	    if(/^#?([\da-f]{3}|[\da-f]{6})$/i.test(str)){
	        function _(s,i){return parseInt(s.substr(i,2), 16);}
	        str = str.replace(/^#/, '').replace(/^([\da-f])([\da-f])([\da-f])$/i, "$1$1$2$2$3$3");
	        return {r:_(str,0), g:_(str,2), b:_(str,4)}
	    } else if(/^rgb *\( *\d{0,3} *, *\d{0,3} *, *\d{0,3} *\)$/i.test(str)){
	        str = str.match(/^rgb *\( *(\d{0,3}) *, *(\d{0,3}) *, *(\d{0,3}) *\)$/i);
	        return {r:parseInt(str[1]), g:parseInt(str[2]), b:parseInt(str[3])};
	   }
	   return str;
	}
		
});




//////////////////////////////////////////////////////////////////////////


wee.lev  = function(min, split){
    // Levenshtein Algorithm Revisited - WebReflection
    try{split=!("0")[0]}catch(i){split=true};
    return function(a, b){
        if(a == b)return 0;
        if(!a.length || !b.length)return b.length || a.length;
        if(split){a = a.split("");b = b.split("")};
        var len1 = a.length + 1,
            len2 = b.length + 1,
            I = 0,
            i = 0,
            d = [[0]],
            c, j, J;
        while(++i < len2)
            d[0][i] = i;
        i = 0;
        while(++i < len1){
            J = j = 0;
            c = a[I];
            d[i] = [i];
            while(++j < len2){
                d[i][j] = min(d[I][j] + 1, d[i][J] + 1, d[I][J] + (c != b[J]));
                ++J;
            };
            ++I;
        };
        return d[len1 - 1][len2 - 1];
    }
}(Math.min, false);

///////////////////////////////////////////////

;(function() {
	
	var x, f = function(){ return this.hex; };

	wee.colors256 = {
		aliceblue: {name:"AliceBlue", rgb:"240,248,255", hex:"#f0f8ff"},
		antiquewhite2: {name:"AntiqueWhite2", rgb:"238,223,204", hex:"#eedfcc"},
		antiquewhite3: {name:"AntiqueWhite3", rgb:"205,192,176", hex:"#cdc0b0"},
		antiquewhite4: {name:"AntiqueWhite4", rgb:"139,131,120", hex:"#8b8378"},
		antiquewhite: {name:"AntiqueWhite", rgb:"250,235,215", hex:"#faebd7"},
		aquamarine: {name:"Aquamarine", rgb:"127,255,212", hex:"#7fffd4"},
		azure: {name:"Azure", rgb:"240,255,255", hex:"#f0ffff"},
		beige: {name:"Beige", rgb:"245,245,220", hex:"#f5f5dc"},
		bisque2: {name:"Bisque2", rgb:"238,213,183", hex:"#eed5b7"},
		bisque3: {name:"Bisque3", rgb:"205,183,158", hex:"#cdb79e"},
		bisque4: {name:"Bisque4", rgb:"139,125,107", hex:"#8b7d6b"},
		bisque: {name:"Bisque", rgb:"255,228,196", hex:"#ffe4c4"},
		black: {name:"Black", rgb:"0,0,0", hex:"#000000"},
		blanchedalmond: {name:"BlanchedAlmond", rgb:"255,235,205", hex:"#ffebcd"},
		blue: {name:"Blue", rgb:"0,0,255", hex:"#0000ff"},
		blueviolet: {name:"BlueViolet", rgb:"138,43,226", hex:"8a2be2"},
		brown: {name:"Brown", rgb:"165,42,42", hex:"#a52a2a"},
		burlywood: {name:"Burlywood", rgb:"222,184,135", hex:"#deb887"},
		cadetblue: {name:"CadetBlue", rgb:"95,158,160", hex:"#5f9ea0"},
		chartreuse: {name:"Chartreuse", rgb:"127,255,0", hex:"#7fff00"},
		chocolate: {name:"Chocolate", rgb:"210,105,30", hex:"#d2691e"},
		coral: {name:"Coral", rgb:"255,127,80", hex:"#ff7f50"},
		cornflowerblue: {name:"CornflowerBlue", rgb:"100,149,237", hex:"#6495ed"},
		cornsilk2: {name:"Cornsilk2", rgb:"238,232,205", hex:"#eee8dc"},
		cornsilk3: {name:"Cornsilk3", rgb:"205,200,177", hex:"#cdc8b1"},
		cornsilk4: {name:"Cornsilk4", rgb:"139,136,120", hex:"#8b8878"},
		cornsilk: {name:"Cornsilk", rgb:"255,248,220", hex:"#fff8dc"},
		cyan: {name:"Cyan", rgb:"0,255,255", hex:"#00ffff"},
		darkgoldenrod: {name:"DarkGoldenrod", rgb:"184,134,11", hex:"#b8860b"},
		darkgreen: {name:"DarkGreen", rgb:"0,100,0", hex:"#006400"},
		darkkhaki: {name:"DarkKhaki", rgb:"189,183,107", hex:"#bdb76b"},
		darkolivegreen: {name:"DarkOliveGreen", rgb:"85,107,47", hex:"#556b2f"},
		darkorange: {name:"DarkOrange", rgb:"255,140,0", hex:"#ff8c00"},
		darkorchid: {name:"DarkOrchid", rgb:"153,50,204", hex:"9932cc"},
		darksalmon: {name:"DarkSalmon", rgb:"233,150,122", hex:"#e9967a"},
		darkseagreen: {name:"DarkSeaGreen", rgb:"143,188,143", hex:"#8fbc8f"},
		darkslateblue: {name:"DarkSlateBlue", rgb:"72,61,139", hex:"#483d8b"},
		darkslategray: {name:"DarkSlateGray", rgb:"49,79,79", hex:"#2f4f4f"},
		darkturquoise: {name:"DarkTurquoise", rgb:"0,206,209", hex:"#00ced1"},
		darkviolet: {name:"DarkViolet", rgb:"148,0,211", hex:"9400d3"},
		deeppink: {name:"DeepPink", rgb:"255,20,147", hex:"#ff1493"},
		deepskyblue: {name:"DeepSkyBlue", rgb:"0,191,255", hex:"#00bfff"},
		dimgray: {name:"DimGray", rgb:"105,105,105", hex:"#696969"},
		dodgerblue: {name:"DodgerBlue", rgb:"30,144,255", hex:"#1e90ff"},
		firebrick: {name:"Firebrick", rgb:"178,34,34", hex:"#b22222"},
		floralwhite: {name:"FloralWhite", rgb:"255,250,240", hex:"#fffaf0"},
		forestgreen: {name:"ForestGreen", rgb:"34,139,34", hex:"#228b22"},
		gainsboro: {name:"Gainsboro", rgb:"220,220,220", hex:"#dcdcdc"},
		ghost: {name:"GhostWhite", rgb:"248,248,255", hex:"#f8f8ff"},
		ghostwhite: {name:"GhostWhite", rgb:"248,248,255", hex:"#f8f8ff"},
		gold: {name:"Gold", rgb:"255,215,0", hex:"#ffd700"},
		goldenrod: {name:"Goldenrod", rgb:"218,165,32", hex:"#daa520"},
		gray: {name:"Gray", rgb:"190,190,190", hex:"#bebebe"},
		greenyellow: {name:"GreenYellow", rgb:"173,255,47", hex:"#adff2f"},
		honeydew2: {name:"Honeydew2", rgb:"244,238,224", hex:"#e0eee0"},
		honeydew3: {name:"Honeydew3", rgb:"193,205,193", hex:"#c1cdc1"},
		honeydew4: {name:"Honeydew4", rgb:"131,139,131", hex:"#838b83"},
		honeydew: {name:"Honeydew", rgb:"240,255,240", hex:"#f0fff0"},
		hotpink: {name:"HotPink", rgb:"255,105,180", hex:"#ff69b4"},
		indianred: {name:"IndianRed", rgb:"205,92,92", hex:"#cd5c5c"},
		ivory2: {name:"Ivory2", rgb:"238,238,224", hex:"#eeeee0"},
		ivory3: {name:"Ivory3", rgb:"205,205,193", hex:"#cdcdc1"},
		ivory4: {name:"Ivory4", rgb:"139,139,131", hex:"#8b8b83"},
		ivory: {name:"Ivory", rgb:"255,255,240", hex:"#fffff0"},
		khaki: {name:"Khaki", rgb:"240,230,140", hex:"#f0e68c"},
		lavender: {name:"Lavender", rgb:"230,230,250", hex:"#e6e6fa"},
		lavenderblush: {name:"LavenderBlush", rgb:"255,240,245", hex:"#fff0f5"},
		lawngreen: {name:"LawnGreen", rgb:"124,252,0", hex:"#7cfc00"},
		lemonchiffon: {name:"LemonChiffon", rgb:"255,250,205", hex:"#fffacd"},
		lightblue: {name:"LightBlue", rgb:"173,216,230", hex:"#add8e6"},
		lightcoral: {name:"LightCoral", rgb:"240,128,128", hex:"#f08080"},
		lightcyan: {name:"LightCyan", rgb:"224,255,255", hex:"#e0ffff"},
		lightgoldenrod: {name:"LightGoldenrod", rgb:"238,221,130", hex:"#eedd82"},
		lightgoldenrodyellow: {name:"LightGoldenrodYellow", rgb:"250,250,210", hex:"#fafad2"},
		lightgray: {name:"LightGray", rgb:"211,211,211", hex:"#d3d3d3"},
		lightpink: {name:"LightPink", rgb:"255,182,193", hex:"#ffb6c1"},
		lightsalmon: {name:"LightSalmon", rgb:"255,160,122", hex:"#ffa07a"},
		lightseagreen: {name:"LightSeaGreen", rgb:"32,178,170", hex:"#20b2aa"},
		lightskyblue: {name:"LightSkyBlue", rgb:"135,206,250", hex:"#87cefa"},
		lightslateblue: {name:"LightSlateBlue", rgb:"132,112,255", hex:"#8470ff"},
		lightslategray: {name:"LightSlateGray", rgb:"119,136,153", hex:"#778899"},
		lightsteelblue: {name:"LightSteelBlue", rgb:"176,196,222", hex:"#b0c4de"},
		lightyellow: {name:"LightYellow", rgb:"255,255,224", hex:"#ffffe0"},
		limegreen: {name:"LimeGreen", rgb:"50,205,50", hex:"#32cd32"},
		linen: {name:"Linen", rgb:"240,240,230", hex:"#faf0e6"},
		maroon: {name:"Maroon", rgb:"176,48,96", hex:"#b03060"},
		mediumaquamarine: {name:"MediumAquamarine", rgb:"102,205,170", hex:"#66cdaa"},
		mediumblue: {name:"MediumBlue", rgb:"0,0,205", hex:"#0000cd"},
		mediumorchid: {name:"MediumOrchid", rgb:"186,85,211", hex:"#ba55d3"},
		mediumpurple: {name:"MediumPurple", rgb:"147,112,219", hex:"9370db"},
		mediumseagreen: {name:"MediumSeaGreen", rgb:"60,179,113", hex:"#3cb371"},
		mediumslateblue: {name:"MediumSlateBlue", rgb:"123,104,238", hex:"#7b68ee"},
		mediumspringgreen: {name:"MediumSpringGreen", rgb:"0,250,154", hex:"#00fa9a"},
		mediumturquoise: {name:"MediumTurquoise", rgb:"72,209,204", hex:"#48d1cc"},
		mediumvioletred: {name:"MediumVioletRed", rgb:"199,21,133", hex:"#c71585"},
		midnightblue: {name:"MidnightBlue", rgb:"25,25,112", hex:"#191970"},
		mintcream: {name:"MintCream", rgb:"245,255,250", hex:"#f5fffa"},
		mistyrose: {name:"MistyRose", rgb:"255,228,225", hex:"#ffe4e1"},
		moccasin: {name:"Moccasin", rgb:"255,228,181", hex:"#ffe4b5"},
		navajowhite: {name:"NavajoWhite", rgb:"255,222,173", hex:"#ffdead"},
		navy: {name:"Navy", rgb:"0,0,128", hex:"#000080"},
		oldlace: {name:"OldLace", rgb:"253,245,230", hex:"#fdf5e6"},
		olivedrab: {name:"OliveDrab", rgb:"107,142,35", hex:"#6b8e23"},
		orange: {name:"Orange", rgb:"255,165,0", hex:"#ffa500"},
		orangered: {name:"OrangeRed", rgb:"255,69,0", hex:"#ff4500"},
		orchid: {name:"Orchid", rgb:"218,112,214", hex:"#da70d6"},
		palegoldenrod: {name:"PaleGoldenrod", rgb:"238,232,170", hex:"#eee8aa"},
		palegreen: {name:"PaleGreen", rgb:"152,251,152", hex:"#98fb98"},
		paleturquoise: {name:"PaleTurquoise", rgb:"175,238,238", hex:"#afeeee"},
		palevioletred: {name:"PaleVioletRed", rgb:"219,112,147", hex:"#db7093"},
		papayawhip: {name:"PapayaWhip", rgb:"255,239,213", hex:"#ffefd5"},
		peachpuff2: {name:"PeachPuff2", rgb:"238,203,173", hex:"#eecbad"},
		peachpuff3: {name:"PeachPuff3", rgb:"205,175,149", hex:"#cdaf95"},
		peachpuff4: {name:"PeachPuff4", rgb:"139,119,101", hex:"#8b7765"},
		peachpuff: {name:"PeachPuff", rgb:"255,218,185", hex:"#ffdab9"},
		peru: {name:"Peru", rgb:"205,133,63", hex:"#cd853f"},
		pink: {name:"Pink", rgb:"255,192,203", hex:"#ffc0cb"},
		plum: {name:"Plum", rgb:"221,160,221", hex:"#dda0dd"},
		powderblue: {name:"PowderBlue", rgb:"176,224,230", hex:"#b0e0e6"},
		purple: {name:"Purple", rgb:"160,32,240", hex:"#a020f0"},
		red: {name:"Red", rgb:"255,0,0", hex:"#ff0000"},
		rosybrown: {name:"RosyBrown", rgb:"188,143,143", hex:"#bc8f8f"},
		royalblue: {name:"RoyalBlue", rgb:"65,105,225", hex:"#4169e1"},
		saddlebrown: {name:"SaddleBrown", rgb:"139,69,19", hex:"#8b4513"},
		salmon: {name:"Salmon", rgb:"250,128,114", hex:"#fa8072"},
		sandybrown: {name:"SandyBrown", rgb:"244,164,96", hex:"#f4a460"},
		seagreen: {name:"SeaGreen", rgb:"46,139,87", hex:"#2e8b57"},
		seashell2: {name:"Seashell2", rgb:"238,229,222", hex:"#eee5de"},
		seashell3: {name:"Seashell3", rgb:"205,197,191", hex:"#cdc5bf"},
		seashell4: {name:"Seashell4", rgb:"139,134,130", hex:"#8b8682"},
		seashell: {name:"Seashell", rgb:"255,245,238", hex:"#fff5ee"},
		sienna: {name:"Sienna", rgb:"160,82,45", hex:"#a0522d"},
		skyblue: {name:"SkyBlue", rgb:"135,206,250", hex:"#87ceeb"},
		slateblue: {name:"SlateBlue", rgb:"106,90,205", hex:"#6a5acd"},
		slategray: {name:"SlateGray", rgb:"112,138,144", hex:"#708090"},
		snow2: {name:"Snow2", rgb:"238,233,233", hex:"#eee9e9"},
		snow3: {name:"Snow3", rgb:"205,201,201", hex:"#cdc9c9"},
		snow4: {name:"Snow4", rgb:"139,137,137", hex:"#8b8989"},
		snow: {name:"Snow", rgb:"255,250,250", hex:"#fffafa"},
		springgreen: {name:"SpringGreen", rgb:"0,255,127", hex:"#00ff7f"},
		steelblue: {name:"SteelBlue", rgb:"70,130,180", hex:"#4682b4"},
		tan: {namz:"Tan", rgb:"210,180,140", hex:"#d2b48c"},
		thistle: {name:"Thistle", rgb:"216,191,216", hex:"#d8bfd8"},
		tomato: {name:"Tomato", rgb:"255,99,71", hex:"#ff6347"},
		turquoise: {name:"Turquoise", rgb:"64,224,208", hex:"#40e0d0"},
		violet: {name:"Violet", rgb:"238,130,238", hex:"#ee82ee"},
		violetred: {name:"VioletRed", rgb:"208,32,144", hex:"#d02090"},
		wheat: {name:"Wheat", rgb:"245,222,179", hex:"#f5deb3"},
		white: {name:"White", rgb:"255,255,255", hex:"#ffffff"},
		whitesmoke: {name:"WhiteSmoke", rgb:"245,245,245", hex:"#f5f5f5"},
		yellow: {name:"Yellow", rgb:"255,255,0", hex:"#ffff00"},
		yellowgreen: {name:"YellowGreen", rgb:"154,205,50", hex:"#9acd32"}
	};
	
	for ( x in wee.colors256 ) { 
		wee.colors256[x].toString =  f;
	}
	
})();

