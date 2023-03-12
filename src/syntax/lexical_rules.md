# Lexical Rules
Onyx shares many lexical/syntactic elements with [Odin](https://odin-lang.org), and Jai (unreleased at time of writing). When I first started creating Onyx, I did not know the syntax I wanted so I started with something similar to those languages. After programming with it for a while, I fell in love with the syntax and it stuck. All credit for much of the syntactic consistency goes to Jai, with Odin as secondary inspiration.

### Comments
Onyx has two comment types, very similar to another C-like languages. Unlike C, Onyx supports nested multi-line comments, which makes quickly commenting a large block of code easier, as you do not have to worry about a multi-line comment in the commented section.
```onyx
// A single line comment

/*
	A multi-line comment
*/

/*
	/*
		A nested multi-line comment
	*/
*/
```

### Keywords
A complete list of Onyx's keywords:
```onyx
package struct    enum        use
if      else      elseif      defer
while   for       do          switch case
break   continue  fallthrough return
sizeof  alignof   typeof      cast
macro   interface where

global (deprecated)
```

### Directives
In order to reduce the number of keywords in the language, Onyx uses *directives*, which are symbols with a `#` in front of them. They serve as keywords, without cluttering the list of reserved words. Some examples of directives are:
```onyx
#load    #load_all   #load_path
#quote   #match      #foreign
#library #export     #auto
```
There are too many directives to list here, and listing them does not help anyone. Most directives appear only in one specific place, and are not valid anywhere else in the code.

### Whitespace
Onyx is largely white-space agnostic. White-space is only needed to separate keywords and symbols. Onyx does not care about spaces vs tabs. That being said, most code written in Onyx uses 4 spaces per indentation level.

### Semi-colons
Onyx uses semi-colons to delineate between statements; Because Onyx is white-space agnostic, something is needed to separate statements. There is potential for adding *implicit semi-colons* where appropriate, but that is not under active development.

### Symbols
Symbols in Onyx start with an alphabetic character or an underscore (`_`), followed by 0 or more alphanumeric characters or underscores. They can be described using the following regular expression:
```regex 
[a-zA-Z_][a-zA-Z0-9_]*
```
