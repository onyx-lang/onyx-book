# #init

`#init` allows you to define procedures that run *before* the `main` in your program.
This allows you to do simple set ups and initialization before `main` is reached.

`#init` must be followed by a compile-time known procedure with the type signature, `() -> void`.
```onyx
#init () {
	println("In #init procedure!");
}

main :: () {
	println("In main!");
}

// Output:
// In #init procedure!
// In main!
```

You are guaranteed that the runtime has been fully initialized before any `#init`
procedure is invoked. This way, you know that printing and heap allocations will
work from `#init` procedures.

## Ordering with `#after`

The order of `#init` procedure is undefined and unstable if you change your program.
However, by using the `#after` directive, you can specify a dependency of an `#init`
procedure that is guaranteed to be executed before the procedure in question.

```onyx
global_map: Map(str, i32);

// Bind the #init statement to a symbol.
prepare_map :: #init () {
	global_map = make(Map(str, i32));
}

populate_map :: #init #after prepare_map () {
	global_map->put("A", 1);
	global_map->put("B", 2);
	global_map->put("C", 3);
}
```

In this example, `prepare_map` is guaranteed to be run before `populate_map` because
of the `#after` directive on `populate_map`.

You can specify as many `#after` directives as you want on a single `#init` procedure.
```onyx
#init
	#after A
	#after B
	#after C
() {
	// ...
}
```

In this example, the `#init` procedures `A`, `B` and `C` will be run before this `#init` procedure.

