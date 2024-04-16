# #if

`#if` is a *compile-time* if statement. It looks like a normal if
statement, except its condition must be resolvable at compile-time.
This is because it controls whether or not the body of the `#if`
statement are included in the compilation.

Static-ifs can be used inside and outside of procedures.

## Outside of Procedures

When outside of a procedure, static-ifs can be used to control whether
or not certain symbols are defined in the current compilation.

```onyx
DEBUG_MODE :: true

#if DEBUG_MODE {
	// This procedure is only defined if DEBUG_MODE is true
	debug_only_procedure :: () {
		// ...
	}
} else {
	// This procedure is only defined if DEBUG_MODE is false
	not_a_debug_procedure :: () {
		
	}
}
```

Static-ifs can contain any top-level "thing" in the language: procedures, structures,
unions, and even `#load` directives. Using this feature, you can optionally
include files depending on a condition.

```onyx
USE_EXTENSIONS :: false
MINIMUM_EXTENSION_VERSION :: 5

#if USE_EXTENSIONS && MINIMUM_EXTENSION_VERSION >= 3 {
	#load "./extensions/v3"
}
```

## Inside of procedures

When inside a procedure, static-ifs can contain statements that will only be
included if the static-if resolves to be `true`.

```onyx
DEBUG_MODE :: true

draw :: () {
	#if DEBUG_MODE {
		draw_debug_ui();
	}

	// ...
}
```

## Other uses

See the [`#defined`](./defined.md) documentation for more uses of static-if statements.
