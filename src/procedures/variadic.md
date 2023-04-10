# Variadic procedures

Variadic procedures allow a procedure to take an arbitrary number of arguments. This function takes any number of integers and returns their sum. The `..i32` type behaves exactly like a slice of `i32` (`[] i32`).
```onyx
sum :: (ints: ..i32) -> i32 {
    result := 0;
    for ints {
        result += it;
    }

    return result;
}

println(sum(1, 2, 3, 4, 5));
```

Variadic procedures can also use the special type `any`, to represent heterogeneous values being passed to the function. This function prints the type of each of the values given.
```onyx
print_types :: (arr: ..any) {
    for arr {
        println(it.type);
    }
}

print_types("Hello", 123, print_types);
```
This example outputs:
```
[] u8
i32
(..any) -> void
```
> Note, read more about `any` in the [`Any`](/stdlib/any.md) section.

Using [Runtime Type Information](), functions can introspect the values given and perform arbitrary operations. For example, `conv.format` uses type information to print anything of any type in the program.
```onyx
// printf uses conv.format for formatting.
printf("{} {} {}\n", "Hello", 123, context);
```
