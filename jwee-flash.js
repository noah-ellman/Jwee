//////////////////////////////////////////////////////////////////////////
// JWee JavaScript Framework & Toolkit 
// Copyright (c) 2010 AUTHORS (mrspoonzy@gmail.com)
// Licensed under the MIT and GPL (for now). 
// http://www.jwee.org
//////////////////////////////////////////////////////////////////////////
// Flash
//////////////////////////////////////////////////////////////////////////
/*
@@namespace wee.flash

@@function getVersion
@desc Get the users's version of macromedia flash
@returns (float) complete numeric flash version

@@function add ( element/id, object args )
@desc Create the flash content easily. This function will auto-delay itself if called before page is loaded.
@arg The element or id of the container to put the flash.
@arg A object containing the parameters for the flash movie.

@@class Movie ( mixed )
@desc Display flash content easily, like SWFObject.

@@namespace wee.flash.Movie

@@method create ( [element where] )
@desc Create the flash &lt;embed&gt; or &lt;object&gt; element.
@arg (optional) Element or Element ID where to place flash content.
@returns The DOM flash embed element

@@method toString
@desc Generate the raw &lt;embed&gt; or &lt;object&gt; HTML code for your flash.
@returns The &lt;embed&gt; or &lt;object&gt; HTML.



*/
//////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////
var Flash = jwee.flash = {};

(function() { 
			 
	var	activex = window.ActiveXObject ? true : false;
	
	Flash.Movie = Class.create( "Flash.Movie", (function() { 	
	
		var	
			objectAttribs = ['id','name','classid', 'codeBase','width','height','type','src'],
			param = function(n,v) { var el = document.createElement('param'); el.setAttribute('name',n); el.setAttribute('value',v); return el; };

		return {
			construct: 
				function(args) {
					var t = typeof args, name;
					Object.extend(this, Flash.Movie.DefaultAttributes);
					if( t == 'object' ) {
						for( var k in args ) {
							if( k in this ) this[k] = args[k];
						}
					} else if( t == 'string' ) this.movie = args;
					name = this.id ? this.id : this.name;
					name = name ? name : jwee.getUniqueId('swf');
					this.id = this.name = name;
				},
			properties: function() {	return Object.keys(Flash.Movie.DefaultAttributes); },
			prepare: function() {
				if( this.movie && !this.src ) this.src = this.movie;
				else if( this.src && !this.movie ) this.movie = this.src;
			},
			create: function(where) {
				var me = this, ele, attribs = {};
				this.prepare();
				if( activex ) {
					objectAttribs.each( function(k) { attribs[k] = me[k]; } );				
					ele = Elem.create('object',attribs);
					this.properties().filter(objectAttribs).each( function(k) { if( me[k] !== null ) ele.appendChild( param(k,me[k]) ); });
				} else {
					this.properties().each( function(k) {attribs[k] = me[k] });				
					ele = Elem.create('embed',attribs);
				}
				if( where ) {
					wee(where).truncate();
					wee(where).appendChild(ele);
				};
				return ele;
			},
			toString: function() {
				var str1 = [], me = this;
				this.prepare();
				if( activex ) {
					str1.push('<object');
					objectAttribs.each( function(k) { str1.push(k+'="' + me[k] + '"'); });
					str1.push('>');
					str1 = [str1.join(" ")];
					this.properties().filter(objectAttribs).each( function(k) {
						str1.push('<param name="' + k + '" value="' + me[k] + '" />');											
					});
					str1.push('</object>');
				} else {
					str1.push('<embed');
					this.properties().each( function(k) { str1.push(' ' + k+'="' + me[k] + '"'); });
					str1.push('></embed>');
				}
				return str1.join("");
			}
			
		};

	})());
	
	Flash.Movie.DefaultAttributes = {
		id: null,
		name: null,
		codeBase: "http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0",
		classid: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		type: "application/x-shockwave-flash",
		width: "100",
		height: "100",
		movie: null,
		src:null,
		wmode: "transparent",
		quality: "auto",
		salign: "LT",
		menu: "0",
		scale: "ShowAll",
		allowscriptaccess: "always",
		allownetworking: "all",
		allowfullscreen: "true"
	};

	Flash.add = function(where, args) {
		if( document.loaded ) {
			new Flash.Movie(args).create( wee(where) );
		} else {
			Event.onReady( function() { Flash.add(where, args); } );
		}
	};

	Flash.getVersion = function() {
		var version = 0, ax = null;
		if( window.ActiveXObject ) {
			try {
				ax = new ActiveXObject("ShockwaveFlash" + "." + "ShockwaveFlash" + ".6");
				ax.AllowScriptAccess = "always";
			} catch(e) {
				if(ax !== null) version = 6.0;
			}
			if( version === 0) {
				try	{
					ax  = new ActiveXObject("ShockwaveFlash" + "." + "ShockwaveFlash");
					var vS = ax.GetVariable("$version").replace(/[A-Za-z\s]+/g, '').split(',');
					version = vS[0] + '.';
					switch((vS[2].toString()).length) {
						case 1:
							version += "00";
						break;
						case 2: 
							version += "0";
						break;
					}
					version +=  vS[2];
					version = parseFloat(version);
				} catch (e) { }
			}
		} else {
			var mF = navigator.mimeTypes['application/x-shockwave-flash'];
			if ( mF ) {
				eP = mF.enabledPlugin;
				if (eP) {
					var vS = eP.description.replace(/\s[rd]/g, '.').replace(/[A-Za-z\s]+/g, '').split('.');
					version = vS[0] + '.';
					switch((vS[2].toString()).length) {
						case 1:
							version += "00";
							break;
						case 2: 
							version += "0";
							break;
					}
					version +=  vS[2];
					version = parseFloat(version);
				 }
			 }	
		}
		Flash.version = version;
		return version;
	}

//////////////////////////////////////////////////
})();
///////////////////////////////////////////////////