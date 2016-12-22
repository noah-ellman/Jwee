//////////////////////////////////////////////////////////////////////////
// JWee JavaScript Framework & Toolkit 
// Copyright (c) 2010 AUTHORS (mrspoonzy@gmail.com)
// Licensed under the MIT and GPL (for now). 
// http://www.jwee.org
//////////////////////////////////////////////////////////////////////////
// USER INTERFACE STUFF
// ** UNDER CONSTRUCTION **
///////////////////////////////////////////////////
wee.ui = (function(){
///////////////////////////////////////////////////

function getSelection(element) {
	if (document.selection && document.selection.createRange) {
		var range = document.selection.createRange();
		var stored = range.duplicate();
		stored.moveToElementText(element);
		stored.setEndPoint("EndToEnd", range);
		element.selectionStart = stored.text.length - range.text.length;
		element.selectionEnd = element.selectionStart + range.text.length;
	}
	return [element.selectionStart, element.selectionEnd];
}

function setSelection(element, range) {
	element.focus();
	element.selectionStart = range[0];
	element.selectionEnd = range[1];
	if (document.selection && document.selection.createRange) {
		var range = document.selection.createRange();
	 	range.moveStart("character", element.selectionStart);
	    	range.moveEnd("character", element.selectionEnd - element.selectionStart);
		range.select();
	}
}


return {
	getSelection: getSelection,
	setSelection: setSelection
}

///////////////////////////////////////////////////
})();
///////////////////////////////////////////////////