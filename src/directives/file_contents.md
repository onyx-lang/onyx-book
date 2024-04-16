# #file_contents

`#file_contents` can be used to add the contents of a file (text or binary) into
the data section of the outputted WebAssembly binary, and gives you access to it
as a `[] u8`.

You can use this to embed anything in the binary that you would have had to put
in a string literal, or load at runtime.

```onyx
image_data := #file_contents "image/path/here.png";
pixels     := convert_image_to_pixels(image_data);
```

This way, there is no file I/O to load an image from disk. It is already in the
binary ready to be used.
