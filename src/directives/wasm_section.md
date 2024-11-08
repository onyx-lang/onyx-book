# #wasm_section

When producing the final WebAssembly file, custom sections can be included to add metadata to the binary.
The compiler already produces some of these like `names`, and `producers`.

Custom sections can be specified in an Onyx program by using the `#wasm_section` directive.
This directive is followed by the custom section name and the contents of the custom section,
as compile-time strings.

```onyx
#wasm_section "my-custom-section" "Custom section data here."

#wasm_section "another-section" #file "path/to/custom/data"
```

