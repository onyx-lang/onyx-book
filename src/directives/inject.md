# #inject

> **Note,** the below documentation about `#inject` is out of date and will removed
> in the future. This is because `#inject` is now unnecessary with recent changes 
> to the language. You can read more about the new syntax on the [Bindings](./../syntax/bindings.md) page,
> under the "Targeted Bindings" section.


`#inject` is a special directive compared to most others, because it enables
many very powerful features in the language.

The basic idea of `#inject` is that it *injects* symbols into a scope, from
anywhere in the code base. Using this, you can add methods to structures,
add symbols and overloads to a package, and even declare new global types
and variables.

## Syntax

The inject directive can take on two forms: the singular form, and the block form.

In the singular form, you simply write `#inject` before a binding, but that binding's
target can be nested inside of anything with a scope. For example, here is one way
of adding a method to a structure.

```onyx
Vector2 :: struct {
	x, y: f32;
}

// Without #inject here, you would get a parsing error.
#inject
Vector2.magnitude :: (v: Vector2) -> f32 {
	return math.sqrt(v.x * v.x + v.y * v.y);
}

main :: () {
	v := Vector2.{ 3, 4 };

	println(v->magnitude());
}
```

> Note, while it would be possible in this case to change the syntax so you
> would not need to put `#inject` in this case, I think that can lead to some
> unexpected bugs. I have not tried it though, so it might be nice to use.

The powerful thing about `#inject` is that the definition for `Vector2.magnitude`
does not have to be in the same file, or even the same package. It can even
be optionally defined with a [static if](./if.md). Using `#inject` you can
define your own extensions to types provided from any library.

When you have many things to inject into the same place, you can use the block form
of `#inject`. In this form, you write `#inject`, then the thing to inject into, followed by
braces (`{}`). Inside the braces, any binding you write will be turned into an
injected binding into that scope.

```onyx
Vector2 :: struct {
	x, y: f32;
}

#inject Vector2 {
	add :: (v1, v2: Vector2) => Vector2.{ v1.x + v2.x, v1.y + v2.y };
	sub :: (v1, v2: Vector2) => Vector2.{ v1.x - v2.x, v1.y - v2.y };
	mul :: (v1, v2: Vector2) => Vector2.{ v1.x * v2.x, v1.y * v2.y };
}

main :: () {
	v1 := Vector2.{ 3, 4 };
	v2 := Vector2.{ 5, 6 };


	println(v1->add(v2));         // Using method call syntax
	println(Vector2.sub(v2, v1)); // Using explicit syntax
}
```

## Limitations

*Anywhere* a binding can appear, you can inject into, with the exception of procedure
bodies. Procedure bodies are isolated to prevent confusion.

But, this means you can inject into any of these things:

- Packages
- Structures
- Unions
- Enums
- (probably more, but I am forgetting them at the time of writing)


## Making global bindings

To prevent name clutter, Onyx intentionally places every binding into a package.
See the [Packages](../structure/packages.md) section for more details. But sometimes,
you want to make a *true* global binding, one that does not require using any package
to access. *To do this, you can simply `#inject` into the `builtin` package.*

This is because the `builtin` package is special. Its public scope is actually mapped
to the *global scope* of the program. This makes it so everything useful defined in
`builtin` is always accessible to you, things like `make`, `new`, `delete` and `context`.
But because of this, you can `#inject` into it to define your own globals for your program.

One example use of this is the `logf` function. It is only defined if you are using a
runtime with the `core.conv` package defined. To do this, there is an `#inject` into
`builtin` in `core/conv/format.onyx` for the `logf` symbol. This way it is always accessible,
but only if you are using a runtime with formatting capabilities.
