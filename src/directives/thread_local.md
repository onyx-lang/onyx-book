# #thread_local

`#thread_local` is used to define a global variable as [*thread-local*](https://en.wikipedia.org/wiki/Thread-local_storage).
These thread-local variables are unique across threads so every thread gets a copy.

```onyx
use core.thread
use core.iter
use core {println}

#thread_local
counter: i32;

thread_task :: (_: rawptr) {
	for 0 .. 10000 {
		counter += 1;
	}

	println(counter);
}

main :: () {
	threads := iter.as_iter(0 .. 16)
			|> iter.map(_ => {
				t := new(thread.Thread);
				thread.spawn(t, cast(&void) null, thread_task);
				return t;
			})
			|> iter.collect();

	for t: threads {
		thread.join(t);
	}
}
```
> Note, this example will not work on the Onyx Playground, because
> it uses multi-threading, which is not supported there.

This program will print `10000`, sixteen times since each thread
has its own copy of `counter`.
