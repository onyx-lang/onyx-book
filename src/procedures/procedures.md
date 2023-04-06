# Procedures

Procedures allow the programmer to encapsulate behavior inside a reusable form. Other languages call them *functions*, *subroutines* or *methods*. "Procedures" is a super-set of all of those terms.

## Syntax
Procedures in Onyx are written simply as: `(parameters) -> return_type { body }`.

Here is a simple procedures that simply prints, `Hello!`.
```onyx
say_hello :: () -> void {
    println("Hello!");
}
```
To explain the different parts of the syntax, here is a broken down version, line by line.
```onyx
say_hello     // This is the symbol name that the procedure will be bound to.
    ::        // This is 'bind' operator, as discussed in Chapter 2.5.
    ()        // This is the start of the procedure; an empty list of parameters.
    -> void   // This is the return type, specified using a `->`.
{
    // This is the procedure's body.
    println("Hello!");
}
```

## Anonymous Procedures
Procedures do not have to be named, and can simply exist as expressions.
Here, `say_hello` is assigned *at runtime* to be an *anonymous procedure*.
```onyx
procedure_as_an_expression :: () -> void {

    // Assign the procedure to a local variable
    say_hello := () -> void {
        println("Hello!");
    };

    say_hello();
}
```

## Optional Return Type
If the procedure returns `void` (i.e. returns nothing), the return type can be completely removed.
```onyx
say_hello :: () {
    println("Hello, no void!");
}
```