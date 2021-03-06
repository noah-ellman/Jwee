
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Sizzle CSS Selector Engine - v1.0
// Copyright 2009, The Dojo Foundation
// Released under the MIT, BSD, and GPL Licenses.
// More information: http://sizzlejs.com/
// (INTEGRATED FOR JWEE)
///////////////////////////////////////////////////
(function(){var p=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,i=0,d=Object.prototype.toString,n=false;var b=
function(D,t,A,v){A=A||[];var e=t=t||document;if(t.nodeType!==1&&t.nodeType!==9){return[];}if(!D||typeof D!=="string"){return A;}var B=[],C,y,G,F,z,s,r=true,w=o(t);p.lastIndex=0;while((C=p.exec(D))!==null){B.push(C[1]);if(C[2]){s=RegExp.rightContext;break;}}if(B.length>1&&j.exec(D)){if(B.length===2&&f.relative[B[0]]){y=g(B[0]+B[1],t);}else{y=f.relative[B[0]]?[t]:b(B.shift(),t);while(B.length){D=B.shift();if(f.relative[D]){D+=B.shift();}y=g(D,y);}}}else{if(!v&&B.length>1&&t.nodeType===9&&!w&&f.match.ID.test(B[0])&&!f.match.ID.test(B[B.length-1])){var H=b.find(B.shift(),t,w);t=H.expr?b.filter(H.expr,H.set)[0]:H.set[0];}if(t){var H=v?{expr:B.pop(),set:a(v)}:b.find(B.pop(),B.length===1&&(B[0]==="~"||B[0]==="+")&&t.parentNode?t.parentNode:t,w);y=H.expr?b.filter(H.expr,H.set):H.set;if(B.length>0){G=a(y);}else{r=false;}while(B.length){var u=B.pop(),x=u;if(!f.relative[u]){u="";}else{x=B.pop();}if(x==null){x=t;}f.relative[u](G,x,w);}}else{G=B=[];}}if(!G){G=y;}if(!G){throw"Syntax error, unrecognized expression: "+(u||D);}if(d.call(G)==="[object Array]"){if(!r){A.push.apply(A,G);}else{if(t&&t.nodeType===1){for(var E=0;G[E]!=null;E++){if(G[E]&&(G[E]===true||G[E].nodeType===1&&h(t,G[E]))){A.push(y[E]);}}}else{for(var E=0;G[E]!=null;E++){if(G[E]&&G[E].nodeType===1){A.push(y[E]);}}}}}else{a(G,A);}if(s){b(s,e,A,v);b.uniqueSort(A);}return A;};b.uniqueSort=
function(r){if(c){n=false;r.sort(c);if(n){for(var e=1;e<r.length;e++){if(r[e]===r[e-1]){r.splice(e--,1);}}}}};b.matches=
function(e,r){return b(e,null,null,r);};b.find=
function(x,e,y){var w,u;if(!x){return[];}for(var t=0,s=f.order.length;t<s;t++){var v=f.order[t],u;if((u=f.match[v].exec(x))){var r=RegExp.leftContext;if(r.substr(r.length-1)!=="\\"){u[1]=(u[1]||"").replace(/\\/g,"");w=f.find[v](u,e,y);if(w!=null){x=x.replace(f.match[v],"");break;}}}}if(!w){w=e.getElementsByTagName("*");}return{set:w,expr:x};};b.filter=
function(A,z,D,t){var s=A,F=[],x=z,v,e,w=z&&z[0]&&o(z[0]);while(A&&z.length){for(var y in f.filter){if((v=f.match[y].exec(A))!=null){var r=f.filter[y],E,C;e=false;if(x==F){F=[];}if(f.preFilter[y]){v=f.preFilter[y](v,x,D,F,t,w);if(!v){e=E=true;}else{if(v===true){continue;}}}if(v){for(var u=0;(C=x[u])!=null;u++){if(C){E=r(C,v,u,x);var B=t^!!E;if(D&&E!=null){if(B){e=true;}else{x[u]=false;}}else{if(B){F.push(C);e=true;}}}}}if(E!==undefined){if(!D){x=F;}A=A.replace(f.match[y],"");if(!e){return[];}break;}}}if(A==s){if(e==null){throw"Syntax error, unrecognized expression: "+A;}else{break;}}s=A;}return x;};var f=b.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:
function(e){return e.getAttribute("href");}},relative:{"+":
function(x,e,w){var u=typeof e==="string",y=u&&!/\W/.test(e),v=u&&!y;if(y&&!w){e=e.toUpperCase();}for(var t=0,s=x.length,r;t<s;t++){if((r=x[t])){while((r=r.previousSibling)&&r.nodeType!==1){}x[t]=v||r&&r.nodeName===e?r||false:r===e;}}if(v){b.filter(e,x,true);}},">":
function(w,r,x){var u=typeof r==="string";if(u&&!/\W/.test(r)){r=x?r:r.toUpperCase();for(var s=0,e=w.length;s<e;s++){var v=w[s];if(v){var t=v.parentNode;w[s]=t.nodeName===r?t:false;}}}else{for(var s=0,e=w.length;s<e;s++){var v=w[s];if(v){w[s]=u?v.parentNode:v.parentNode===r;}}if(u){b.filter(r,w,true);}}},"":
function(t,r,v){var s=i++,e=q;if(!/\W/.test(r)){var u=r=v?r:r.toUpperCase();e=m;}e("parentNode",r,s,t,u,v);},"~":
function(t,r,v){var s=i++,e=q;if(typeof r==="string"&&!/\W/.test(r)){var u=r=v?r:r.toUpperCase();e=m;}e("previousSibling",r,s,t,u,v);}},find:{ID:
function(r,s,t){if(typeof s.getElementById!=="undefined"&&!t){var e=s.getElementById(r[1]);return e?[e]:[];}},NAME:
function(s,v,w){if(typeof v.getElementsByName!=="undefined"){var r=[],u=v.getElementsByName(s[1]);for(var t=0,e=u.length;t<e;t++){if(u[t].getAttribute("name")===s[1]){r.push(u[t]);}}return r.length===0?null:r;}},TAG:
function(e,r){return r.getElementsByTagName(e[1]);}},preFilter:{CLASS:
function(t,r,s,e,w,x){t=" "+t[1].replace(/\\/g,"")+" ";if(x){return t;}for(var u=0,v;(v=r[u])!=null;u++){if(v){if(w^(v.className&&(" "+v.className+" ").indexOf(t)>=0)){if(!s){e.push(v);}}else{if(s){r[u]=false;}}}}return false;},ID:
function(e){return e[1].replace(/\\/g,"");},TAG:
function(r,e){for(var s=0;e[s]===false;s++){}return e[s]&&o(e[s])?r[1]:r[1].toUpperCase();},CHILD:
function(e){if(e[1]=="nth"){var r=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(e[2]=="even"&&"2n"||e[2]=="odd"&&"2n+1"||!/\D/.test(e[2])&&"0n+"+e[2]||e[2]);e[2]=(r[1]+(r[2]||1))-0;e[3]=r[3]-0;}e[0]=i++;return e;},ATTR:
function(u,r,s,e,v,w){var t=u[1].replace(/\\/g,"");if(!w&&f.attrMap[t]){u[1]=f.attrMap[t];}if(u[2]==="~="){u[4]=" "+u[4]+" ";}return u;},PSEUDO:
function(u,r,s,e,v){if(u[1]==="not"){if(p.exec(u[3]).length>1||/^\w/.test(u[3])){u[3]=b(u[3],null,null,r);}else{var t=b.filter(u[3],r,s,true^v);if(!s){e.push.apply(e,t);}return false;}}else{if(f.match.POS.test(u[0])||f.match.CHILD.test(u[0])){return true;}}return u;},POS:
function(e){e.unshift(true);return e;}},filters:{enabled:
function(e){return e.disabled===false&&e.type!=="hidden";},disabled:
function(e){return e.disabled===true;},checked:
function(e){return e.checked===true;},selected:
function(e){e.parentNode.selectedIndex;return e.selected===true;},parent:
function(e){return !!e.firstChild;},empty:
function(e){return !e.firstChild;},has:
function(s,r,e){return !!b(e[3],s).length;},header:
function(e){return/h\d/i.test(e.nodeName);},text:
function(e){return"text"===e.type;},radio:
function(e){return"radio"===e.type;},checkbox:
function(e){return"checkbox"===e.type;},file:
function(e){return"file"===e.type;},password:
function(e){return"password"===e.type;},submit:
function(e){return"submit"===e.type;},image:
function(e){return"image"===e.type;},reset:
function(e){return"reset"===e.type;},button:
function(e){return"button"===e.type||e.nodeName.toUpperCase()==="BUTTON";},input:
function(e){return/input|select|textarea|button/i.test(e.nodeName);}},setFilters:{first:
function(r,e){return e===0;},last:
function(s,r,e,t){return r===t.length-1;},even:
function(r,e){return e%2===0;},odd:
function(r,e){return e%2===1;},lt:
function(s,r,e){return r<e[3]-0;},gt:
function(s,r,e){return r>e[3]-0;},nth:
function(s,r,e){return e[3]-0==r;},eq:
function(s,r,e){return e[3]-0==r;}},filter:{PSEUDO:
function(w,s,t,x){var r=s[1],u=f.filters[r];if(u){return u(w,t,s,x);}else{if(r==="contains"){return(w.textContent||w.innerText||"").indexOf(s[3])>=0;}else{if(r==="not"){var v=s[3];for(var t=0,e=v.length;t<e;t++){if(v[t]===w){return false;}}return true;}}}},CHILD:
function(e,t){var w=t[1],r=e;switch(w){case"only":case"first":while((r=r.previousSibling)){if(r.nodeType===1){return false;}}if(w=="first"){return true;}r=e;case"last":while((r=r.nextSibling)){if(r.nodeType===1){return false;}}return true;case"nth":var s=t[2],z=t[3];if(s==1&&z==0){return true;}var v=t[0],y=e.parentNode;if(y&&(y.sizcache!==v||!e.nodeIndex)){var u=0;for(r=y.firstChild;r;r=r.nextSibling){if(r.nodeType===1){r.nodeIndex=++u;}}y.sizcache=v;}var x=e.nodeIndex-z;if(s==0){return x==0;}else{return(x%s==0&&x/s>=0);}}},ID:
function(r,e){return r.nodeType===1&&r.getAttribute("id")===e;},TAG:
function(r,e){return(e==="*"&&r.nodeType===1)||r.nodeName===e;},CLASS:
function(r,e){return(" "+(r.className||r.getAttribute("class"))+" ").indexOf(e)>-1;},ATTR:
function(v,t){var s=t[1],e=f.attrHandle[s]?f.attrHandle[s](v):v[s]!=null?v[s]:v.getAttribute(s),w=e+"",u=t[2],r=t[4];return e==null?u==="!=":u==="="?w===r:u==="*="?w.indexOf(r)>=0:u==="~="?(" "+w+" ").indexOf(r)>=0:!r?w&&e!==false:u==="!="?w!=r:u==="^="?w.indexOf(r)===0:u==="$="?w.substr(w.length-r.length)===r:u==="|="?w===r||w.substr(0,r.length+1)===r+"-":false;},POS:
function(u,r,s,v){var e=r[2],t=f.setFilters[e];if(t){return t(u,s,r,v);}}}};var j=f.match.POS;for(var l in f.match){f.match[l]=new RegExp(f.match[l].source+/(?![^\[]*\])(?![^\(]*\))/.source);}var a=
function(r,e){r=Array.prototype.slice.call(r,0);if(e){e.push.apply(e,r);return e;}return r;};try{Array.prototype.slice.call(document.documentElement.childNodes,0);}catch(k){a=
function(u,t){var r=t||[];if(d.call(u)==="[object Array]"){Array.prototype.push.apply(r,u);}else{if(typeof u.length==="number"){for(var s=0,e=u.length;s<e;s++){r.push(u[s]);}}else{for(var s=0;u[s];s++){r.push(u[s]);}}}return r;};}var c;if(document.documentElement.compareDocumentPosition){c=
function(r,e){var s=r.compareDocumentPosition(e)&4?-1:r===e?0:1;if(s===0){n=true;}return s;};}else{if("sourceIndex" in document.documentElement){c=
function(r,e){var s=r.sourceIndex-e.sourceIndex;if(s===0){n=true;}return s;};}else{if(document.createRange){c=
function(t,r){var s=t.ownerDocument.createRange(),e=r.ownerDocument.createRange();s.selectNode(t);s.collapse(true);e.selectNode(r);e.collapse(true);var u=s.compareBoundaryPoints(Range.START_TO_END,e);if(u===0){n=true;}return u;};}}}(
function(){var r=document.createElement("div"),s="script"+(new Date).getTime();r.innerHTML="<a name='"+s+"'/>";var e=document.documentElement;e.insertBefore(r,e.firstChild);if(!!document.getElementById(s)){f.find.ID=
function(u,v,w){if(typeof v.getElementById!=="undefined"&&!w){var t=v.getElementById(u[1]);return t?t.id===u[1]||typeof t.getAttributeNode!=="undefined"&&t.getAttributeNode("id").nodeValue===u[1]?[t]:undefined:[];}};f.filter.ID=
function(v,t){var u=typeof v.getAttributeNode!=="undefined"&&v.getAttributeNode("id");return v.nodeType===1&&u&&u.nodeValue===t;};}e.removeChild(r);e=r=null;})();(
function(){var e=document.createElement("div");e.appendChild(document.createComment(""));if(e.getElementsByTagName("*").length>0){f.find.TAG=
function(r,v){var u=v.getElementsByTagName(r[1]);if(r[1]==="*"){var t=[];for(var s=0;u[s];s++){if(u[s].nodeType===1){t.push(u[s]);}}u=t;}return u;};}e.innerHTML="<a href='#'></a>";if(e.firstChild&&typeof e.firstChild.getAttribute!=="undefined"&&e.firstChild.getAttribute("href")!=="#"){f.attrHandle.href=
function(r){return r.getAttribute("href",2);};}e=null;})();if(document.querySelectorAll){(
function(){var e=b,s=document.createElement("div");s.innerHTML="<p class='TEST'></p>";if(s.querySelectorAll&&s.querySelectorAll(".TEST").length===0){return;}b=
function(w,v,t,u){v=v||document;if(!u&&v.nodeType===9&&!o(v)){try{return a(v.querySelectorAll(w),t);}catch(x){}}return e(w,v,t,u);};for(var r in e){b[r]=e[r];}s=null;})();}if(document.getElementsByClassName&&document.documentElement.getElementsByClassName){(
function(){var e=document.createElement("div");e.innerHTML="<div class='test e'></div><div class='test'></div>";if(e.getElementsByClassName("e").length===0){return;}e.lastChild.className="e";if(e.getElementsByClassName("e").length===1){return;}f.order.splice(1,0,"CLASS");f.find.CLASS=
function(r,s,t){if(typeof s.getElementsByClassName!=="undefined"&&!t){return s.getElementsByClassName(r[1]);}};e=null;})();}
function m(r,w,v,A,x,z){var y=r=="previousSibling"&&!z;for(var t=0,s=A.length;t<s;t++){var e=A[t];if(e){if(y&&e.nodeType===1){e.sizcache=v;e.sizset=t;}e=e[r];var u=false;while(e){if(e.sizcache===v){u=A[e.sizset];break;}if(e.nodeType===1&&!z){e.sizcache=v;e.sizset=t;}if(e.nodeName===w){u=e;break;}e=e[r];}A[t]=u;}}}
function q(r,w,v,A,x,z){var y=r=="previousSibling"&&!z;for(var t=0,s=A.length;t<s;t++){var e=A[t];if(e){if(y&&e.nodeType===1){e.sizcache=v;e.sizset=t;}e=e[r];var u=false;while(e){if(e.sizcache===v){u=A[e.sizset];break;}if(e.nodeType===1){if(!z){e.sizcache=v;e.sizset=t;}if(typeof w!=="string"){if(e===w){u=true;break;}}else{if(b.filter(w,[e]).length>0){u=e;break;}}}e=e[r];}A[t]=u;}}}var h=document.compareDocumentPosition?
function(r,e){return r.compareDocumentPosition(e)&16;}:
function(r,e){return r!==e&&(r.contains?r.contains(e):true);};var o=
function(e){return e.nodeType===9&&e.documentElement.nodeName!=="HTML"||!!e.ownerDocument&&e.ownerDocument.documentElement.nodeName!=="HTML";};var g=
function(e,x){var t=[],u="",v,s=x.nodeType?[x]:x;while((v=f.match.PSEUDO.exec(e))){u+=v[0];e=e.replace(f.match.PSEUDO,"");}e=f.relative[e]?e+"*":e;for(var w=0,r=s.length;w<r;w++){b(e,s[w],t);}return b.filter(u,t);};window.Sizzle=window.wee.sizzle=b;})();
//////////////////////////////////////////////////////////////////////////////////////////////////////
