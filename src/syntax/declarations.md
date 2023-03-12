# Declarations
Declaring variables in Onyx is very similar to declaring variables in many other modern programming languages. A single colon (`:`) is used to declare a variable, optionally followed by its type and/or the initial value for the variable.

```onyx
<variable name> : <declared type> = <initial value> ;

<declared type> is optional if <intial value> is present.
= <initial value> is optional.
```

## Examples
```onyx
x: i32;
y: i32 = 10;
z := 10;
```
If a `<declared type>` is not placed between the `:` and `=`, the type is inferred to be the same as the type of the `<initial value>`.