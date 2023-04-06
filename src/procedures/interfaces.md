# Interfaces and where TODO

Interfaces allow for type constraints to be placed on polymorphic procedures. Without them, polymorphic procedures have no way of specifying which types are allowed for their polymorphic variables. Interfaces are best explained through example, so consider the following.
```onyx
CanAdd :: interface (t: $T) {
    { t + t } -> T;
}
```
`t` is a value of type `T`. The body of the interface is specifying that two values of type `T` can be added together and the result is of type `T`. Any expression can go inside of the curly braces, and it will be type checked against the type after the arrow. This interface can be used to constrict which types are allowed in polymorphic procedure using a `where` clause.
```onyx
CanAdd :: interface (t: $T) {
    { t + t } -> T;
}

sum_array :: (arr: [] $T) -> T where CanAdd(T) {
    result: T;
    for arr do result += it;
    return result;
}

// This is allowed
sum_array(f32.[ 2, 3, 5, 7, 11 ]);

// This is not, because '+' is not defined for 'str'.
sum_array(str.[ "this", "is", "a", "test" ]);
```
The second call to `sum_array` would generate an error anyway when it type checks the specialized procedure with `T=str`. However, this provides a better error message and upfront clarity to someone using the function what is expected from the type.

Interface constraints can also take on a more basic form, where the expected type is omitted. In this case, the compiler is only checking if there are no errors in the provided expression.
```onyx
// This does not check if t + t is of type T.
CanAdd :: interface (t: $T) {
    t + t;
}
```

Interfaces can be used in conjunction with `#match` blocks to perform powerful compile-time switching over procedures. Consider the following extension to the previous example.
```onyx
CanAdd :: interface (t: $T) {
    { t + t } -> T;
}

sum_array :: #match {
    (arr: [] $T) -> T where CanAdd(T) {
        result: T;
        for arr do result += it;
        return result;
    },

    (arr: [] $T) -> T {
        printf("Cannot add {}.", T);

        result: T;
        return result;
    }
}

// This is allowed
sum_array(f32.[ 2, 3, 5, 7, 11 ]);

// This is now allowed, but will print the error.
sum_array(str.[ "this", "is", "a", "test" ]);
```
First the compiler will check if `T` is something that can be added. If it can, the first procedure will be called. Otherwise the second procedure will be called.
