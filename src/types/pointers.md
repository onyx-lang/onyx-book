# Pointers
Pointers contain an address of a value of the given type. A `&T` is a pointer to value of type `T`. If a pointer is not pointing to anything, its value is `null`.

Use the `&` operator to take the address of a value. Note the consistency between the type and operation used to create a pointer.
```onyx
x: i32  = 10;
p: &i32 = &x;
```

Use the `*` operator to retrieve the value out of a pointer. This is not a safe operation, so faults can occur if the pointer is pointing to invalid memory.
```onyx
x := 10;
p := &x;

printf("*p is {}.\n", *p);
```



# Multi-pointers
Normal pointers in Onxy do *not* support pointer addition nor subscripting, i.e. `x[i]`.
To do this, a *multi-pointer* must be used.

Multi-pointers are written as `[&] T`. They implicitly convert to-and-from normal pointer types, so they do not add much to the safely of a program, but they do allow for expressed intent when using pointers. Consider these two procedures; there is a clear difference between how the pointers are going to be used.
```onyx
proc_1 :: (out: &i32) {
    *out = 10;
}

proc_2 :: (out: [&] i32) {
    for 10 {
        out[it] = it;
    }
}
```
> **Note**, pointer addition and substraction on `[&] T` steps with `sizeof(T)`.
>
> So, `cast([&] i32, 0) + 1 == 4`.

# Pointers vs Multi-Pointers
| `& T` | `[&] T` |
| ----- | ------- |
|  `*t` |  `t[i]` |
| `t.foo` | `t + x` |
| `==`, `!=` | `==`, `!=` |

