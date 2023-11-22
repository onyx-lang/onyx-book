# If/else operator

Onyx has one ternary operator for inline if-statements.
Inspired by Python, it has this form.
```
true-stmt if condition else false-stmt
```

Here is a simple example of using it.
```onyx
use core

main :: () {
    value := 10;

    x := 1 if value < 100 else 0;
    core.println(x); // Prints 1
}
```

While this operator should be scarely used for the sake of readable code, it can be very handy in certain circumstances.
