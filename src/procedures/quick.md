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


## Closures

Onyx has *experimental* support for closures when using quick-procedures.
Currently, this is in the form of *explicit* closure, where every captured
variable has to be declared before it can be used. This restriction will
likely be lifted in the future when other internal details are figured out.

To declare a closure, simply add a *closure block* to the quick procedure
definition.

```onyx
main :: () {
    x := 10
    
    // Here, x is captured by value, and a copy is made for
    // this quick procedure.
    f := ([x] y: i32) => {
        return y + x
    }

    f(20) |> println(); // Prints 30
}
```

Captured values can either by value, or by pointer.
To capture by pointer, simply place a `&` in front of the variable name.

```onyx
main :: () {
    x := 10
    
    // Here, x is captured by pointer
    f := ([&x] y) => {
        *x = 20
        return y + *x
    }

    f(20) |> println(); // Prints 40
    println(x);         // Prints 20
}
```


### Currying

A form of [function currying](https://en.wikipedia.org/wiki/Currying) is possible in Onyx
using chained quick procedures, and passing previous
arguments to each subsequent quick procedure.

```onyx
add :: (x: i32) => ([x] y: i32) => ([x, y] z: i32) => {
    return x + y + z
}

main :: () {
    partial_sum := add(1)(2)

    sum1 := partial_sum(3)
    sum2 := partial_sum(10)

    println(sum1)
    println(sum2)
}
```


### Internal details of Closures

Every time a closure is encountered at runtime, a memory allocation must be made
to accommodate the memory needed to store the captured values. To do this, a
builtin procedure called `__closure_block_allocate` is called. This procedure is
implemented by default to invoke `context.closure_allocate`. By default, `context.closure_allocate` allocates a buffer from the *temporary allocator*. If you want to change
how closures are allocated, you can change this procedure pointer to do something
different. 

```onyx
main :: () {
    context.closure_allocate = (size: i32) -> rawptr {
        printf("Allocating {} bytes for closure.\n", size)
        
        // Allocate out of the heap
        return context.allocator->alloc(size)
    } 

    x := 10
    f := ([x] y: i32) => {
        return y + x
    }

    f(20) |> println()  // Prints 30 
}
```
