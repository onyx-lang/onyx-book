# Procedure types
Procedure types represent the type of a procedure. They are used when passing a procedure as an argument, or storing a procedure in a variable or structure member. They are written very similar to procedures, except they must have a return type, even if it is void.
```onyx
map :: (x: i32, f: (i32) -> i32) -> i32 {
	return f(x);
}

// Explicit version of a procedure
println(map(10, (value: i32) -> i32 {
	return value * 2;
}));
```

Using procedure types for parameters enables quick procedures to be passed.
```onyx
map :: (x: i32, f: (i32) -> i32) -> i32 {
	return f(x);
}

// Quick version of a procedure
// Because 'map' provides the type of the argument
// and return value, this quick procedure can be passed.
println(map(10, x => x * 2));
```

As a convenience, procedure types can optionally have argument names to clarify what each argument is.
```onyx
handle_player_moved: (x: i32, y: i32, z: i32) -> void

// Elsewhere in the code base.
handle_player_moved = (x, y, z) => {
	println("Player moved to {} {} {}\n", x, y, z);
}

handle_player_moved(10, 20, 30);
```

