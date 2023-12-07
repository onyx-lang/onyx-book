# Method call operator

Onyx aims to support multiple styles of programming. The [Pipe Operator](./pipe.md) section
describes how a functional style of programming can be achieved. This section will describe
how an Object-Oriented style of programming can be done.

The key behind this is the `->` operator, also called the "method call operator". It can be
understood as a simple shorthand for the following.
```onyx
foo.method(foo, 123)
```

This can instead be written as the following.
```onyx
foo->method(123);
```

Much like the pipe operator, it makes the left-hand side of the operator the *first* argument
to the function call. However, unlike the pipe operator, it also resolves the function from
within the scope of the left-hand side. It also automatically takes the address of the left-hand
side if the method expects a pointer as the first argument. These features together make for
a good aproximation to an inheritance-less OOP programming model.


## Object-Oriented Programming

Onyx is not an object-oriented language. It is a *data-oriented* language, where you should
think about the way your data is structured when solving problems.

That does not mean that all object-oriented language features are bad. Sometimes, it is
easier to think about something as an "object" with "things" that it can do. When that is
the case, Onyx can help.

With the method-call operator (described above), you can write methods on [structures](../types/structures.md) and
[unions](../types/unions.md).

```onyx
use core

Foo :: struct {
    name: str;

    // When a function is declared inside of a structure,
    // it can be accessed under the struct's scope, i.e. `Foo.say_name`.
    say_name :: (f: Foo) {
        core.printf("My name is {}.\n", f.name);
    }
}

main :: () {
    foo := Foo.{ "Joe" };
    foo->say_name();
}
```

Other ways of writing `main` above would be like so:
```onyx
main :: () {
    foo := Foo.{ "Joe" };

    foo.say_name(foo);    // Accessing on 'foo' will look to its types
                          // scope, in this case 'Foo', since 'foo' does
                          // not have a member named 'say_name'.

    Foo.say_name(foo);    // Explicit version as you would see in many 
                          // other languages.
}
```

Sometimes you want to pass the "object" as a pointer to the method if the method is going
to modify the object. As a convience, the method call operator will do this automatically
for you, if it is possible to take the address of the left-hand side. This may feel a little
weird but it is largely intuitive and similar to how many other languages work.
```onyx
use core

Foo :: struct {
    name: str;

    say_name :: (f: Foo) {
        core.printf("My name is {}\n", f.name);
    }

    // Entirely redundant method, but illustrates passing by pointer.
    set_name :: (f: &Foo, name: str) {
        // f can be modified here because it is passed by pointer.
        f.name = name;
    }
}

main :: () {
    // Create a zero-initialized Foo.
    foo: Foo;

    // Call the set_name method
    foo->set_name("Jane");
    // Note that this is equivalent to the follow (notice the &foo).
    // foo.set_name(&foo, "Jane")

    foo->say_name();
}
```

## Virtual Tables

While Onyx does not natively support virtual tables, there is a pattern
that can achieve this using `use`d members on structures. Here is an
example of the classic "Animals that can speak" inheritance argument.

Create a virtual table structures that will store the function pointers.
```onyx
Animal_Vtable :: struct {
    // 'greet' is a member of the vtable, and takes a pointer
    // to the object (which this does not concern itself with),
    // as well as the name to greet.
    greet: (rawptr, name: str) -> void;
}
```

Then, create some implementations of the virtual table as global variables.
Note, these could be scoped so they can only be used where you need them,
but for this example they are accessible everywhere.
```onyx
dog_vtable := Animal_Vtable.{
    greet = (d: &Dog, name: str) {
        printf("Woof {}!\n", name);
    }
}

cat_vtable := Animal_Vtable.{
    greet = (d: &Cat, name: str) {
        printf("Meow {}!\n", name);
    }
}

```

Finally create the `Dog` and `Cat` structures, with a `use`d member of type `Animal_Vtable`.
This will enable the `animal->greet()` syntax because `greet` is accessible as a
member in `Dog` and `Cat`.

```onyx
Dog :: struct {
    use vtable: Animal_Vtable = dog_vtable;
}

Cat :: struct {
    use vtable: Animal_Vtable = cat_vtable;
}
```

Now you can pass a pointer `Dog` and or a pointer to `Cat` to any procedure expecting
a pointer to an `Animal_Vtable`, thanks to [Sub-Type Polymorphism](../types/structures.md#sub-type-polymorphism).

```onyx
say_greeting :: (animal: &Animal_Vtable, name: str) {
    animal->greet(name);
}

main :: () {
    dog := Dog.{};
    cat := Cat.{};

    say_greeting(&dog);
    say_greeting(&cat);
}
```

This is obviously more clunky than object-oriented programming in a language like
Java or C++, but that's because Onyx is not an object-oriented language.

This pattern is used in a couple of places throughout the standard library,
notably in the `io.Stream` implementation, which enables reading and writing
using the same interface from anything that defines `io.Stream_Vtable`, including
files, sockets, processes and string buffers.
