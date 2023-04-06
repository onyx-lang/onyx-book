# Return values TODO

Procedures can return 0 or more values. Return types are specified after procedure arguments using an `->`. If multiple return values are desired, the return types have to be enclosed in parentheses. The `return` keyword is used to specify returned values.
```onyx
// A single integer return value.
add :: (x, y: i32) -> i32 {
    return x + y;
}

// Returning 2 integers.
swap :: (x, y: i32) -> (i32, i32) {
    return y, x;
}

z := add(2, 3);

a, b := 10, 20;
a, b = swap(a, b);
```

Note, returned values are passed by value. 