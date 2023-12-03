# Design Decisions

## Preface

The design decisions that shaped Onyx were made over the course of several
years and tended to adapt to my preferred programming style throughout that the time.
I always aimed to keep Onyx's features relatively orthogonal, but there are some overlapping
features that target different styles of programming.

## Imperative vs Functional

Onyx is an imperative language. You write a sequence of statements that should be executed
in the specified order to evaluate your program. This is my preferred style of programming
so it is what I made Onyx.

However, I do enjoy the simplicity of a functional language. The idea of expressing
a computation at a higher level appeals to me. Instead of writing a bunch of `for`-loops,
you express *what* you want to happen, instead of *how* it should happen.

For this reason, Onyx does have *functional-inspired* features that make that style
of programming accessible. The two features that really make this possible are the 
[pipe operator](../operators/pipe.md), and [quick procedures](../procedures/quick.md).
Here is an example of using them together with the `core.iter` library to express
the computation: Sum the squares of the first 5 numbers in a sequence.

```onyx
use core {iter, println}

main :: () {
    sequence := i32.[5, 2, 4, 9, 29, 8, 2, 8, 3];

    iter.as_iter(sequence)    // Make the iterator
    |> iter.take(5)           // Only take the first 5 elements
    |> iter.map(x => x * x)   // Square each result

    // Sum the squares with a fold operation
    |> iter.fold(0, (x, y) => x + y)
    |> println()              // Print it to the screen
}
```

While Onyx is largely an imperative language, there are many places where expressing
your code in a more functional way like this can actually help readability.

For completeness, here is the same code written in an imperative style.

```onyx
use core {println}

main :: () {
    sequence := i32.[5, 2, 4, 9, 29, 8, 2, 8, 3];

    sum := 0;
    for value: sequence[0 .. 5] {
        square := value * value;
        sum += square;
    }

    println(sum);
}
```

Each developer can choose their own style in Onyx, but I want Onyx to be able to support both styles.

 
## Why the `::`?

This was inspired from Jai and Odin. It means there is a compile-time constant binding
between *something* (a procedure, `struct`, `union`, number, etc.), and a symbol. 

Here's some examples:
```onyx
A_String    :: "A compile-time string"
A_Number    :: 42
A_Struct    :: struct { }
A_Union     :: union { }
A_Procedure :: () { }
```

This syntax might look strange at first, but it actually simplifies things quite a bit.
Notice how every kind of definition looks the same. Its always `name :: thing`.
This means there is no longer a difference between things that are anonymous and things
that are nominal. If you want to write an anonymous procedure, you simply leave the binding
off of it. This is a silly example, because you couldn't call this procedure with a way
to reference it, but it does compile.

```onyx
// No named procedure
(x: i32, y: i32) -> i32 {
    return x + y;
}
```

The colon is actually relatively special in Onyx. **Anywhere** there is a `:`, a new symbol 
is being declared. To find (almost) all symbol declarations in a file, you can use the regular expression:
```regex
[a-zA-Z0-9]+\s?:
```
> **Note**, the only exception to this rule is [quick procedures](../procedures/quick.md), whose syntax
> does not use the colon, for the sake of being as terse as possible.


## Semi-colons
To many, semi-colons are (or at least should be) a thing of the past.
While I don't entirely disagree, Onyx currently does require them at the end of every statement.
This is because of a larger trade-off: Onyx is whitespace agnostic. You can remove any whitespace
that is not between a keyword and a symbol, and the program will continue to work.

This might not seem that important, but it is part of a larger goal to keep the Onyx language as unopinionated
as possible. You should be able to space out and format your code as you please, without the compiler
getting in the way. While good style should obviously be used, I don't believe it is the onus of Onyx to
enforce style. After more Onyx code exists, it might be worth creating something like `onyx fmt`, like `go fmt`,
but in the meantime that is not a priority.

You might think, *Why not use newlines as 'semi-colons'?'*
This is a good point and something I have looked into.
There are several features in Onyx that make this a little tricky and would force you to write code in a particular way.

For example, [if/else](../operators/if-else.md) expressions do not work well like this.
Here is some code that is ambiguous without semi-colons.
```onyx
x := foo()

if x == 5 {
    // ...
}

// Could be interpreted as this, which would not compile.

x := foo() if x == 5 {
    // ...
}
```

You might say, well since `if` is on a new line, it shouldn't join with the previous line.
That would work but then you would *have* to write if/else expressions on the same line (or at least the `if` part).
```onyx
x := foo() if condition
           else otherwise
```

This might be a worthwhile trade-off in the future, but that is to be decided later.

## Why explicitly overloaded procedures?

Onyx uses explicitly [overloaded procedures](../procedures/overloaded.md), over the more "traditional" *implicitly* overloaded procedures.
In my experience, implicitly overloaded procedures sound like a good idea, until there are many overloads
with complicated types, that could be ambiguous. See [SFINAE](https://en.cppreference.com/w/cpp/language/sfinae) as
an example of what I am talking about.

To avoid this, Onyx's overloaded procedures must be explicitly declared, explicitly overloaded, and
there is defined order as to which overloads are checked. It does cause a *slightly* verbose syntax,
and a little bit more planning, but it simplifies things for the code writer, code reader, and the compiler
writer. I believe it is a win-win-win.


