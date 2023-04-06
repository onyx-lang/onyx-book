# Code Blocks
To make macros even more powerful, Onyx provides compile-time code blocks. Code blocks capture code and treat it as a compile-time object that can be passed around. Use `#quote` to create a code block. Use `#unquote` to "paste" a code block.
```onyx
say_hello :: #quote {
    println("Hello!");
}

#unquote say_hello;
```
Code blocks are not type checked until they are unquoted, so they can contain references to references to variables not declared within them.

Code blocks can be passed to procedures as compile-time values of type `Code`.
```onyx
triple :: ($body: Code) {
    #unquote body;
    #unquote body;
    #unquote body;
}

triple(#quote {
    println("Hello!");
});
```

Code blocks can be passed to macros without being polymorphic variables, because all parameters to macros are compile-time known.
```onyx
triple_macro :: macro (body: Code) {
    #unquote body;
    #unquote body;
    #unquote body;
}

triple_macro(#quote {
    println("Hello!");
});
```

There are two syntactic short-hands worth knowing for code blocks. A single statement/expression in a code block can be expressed as: `#(expr)`
```onyx
#(println("Hello"))
// Is almost the same the as
#quote { println("Hello"); }
```

The practical difference between `#()` and `#quote {}` is that the latter produces a block of code, that has a `void` return type, while the former results in the type of the expression between it. The `core.array` package uses this features a lot for creating a "lambda/capture-like" syntax for its procedures.
```onyx
use core.array {fold}

find_largest :: (x: [] $T) -> T {
    return fold(x, 0, #(it if it > acc else acc));
}
```

A code block can also be passed to a macro or procedure simply by placing a block immediately after a function call. This only works if the function call is a statement.
```onyx
skip :: (arr: [] $T, $body: Code) {
    for n: 0 .. arr.count {
        if n % 2 == 1 do continue;
        it := arr[n];
        #unquote body;
    }
}

// This prints: 2, 5, 11
skip(.[2, 3, 5, 7, 11, 13]) {
    println(it);
}
