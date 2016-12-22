// Use an array just like a function callback!
Array.prototype.call = function() { 
	var args = $a(arguments), len = args.length, scope = len ? args.shift() : null;
	((this[0])[this[1]]).apply(scope||this[0],this.slice(2).concat(args));
};