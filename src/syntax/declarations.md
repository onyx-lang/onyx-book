# Declarations
Declaring variables in Onyx is very similar to declaring variables in many other modern programming languages. A single colon (`:`) is used to declare a variable, optionally followed by its type and/or the initial value for the variable.

```onyx
<variable name>(, <variable name>)* : <declared type> = <initial value> ;
```

## Inferred Types
If the type of the initial value can be determined, then the declared type of the variable is optional, and it will be infered from the type of the initial value.

## Examples
Here we declare a variable called `x` of type `i32`. It is guaranteed that `x` will be initialized to `0` here.
```onyx
x: i32;
```

Here we declare a variable `y` explicitly as type `i32`, with an initial value of `10`.
```onyx
y: i32 = 10;
```

Here we declare a variable `z` with an infered type. Since, the declared type was omitted, it will copy the type of the initial value. When not the presence of other type information, the literal `10` has type `i32`, so `z` will be of type `i32`.
```onyx
z := 10;
```
