# Reflection

Reflection provides the ability for a program to introspect itself,
and perform operations different dynamically at runtime based on a values type,
or metadata in the compiled program.

In Onyx, reflection is available through the `runtime.info` package.
This package provides utility function for accessing all type information
and metadata ([tags](./../directives/tag.md)) stored in the binary.

## Types are Values

Every type in Onyx is given a unique ID at compile time.
This ID is not stable, so a separate compilation may choose
a different ID for the same nominal type.
By having a single integer for every type, Onyx's types can
be *runtime* values as well as compile time values.

In the example, `t` is variable that *stores* a type.

```onyx
main :: () {
    t := i32;

    println(t);         // Prints i32
    println(typeof t);  // Prints type_expr, aka the type of a type
}
```

Under the hood, `t` is simply storing a 32-bit integer that is the
unique ID of `i32`.

## `any`

This ability to have types as runtime values enables `any` in Onyx.
`any` is a dynamically typed value, whose type is known at runtime,
instead of at compile-time. Under the hood, `any` looks like this:

```onyx
any :: struct {
    data: rawptr;
    type: type_expr;
}
```

As you can see, it stores a data pointer and a runtime-known type.
Every `any` points to a region of memory where the value is actually stored.
You can think of `any` like a "fat-pointer" that stores the pointer, *plus* the type.

`any` is typically used as an argument type on a procedure.
When a parameter has `any` as its type, the compiler will implicitly
wrap the corresponding argument in an `any`, placing the argument on the stack,
and constructing an `any` using the pointer to the stack and the type of the
argument provided.

```onyx
uses_any :: (value: any) {
    println(value.type);
}

main :: () {
    uses_any(10);       // Prints i32
    uses_any("Hello");  // Prints str
    uses_any(context);  // Prints OnyxContext
}
```

`any` can also be used for variadic arguments of different types.

```onyx
/// Prints all of the 
many_args :: (values: ..any) {
    for value in values {
        printf("{} ", value.type);
    }
}

main :: () {
    many_args(10, "Hello", context);
    // Prints: i32 str, OnyxContext
}
```

To use the data inside of an `any`, you have to write code that handles the different
types, or kinds of types that you expect. You can either check for concrete types explicitly,
or use runtime type information to handle things dynamically. To get the type information for a given type,
use the [`runtime.info.get_type_info`](https://docs.onyxlang.io/packages/runtime.info.html#get_type_info) procedure, of the `info` method on the `type_expr`.

```onyx
print_size :: (v: any) {
    size := switch v.type {
        case i32 => 4
        case i64 => 8
        case str => 8
        case _   => -1
    };

    printf("{} is {} bytes.\n", v.type, size);
}

main :: () {
    print_size(10);
    print_size("Hello");
    print_size(context);
}
```

In this contrived example, `print_size` checks the type of the `any` against explicit
types using a [switch expression](#), defaulting to -1 if the type is not one of them.

For some applications of `any` this is perfectly acceptable, but for others, a more
generalized approach might be necessary. In such cases, you can use runtime type information to introspect the type.


## Using Runtime Type Information

Baked into every Onyx compilation is a *type table*.
This table contains information on every type in the Onyx program,
from the members of structures, to the variants of unions, to
which polymorphic structure was used to create a structure.

This information is stored in `runtime.info.type_table`, which is a slice that contains
a `&Type_Info` for each type in the program.

`Type_Info` stores generic information for every type, such as the size.
When given a `&Type_Info`, you will generally cast it to another type to get more
information out of it by using the `kind` member.

In this example, when a structure type is passed in, the function will print the
all of the members of the structure, including their: name, type and offset.

```onyx
print_struct_details :: (type: type_expr) {
    info := type->info();
    struct_info := info->as_struct();  // OR cast(&Type_Info_Struct) info
    
    for member in struct_info.members {
        printf("Member name   : {}\n", member.name);
        printf("Member type   : {}\n", member.type);
        printf("Member offset : {} bytes\n", member.offset);
        printf("\n");
    }
}

Foo :: struct {
    first: str;
    second: u32;
    third: &Foo;
}

main :: () {
    print_struct_details(Foo);
}
```

This prints:

```
Member name   : first
Member type   : [] u8
Member offset : 0 bytes

Member name   : second
Member type   : u32
Member offset : 8 bytes

Member name   : third
Member type   : &Foo
Member offset : 12 bytes
```






In this example, runtime type information is used to get the size of the type.

```onyx
print_size :: (v: any) {
    info := v.type->info();
    size := info.size;     // Every type has a known size

    printf("{} is {} bytes.\n", v.type, size);
}

main :: () {
    print_size(10);
    print_size("Hello");
    print_size(context);
}
```


