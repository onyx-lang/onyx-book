# Automatic-return type
Sometimes, the exact type of a returned value is cumbersome to write out. In this case, `_` can be used as the return type. The compiler determines the return type from the first `return` statement in the procedure.
```onyx
// _ is determined to be:
//   Iterator(i32), bool, str
weird_return_type :: (x: i32) -> _ {
    return iter.as_iter(1 .. 5), false, "Hello, World!";
}
```

In some cases in Onyx, it is actually impossible to write the return type. `_` can be used in this case, and the compiler will figure out what type needs to be there. Look at this example from the standard library.
```onyx
iter.prod :: (x: $I/Iterable, y: Iterator($Y)) -> _ { ... }
```

`iter.prod` returns an iterator of pairs of the two values yielded from the left and right iterators.
There is no way to write the return type, because you cannot spell the type of `Iterator` that `x` is because it is only `Iterable`, meaning you can call `as_iter` on it. Think about it, what could you write in `Iterator(Pair(???, Y))` to make it correct?