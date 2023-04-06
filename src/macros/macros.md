# Macros

Macros in Onyx are very much like procedures, with a couple notable differences. When a macro is called, it is expanded at the call site, as though its body was copy and pasted there. This means that macros can access variables in the scope of their caller.
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

Block and expression macros behave different with respect to some of the language features. Expression macros behave exactly like an inlined procedure call with dynamic scoping.
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