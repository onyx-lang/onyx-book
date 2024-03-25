# Slices
Slices are arrays with a runtime known size. A slice `[] T` is equivalent to the following structure.
```onyx
[] T == struct {
	data: &T;
	count: u32;
}
```

Slices are the most common array-like type used in practice.  Slices do not hold the data of their contents directly, but rather through a pointer.

Slices can be used to represent a sub-array. A slice can be created using the `[]` operator on an array-like type, but providing a `range` instead of an integer. Note that the range is half-open, meaning the upper bound is not included.
```onyx
arr := u32.[1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

slice: [] u32 = arr[4 .. 7];
for slice {
	println(it);  // Prints 5, 6, 7
}
```

All array-like types implicitly cast to a slice. The following function works on fixed-size arrays, slices, and dynamic arrays.
```onyx
product :: (elems: [] $T) -> T {
	result := 1;
	for elems do result *= it;
	return result;
}

data := .[1, 2, 3, 4];
println(product(data));
println(product(data[2 .. 4]));
println(product(Array.make(data)));
```

