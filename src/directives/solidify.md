# #solidify

`#solidify` freezes a polymorphic procedure, or picks one option from an overload set, so the result can be used where a concrete procedure is required.

## From arguments

A parenthesized argument list selects the overload and solves polymorphic variables from the types given.
Named arguments can also be used to pick a particular parameter.

```onyx
overloaded :: #match {
    (x: str) { println("string"); },
    (x: i32) { println("int"); },
    (z: $T)  { println("other"); },
}

int_fn :: #solidify overloaded(i32)
other  :: #solidify overloaded(z = range)
```

`int_fn` is the `i32` overload. `other` matches the parameter named `z` against `range`.

## Naming variables

Using a `#solidify` block (`{}`), you name polymorphic variables directly.
A partial block leaves the remaining variables unsolved and therefore the result is still a polymorhpic procedure.

```onyx
foo :: (x: $A, y: $B) {
    printf("{} {}\n", x, y);
}

foo_i32 :: #solidify foo { A = i32 }
// foo_i32(10, "hi") still solves B.

bar :: ($T: type_expr, x: T, y: $U) {
    printf("{} {}\n", x, y);
}

bar_i32 :: #solidify bar { T = i32 }
// T is no longer passed. U is still open.
// bar_i32(10, "hi") solves U as str.
```
