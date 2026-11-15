# #object

`#object` links a WebAssembly object or static archive produced by Clang or GCC. Simply pass the relative file path to the object file.

Declarations inside the block with an empty body (`---`) are symbols defined by the object; think C header file definitions.

```onyx
Vector2 :: struct {x, y: f32}

#object "vec2_ops.wasm" {
    vec2_add  :: (v1, v2: Vector2) -> Vector2 ---
    vec2_norm :: (v: Vector2) -> Vector2 ---
}
```

## `#provide`

`#provide` inside an `#object` block binds an undefined symbol from that object to an Onyx procedure or to an existing global. Objects are linked independently, so a provide in one `#object` does not affect the same symbol in another `#object`. This is to allow for fine-grain control over linking, allowing you to say, print debug info when a function is called, but only from a certain object file.

```onyx
errno: i32;

#object "vec2_ops.wasm" {
    vec2_add  :: (v1, v2: Vector2) -> Vector2 ---
    vec2_norm :: (v: Vector2) -> Vector2 ---

    #provide {
        sqrt :: #solidify math.sqrt(f32)
        errno :: errno
    }
}
```

`sqrt` is a new procedure visible to the object. `errno :: errno` reserves the object's `errno` as the existing global. The left-hand name is the symbol in the object.

`#namespace`, also inside `#provide`, tells the linker to look up remaining undefined symbols in a package or type.

```onyx
use core.libc

#provide {
    #namespace libc
}
```

Object output does not re-link functions that themselves came from an `#object`.

Functions that return a struct, array, dynamic array, union, or multiple values use the C calling convention described under [`#foreign`](./foreign.md). That is what makes an `#object` line up with C.
