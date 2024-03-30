# Range operator

Ranges in Onyx represent an interval of numbers and are typically used in `for`-loops
and for creating slices of a buffer.

The `x .. y` binary operator makes a half-open range, representing the set `[x, y)`.
For example, the range `1 .. 5` represents a range including 1, 2, 3, and 4, but not 5.

The `x ..= y` binary operator makes a fully-closed range, representing the set `[x, y]`.
For example, the range `1 ..= 5` represents a range including 1, 2, 3, 4, *and* 5.

The type of these ranges will either be `range` or `range64`, depending if `x` and `y`
were 32-bit integers or 64-bit integers.

## For loop over integers

For-loops support iterating over a range.
```onyx
// Prints 1 to 10
for x in 1 ..= 10 {
    println(x);
}
```

## Creating a slice

When you have a buffer of data, you can create a slice out of the data by subscripting
it with something of type `range`. It could be a range literal, or any other value
of type `range`.

```onyx
buf: [1024] u8;
bytes_read := read_data(buf);

// Create a slice referencing the underlying buffer.
// (Nothing is copied in this operation.)
data_read := buf[0 .. bytes_read];
```

