# Use declarations

When a file wants to use code from another package, that package must be explicitly *used*.
This is done with the `use` declaration. A `use` declaration binds one or more symbols in the current scope to other items in another package. If a `use` declaration is done at the top-level, the bindings are applied at *file scope*.

## Simple case
The simplest `use` declaration looks like this.
```onyx
package foo

use bar

func :: () {
    bar.something_interesting();
}
```

This `use` declaration says, "bind `bar` to be the package named `bar`."
This allows `func` to use `bar` in its body.

## Selective case
To bind to a symbol inside of a package, this syntax can be used.
```onyx
package foo

use bar {something_interesting}

func :: () {
    something_interesting();
}
```

This `use` declaration extracts the symbol `something_interesting` and binds a symbol of the same name to it in the current file.

## Avoiding name conflicts
Sometime, you want to rename a symbol due to a name conflict, or just to shorten your code.
You can do so like this.
```onyx
package foo

use bar {
    SI :: something_interesting
}

func :: () {
    SI();
}
```

This `use` declaration extracts the symbol `something_interesting`, then binds it to `SI` in the current file.

## Use all
If you want to bring *all* symbols inside of a package into the current file, say `use p {*}`.
```onyx
package foo

use bar { * }

func :: () {
    something_interesting();
}
```

## Use all and package
If you want to bind the package itself, *and* all symbols inside of the package, simply place the `package` keyword inside of the `{}`.
```onyx
package foo

use bar { package, * }

func :: () {
    something_interesting();
    
    // OR

    bar.something_intesting():
}
```

## Changing package name
If you want to bind the package itself to a different name, provide the alias like in the previous example.
```onyx
package foo

use bar { B :: package }

func :: () {
    B.something_interesting();
}
```


