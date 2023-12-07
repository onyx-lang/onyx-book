# Pipe operator

The pipe (`|>`) operator is used as syntactic sugar when you want the result of one procedure call to be passed as the first argument to another another call.
This might sound contrived, but with a well-designed API it can happen often.

The pipe operator transform the code as follows:
```
x |> f(y)    into     f(x, y)
```
As you can see, it simply takes the left hand side, and passes it as the *first* argument to the procedure call.
The operator is left-associative, which simply means the parentheses are automatically inserted to all for correct chaining of pipes.

Look at this simple API for doing (very simple) computations.
On the first line of `main`, there is an example of using this API with nested function calls.
On the second line, there is the equivalent code written using the pipe operator.
```onyx
add :: (x: i32, y: i32) -> i32 {
    return x + y;
}

negate :: (x: i32) -> i32 {
    return -x;
}

double :: (x: i32) -> i32 {
    return x * 2;
}

main :: () {
    println(double(add(negate(-5), 4)));

    -5 |> negate() |> add(4) |> double() |> println();
}
```

## Iterators and Pipe

The `core.iter` package in Onyx uses the pipe operator heavily.
The package is designed in a way for the `Iterator` transformation
functions to be easily chained.

For example, say you wanted to find the first 5 odd numbers greater
than 100, you could write the following iterator.

```onyx
my_numbers :=
    iter.as_iter(0 .. 100000)        // Convert the range to an iterator.
    |> iter.skip_while(x => x < 100) // Skip numbers less than 100.
    |> iter.filter(x => x % 2 == 1)  // Filter for only odd numbers.
    |> iter.take(5)                  // Only take the first 5 things.
    |> iter.collect();               // Collect the results as an array.
```

This is contrived example, but it shows how composable the `iter` package
is, thanks to the pipe operator.
