# Overloaded procedures
Overloaded procedures allow a procedure to have multiple implementations, depending on what arguments are provided. Onyx uses *explicitly* overloaded procedures, as opposed to implicitly overloaded procedures. All overloads for the procedure are listed between the `{}` of the `#match` expression, and are separated by commas.
```onyx
to_int :: #match {
    (x: i32) -> i32 { return x; },
    (x: str) -> i32 { return cast(i32) conv.str_to_i64(x); },
    (x: f32) -> i32 { return cast(i32) x; },
}

println(to_int(5));
println(to_int("123"));
println(to_int(12.34));
```

The order of procedures does matter.  When trying to find the procedure that matches the arguments given, the compiler tries each function according to specific order. By default, this order is the lexical order of the functions listed in the `#match` body. This order can be changed using the `#order` directive.
```onyx
options :: #match {
    #order 10 (x: i32) { println("Option 1"); },
    #order 1  (x: i32) { println("Option 2"); },
}

// Option 2 is going to be called, because it has a smaller order.
options(1);
```
The lower order values are given higher priority, as they are *ordered* first.

Overloaded procedures as described would not be very useful, as all of the procedures would have to be known when writing the overload list. To fix this issue, Onyx has a second way of using `#match` to add overload options to an already existing overloaded procedure.
```onyx
options :: #match {
    (x: i32) { println("Int case."); }
}

// #match can be used as a directive to specify a new overload option for
// an overloaded procedure. Directly after #match is the overloaded procedure,
// followed by the new overload option.
#match options (x: f32) { println("Float case."); }
#match options (x: str) { println("String case."); }

// As an alternative syntax that might become the default for Onyx,
// #overload can be used with a '::' between the overloaded procedure
// and the overload option. This is prefered because it looks more
// like writing a normal procedure, but with `#overload` as a "tag".
#overload
options :: (x: cstr) { println("C-String case."); }

// A order can also be specified like so.
#match options #order 10 (x: i32) { println("Other int case."); }
```

Sometimes, the ability to add new overload options should be disabled to prevent undesired behavior. For this Onyx has two directives that can be added after `#match` to change when procedures can be added.
- `#locked` - This prevents adding overload options. The only options available are the ones between the curly braces.
- `#local` - This allows options to be added, but only within the same file. This can be used to clean-up code that is over-indented.

Here is an example of using `#match #local`.
```onyx
length :: #match #local {}

#overload
length :: (x: u32) => 4

#overload
length :: (x: str) => x.count
```


Overloaded procedures provide the backbone for type-generic "traits" in Onyx. Instead of making a type/object oriented system (e.g., Rust), Onyx uses overloaded procedures to provide type-specific functionality for operations such as hashing. Multiple data-structures in the `core` package need to hash a type to a 32-bit integer. `Map` and `Set` are two examples. To provide this functionality, Onyx uses an overloaded procedure called `hash` in the `core.hash` package. This example shows how to define how a `Point` structure can be hashed into a `u32`.
```onyx
Point :: struct {x, y: i32}

#overload
core.hash.hash :: (p: Point) => cast(u32) (x ^ y);
```
