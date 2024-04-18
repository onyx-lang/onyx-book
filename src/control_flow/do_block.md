# Do blocks

Do blocks allow you to encapsulate statements into smaller chunks
of code whose sole purpose is to evaluate to a value.

Do blocks are expressions, and therefore must return a value.
This is done using the `return` keyword.

```onyx
main :: () {
    x := 10

    y := do {
        if x > 5 do return "X is greater than 5"
        return "X is less than or equal to 5"
    }

    println(y)
}
```

## Explicit typing

If necessary, you can provide an explicit type to the do block using `-> type` after
the `do` keyword.

```onyx
Color :: enum { Red; Green; Blue; }

main :: () {
    col := do -> Color {
        return .Green
    }

    println(col)
}
```

## Internal details

Do blocks were actually a feature that came for "free" when [`macro`](./../procedures/macros.md)
were implemented. Every *expression* `macro` simply turns into a do
block at the call site.

```onyx
add :: macro (x, y: i32) -> i32 {
    return x + y
}

main :: () {
    x1 := add(3, 4)

    // The above simply desugars into this:
    x2 := do -> i32 {
        return 3 + 4
    }
}
```

