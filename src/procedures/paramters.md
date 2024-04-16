# Parameters
Procedures can take 0 or more parameters. All parameters are passed by value. Parameters that are passed by pointer copy the pointer value, not the data where the pointer is pointing.

## Syntax
Procedure parameters are given a name, followed by a `:`, followed by the type of that parameter. A comma (`,`) is used to delimit the different parameters.
```onyx
print_add :: (x: i32, y: i32) {
    printf("{} + {} = {}\n", x, y, x + y);
}

compute_add :: (out: &i32, x: i32, y: i32) {
    *out = x + y;
}
```

As a convenience, if two or more parameters have the same type, they can be written using the type only once.
In this example, because `x` and `y` are the same type, the `: i32` is not needed after `x`.
```onyx
print_add :: (x, y: i32) {
    // ...
}
```

## Default values
Parameters can have default values. The default value is computed on the caller's side. This means default values are not part of the procedure's type. They are only a convenience provided by a given procedure.
```onyx
print_msg_n_times :: (n: i32, msg: str = "Hello, World!") {
    for n do println(msg);
}

print_msg_n_times(10);
```

The type of a defaulted parameter can be omitted if the type of the expression is known.
```onyx
// Because "Hello, World!" is known to be of type 'str',
// the type of msg can be omitted.
print_msg_n_times :: (n: i32, msg := "Hello, World!") {
    for n do println(msg);
}

print_msg_n_times(10);
```
