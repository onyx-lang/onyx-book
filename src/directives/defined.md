# `#defined`

When a symbol may or may not be defined due to different compilation flags,
you can use `#defined` to test whether or not it is actually defined.

`#defined` looks like a procedure with a single argument, which evaluates
at compile-time to a boolean expression.

```onyx
use core {println}

main :: () {
	main_is_defined := #defined(main);  // true
	foo_is_defined  := #defined(foo);   // false
}
```

One useful feature of `#defined` is that you can use it to test if a
package is defined in the program. This way, you can test for optional
extensions in your program, without relying on using the correct flags.
```onyx
#if #defined(package foo) {
	// We know foo is defined, we can write a procedure that uses it
	uses_foo :: () {
		use foo;
		
		foo.bar();
	}
}
```

## Using with `#if`

`#defined` is generally used with [`#if`](./if.md) to conditionally include things
depending on if something else was or was not defined.

As an example, you could have a set of procedures that can be overridden by the end-user
of your library. But if they want to use the defaults, they can be still be defined
automatically. A combination of `#inject`, `#defined`, and `#if` makes this works well.

In the library, you would use `#if` and `#defined` to test if a certain flag was defined.
```onyx
package your_library

// Use predefined procedures if user did not override them.
#if !#defined(CUSTOM_PROCEDURES) {
	do_thing_one :: () { println("Default thing 1!"); }
	do_thing_two :: () { println("Default thing 2!"); }
}
```

Then the consumer of the library can use `#inject` to define the flag and functions if necessary.
```onyx
package main

use your_library

// Override procedures using #inject
#inject your_library {
	CUSTOM_PROCEDURES :: true

	do_thing_one :: () { println("Overridden thing 1!"); }
	do_thing_two :: () { println("Overridden thing 2!"); }
}

main :: () {
	your_library.do_thing_one(); // Overridden thing 1!
	your_library.do_thing_two(); // Overridden thing 2!
}
```

