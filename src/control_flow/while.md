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

 `while expr as name` and `while expr as &name` extract an optional the same way [`if`](./ifs.md) does. This can be used for a generic "iterable" pattern, where anything that return `? T` can be treated as an iterator.
```onyx
num_iterator := Iterator.from(1 .. 10)

// `Iterator.next` returns a `? i32`
while Iterator.next(num_iterator) as num {
    println(num)
}

// Using a closure to store internal state
counter :: (start, end: $T, incr: T = 1) -> () -> ? T {
    value := start
    return () use () -> ? T {
        if value >= end do return .None
        defer value += incr
        return value
    }
}

c := counter(1, 10)
while c() as num {
    println(num)
}
```
