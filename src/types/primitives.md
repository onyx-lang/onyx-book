# Primitives
Onyx contains the following primitive types.
```onyx
void         // Empty, 0-size type

bool         // Booleans

u8  u16      // Unsigned integers: 8, 16, 32, and 64 bit.
u32 u64 

i8  i16      // Signed integers: 8, 16, 32, and 64 bit.
i32 i64

f32 f64      // Floating point numbers: 32 and 64 bit.

rawptr       // Pointer to an unknown type.

type_expr    // The type of a type.

any          // Used to represent any value in the language.

str          // A slice of bytes ([] u8)
cstr         // A pointer to bytes (^u8) with a null-terminator.
dyn_str      // A dynamic string ([..] u8)

range        // Represents a start, end, and step.

v128         // SIMD types.
i8x16 i16x8
i32x4 i64x2
f32x4 f64x2
```
