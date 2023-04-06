# While loops

`while`-statements are very similar to `if`-statements, except when the bottom of the while-loop body is reached, the program re-tests the condition, and will loop if necessary.

`while`-statements have the same syntax as `if`-statements.
```onyx
x := 10;
while x >= 0 {
	println(x);
	x -= 1;
}
```

`while` statements can also have *initializers*, meaning the above code could be rewritten as:
```onyx
while x := 10; x >= 0 {
	println(x);
	x -= 1;
}
```

`while` statements can also have an `else` block after them. The `else` block is executed if the condition for the `while` loop was never true.
```onyx
while false {
	println("Never printed.");
} else {
	println("This will print.");
}
```

