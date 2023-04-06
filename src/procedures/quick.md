# Quick procedures
With [polymorphic variables](./polymorphic.md) and [`#auto`](./automatic_return_type.md), it is possible to write a completely type-generic procedure in Onyx.
```onyx
print_iterator :: (msg: $T, iterable: $I) -> #auto {
    println(msg);
    for iterable {
        println(it);
    }
    return 1234;
}

print_iterator("List:", u32.[ 1, 2, 3, 4 ]);
print_iterator(8675309, 5 .. 10);
```
No types are given in the procedure above. `msg` and `iterable` can be any type, provided that `iterable` can be iterated over using a `for` loop. This kind of procedure, one with no type information, is given a special shorthand syntax.
```onyx
print_iterator :: (msg, iterable) => {
    println(msg);
    for iterable {
        println(it);    
    }
    return 1234;
}

print_iterator("List:", u32.[ 1, 2, 3, 4 ]);
print_iterator(8675309, 5 .. 10);
```
Here the `=>` signifies that this is a *quick procedure*. The types of the parameters are left out, and can take on whatever value is provided. Programming using quick procedures feels more like programming in JavaScript or Python, so don't abuse them. They are very useful when passing procedures to other procedures.
```onyx
map :: (x: $T, f: (T) -> T) -> T {
    return f(x);
}

// Note that the paraentheses are optional if
// there is only one parameter.
y := map(5, value => value + 4);
println(y);
```

You can also have a mix between quick procedures and normal procedures. This examples shows an alternative way of writing `-> #auto`.
```onyx
// The => could be -> #auto, or -> T.
find_smallest :: (items: [] $T) => {
    small := items[0];
    for items {
        if it < small do small = it;
    }
    return small;
}

println(find_smallest(u32.[6,2,5,1,10]));
```
