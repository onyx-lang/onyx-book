# Automatic-return type TODO
Sometimes, the exact type of returned value is cumbersome to write out. In this case, `#auto` can be provided as the return type. It automatically determines the return type given the first `return` statement in the procedure.
```onyx
// #auto would automatically determined to be:
//   Iterator(i32), bool, str
weird_return_type :: (x: i32) -> #auto {
    return iter.as_iter(1 .. 5) , false, "Hello, World!";
}
```

In some cases in Onyx, it is actually impossible to write the return type. `#auto` can be used in this case, and the compiler will figure out what type needs to be there.