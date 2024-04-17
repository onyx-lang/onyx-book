# Used Locals

> This is an experimental feature that may not work perfectly, and may go away in the future
> if there is push back or major problems.

A very common pattern in Onyx is to create/allocate a resource, then `defer` the release/free of the resource on the next line. Take this for an example.

```onyx
main :: () {
    // Make a dynamic array.
    my_arr := make([..] i32);

    // Delete the array at the end of main.
    defer delete(&my_arr);
}
```

Whether using dynamic arrays, `io.Reader`s, or `os.File`s, this pattern is all over the place.

To make it a little easier to type, and to allow the author of the type to define how to
clean up the resource allocation, you can simply place the `use` keyword in front of the variable
definition. This will automatically insert a deferred call to the builtin procedure `__dispose_used_local`.
This procedure can be overloaded to define how to dispose of any resource. It also contains an
overload for `delete`, which means anything you can call `delete` on, you can already `use`.

This is the same example as before, but with `use` instead.

```onyx
main :: () {
    // Implicitly delete the array at the end of scope.
    use my_arr := make([..] i32);


    // The above code is equivalent to this:
    my_arr := make([..] i32);
    defer __dispose_used_local(&my_arr);
}
```

