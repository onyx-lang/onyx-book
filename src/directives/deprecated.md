# #deprecated

You can use `#deprecated` on a procedure to cause a *warning* whenever it is called.
It is not a compile *error*, but it will show the deprecation message when the program
is compiled.

Here is how to use it.
```onyx
an_old_procedure :: (x, y: i32) -> i32
	#deprecated "This is the deprecation message. Include relevant replacement info here."
{
	// ...
}
```

The `#deprecated` directive goes after the return type and before the start of the function body.
A compile-time known string must follow that should contain information about how to migrate away
from using the deprecated function.

Currently, `#deprecated` can only appear on procedures. While it could be useful on types,
it is currently not supported.
