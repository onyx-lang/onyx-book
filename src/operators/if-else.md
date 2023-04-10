# If/else operator

Onyx has a ternary operator for inline if-statements.
It has the form,
```
true-stmt if condition else false-stmt
```

Here is an example.
```onyx
use core

main :: () {
    value := 10;

    x := 1 if value < 100 else 0;
    core.println(x); // Prints 1
}

```

