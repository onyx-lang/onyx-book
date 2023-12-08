# #doc

`#doc` is used to provide doc-strings to bindings. They can appear before
most "things" in the language, like structures, unions, procedures, enums, etc.

To use them, simply write `#doc` followed by a compile-time string.
```onyx
#doc "This is the documentation for the 'procedure_a'."
procedure_a :: () {
	// ...
}

#doc """
	This multi-line string literal is the documentation
	for procedure_b.
"""
procedure_b :: () {
	// ...
}
```

Note that you can only have one `#doc` directive per binding.

These doc-strings are included in the generated `.odoc` file when compiled
with the `--doc` flag. This binary file is used by [onyx-doc-gen](https://github.com/onyx-lang/onyx-doc-gen)
to generate HTML documentation for the current compilation. This file can
also be easily deserialized into a structure you can work with in Onyx
like so.

```onyx
use core.encoding.osad
use core.doc
use core.os

contents := os.get_contents("documentation.odoc");
docs     := osad.deserialize(doc.Doc, contents)->unwrap();

// See core/doc/doc.onyx for the what is inside of `docs`
```
