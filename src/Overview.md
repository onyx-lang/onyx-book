## Disclaimer
> This documentation is incomplete and not guaranteed to be up to date.

## Introduction
This is a high-level overview of some the features of the Onyx programming language. A basic knowledge of programming and computer systems is assumed. This documentation is not designed to be read top-to-bottom, so feel free to jump around as it makes sense. Most of the examples can be copied into the `main` procedure on [Onyx Playground](https://onyxlang.io/playground/).

## Hello, Onyx!
The following is the famous "Hello, World!" program, implemented in Onyx.

```onyx
use core {*}

main :: () {
	println("Hello, World!");
}
```

### Running Onyx
When your program is saved to `hello.onyx`, you can now compile and run it:
```sh
onyx run hello.onyx
```

### Compiling Onyx
You can also compile Onyx to a [WebAssembly](https://webassembly.org) binary, and run it later:
```sh
onyx hello.onyx -o hello.wasm
onyx run hello.wasm
```
