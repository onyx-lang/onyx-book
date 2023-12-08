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

Fixed-size arrays can be constructed using an array literal. Array literals have the form `type.[elements]`. The `type` is optional if the type of the elements can be automatically inferred.
```onyx
arr := u32.[1, 2, 3, 4];
assert((typeof arr) == [4] u32, "type does not match");

floats := .[5.0f, 6.0f, 7.0f];
assert((typeof floats) == [3] f32, "type does not match");
```

## Array Programming

Fixed-size arrays have builtin array programming support. This allows the `+`, `-`, `*`, `/` operators to be used with them.

```onyx
Vector3 :: [3] i32; // A simple three-component vector

a: Vector3 = .[ 1, 2, 3 ];
b: Vector3 = .[ 1, 1, 1 ];

c := a + b; // [ 2, 3, 4 ];
c *= 2;     // [ 4, 6, 8 ];
```

### Builtin Fields

Fixed-size arrays can also be accessed with builtin fields if their length is <= 4. The fields are `x`, `y`, `z`, `w` or `r`, `g`, `b`, `a`. Array field access is equivalent to regular indexing and does **not** affect an array's memory layout.

```onyx
Color :: [4] f32; // A simple RGBA color

red:   Color = .[ 1, 0, 0, 0 ];
green: Color = .[ 0, 1, 0, 0 ];
blue:  Color = .[ 0, 0, 1, 0 ];

full_opacity: Color = .[ 0, 0, 0, 1 ];

fuchsia := red + full_opacity; // [ 1, 0, 0, 1 ]
fuchsia.b = 1; // Equivalent to fuchsia[2] = 1

teal := green + blue; // [ 0, 1, 1, 0 ]
teal.a = 1;

white := red + green + blue;
white.a = 1;
```
