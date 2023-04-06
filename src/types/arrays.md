# Fixed-size Arrays
Fixed-size arrays store a fixed number of values of any type. A `[N] T` array hold `N` values of type `T`. The `[]` operator can be used to access elements of the array.
```onyx
arr: [5] u32;
arr[0] = 1;
arr[1] = 2;
arr[2] = 3;
arr[3] = 4;
arr[4] = 5;
```

Fixed-size arrays are passed by pointer to procedures. However, the `=` operator copies the contents of the array to the destination.
```onyx
mutate_array :: (arr: [5] u32) {
	arr[3] = 1234;
}

arr: [5] u32;
mutate_array(arr);
println(arr[3]);     // Prints 1234

arr2: [5] u32 = arr; // This is an element by element copy.
arr2[3] = 5678;      // This does not modify the original array.
println(arr[3]);     // So this also prints 1234
```

Fixed-sized arrays can be constructed using an array literal. Array literals have the form `type.[elements]`. The `type` is optional if the type of the elements can be automatically inferred.
```onyx
arr := u32.[1, 2, 3, 4];
assert((typeof arr) == [4] u32, "type does not match");

floats := .[5.0f, 6.0f, 7.0f];
assert((typeof floats) == [3] f32, "type does not match");
```

