# Literals
## Boolean Literals
Onyx contains the standard boolean literals: `true` and `false`.  They must be spelled all-lowercase as they are actually just global symbols. This means if you are feeling particularly evil, you could change what `true` and `false` mean in a particular scope, but I *highly* recommend you don't.

## Numeric Literals
Onyx contains the following numeric literals:
```onyx
123          // Standard integers
0x10         // Hexadecimal integers

4.0          // Floating point
2.3f         // Floating point, of type f32.

'a'          // Character literals, of type u8
#char "a"    // Alternative character literals
```
Integer literals are special in that they are "un-typed" until they are used. When used, they will become whatever type is needed, provided that there is not loss of precision when converting.
Here are some examples,
```onyx

x: i8 = 10;
y := x + 100;  // 100 will be of type i8, and that is okay because
			   // 100 is in the range of 2's-complement signed
			   // 8-bit numbers.


x: i8 = 10;
y := x + 1000; // This will not work, as 1000 does not fit into
			   // an 8-bit number. This will result in a compile
			   // time error.

x: f32 = 10.0f;
y := x + 100;  // 100 will be of type f32. This will work, as 100
			   // fits into the mantissa of a 32-bit floating
			   // point number, meaning that there is no loss
			   // of percision.
```

## Character Literals
There are two ways to write a character literal in Onyx:
```onyx
'a'
#char "a"
```
> **Note**, Onyx used to only have `#char "a"` because the single-quotation character was being reserved for some other use. That other use did not appear in 3 years of development, so the single-quotation was given up to serve as a character literal.

## String Literals
Onyx contains the following string-like literals:
```onyx
"Hello!"       // Standard string literals, of type 'str'.

#cstr "World"  // C-String literals, of type 'cstr'.

"""            // A multi-line string literal, of type 'str'.
Multi          // Note that the data for the multi-line literal
line           // starts right after the third quote, so technically
string         // all of these "comments" would actually be part of the
literal        // literal.
"""
```
In Onyx, there are 3 string types, `str`, `cstr`, `dyn_str`. `cstr` is analogous to a `char *` in C. It is a string represented as a pointer to an array of bytes, that is expected to end in a `'\0'` byte. For compatibility with some C libraries, Onyx also has this type.

Most Onyx programs solely use `str`, as it is safer and more useful. A `str` is implemented as a 2 element structure, with a pointer to the `data`, and an integer `count`. This is safer, as a null-terminator is not necessary, so a buffer-overflow is much harder. To convert a `cstr` to `str`, use
`string.from_cstr`.

`dyn_str`, or *dynamic string*, is a string type that allows for modifying the string by appending to it. It is implemented as a dynamic array of `u8`, so any array function will work with it. To make more idiomatic and readable code, the `core.string` package also has functions for working with dynamic strings, such as [`append`](https://docs.onyxlang.io/packages/core.string#append) and [`insert`](https://docs.onyxlang.io/packages/core.string#insert).

## Built-in constants
```onyx
null           // Represents an empty pointer
null_proc      // Represents an empty function pointer
```
You may be wondering why there is a separate value for an empty function pointer. This is due to the securer runtime of Onyx over C. In WebAssembly (Onyx's compile target), functions are completely separated from data. Function references are not pointers, they are indices. For this reason, there are two different values that represent "nothing" for their respective contexts.
