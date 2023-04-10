# Boolean operators

Onyx has the following binary boolean operators:

| Operator | Use | Works on |
| --- | --- | --- |
| `&&` | And | booleans |
| \|\| | Or | booleans |

Onyx has the following unary boolean operator:

| Operator | Use | Works on |
| --- | --- | --- |
| `!` | Not | booleans |

## Implicit Boolean Conversions

In certain circumstances where a boolean value is expected, Onyx will implicitly convert the value to a boolean in the following ways:

- *Pointers*: If the pointer is non-null, it is `true`. If it is null, it is `false`.
- *Array-like*: If the array is empty, it is `false`. If it is non-empty, it is `true`.
- *Optionals*: If the optional has a value, it is `true`. Otherwise, it is `false`.

As an escape-hatch for library writers, it is possible to make *anything* implicitly cast to bool by overloading the builtin procedure, `__implicit_bool_cast`. Here is an example of making a custom structure cast to bool implicitly.

```onyx
Person :: struct {
    age: u32;
    name: str;
}

#overload
__implicit_bool_cast :: (p: Person) -> bool {
    return p.age > 0 && p.name;
}


main :: () {
    p1 := Person.{};
    p2 := Person.{42, "Joe"};

    if !p1 { println("p1 is false"); }
    if  p2 { println("p2 is true"); }
}
```



