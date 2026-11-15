# Polymorphic procedures
Polymorphic procedures allow the programmer to express *type-generic* code, code that does not care what type is being used. This is by far the most powerful feature in Onyx.

Polymorphic procedures use *polymorphic variables*. A polymorphic variable is declared using a `$` in front of the name. When calling a polymorphic procedure, the compiler will try to solve for all of the polymorphic variables. Then, it will construct a specialized version of the procedure with the polymorphic variables substituted with their corresponding value.

Here is an example of a polymorphic procedure that compares two elements.
```onyx
min :: (x: $T, y: T) -> T {
    if x < y do return x;
    else     do return y;
}

x := min(10, 20);
y := min(40.0, 30.0);

// Errors
// z := min("Hello", "World");
```
`$T` declares `T` as a polymorphic variable. When `min` is called with two `i32`s, the compiler solves for `T`, finding it to be `i32`. Then a specialized version of `min` is constructed that operates on `i32`s. A very similar thing happens for the second call, except in that case `T` is `f64`. Notice that an error will occur if `min` is called with something that does not define the operator `<` for `T`.

Polymorphic variables can occur deeply nested in a type. The compiler employs pattern matching to solve for the polymorphic variable.
```onyx
foo :: (x: &[] Iterator($T)) {
    // ...
}

val: &[] Iterator(str);
foo(val);
```

Here is a simple pattern matching process that the compiler goes through to determine the type of `$T`.

| Variable Type      | Given Type          |
| ------------------ | ------------------- |
| `&[] Iterator($T)` | `&[] Iterator(str)` |
| `[] Iterator($T)`  | `[] Iterator(str)` |
| `Iterator($T)`     | `Iterator(str)`     |
| `$T`               | `str`               |

If at any point the types do not match, an error is given.

Parameters can also be polymorphic variables. If a `$` is placed in front of a parameter, it becomes a compile-time "constant". A specialized version of the procedure is made for each value given.
```onyx
add_constant :: ($N: i32, v: i32) -> i32 {
    // N is a compile-time known integer here.
    // It is equivalent to writing '5'.
    return N + v;
}

println(add_constant(5, 10));
```

Types can be passed as constant through polymorphic variables. Consider this example.
```onyx
make_cubes :: ($T: type_expr) -> [10] T {
    arr: [10] T;
    for 0 .. 10 {
        arr[it] = cast(T) (it * it * it);
    }
    return arr;
}

arr := make_cubes(f32);
```
Because `T` is a constant, it can be used in the type of `arr`, as well as in the return type.

## Return types

A `$T` that also appears in a parameter is solved from the argument, as above. A `$T` that appears only in the return type is solved from the type the caller expects. That type comes from a typed binding, a cast, a formal parameter, or the other branch of an `if` or `switch` expression.

```onyx
give :: () -> $T {
    return 0;
}

x: i32 = give();

pick :: #match {
    () -> i32 { return 1; },
    () -> str { return "one"; },
}

n: i32 = pick();
s: str = cast(str) pick();
```

`where` clauses run after return variables are solved, so a clause can name a return-only `$T`.

A call with nothing to take the type from is an error when a return variable is still open. That includes a bare statement, the right-hand side of `:=`, and an operator operand.

```onyx
give();          // error
n := give();     // error
m := give() + 1; // error
```

When several overloads match the arguments, the expected type picks the first one whose return type matches.

`#solidify` freezes a polymorphic procedure before the call. See [`#solidify`](../directives/solidify.md).

## `From.from`

`From(T, R)` means `R.from` builds an `R` from a `T`. `From.from(x)` calls that method. When the two types are already the same, it returns `x`. The destination is a polymorphic return, so the call needs a type to solve against.

```onyx
v := 10;
i: i32 = From.from(v);
```

Other overloads of `From.from` are tried before those two cases. A missing conversion is a compile error that names both types. A call with no destination type is also an error. `From.from` is not a cast. A cast reinterprets a value; see [Cast operators](../operators/cast.md).
