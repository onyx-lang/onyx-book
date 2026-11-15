# Optional
Optional types in Onyx represent something that may or may not contain a value.
They are simply written as `? T`, where `T` is the type that the optional may contain.
> You may wonder why its written as `? T` instead of `T?`. This is to prevent ambiguity. For example,
> if you see `[] T?`, is this an optional slice of `T` (`([] T)?`)? or a slice of optional `T` (`[] (T?)`)? To avoid this problem
> the optional specifier is placed in the same place as the pointer/slice/etc. specifiers.

Internally, Optional types are simply defined as a polymorphic union called `Optional` in the `builtin` package.
They are just given the special `? T` syntax to mean `Optional(T)`. These are equivalent.

## Using Optionals

Optionals have been designed to be used ergonomically within your codebase, without much overhead.

Here is an incorrect example of function that gets the last element of an array.
It is incorrect because it does not correctly handle the case where the array is empty.

```onyx
array_last :: (arr: [] $T) -> T {
    return arr[arr.count - 1];
}

array_last(.[1, 2, 3]) // returns 3
array_last(.[])        // undefined behavior
```

The only change we need to make to make this correct, all we need to change is the return type to `? T`, and add a check for an empty array.
The correct code would look like so.

```onyx
array_last :: (arr: [] $T) -> ? T {
    // If the array is empty. Equivalent to arr.count == 0
    if !arr {
        // Return an empty instance of ? T, which is a None.
        return .{};
    }

    // This will implicitly cast from a T to a ? T.
    return arr[arr.count - 1];
}

array_last(.[1, 2, 3]); // returns Some(3)
array_last(.[]);        // returns None
```

If we wanted to get the value stored in an optional, we have a couple of options. We could,
- Use one of the builtin methods on `Optional`, like `unwrap`, `value_or`, or `or_else`.
- Use the try operator (`?`) force getting the value, or returning `.{}` from the nearest block.
- Use the coalesce operator (`??`).
- Use a `switch` statement with a capture
- Use `if` or `while` with `as` to bind the inner value

```onyx
// `o` is an optional i32.
o: ? i32 = 123;

v1 := o->unwrap();         // Cause an assertion failure if it doesn't exist
v2 := o->value_or(0);      // Provide a default value
v3 := o->or_else(() => 0); // Provide a default value, wrapped in a function

v4 := o?;     // If no value exists, execute `return .{}`;
v5 := o ?? 0; // Equivalent to `->value_or(0)`;

switch o {
    case .None {
        // No value
    }

    case .Some as v6 {
        // v6 is the value
    }
}

// `as &name` binds a pointer into the payload.
switch o {
    case .Some as &p {
        *p = 0;
    }

    case .None ---
}
```

## Extracting in `if` and `while`

`if expr as name` tests a `? T` and, when a value is present, binds that value for the body. `as &name` binds a pointer into the payload instead. The binding is in scope in both branches, including `elseif`. In the `else` branch the pointer form is `null`. The same two forms work on `while`. See also [`if`](../control_flow/ifs.md).

```onyx
if result as v {
    println(v);
}

if result as &f {
    f.x = "mutated";
} else {
    // f is null
}

while next() as item {
    println(item);
}
```