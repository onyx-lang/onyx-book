# Switch

`switch`-statements are used to simplify a chain of `if`-`elseif` statements. Switch statements look a little different in Onyx compared to say C. This is because `case` blocks are actually blocks, not just jump targets.
```onyx
value := 10;

switch value {
	case 5 {
		println("The value was 5.");
	}

	case 10 do println("The value was 10.");

	case _ {
		println("The value was not recognized.");
	}
}
```
`#default` is used for the default case. The default case must be listed lexicographical as the last case.

## `fallthrough`

`case` blocks in Onyx automatically exit the `switch` statement after the end of their body, meaning an ending `break` statement is not needed. If you do however want to fallthrough to the next case like in C, use the `fallthrough` keyword.
```onyx
switch 5 {
	case 5 {
		println("The value was 5.");
		fallthrough;
	}

	case 10 {
		println("The value was (maybe) 10.");
	}
}
```

## Ranges

`switch` statements also allow you to specify a range of values using `..` or `..=`.
```onyx
switch 5 {
	case 5 ..= 10 {
		println("The value was between 5 and 10.");
	}
}
```

## Custom Types

`switch` statements can operate on any type of value, provided that an operator overload for `==` has been defined.
```onyx
Point :: struct {x, y: i32;}
#operator == (p1, p2: Point) => p1.x == p2.x && p1.y == p2.y;

switch Point.{10, 20} {
	case .{0,   0} do println("0, 0");
	case .{10, 20} do println("10, 20");
	case #default  do println("None of the above.");
}
```

## Tagged Unions

`switch` statements are very important when working with tagged unions. See the [`tagged union`](../types/unions.md) section for details.

## Initializers

`switch` statements can also optionally have an *initializer*, like [`while`](./while.md) and [`if`](./ifs.md) statements.

