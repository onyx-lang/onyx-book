# Macros

Macros in Onyx are very much like procedures, with a couple notable differences. When a macro is called, it is expanded at the call site, as though its body was copy-and-pasted there. This means that macros can access variables in the scope of their caller.
```onyx
print_x :: macro () {
    // 'x' is not defined in this scope, but it can be used
    // from the enclosing scope.
    println(x);
}

{
    x := 1234;
    print_x();
}

{
    x := "Hello from a macro!";
    print_x();
}
```

Because macros are inlined at the call site and break traditional scoping rules, they cannot be used as a runtime known value.

There are two kinds of macros: *block macros*, and *expression macros*. The distinguishing factor between them is the return type. If a macro returns `void`, it is a block macro. If it returns anything else, it is an expression macro.

Block and expression macros behave differently with respect to some language features. Expression macros behave exactly like an inlined procedure call with dynamic scoping.
```onyx
add_x_and_y :: macro (x: $T) -> T {
    defer println("Deferred print statement.");
    return x + y;
}

{
    y := 20.0f;
    z := add_x_and_y(30.0f);
    printf("Z: {}\n", z);
}

// This prints:
// Deferred print statement.
// Z: 50.0000
```
This example shows that `defer` statements are cleared before the expression macro returns. Also, the `return` statement is used to return from the `macro` with a value.

Block macros behave a little differently. `defer` statements are not cleared, and `return` statements are used to return from the caller's procedure.
```onyx
early_return :: macro () {
    return 10;
}

defer_a_statement :: macro () {
    defer println("Deferred a statement.");
}

foo :: () -> i32 {
    defer_a_statement();
    println("About to return.");
    early_return();
    println("Never printed.");
}

// foo() will print:
// About to return.
// Deferred a statement.
```
In `foo`, the call to `defer_a_statement` adds the deferred statement to `foo`. Then the first `println` is run. Then the `early_return` macro returns the value 10 from `foo`. Finally, the deferred print statement is run.

This distinction between block and expression macros allows for an automatic destruction pattern.
```onyx
// These are not the actual procedures to use mutexes.
grab_mutex :: macro (mutex: Mutex) {
    mutex_lock(mutex);
    defer mutex_unlock(mutex);
}

critical_procedure :: () {
    grab_mutex(a_mutex);
}
```
`grab_mutex` will automatically release the mutex at the end of `critical_procedure`. This pattern of creating a resource, and then freeing it automatically using `defer` is very common.


## Code Blocks
To make macros even more powerful, Onyx provides compile-time code blocks. Code blocks capture code and treat it as a compile-time object that can be passed around. Use `[] {}` to create a code block. Use `#unquote` to "paste" a code block.
```onyx
say_hello :: [] {
    println("Hello!");
}

#unquote say_hello;
```
Code blocks are not type checked until they are unquoted, so they can contain references to variables not declared within them.

Code blocks have their syntax because they can optionally take parameters between their `[]`. When unquoting a code block with parameters,
you must pass an *equal or greater* number of arguments in parentheses after the variable name.
```onyx
do_something :: ($do_: Code) {
    #unquote do_(1, 2);
    #unquote do_(2, 6);
}

do_something([a, b] {
    println(a + b);
});
```

Code blocks can be passed to procedures as compile-time values of type `Code`.
```onyx
triple :: ($body: Code) {
    #unquote body;
    #unquote body;
    #unquote body;
}

triple([] {
    println("Hello!");
});
```

Code blocks can be passed to macros without being polymorphic variables, because all parameters to macros are compile-time known.
```onyx
triple_macro :: macro (body: Code) {
    #unquote body;
    #unquote body;
    #unquote body;
}

triple_macro([] {
    println("Hello!");
});
```

A single statement/expression in a code block can be expressed as: `[](expr)`
```onyx
[](println("Hello"))
// is almost the same as
[] { println("Hello"); }
```

The practical difference between `[]()` and `[] {}` is that the latter produces a block of code, that has a `void` return type, while the former results in the type of the expression between it. The `Array` and `Slice` structures use this feature for creating a "lambda/capture-like" syntax for their procedures.
```onyx
find_largest :: (x: [] $T) -> T {
    return Slice.fold(x, 0, [x, acc](x if x > acc else acc));
}
```

A code block can also be passed to a macro or procedure simply by placing a block immediately after a function call. This only works if the function call is a statement.
```onyx
skip :: (arr: [] $T, $body: Code) {
    for n in 0 .. arr.count {
        if n % 2 == 1 do continue;
        it := arr[n];
        #unquote body;
    }
}

// This prints: 2, 5, 11
skip(.[2, 3, 5, 7, 11, 13]) {
    println(it);
}
