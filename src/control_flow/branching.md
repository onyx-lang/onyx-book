# Branching
The following keywords can be used to branch form a block of code early.

## `break`
`break` can be used to jump execution to after the body of the enclosing loop.
```onyx
// Prints 0 to 5.
for 0 .. 10 {
	println(it);
	if it == 5 do break;
}
```

## `continue`
`continue` can be used to jump execution to the condition of the enclosing loop.
```onyx
// Prints 5 to 9.
for 0 .. 10 {
	if it < 5 do continue;
	println(it);
}
```

## `fallthrough`
`fallthough` is discussed in the [`switch` statement](./switch.md) section.

## `return`
`return` is used to end execution of the current procedure. It is also used to provide return values.
```onyx
fact :: (n: i32) -> i32 {
	if n <= 1 do return 1;   // Early return
	return fact(n - 1) * n;  // Providing result
}
```

