# Why use Onyx?

Onyx is a *WebAssembly first* language. Onyx aims to make it as easy as possible
to start working with WebAssembly. For that reason, Onyx is very well suited for
the niche kinds of projects that require using WebAssembly. WebAssembly is growing
in popularity outside of the browser because of projects like [Wasmer](https://wasmer.io), [Wasmtime](https://wasmtime.dev/), and [WasmEdge](https://wasmedge.org/) that make it easy to run WebAssembly in a controlled environment. These "controlled environments" could be game engines, where WASM is used as a "script" system; cloud functions, where WASM is used to respond to requests; plug-in systems for [editors](https://lapce.dev) or [tools](https://zellij.dev/).

For more details, see the section on [Why WebAssembly?](./wasm.md).

## Why not use Onyx?

Due to the tradeoffs and choices Onyx has made, Onyx is not suited for every use-case.
For that reason, I don't expect Onyx to take off in the same way that Rust or Go took off.

There are many kinds of projects where Onyx will never be able to be used, and that's okay.
I only want Onyx to be great for the projects that *can* use Onyx and WebAssembly.
Some projects that Onyx would not be suited for would be:

- Very performance critical desktop applications
- Native libraries, though [Wasmer does have a way to do this](https://docs.wasmer.io/registry)
- Embedded environments


To drive the point home, there will likely never be a *rewrite it in Onyx* trend like there
is with Rust. Onyx is not aiming to replace Rust, Go, Zig, C++, or whatever your favorite
language is. Onyx is a new language, filling the rather niche purpose of supporting WebAssembly
above all else. **I do not see WebAssembly being a limitation of Onyx, but rather I see Onyx
pushing the boundaries of WebAssembly.**

## Onyx's runtime

One interesting point to make is that the `onyx` toolchain bundles a WebAssembly runner.
This means that when developing in Onyx, it will feel just like you are developing in NodeJS
or Python. You run your program with `onyx run`, just like you would run `node` or `python`.
The fact that Onyx compiles to WebAssembly only matters when you are trying to ship your project.
For that, it is possible (but undocumented) to compile a standalone executable of your project
that bundles your WASM code and the runtime. Other than a slightly slower startup time, it
feels and acts just like a native executable.


