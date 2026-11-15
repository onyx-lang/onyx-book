# Documentation comments

A comment that starts with `///` is a documentation comment. It attaches to the next binding: a procedure, structure, union, enum, or other declaration. Several `///` lines in a row are joined into one string.

```onyx
/// This is the documentation for procedure_a.
procedure_a :: () {
    // ...
}

/// This is the documentation for procedure_b.
/// A second line is part of the same string.
procedure_b :: () {
    // ...
}
```

An ordinary `//` comment is not documentation.

These strings are included in the generated `.odoc` file when compiled with the `--doc` flag. That file is used by [onyx-doc-gen](https://github.com/onyx-lang/onyx-doc-gen) to generate HTML documentation for the current compilation. It can also be deserialized in Onyx.

```onyx
use core.encoding.osad
use core.doc
use core.os

contents := os.get_contents("documentation.odoc");
docs     := osad.deserialize(doc.Doc, contents)->unwrap();

// See core/doc/doc.onyx for what is inside of `docs`
```
