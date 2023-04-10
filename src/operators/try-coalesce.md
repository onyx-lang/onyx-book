# Try/Coalesce operators

Onyx has two special operators that are not given any intrinsic meaning by the compiler.
Their use is entirely defined within the standard library.
They are the try (`?`) and the coalesce (`??`) operator.

## Try operator (`?`)

The try operator is a postfix operator that can occur anywhere in an expression.
Currently, the try operator is only used by the `Optional` and `Result` types.
While not enforced by the compiler, the try operator generally acts as an early escape from a procedure.

For `Optional`, if no value is present, an empty value is returned from the enclosing procedure.

For `Result`, if an error value is present, the result value is returned.

Here is an example of using the try operator on an `Optional`.
```onyx
use core

first :: (arr: [] $T) -> ? T {
    if !arr do return .{};

    return arr[0];
}

double :: (v: $T) -> T {
    return v * 2;
}

compute :: (arr: [] $T) -> ? T {
    v := first(arr)?;
    return double(v);
}

main :: () {
    arr1 := i32.[ 2, 3, 5, 7, 11 ];
    arr2 := i32.[];

    compute(arr1) |> core.println();
    compute(arr2) |> core.println();
}

```

## Coalesce Operator (`??`)

The coalesce operator is a binary operator that returns the right-side value if the left-side is an empty value.
This is defined for `Optional` and `Result` types.

Here is an example of the coalesce operator with `Optional`.

```onyx
use core

first :: (arr: [] $T) -> ? T {
    if !arr do return .{};

    return arr[0];
}

main :: () {
    arr := i32.[];

    v := first(arr) ?? 0;
    core.println(v); // Prints 0
}

```


