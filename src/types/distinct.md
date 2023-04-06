# Distinct
Distinct types wrap a primitive or pointer type, which allows for strong type checking and operator overloads. Consider this example about representing a timestamp.
```onyx
use core {println}

Time     :: #distinct u32
Duration :: #distinct i32

#operator - (end, start: Time) -> Duration {
	return Duration.{cast(u32) end - cast(u32) start};
}

start := Time.{1000};
end   := Time.{1600};

duration := end - start;
println(typeof duration);
println(duration);
```
With distinct types, more semantic meaning can be given to values that otherwise would be nothing more than primitives.

Distinct types can be casted directly to their underlying type, and vice versa. Distinct types cannot be casted directly to a different type.

It should be noted that when a distinct type is made, *all* operators are no longer defined for the new type. In the previous example, two `Time` values would not be comparable unless a specific operator overload was provided.
```onyx
Time :: #distinct u32
#operator == (t1, t2: Time) => cast(u32) == cast(u32) t2;
```

