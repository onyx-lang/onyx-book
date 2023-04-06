# For loops
`for` loops are the most powerful control flow mechanism in Onyx. They enable:
- Iteration shorthand
- Custom iterators
- Removing elements
- Scoped resources

## Range-Based Loop

A basic `for` loop in Onyx. This will iterate from 1 to 9, as the upper bound is not included.
```onyx
for i: 1 .. 10 {
    println(i);
}
```
This `for` loop is iterating over a `range`. Ranges represent half-open sets, so the lower bound is included, but the upper bound is not.

## Array-Based Loop
`for` loops can also iterate over array-like types: `[N] T`, `[] T`, `[..] T`. Use `&` after `for` to iterate over the array by pointer.
```onyx
primes: [5] i32 = .[ 2, 3, 5, 7, 11 ];
for value: primes {
    println(value);
}

// This modifies the array so each element
// is double what it was.
for& value: primes {
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


## Custom Iterators Loops

The final type that `for` loops can iterate over is `Iterator(T)`. `Iterator` is a built-in type that represents a generic iterator. An `Iterator` has 4-elements:
- `data` - a pointer to the context for the iterator.
- `next` - a function to retrieve the next value out of the iterator.
- `remove` - an optional function to remove the current element.
- `close` - an optional function to cleanup the iterator's context.
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
doubled_iterator := iter.as_iter(1 .. 5)
                 |> iter.map(x => x * 2);

{
    defer doubled_iterator.close(doubled_iterator.data);

    while true {
        it, cont := doubled_iterator.next(doubled_iterator.data);
        if !cont do break;    

        println(it);
    }
}
```

### `#no_close`

The `close` function of an `Iterator` is always called after the loop exits. If this is not the desired behavior, you can add `#no_close` after `for` to forego inserting the `close` call.
```onyx
doubled_iterator := iter.as_iter(1 .. 5)
                 |> iter.map(x => x * 2);
for #no_close doubled_iterator {
    println(it);
}

// Later:
iter.close(doubled_iterator);
```

### `#remove`

The final feature of `Iterator`-based `for` loops is the `#remove` directive. If the current `Iterator` supports it, you can write `#remove` to remove the current element from the iterator.
```onyx
// Make a dynamic array from a fixed-size array.
arr := array.make(u32.[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// as_iter with a pointer to a dynamic array 
// supports #remove.
for iter.as_iter(&arr) {
    if it % 2 == 0 {
        // Remove all even numbers
        #remove;
    }
}

// Will only print odd numbers
for arr do println(it);
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

