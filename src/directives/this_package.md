# #this_package

This directive is a small hack that can be used when writing [`macros`](../procedures/macros.md).
Because macros do not have normally scoping, it can be difficult
to reference something that is defined in the same package as the
macro, since when the macro is expanded it might not be visible.

`#this_package` is used to represent the current file's package as a
object in which you can look things up.

```onyx
internal_details :: (x: rawptr, T: type_expr) {
	// ...
}

useful_macro :: macro (x: & $T) {
	#this_package.internal_details(x, T);
}
``` 

> This pattern is very common in the core libraries of Onyx, where
> you have a macro that takes a pointer to anything, but it gets
> expanded to a procedure call that simply passes the pointer and
> the type of the value.

This has to use `#this_package` because `internal_details` is not going
to be directly accessible when the macro is expanded. But by specifying
that it needs to be looked up in the current package, this problem can
be avoided. 

