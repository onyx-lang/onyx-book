# Closures

Onyx has *experimental* support for closures.
Currently, this is in the form of *explicit* closure, where every captured
variable has to be declared before it can be used. This restriction will
likely be lifted in the future when other internal details are figured out.

To declare a closure, simply add `use (...)` to the procedure definition,
between the arguments and the return type.

```onyx
main :: () {
    x := 10
    
    // Here, x is captured by value, and a copy is made for
    // this quick procedure.
    f := (y: i32) use (x) -> i32 {
        return y + x
    }

    f(20) |> println() // Prints 30
}
```

Captured values can either by value, or by pointer.
To capture by pointer, simply place a `&` in front of the variable name.

```onyx
main :: () {
    x := 10
    
    // Here, x is captured by pointer
    f := (y) use (&x) => {
        *x = 20
        return y + *x
    }

    f(20) |> println() // Prints 40
    println(x)         // Prints 20
}
```


### Currying

A form of [function currying](https://en.wikipedia.org/wiki/Currying) is possible in Onyx
using chained quick procedures, and passing previous
arguments to each subsequent quick procedure.

```onyx
add :: (x: i32) => (y: i32) use (x) => (z: i32) use (x, y) => {
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
implemented by default to invoke `context.closure_allocate`. By default,
`context.closure_allocate` allocates a buffer from the *temporary allocator*. If you want to change
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
    f := (y: i32) use (x) => {
        return y + x
    }

    f(20) |> println()  // Prints 30 
}
```
