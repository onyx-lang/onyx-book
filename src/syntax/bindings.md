# Bindings

*Bindings* are a central concept to Onyx. A binding declares that certain symbol is *bound* to something in a scope. This "something" can be an compile-time known object. Here is a non-exhaustive list or some of the compile-time known objects.
- Procedure
- `macro`
- `struct`
- `enum`
- `package`

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


