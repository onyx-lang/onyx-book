# Structures
Structures are the record type in Onyx. A structure is declared using the `struct` keyword and is normally bound to a symbol. Members of a structure are declared like declarations in a procedure.
```onyx
Point :: struct {
	x: i32;
	y: i32;
}
```

## Accessing Members
Member access is done through the `.` operator. Note that accessing a member on a pointer to a structure uses the same `.` syntax.
```onyx
p: Point;
p.x = 10;
p.y = 20;

ptr := &p;
ptr.x = 30;
```

## Structure Literals
Structure literals are a quicker way of creating a value of a struct type. They have the form, `Type.{ members }`. The `members` can be partially, or completely named. The same rules apply for when giving members as do for arguments when calling a procedure. If a value is not provided for a member, and no default value is given in the structure, a zeroed-value is used.
```onyx
// Naming members
p1 := Point.{x=10, y=20};

// Leaving out names. Follows order of members declared in the structure.
p2 := Point.{10, 20};
```

## Defaulted Members
Members can be given default values. These values are used in structure literals if no other value is provided for a member. They are also used by `__initialize` to initialize a structure.
```onyx
Person :: struct {
	name: str = "Joe";

	// If the type can be inferred, the type can be omitted.
	age := 30;
}

sally := Person.{ name="Sally", age=42 };
println(sally);

// Because name is omitted, it defaults to "Joe".
joe := Person.{ age=31 };
println(joe);

// Leaving out all members simply sets the members with initializers to
// their default values, and all other members to zero.
joe2 := Person.{};
println(joe2);
```

## Directives
Structures have a variety of directives that can be applied to them to change their properties. Directives go before the `{` of the structure definition.

| Directive  | Function                            |
| ---------- | ----------------------------------- |
| `#size n`  | Set a minimum size                  |
| `#align n` | Set a minimum alignment             |
| `#pack`    | Disable automatic padding           |
| `#union`   | A members are at offset 0 (C Union) |


## Polymorphic Structures
Structures can be polymorphic, meaning they accept a number of compile time arguments, and generate a new version of the structure for each set of arguments.
```onyx
// A 2d-point in any field.
Point :: struct (T: type_expr) {
	x, y: T;
}

Complex :: struct {
	real, imag: f32;
}

int_point: Point(i32);
complex_point: Point(Complex);
```

Polymorphic structures are immensely useful when creating data structure. Consider this binary tree of any type.
```onyx
Tree :: struct (T: type_expr) {
	data: T;
	left, right: &Tree(T);	
}

root: Tree([] u8);
```

When declaring a procedure that accepts a polymorphic structure, the polymorphic variables can be explicitly listed.
```onyx
HashMap :: struct (Key: type_expr, Value: type_expr, hash: (Key) -> u32) {
	// ...
}

put :: (map: ^HashMap($Key, $Value, $hash), key: Key, value: Value) {
	h := hash(key);
	// ...
}
```
Or they can be omitted and a polymorphic procedure will be created automatically. The parameters to the polymorphic structure can be accessed as though they were members of the structure.
```onyx
HashMap :: struct (Key: type_expr, Value: type_expr, hash: (Key) -> u32) {
	// ...
}

put :: (map: ^HashMap, key: map.Key, value: map.Value) {
	h := map.hash(key);
	// ...
}
```

## Structure Composition
Onyx does not support inheritance. Instead, a composition model is preferred. The `use` keyword specifies that all members of a member should be directly accessible.
```onyx
Name_Component :: struct {
	name: str;
}

Age_Component :: struct {
	age: u32;
}

Person :: struct {
	use name_comp: Name_Component;
	use age_comp:  Age_Component;
}

// 'name' and 'age' are directly accessible.
p: Person;
p.name = "Joe";
p.age = 42;
println(p);
```

## Sub-Type Polymorphism
Onyx supports sub-type polymorphism, which enable a safe and automatic conversion between pointer types `&B` to `&A` if the following conditions are met:
1. The first member of `B` is of type `A`.
2. The first member of `B` is used.
```onyx
Person :: struct {
	name: str;
	age:  u32;
}

Joe :: struct {
	use base: Person;
	pet_name: str;
}

say_name :: (person: ^Person) {
	printf("Hi, I am {}.\n", person.name);
}

joe: Joe;
joe.name = "Joe";

// This is safe, because Joe "extends" Person.
say_name(^joe);
```

In this example, you can pass a pointer to `Joe` when a pointer to `Person` is expected,
because the first member of `Joe` is a `Person`, and that member is used.

