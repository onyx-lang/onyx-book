# Bindings

*Bindings* are a central concept to Onyx. A binding declares that certain symbol is *bound* to something in a scope. This "something" can be an compile-time known object. Here is a non-exhaustive list or some of the compile-time known objects.
- Procedure
- `macro`s
- `struct`s
- `enum`s
- `package`s
- constant literals

## Syntax
A binding is written in the following way:

```onyx
symbol_name :: value
```

This says that `symbol_name` will mean the same thing as `value` in the scope that it was declared in. Normally, `value` is something like a procedure, structure, enum, or some other compile-time known object. However, there is nothing wrong with re-binding a symbol to give it an alternate name.
> **Note**, the ability to alias symbols to other symbols has an interesting consequence. Since names are not inheritly part of a procedure or type defintion, a procedure or type can have multiple names.
> ```onyx
> f :: () { ... }
> g :: f
> ```
> Notice that the procedure defined here can be called `g` or `f`. When reporting errors the compiler will use the name that was originally bound to the procedure (`f`).

## Use as constants

Onyx does not have a way so specify constant variables. When you declare a variable with `:=`, it is *always* modifiable. While constants are very useful, Onyx would suffer from the same problem that C and C++ have with constants: they aren't necessarily constant. You can take a pointer to it, and use that to modify it. Onyx does not want to make false promises about how constant something is.

That being said, bindings can serve as compile-time constants. You can declare
a binding to a constant literal, or something that can be reduced to a constant literal
at compile time. Here are some examples.

```onyx
A_CONSTANT_INTEGER :: 10
A_CONSTANT_FLOAT :: 12.34
A_CONSTANT_STRING :: "a string"

// Since A_CONSTANT_STRING.length and A_CONSTANT_INTEGER are compile-time known
// the addition can happen at compile-time.
A_CONSTANT_COMPUTED_INTEGER :: A_CONSTANT_STRING.length + A_CONSTANT_INTEGER
```

## Targeted Bindings

Bindings can be also placed into a scope other than the current package/file scope.
Simply prefix the binding name with the name of the target scope, followed by a `.`.

```onyx
Foo :: struct {}

// `bar` is bound inside of the `Foo` structure.
Foo.bar :: () {
}
```

Here the `bar` procedure is placed inside of the `Foo` structure. This makes it accessible
using `Foo.bar`. When combined with the [method call operator](./../operators/methods.md), methods can be defined
on types in Onyx in a similar manner to Go.

The target scope does not have to be a structure however; it can also be a `package`, `union`,
`enum`, or `#distinct` type.

Using targeted bindings is *very common* in many Onyx programs, because it allows for
a defining procedures that are associated with a type, *directly* on the type.
This makes them easier to find, and able to be used by the method call operator.

