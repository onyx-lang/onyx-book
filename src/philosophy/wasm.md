# Why WebAssembly?

## WebAssembly's (very condensed) History

[WebAssembly](https://webassembly.org) (WASM) is a new bytecode format that has become one of the largest
misnomers in the computing space. While WASM started on the *Web*, it quickly found uses outside of the 
web browser. Since it is a platform and architecture independent bytecode, it can be used in much the
same way as the JVM, Erlang's BEAM, or the .NET CLR. The thing that makes WASM so appealing is that the
bytecode format is very simple and unopinionated, while the other bytecode options are very tied to the
programming languages they run. WASM is meant to be a compilation target for every language.

WASM by design is sandboxed and safe to execute on any system. In order for a WASM binary to do anything,
it must import functions from the host environment. In the browser, these would be defined in JavaScript.
Outside of the browser, they have to be defined by the WASM runner. To prevent everyone from making their
own standard, the WebAssembly Systems Interface (WASI) was made to cover most common use cases, like file
operations and working with standard input/output.

WASI was a great step to get WASM out of the browser, but it does leave much to be desired. For example,
at the time of writing it does not support networking, which makes writing a whole class of useful programs
impossible. To fix this, Wasmer created WASIX, or an *extended* WASI specification, that fills the gaps
in the WASI specification.
> **Note**, Onyx fully supports WASIX by compiling with `-r wasi -DWASIX`.

There is work being done to create the WebAssembly Component Model, which is a way for programs written
in a variety of different language to all interoperate with one another, much like how programs from Java,
Kotlin, and Scala can interact because they all run on the JVM. This proposal is nearly completion, but
Onyx is waiting until there are more languages implementing it to see how all of the details shake out.
It is on the roadmap for Onyx to support it.

## Why choose WebAssembly?

While WASM is great for its purpose, its purpose does seem a little niche.
Why compile to WASM when you could just compile to native machine code?
Why target WASM directly when you could target LLVM, and then get WASM for free, *plus* all other platforms?

I will preface this saying, *WASM and Onyx are not for everyone's use case*.
While I hope to see WASM (and Onyx) used in more places, it is not meant to replace *everything*.

Onyx targets WASM for the following reasons:

- **WASM has a strong future in cross-platform deployment**. WASM is already being used as an alternative to Docker containers in serverless deployments. WASM is also being used as plugin systems in editors and game engines. Almost every non-embedded system has some form of WASM capability because WASM is provided by all modern browsers.

- **WASM is safe**. From their sandbox, explicit imports, and explicit permissions, WASM and WASI are much safer for the end-user when compared to native binaries and other bytecodes.

- **WASM is fast**. WASM is simple to compile to, resulting in very fast compilation. WASM is translated to native machine instructions on every platform resulting in very high performance as well. There are even projects that can do this compilation ahead of time, so they can truly compile a WASM binary into a native binary.

- **WASM is easy**. Onyx is a hobby project. I do not have enough time or patience to work with LLVM. While it can produce great results and is an industry-leading technology for good reason, it is not know to be easy to work with. Also, targeting machine code directly would be just as hard and probably more time-consuming.

- **WASM is inconsequential**. While counter-intuitive, the fact Onyx compiles to WASM is mostly transparent to the end user. When using `onyx run`, Onyx feels like using a scripting language, because the WASM details are hidden from the programmer. In production cases where the end-user does not have Onyx installed, see the above bullet point.

While WASM might not be the right choice for your project, Onyx only aims to provide a great developer experience for projects that *want* to use WASM.

