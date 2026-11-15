# #file_contents

`#file_contents` embeds the contents of a file, text or binary, in the data section of the output WebAssembly binary. The result is a `[] u8`.

Use it for data that would otherwise be a large string literal or loaded from disk at runtime. The bytes are already in the binary.

```onyx
image_data := #file_contents "image/path/here.png";
pixels     := convert_image_to_pixels(image_data);
```

A bare path, and a path that starts with `./`, are resolved next to the source file that contains the directive. That includes a file brought in with `#load`. It is not resolved against the process working directory.

```onyx
// Looks beside this source file, not in the working directory.
bytes := #file_contents "payload.txt";
nearby := #file_contents "./payload.txt";
```

An absolute path is used as written. A path of the form `"mapped_directory:filename"` uses a mapped folder, the same way [`#load`](../structure/load.md) does.
