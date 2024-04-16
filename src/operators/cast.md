# Cast operators

When two values are not of the same type, one will need to be *casted* to the other's type.
In Onyx, the `cast` keyword is used. It takes on the following two forms described below.

## Prefix form
```onyx
main :: () {
    x: i32 = 10;
    y: f32 = 20.0f;

    // Cast x to be a f32 so it can be added with y.
    result := cast(f32) x + y;

    println(result);
}
```

Here, a cast is needed to turn `x` into a `f32` so it can be added with `y`.
This cast is in prefix form, which simply means it appears as a *prefix* to the thing being casted, similar to unary negation (`-`).


## Call form

```onyx
BaseType :: struct {
    name: str;
}

SubType :: struct {
    use base: BaseType;

    age: u32;
}

main :: () {
    sub_value := SubType.{
        age = 123
    };

    base_ptr: &BaseType = &sub_value;
    
    age_value := cast(&SubType, base_ptr).age;
    println(age_value);
}
```

In this contrived example, `base_ptr` is casted to a `&SubType` using the the *call* form of the cast operator.
This form is slightly nicer when you are going to immediately to follow the cast operation with a postfix operation.
In this case, `.age`.
If this was written in prefix form, another set of parentheses would be needed: `(cast(&SubType) base_ptr).age`.


## Auto casting

Sometimes, a cast is necessary for the code to type check, but it is cumbersome to type the entire cast operation.
Maybe the type is too long, or maybe the type is not even available because the package is not used.
In these cases, the *auto-cast* operator can be used.

Auto-cast is written with a double-tilde (`~~`).
This was chosen because there would be no purpose to performing a bitwise negation (`~`) twice in a row.

To understand auto-cast, treat it like it was a `cast(X)`, and the `X` is automatically figured out by the compiler.
If the auto-cast is not possible, a compile-time error will be reported.

```onyx
print_float :: (x: f32) {
    printf("{}\n", x);
}

main :: () {
    x := 10;

    // Automatically cast x to an f32, since y is an f32.
    y: f32 = ~~ x;

    // Automatically cast x to an f32, since print_float expects an f32.
    print_float(~~ x);
}
```

## No "magic" casts

Onyx does not have "special" or "magic" casts between two completely unrelated types, such as strings and numbers.
Instead, `conv.parse` and `tprintf` should be used.

```onyx
main :: () {
    x := 10;

    // Equivalent to `cast(str)` in some other languages
    x_str := tprintf("{}", x);

    // conv.parse parses a string into the type provided, and returns
    // an optional of that type. So, a default must be provided using ??.
    x_val := conv.parse(i32, x_str) ?? 0;
}
```
