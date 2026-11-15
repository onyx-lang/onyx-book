# #inject

Methods and other members are normally added with a [targeted binding](../syntax/bindings.md). A targeted binding does not need `#inject`.

```onyx
Vector2 :: struct {
    x, y: f32;
}

Vector2.magnitude :: (v: Vector2) -> f32 {
    return math.sqrt(v.x * v.x + v.y * v.y);
}

main :: () {
    v := Vector2.{ 3, 4 };
    println(v->magnitude());
}
```

`#inject` still inserts bindings into another scope. The definition does not have to be in the same file or package, and a [static if](./if.md) can include it only when a condition is true. Use it when many bindings share one target, or when the body needs `#Self`.

## Block form

Write `#inject`, the target, and a block. Every binding in the block is placed in that target. `#inject` blocks cannot be nested.

`#Self` names the inject target. It is only legal inside an `#inject` block.

```onyx
Vector2 :: struct {
    x, y: f32;
}

#inject Vector2 {
    add :: (v1, v2: Vector2) => Vector2.{ v1.x + v2.x, v1.y + v2.y };

    doubled :: (v: #Self) -> Vector2 {
        return .{ v.x * 2, v.y * 2 };
    }
}

main :: () {
    v1 := Vector2.{ 3, 4 };
    v2 := Vector2.{ 5, 6 };

    println(v1->add(v2));
    println(v1->doubled());
}
```

The target can be a package, structure, union, enum, or `#distinct` type. Procedure bodies cannot be injected into.

There is also a singular form, `#inject` before one binding whose name already names the target. A targeted binding is the same thing without the directive.

```onyx
#inject
Vector2.magnitude :: (v: Vector2) -> f32 {
    return math.sqrt(v.x * v.x + v.y * v.y);
}
```

## Making global bindings

Every binding lives in a package. See [Packages](../structure/packages.md). The `builtin` package is special: its public scope is the global scope, which is why `make`, `new`, `delete`, and `context` are always visible. Injecting into `builtin` defines a true global for the program.

```onyx
#inject builtin {
    logf :: (fmt: str, args: ..any) {
        // ...
    }
}
```
