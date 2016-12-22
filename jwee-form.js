//////////////////////////////////////////////////////////////////////////
// JWee JavaScript Framework & Toolkit 
// Copyright (c) 2010 AUTHORS (mrspoonzy@gmail.com)
// Licensed under the MIT and GPL (for now). 
// http://www.jwee.org
//////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////
// Form
// ** UNDER CONSTRUCTION **
//////////////////////////////////////////////////////////////////////////
/***
@@@namespace wee

@@toolkit form
@desc All form related functions.

@@@namespace wee.form
@desc All form related functions.

@@function toQueryString
@arg the form
@ret form values as encoded url query string

@@function toObject
@arg the form
@ret {object} plain object with properties and values representating the form data

@@ajaxify
@arg the form
@advanced

***/

;(function(){
///////////////////////////////////////////////////
wee.form = {
	
	toQueryString : function(form) {
		form = wee(form);
		var q = {}, e = Array.from(form.elements), len = e.length;
		for( var i = 0; i < len; i++ ) {
			q[e[i].name] = e[i].value;
		}
		return Object.toQueryString(q);
	},
	
	toObject : function(form) {
		form = wee(form);
		var q = {}, e = Array.from(form.elements), len = e.length;
		for( var i = 0; i < len; i++ ) {
			q[e[i].name] = e[i].value;
		}
		return q;
	},
	
	ajaxify : function(form) {
		form = wee(form);
		var 
			method = form.getAttribute('method') || 'get',
			action = form.getAttribute('action'),
			cb = typeof form.afterSubmit == 'function' ? form.afterSubmit : nully;
			
			form.onsubmit = function() {
				wee.ajax.post(action,cb,wee.form.toObject(form));
				return false;
			};
			
	}
			
};

wee.event.onLoad( function() {
	
	var len = document.forms.length;
	while(len--) {
		if( wee(document.forms[len]).hasClass('ajax') ) {
			wee.form.ajaxify(document.froms[len]);		
			trace("Form", document.forms[len].name, 'ajaxified!');
		}
	}
	
	
	
	
	
});


///////////////////////////////////////////////
/***
@@class Form
@arg the form element or valid #id of form


@@namespace wee.form.Form

@@method elements
@ret the form elements

@@method submit
@desc submits the form
**/
///////////////////////////////////////////////

wee.Form = wee.form.Form = Class.create('Form', {
		construct: function(form) {
			this.form = wee(form);
		},
		elements: function() {
			return Array.from(this.form.elements);
		},
		submit: function() {
			this.form.submit();
		},
		toString: function() {
			return wee.form.toQueryString(this.form);
		}
});

///////////////////////////////////////////////////
})();
//////////////////////////////////////////////////////////////////////////