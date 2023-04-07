# Packages

Onyx has a relatively simple code organization system that is similar to other languages.
To organize code, Onyx has *packages*.
A package is collection of files that define the public and private symbols of the package.
To use the symbols inside of a package, each *file* it is using the package.
This is done with the `use` keyword.

Let's say we have two source files, `foo.onyx` and `bar.onyx`
They are part of the packages `foo` and `bar` respectively.
If `bar.onyx` wants to use some code from `foo.onyx`, it has to `use foo` before it can do so.
This makes the `foo` package accessible inside of `bar.onyx`.

```onyx
// foo.onyx

// Declares that this file is part of the "foo" package.
package foo

some_interesting_code :: () {
    // ...
}
```

```onyx
// bar.onyx

// Declares that this file is part of the "bar" package.
package bar

use foo

func :: () {
    foo.some_interesting_code();
}
```

It is important to note, that while it may be a good idea to organize your source files into directories that correspond to the package that they are in, there is no limitation as to which files can be part of which packages.
<em>Any</em> file can declare that it is part of <em>any</em> package.
There may be a future language feature to optionally limit this.

## Scoping

While controversial, Onyx has opted to have a *public by default* symbol system.
Unless marked otherwise, all symbols inside a package are accessible from outside that package.
If there are implementation details to hide, they can be scoped to either the current package or the current file.

Use `#package` before a binding to declare that the scope is internal to the package.
Any file that is part of the same package can see the symbol, but external files cannot.
```onyx
package foo

public_interface :: () {
    internal_details();
}

#package
internal_details :: () {
    // ...
}
```

Use `#local` before a binding to declare that the scope is internal to the file.
Only things in the same file can see the symbol.
```onyx
package foo

public_interface :: () {
    super_internal_details();
}

#local
super_internal_details :: () {
    // ...
}
```


> Note, while Onyx is white-space agnostic, it is common to write the `#package` and `#local` directives on a separate line before the binding.

If you have a large set of implementation details, it might be more readable to use the *block* version of `#local` and `#package`.
```onyx

public_interface :: () {

}

#local {
    lots :: () {
    }

    of :: () {
    }

    internal :: struct {
    }

    details :: enum {
    }
}
```
