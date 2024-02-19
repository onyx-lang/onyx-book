# Interfaces and where

Interfaces allow for type constraints to be placed on polymorphic procedures. Without them, polymorphic procedures have no way of specifying which types are allowed for their polymorphic variables. Interfaces are best explained through example, so consider the following.
```onyx
CanAdd :: interface (T: type_expr) {
    t as T;

    { t + t } -> T;
}
```
`T` is a type, and `t` is a value of type `T`. The body of the interface is specifying that two values of type `T` can be added together and the result is of type `T`. Any expression can go inside of the curly braces, and it will be type checked against the type after the arrow. This interface can be used to constrict which types are allowed in polymorphic procedure using a `where` clause.
```onyx
CanAdd :: interface (T: type_expr) {
    t as T;

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
The second call to `sum_array` would generate an error anyway when it type checks the specialized procedure with `T=str`. However, this provides a better error message and upfront clarity to someone calling the function.

Interface constraints can also take on a more basic form, where the expected type is omitted. In this case, the compiler is only checking if there are no errors in the provided expression.
```onyx
// This does not check if t + t is of type T.
CanAdd :: interface (T: type_expr) {
    t as T;

    t + t;
}
```

Interfaces can be used in conjunction with `#match` blocks to perform powerful compile-time switching over procedures. Consider the following extension to the previous example.
```onyx
CanAdd :: interface (T: type_expr) {
    t as T;

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

// This is now allowed, but will print an error.
sum_array(str.[ "this", "is", "a", "test" ]);
```

First the compiler will check if `T` is something that can be added, and if it can, the first procedure will be called. Otherwise the second procedure will be called.

## Where expressions

Compile-time constant expressions can be used alongside interfaces in `where` clauses. This gives the programmer even more control over the conditions their function will be called under. For example, ensuring the length of an array fits within a specific range allows us to optimize our code.

```onyx
sum_array :: #match {
    (arr: [] $T) -> T where CanAdd(T) {
        result: T;
        for arr do result += it;
        return result;
    },

    // This will only be called with fixed-size arrays who's length is between 1 and 4.
    (arr: [$N] $T) -> T where CanAdd(T), N >= 1, N <= 4 {
        // An imaginary macro that duplicates the body N times
        // to avoid the cost of loops.
        return unroll_loop(arr, N, [a, b](a += b));
    },

    (arr: [] $T) -> T {
        printf("Cannot add {}.", T);

        result: T;
        return result;
    }
}

// This will call the [] $T version of sum_array
sum_array(f32.[ 2, 3, 5, 7, 11 ]);

// This will call the [$N] $T version of sum_array
sum_array(f32.[ 1, 2, 3, 4 ]);

// This will also call the [$N] $T version of sum_array
sum_array(f32.[ 1, 2, 3 ]);
```
