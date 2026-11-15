# For loops
`for` loops are the most powerful control flow mechanism in Onyx. They enable:
- Iteration shorthand
- Custom iterators
- Scoped resources

## Range-Based Loop

A basic `for` loop in Onyx. This will iterate from 1 to 9, as the upper bound is not included.
```onyx
for i in 1 .. 10 {
    println(i);
}
```
This `for` loop is iterating over a `range`. Ranges represent half-open sets, so the lower bound is included, but the upper bound is not.

## Array-Based Loop
`for` loops can also iterate over array-like types: `[N] T`, `[] T`, `[..] T`. Use `&` after `for` to iterate over the array by pointer.
```onyx
primes: [5] i32 = .[ 2, 3, 5, 7, 11 ];
for value in primes {
    println(value);
}

// This modifies the array so each element
// is double what it was.
for &value in primes {
    // value is a &i32.
    *value *= 2;
}
```

## `it`

Naming the iteration value is optional. If left out, the iteration value will be called `it`.
```onyx
for i32.[2, 3, 5, 7, 11] {
    println(it);
}
```

## Indexed-loops

`for` loops can optionally have a second iteration value called the index.
This index starts at 0, and increments by 1 every iteration.
Its default type is `i32`, but this can be changed.

```onyx
// Use i32 as type of index
for value, index in i32.[2, 3, 5, 7, 11] {
    printf("{}: {}", index, value);
}

// Explicitly change the type to i64
for value, index: i64 in i32.[2, 3, 5, 7, 11] {
    printf("{}: {}", index, value);
}
```


## Custom Iterators Loops

The final type that `for` loops can iterate over is `Iterator(T)`. `Iterator` is defined in `core.iter` and re-exported as `builtin.Iterator` when `core` is loaded. An `Iterator` has three elements:
- `data` - a pointer to the context for the iterator.
- `next` - a function that returns the next value as `? T`. `None` ends the loop.
- `close` - an optional function to clean up the iterator's context.
The `core.iter` package provides many utilities for working with iterators.

Here is a basic example of creating an iterator from a `range`, then using `iter.map` to double the values. Iterators are lazily evaluated, so none of the actual doubling happens until values are pulled out of the iterator by the `for` loop.
```onyx
doubled_iterator := iter.as_iter(1 .. 5)
                 |> iter.map(x => x * 2);

for doubled_iterator {
    println(it);
}
```

The above `for` loop loosely translates to the following code.
```onyx
doubled_iterator := Iterator.from(1 .. 5)
                 |> Iterator.map(x => x * 2);

{
    defer Iterator.close(doubled_iterator);

    while true {
        value := Iterator.next(doubled_iterator);
        switch value {
            case .None do break;
            case .Some as it {
                println(it);
            }
        }
    }
}
```

### `#no_close`

The `close` function of an `Iterator` is always called after the loop exits. If this is not the desired behavior, you can add `#no_close` after `for` to forego inserting the `close` call.
```onyx
doubled_iterator := Iterator.from(1 .. 5)
                 |> Iterator.map(x => x * 2);
for #no_close doubled_iterator {
    println(it);
}

// Later:
Iterator.close(doubled_iterator);
```

## `#first`

Many times while writing `for` loops, it is nice to know if this iteration is one of two special values: the first and last iteration.
As a convenience, Onyx provides the `#first` directive in all of its `for` loops.
It is a `bool` value that is `true` during the first iteration, and then false afterwards.
Note, Onyx *does not* provide an equivalent `#last` directive, because in `Iterator`-based loops, it is impossible to know when the last iteration will happen.

One example of where this is useful is in a formatted printer. Consider this code that prints the elements of an array.
```onyx
arr := i32.[ 2, 3, 5, 7, 11 ];

for arr {
    if !#first do print(", ");
    print(it);
}
```
This example will print:
```
2, 3, 5, 7, 11
```

## Explicitly-typed loop variable

You can optionally provide an explicit type for the loop variable, if you feel it improves code readability.
It does not carry any extra semantic meaning, but solely exists for the next reader of the code.
If you provide the incorrect type, it is a compile error.

```onyx
strings := str.["A", "list", "of", "strings"];

// Explicitly say that value is a str
for value: str in strings {
    println(value)
}
```

