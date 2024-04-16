# Program Structure

An important problem that every programming language tackles in a different way is: how do you structure larger, multi-file programs?

While each way of tackling this problem has its own advantages and disadvantages, Onyx takes a relatively simple approach. The following are the core principles:

- **No incremental compilation**.
- **Divide files into packages**.
- **Dissociate the package hierarchy from the folder hierarchy**.

## No incremental compilation
Onyx does not do incremental compilation. Everything is recompiled, from scratch, every time. This may seem like a drawback, not a feature, but it simplifies the development process immensely.

Onyx has a number of feature that could not be partially compiled in any reasonable way. Macros, runtime type information and static-if statements to name just a few. Instead of shoehorning a solution for this into the compiler, Onyx simply avoids partial/incremental compilation.

Onyx's compiler is very fast. While no incredibly large programs are written in Onyx *yet*, a simple calculation shows that the compiler could theoretically compile 100-200 *thousand* lines per second in larger project. For this reason, incremental compilation is not necessary, as your project will compile almost instantly, no matter what size.

> **Note**, Onyx's compiler is currently still **single-threaded**. If and when this issue is addressed and a multi-threaded compilation model is achieved, it is not impossible to reach over *one-million lines per second*.

One large downside of partial compilation is the need to worry about, "*Did my whole project get recompiled and updated? Or am I still testing old code?*" With a poorly configured build system, it is quite easy to cause this issue, which can lead to hours of a frustrating debugging experience. This is another reason Onyx avoids partial compilation. You know for a fact every time you compile, it is a fresh build.

## Divide files into packages
In Onyx, every source file is part of a package. The package that a file is part of is declared in the first source line of the file.

```onyx
// There can be comments before the package declaration.

package foo

func :: () {}

Struct :: struct {}

```

The above file declares that it is part of the `foo` package.
All symbols declared public in this file (`func` and `Struct`) are placed in public scope of `foo`.

When another file wants to use these symbols, all it has to do is `use foo`.
Then it uses `foo` to access things inside of the `foo` package.

```onyx
package main

use foo

main :: () {
    foo.func();
}
```

> Note, see more about this in the [Packages](/structure/packages.md) section.

## Dissociate the package hierarchy from the file hierarchy

Unlike in many other languages, Onyx does not enforce parity between the hierarchy of files on disk, to the hierarchy of packages in the program. *Any* file can be part of *any* package. While this does come at a readability loss, it offers greater flexibility to the programmer.

**TODO** Explain why this is a good thing, because it is, trust me.

