# Calling procedures
Calling any procedure-like thing in Onyx uses the traditional `()` post-fix operator, with arguments in between. Arguments are separated by commas. Arguments can also be named. Once arguments start being named, all subsequent arguments must be named.
```onyx
magnitude :: (x, y, z: f32) -> f32 {
    return math.sqrt(x*x + y*y + z*z);
}

// Implicit naming
println(magnitude(10, 20, 30));

// Explicit naming
println(magnitude(10, y=20, z=30));

// Explicit naming, in diffrent order
println(magnitude(z=30, y=20, x=10));
