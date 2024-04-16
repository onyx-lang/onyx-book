# Procedure calls

Calling a procedures use the traditional postfix `()` operator.
Simply place `()` after the procedure you would like to call.

```onyx
// This is discussed in chapter 6, Procedures.
foo :: () -> void {
    // ...
}

main :: () -> void {
    // Using () to call foo.
    foo();
}
```

## Passing Arguments

Arguments are passed in between the `()`, in a comma-separated fashion.
The type of each argument must agree with the expected parameter type, or at least be of compatible type.

```onyx
foo :: (x: i32, y: str) -> void {
    // ...
}

main :: () -> void {
    foo(10, "Hello");
}
```

## Named Arguments

Somes it is nicer for clarity to explicitly name the arguments being passed.
This can be done by specifying the name, then an `=`, then the value.
This specifies that the argument is for the parameter with the same name.

```onyx
foo :: (x: i32, y: str) -> void {
    // ...
}

main :: () -> void {
    foo(x = 10, y = "Hello");
}
```

When the arguments are named, their order can be changed.

```onyx
foo :: (x: i32, y: str) -> void {
    // ...
}

main :: () -> void {
    // The order does not matter here.
    foo(y = "Hello", x = 10);
}
```

Named arguments are particularly useful when there are a lot of parameters with default values, and you want to modify a small number of them.

```onyx
// This is a simple example of many defaulted arguments
foo :: (option_1 := true, option_2 := "./tmp", option_3 := 4) -> void {
    // ...
}

main :: () -> void {
    // Override a small number of the default values.
    foo(
        option_2 = "/something_else",
        option_3 = 8
    );
}
```

