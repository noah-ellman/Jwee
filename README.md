# Jwee Javascript Framework

[https://www.jwee.org]

[https://www.noahellman.org]

## This project has become depreciated

JWee is a new JavaScript Toolkit that is rich in features, yet slim and intuitive - ridiculously fast and efficient, and allows you to keep your freedom to code the way you want to, and the way JavaScript intended.

Jwee has been built for performance, and aims to provide the developer with the features and shortcuts that are really useful - sans the fluff and inefficiencies. Jwee cares about being easy on the browser, because a stressed browser equals a stressed user.

Jwee's design has been influenced by Prototype and by jQuery. To build Jwee, we took our own innovations and the inspirations from other frameworks and fused it all together, renovating every line of code for perfection. The result is a lean and mean framework redeux + major energy drinks.


To help you get started, here is an overview of the fundamentals. To work with any javascript framework, including jwee, it is required that you at the very least have a beginners knowledge of the javascript language.

For introductions to the Javascript langauge, try searching google for now.

If you have used another framework in the past, or if you are experienced with the javascript language, you will most likely find jwee very easy to understand and use.

If you are familiar with jQuery
Then know that jQuery() is just like jwee() in its use for selecting elements by ID. $() is an easier to type alias for jwee().
However, unlike jQuery, in jwee element methods are part of the elements themselves, and not part of jwee object.
If you are familiar with Prototype
Jwee also installs magic methods to DOM elements.
Jwee also extends the native objects, like String and Array with additional methods.
In Jwee you can use $() for getting an element by ID.
Key things to know

The Jwee object is window.jwee, or simply jwee.
jwee itself also contains some uncatagorized functions
jwee.dom contains functions for accessing DOM elements and properties
jwee.ua contains user agent information
jwee.cookie contains cookie related functions
jwee is a function itself (see below)
For convience sake, many of the commonly used functions have global aliases.
$ is an alias for jwee
$() is the same as jwee() and jwee.dom.id()
Dom is the same as jwee.dom
Elem is the same as jwee.elem
UA is the same as jwee.ua
There are others, but this is a start
Accessing elements

Lets say we have a <DIV> with the id of "foo".
```
<div id="foo">  
Hello World.  
</div>  
```
To access this <DIV> in code, we use the $, which is just like getElementById.

var myDiv = $('foo');  
Note - It is important to note that $ returns the actual DOM element (not a psuedo-element framework object).

The $ function ensures that the element is also enhanced with additional magic methods. For a complete reference to these methods, see here. For example:
```
$("foo").update("Goodbye World"); 
```
// The text in the DIV will change to the text above  
Accessing elements with CSS selectors

You can get an array of elements matching a given CSS query using Dom.select(). Only use $() for getting by ID. The framework, jQuery, combines all forms of querying into the $() function, but jwee does not.  Why?

```
Dom.select("input");   // All input form items  
Dom.select("#foo a");   // All links within the element with id="foo"  
  
var elements = Dom.select("div.hidden")   // All div elements that are the CSS class "hidden"  
elements.each( function() {  
    this.removeClass("hidden");   
} );  
  
// The above line removes the class "hidden" from all DIV's which have it.  

```
