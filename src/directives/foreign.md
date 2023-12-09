# #foreign

The `#foreign` directive is used to tell the compiler that a function is defined outside
of this program. Because Onyx compiles to WebAssembly, this means that the function will
be added to the *import* section of the WASM module. You can read more about what that
means [here](https://webassembly.github.io/spec/core/binary/modules.html#import-section).

The `#foreign` directive can appear in two different places, depending on which is
more convenient.

The first position it can appear in is directly after the return type of a function.
In this position, it must be followed by *two* compile-time known strings that are
the *module* and *import* name. This terminology is inherited from the WebAssembly specification.
```onyx
external_procedure :: (arg1: i32, arg2: i32) -> i32 #foreign "host" "add" ---
```

In this example, `host` is the module name, and `add` is the import name.


## Foreign blocks

The other position `#foreign` can appear in is *foreign-blocks*.
In this form, you can declare many foreign procedures at once, so long
as they all have the same module name, and their import name matches the
name in Onyx that is given to them.

```onyx
#foreign "host" {
	add :: (arg1: i32, arg2: i32) -> i32 ---
	sub :: (arg1: i32, arg2: i32) -> i32 ---
	mul :: (arg1: i32, arg2: i32) -> i32 ---
}
```

In this example, `add`, `sub`, and `mul` are all foreign procedures with the module
name `host`. They have the import names `add`, `sub`, and `mul` respectively.

We can validate this using the `wasm-objdump` tool from the [WebAssembly Binary Toolkit](https://github.com/WebAssembly/wabt).
We also have to compile in a special way to not clutter the output with
the imports that come from the standard library.
```sh
$ onyx build -r custom -o example.wasm example.onyx core/runtime/default_link_options.onyx
$ wasm-objdump -x -j import example.wasm

example.wasm:	file format wasm 0x1

Section Details:

Import[3]:
 - func[0] sig=0 <host.add> <- host.add
 - func[1] sig=0 <host.sub> <- host.sub
 - func[2] sig=0 <host.mul> <- host.mul
```

> When using Onyx from the command line with `onyx run`, or when running with
> the WASI backend, these foreign functions will be resolved for you. However,
> when using JavaScript as your runtime, you will need to provide definitions for
> each imported procedure. See [this MDN article](https://developer.mozilla.org/en-US/docs/WebAssembly/Using_the_JavaScript_API) for more details.
