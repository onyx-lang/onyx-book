# Tagged Unions

Tagged unions in Onyx can be thought of as an `enum`, with every variant having a different type associated with it.
When the tagged union is one variant, it is storing a value of the corresponding type.
A value can only be one of the variants at a time.
They are written using the `union` keyword and look much like structures.

Here is an example of a tagged union.
```onyx
Value :: union {
    // First variant, called Int, stores an i32.
    Int: i32;

    // Second variant, called String, stores a str.
    String: str;

    // Final variant, called Unknown, stores "void", meaning it does not store anything.
    Unknown: void;
}
```
This union has three variants called `Int`, `String`, and `Unknown`.
They store an `i32`, `str` and nothing respectively.
Internally there is also an `enum` made to store these variant tags. You can access it using `Value.tag_enum`.

To create a value out of a union type, it looks like a structure literal, except there must be *exactly one* variant listed by name, with its corresponding value.
```onyx
v1 := Value.{ Int = 123 };
v2 := Value.{ String = "string value" };
v3 := Value.{ Unknown = .{} }; // To spell a value of type 'void', you can use '.{}';
```

We create three values, one for each variant of the union.
To get access to the values inside of the tagged union, we have two options: using a `switch` statement, or using variant access.

We can use `switch` statement over our tagged union value, and use a capture to extract the value stored inside.
```onyx
print_value :: (v: Value) {
    switch v {
        // `n` is the captured value
        // Notice we use `.Integer`. This is short for `Value.tag_enum.Integer`.
        case .Integer as n {
            printf("It's an integer with value {}.\n", n);
        }

        case .String as s {
            printf("It's a string with value {\"}.\n", s);
        }

        // All other cases will be unhandled
        // This is still necessary to satisfy exhaustive matching
        case #default ---
    }
}

print_value(v1);
print_value(v2);
print_value(v3);
```

We can also directly access the variant on the tagged union. This gives us an *optional* of the corresponding type.
If the current variant matched, we get a `Some`. If not, we get a `None`.
```onyx
println(v1.Integer); // prints Some(123)
println(v1.String);  // prints None
```
You can use the features of `Optional`s to work with these results.

## Polymorphic unions
Like structures, unions can be polymorphic and take type parameters.

A good example is the `Result` type from the standard library.
It is defined as:
```onyx
Result :: union (Ok_Type: type_expr, Err_Type: type_expr) {
    Ok: Ok_Type;
    Err: Err_Type;
}
```

These work exactly like polymorphic structures when it comes to using them in procedure definitions and the like.
```onyx
// Returns an optional of the error type of the result.
// (entirely redundant, but gives an example)
get_err :: (result: Result($Ok, $Err)) -> ? Err {
    return result.Err;
}
```
