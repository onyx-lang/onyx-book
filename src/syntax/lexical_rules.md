# Lexical Rules
Onyx shares many lexical/syntactic elements with [Odin](https://odin-lang.org), and Jai (unreleased at time of writing). When I first started creating Onyx, I did not know the syntax I wanted so I started with something similar to those languages. After programming with it for a while, I fell in love with the syntax and it stuck. All credit for much of the syntactic consistency goes to Jai, with Odin as secondary inspiration.

### Comments
Onyx has two comment types, very similar to other C-like languages. Unlike C, Onyx supports nested multi-line comments, which makes quickly commenting a large block of code easier, as you do not have to worry about a multi-line comment in the commented section. A line that starts with `///` is a [documentation comment](../directives/docs.md), not an ordinary comment.
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
package struct    enum        union  use
if      else      elseif      defer
while   for       do          switch case
break   continue  fallthrough return
sizeof  alignof   typeof      cast
macro   interface where       in     as
global
```

`global` declares a WebAssembly global. `name :: global T` creates a global of type `T`. It is rarely written by hand.

### Directives
In order to reduce the number of keywords in the language, Onyx uses *directives*, which are symbols with a `#` in front of them. They serve as keywords, without cluttering the list of reserved words. Some examples of directives are:
```onyx
#load    #load_recursive  #library_path
#size    #match           #foreign
#library #export          #distinct
```
There are too many directives to list here, and listing them does not help anyone. Most directives appear only in one specific place, and are not valid anywhere else in the code.

### Whitespace
Onyx is largely white-space agnostic. White-space is only needed to separate keywords and symbols. Onyx does not care about spaces vs tabs. That being said, most code written in Onyx uses 4 spaces per indentation level.

### Semi-colons
Onyx is whitespace agnostic, so statements are separated by semicolons. The compiler inserts a semicolon at a newline when the previous token can end a statement: a name, a literal, `return`, `break`, `continue`, `fallthrough`, `)`, `}`, `]`, `?`, or `!`. An explicit semicolon is still accepted. These two programs are the same.

```onyx
x := 10
println(x)
```

```onyx
x := 10;
println(x);
```

`--feature optional-semicolons`, and a `//+optional-semicolons` comment on the first line of a file, turn on the same insertion. Insertion is already the default, so neither is needed.

### Symbols
Symbols in Onyx start with an alphabetic character or an underscore (`_`), followed by 0 or more alphanumeric characters or underscores. They can be described using the following regular expression:
```regex 
[a-zA-Z_][a-zA-Z0-9_]*
```
