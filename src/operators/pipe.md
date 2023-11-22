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

