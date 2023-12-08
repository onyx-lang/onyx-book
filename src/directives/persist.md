# #persist

`#persist` is used to make static global variable in places that normally would not have
static global variables.

You can define a *persistent* or static variable in a procedure like so.
```onyx
count :: () -> i32 {
	// Persistent variables are global variables
	// constrained to the current scope.
	#persist counter: i32;

	counter += 1;
	return counter;	
}

main :: () {
	for 100 {
		println(count());
	}
}
```

You can define a persistent variable in a structure body, where it will be accessible
using the structure name as a namespace.

```onyx
Foo :: struct {
	#persist foo_counter: i32;

	name: str;


	make :: () -> Foo {
		Foo.foo_counter += 1;
		return Foo.{ tprintf("Foo #{}\n", Foo.foo_counter) };
	}
}

main :: () {
	f1 := Foo.make();
	f2 := Foo.make();

	println(f1);  // Foo #1
	println(f2);  // Foo #2

	println(Foo.foo_counter);
}
```
