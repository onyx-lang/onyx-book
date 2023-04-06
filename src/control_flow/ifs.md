# If

`if` statements allow the programmer to optionally execute a block of code, if a condition is met.

`if`-statements in Onyx are written like this:
```onyx
if condition {
	println("The condition was true!");
}
```
Notice that there does not need to be parentheses around the condition. One thing to note is that the syntax for an `else`-`if` chain uses the keyword `elseif`, not `else if`.
```onyx
if x >= 100 {
	println("x is greater than 100");
} elseif x >= 10 {
	println("x is greater than 10");
} else {
	println("x is not special.");
}
```

## Initializers
`if`-statements can also have an *initializer*, which is a statement that appears before the condition. They allow you to declare variables that are only available in the scope of the `if`-statement, or any of the `else`  blocks.
```onyx
can_error :: () -> (i32, bool) ---

if value, errored := can_error(); !errored {
	printf("The value was {}!\n", value);
}

// value is not visible here.
```

