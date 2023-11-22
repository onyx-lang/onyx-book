# Dynamic Arrays
Dynamic arrays have a variable size that can be changed after they are created. A `[..] T` is a dynamic array of `T`. Functionality for dynamic arrays is provided in the Onyx standard library in the `core.array` package.
```onyx
use core {array, println}

arr: [..] i32;
array.init(&arr);
defer array.free(&arr);

for 0 .. 10 {
	array.push(&arr, it);
}

for arr {
	println(it);
}
```
See the [the core.array package](https://docs.onyxlang.io/packages/core.array.html) for a full list of functions provided.

Dynamic arrays store an Allocator to know how to request more memory for the array. By default `context.allocator` is used. However, an alternate allocator can be specified in `array.make` or `array.init`.

Because dynamic arrays are so common and useful, Onyx provides some operator overloads for dynamic arrays. The most useful is `<<`, which is used to append elements.
```onyx
// Same example as above.
use core {array, println}

// Dynamic arrays are safely automatically allocated
// on the first push, so there is no need to explicitly
// allocate it if you are using context.allocator.
arr: [..] i32;
defer if arr.data != null do array.free(&arr);

for 0 .. 10 {
	// No need to take the address 'arr'.
	arr << it;
}

for arr {
	println(it);
}
```

