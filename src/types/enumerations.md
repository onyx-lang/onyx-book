# Enumerations
Enumerations or "enums" give names to values, resulting in cleaner code. Enums in Onyx are declared much like structures.
```onyx
Color :: enum {
	Red;
	Green;
	Blue;
}

col := Color.Red;
```
Notice that enums use `;` to delineate between members.

By default, enum members are automatically assigned incrementing values, starting at 0. So above, `Red` would be 0, `Green` would be 1, `Blue` would be 2. The values can be overridden if desired. A `::` is used because these are constant bindings.
```onyx
Color :: enum {
	Red   :: 123;
	Green :: 456;
	Blue  :: 789;
}
```

Values are automatically incremented from the previous member if no value is given.
```onyx
Color2 :: enum {
	Red :: 123;
	Green;  // 124
	Blue;   // 125
}
```

Values can also be expressed in terms of other members.
```onyx
Color3 :: enum {
	Red   :: 123;
	Green :: Red + 2;
	Blue  :: Red + Green;
}
```

By default, enums values are of type `u32`. This can also be changed by specifying the underlying type in parentheses after the `enum` keyword.
```onyx
Color :: enum (u8) {
	Red; Green; Blue;
}
```

Enums can also represent a set of bit-flags, using the `#flags` directive. In an `enum #flags`, values are automatically doubled instead of incremented.
```onyx
Settings :: enum #flags {
	Vsync;        // 1
	Fullscreen;   // 2
	Borderless;   // 4
}

settings: Settings;
settings |= Settings.Vsync;
settings |= Settings.Borderless;
println(settings);
```

As a convenience, when accessing a member on an `enum` type, if the type can be determined from context, the type can be omitted.
```onyx
Color :: enum {
	Red; Green; Blue;
}

color := Color.Red;

// Because something of type Color only makes
// sense to compare with something of type Color,
// Red is looked up in the Color enum. Note the
// leading '.' in front of Red.
if color == .Red {
	println("The color is red.");
}
```

