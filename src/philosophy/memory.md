# Memory Management in Onyx

Onyx has *manually managed memory*. Now, you're probably thinking of C, where you
have to be careful that every `malloc` that it has a matching `free`. Onyx's memory
management has *some* aspect of that, but Onyx has many things that make it much easier
to not make mistakes.

## Why manually managed memory?

There are realistically two alternatives, both of which Onyx chooses not to do.
- **Garbage collection**
- **Borrow checking semantics**

Garbage collection is not really possible in WASM, due to the way WASM is run. There is not
a way to have an external source stop execution and do a garbage collection pass.

> You might be thinking, *but what about WASM GC?* WASM GC is not a direct solution for this.
> WASM GC is a major change affecting the entire programming paradigm in WASM.
> Instead of structures and compound types being stored in linear memory, they are stored
> in references to external objects, and are operated on with an entire new class of
> instructions. This is why they can be garbage collected, because the external runtime
> can see everywhere they are stored, because they aren't stored in linear memory.
> Onyx *may* support WASM GC in the future, but it is not a priority item.

Borrow checking semantics are definitely a viable route to do memory management in WASM.
Rust is as popular as it is for a good reason, and the community has made some incredible
things in it. However, for Onyx, I did not want to have to "fight" the borrow checker.
I wanted to write code how I wanted to write code. There are many projects I work on that
I know have memory leaks, but I don't care. I'm just experimenting and want to get something
working before I do a final pass. Rust is great for that final pass, and I have nothing
against people who use and love Rust. For Onyx, I wanted to have more control because I
feel like managing memory is not as hard as people make it out to be; especially when you
have the right tools.

## The right tool: Custom Allocators

Like Zig and Odin, Onyx has full support for creating custom allocators.
Everything that works with memory *must* explicitly use an `Allocator`.
All core data structures and functions that allocate memory have the option
to specify which Allocator to use.

If you've never programmed with custom allocators, this might seem a little
weird or complicated, but it actually simplifies programming and memory management.

One thing to realize is that *most* allocations you make have a well defined
*lifetime*, or time in which they can be accessed. Sometimes that lifetime can
be hard to describe to something like a borrow checker, but they breakdown into
four categories:

- **Very short term**: Allocations that likely only live to end of a function.
- **Short term**: Allocations that live until the end of the main loop.
- **Infinite**: Allocations that will never be freed.
- **Actually manually managed**: Allocations you actually have to think about when they are freed.

For *very short term* allocations, Onyx has the [`defer`](../control_flow/defer.md) keyword.
Deferred statements or blocks are executed right before the current block or function exits.
They are convenient because you can place the freeing call right next to the allocation call,
so it is easy to keep track of. Also, it prevents accidentally forgetting to free something
because you added an early return to the function.
> **Note**, the `defer` keyword is nothing new, and is present in many popular programming languages today.

For *short term* allocations, Onyx has the temporary allocator. The temporary allocator
is a thread-local allocate-only allocator. It simply grows an arena of memory as you 
allocate from it. You cannot free from the temporary allocator. Instead, you free
*everything* in the temporary allocator, all at once, by calling `core.alloc.clear_temp_allocator()`.
This is generally done at the end or beginning of the main loop of the program.

*Infinitely* living allocations are the easiest. Just don't free it.

I would estimate 5% of the time you actually have to think about how long an allocation has to live.
For that 5%, it might take a little planning and debugging before your memory management is working
entirely correctly, but I believe that is worth not fighting a borrow checker.


## Why should you manage memory?

This may be a hot take, but for many programs, *you don't need to manage memory*.
If your program is only going to do a task and then exit, it does not need to manage its memory.

Take the Onyx compiler as an example.
It allocates a lot of memory, but since all of that memory is needed until
the moment it exits, there is no point in freeing any of it. The operating
system will take care of reclaiming the pages when the compiler exits.

I would argue the only time you need to do memory management is when you have
a program that is going to run for a long time. Things like games, web servers,
graphical applications, etc. In all of these cases, there is a central main loop
that drives the program. This main loop creates a great natural boundary for
when certain things can be freed.

The temporary allocator exists for this purpose.
You allocate into the temporary allocator when you have something that should be
valid for this loop, but should not live past the end of the loop.

The HTTP Server package for Onyx uses this strategy, but even more aggressive.
It replaces the main allocator (aka `context.allocator`, which is used by default
throughout the standard library), with a GC allocator. This allocator tracks
every allocation made in it, and can free everything in a single call. Every
request handler uses this allocator, so you can intentionally forget to free everything,
and the GC allocator will automatically free it all when the request is processed.


