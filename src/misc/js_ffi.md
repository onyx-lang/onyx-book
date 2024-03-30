# JS Interop

Interfacing with JavaScript from Onyx is easy thanks to the `core.js` package. It was inspired from
`[syscall/js](https://pkg.go.dev/syscall/js)`, made by the wonderful people over at on the Go team.

The `core.js` package abstracts away the details of managing references to JS values from Onyx,
so you are able to write code that uses JS values without caring about all the internal details.

For example, here is a simple program that runs on a web browser. It creates a new `button` element,
add a `click` event handler that will call an Onyx function, then adds the button to the page.

```onyx
use core.js

main :: () {
    // Lookup the document object in the global scope (i.e. window).
    document := js.Global->get("document");

    // Call createElement to make a new button, then set the text of the button.
    button := document->call("createElement", "button");
    button->set("textContent", "Click me!");

    // Call addEventListener to handle the `click` event.
    // Use js.func to wrap an Onyx function to be available from JS.
    button->call("addEventListener", "click", js.func((this, args) => {
        js.Global->call("alert", "Hello from Onyx!");

        return js.Undefined;
    }));

    // Call appendChild on the body to insert the button on the page.
    document->get("body")->call("appendChild", button);
}
```

While compiling this program, be sure to add the `-r js` flag, as it specifies you are targeting
a JS runtime.

```sh
onyx build -o app.wasm -r js program.onyx
```

This will generate *two* files, `app.wasm` and `app.wasm.js`. The `.js` file exists to allow you
to load and call your Onyx code from JS. Here is a simple HTML page that will load the
JS and start the program, which will in turn call `main`.

```html
<html>
    <head>
        <title>Onyx program</title>
        <script type="module">
            import Onyx from "/app.wasm.js"
            let app = await Onyx.load("/app.wasm")
            app.start()  // Bootstrap program and call main
        </script>
    </head>
    <body>
    </body>
</html>
```

Load this in your favorite web browser from a local web server and you should see a button on the
page. Click it to test the program!

## Some internal details

There are some nuances that are worth mentioning about how this library is currently setup.

The `.start()` method does start the program and invoke your `main` function, but it also
does a little more. It also bootstraps the standard library, preparing buffers and allocators
used by most Onyx programs. For this reason, even if you are not going to do anything in your
main program and solely want to use Onyx as auxiliary to your main code, you still need to call
the `.start()` method; just leave the `main` procedure empty.

When you want to invoke a specific Onyx function from JS, you have to do two things.
First, the procedure you wish to call *has* to have the following signature: `(js.Value, [] js.Value) -> js.Value`.
The first argument is the `this` implicit parameter. The second argument is a slice of
`js.Value`s that are the actual arguments. Here is a simple `add` procedure using this signature.

```onyx
use core.js

add :: (this: js.Value, args: [] js.Value) -> js.Value {
    a := args[0]->as_int() ?? 0;
    b := args[1]->as_int() ?? 0;

    res := js.Value.from(a + b);

    return res;
}
```

Second, *export* the procedure from Onyx using the [`#export`](./../directives/export.md) directive.

```onyx
#export "add" add
```

Then, you can use the `.invoke()` method to invoke the procedure with an arbitrary number of arguments.

```onyx
app.invoke("add", 123, 456); // Returns 579
```

As a slight aid, if you forget to call `.start()`, `.invoke()` will automatically call it for you the
first time. So, if you use invoke and are wondering why the `main` of your procedure is executing,
you likely forgot to call start.


## Understanding the API

The API provided by `core.js` is a very thin wrapper around normal JS operations.
The best way to understand it is to understand what each of the methods does in JS.
Once you understand how each JS operation maps to the corresponding Onyx method,
it is relatively easy to translate JS code into Onyx.


### `Value.new_object`

Creates a new empty object. Equivalent of writing `{}` in JS.

### `Value.new_array`

Creates a new empty array. Equivalent of writing `[]` in JS.

### `Value.from`

Converts an Onyx value into a JS value, if possible.

### `Value.as_bool`, `Value.as_float`, `Value.as_int`, `Value.as_str`

Convert a JS value into an Onyx value, if possible.

### `Value.type`

Returns the type of the JS value. Similar to `typeof` in JS,
but it has sensible semantics.

### `Value.call`

Calls a method on an object, passing the object as the `this` argument. `x->call("y", "z")` is equivalent to `x.y("z")` in JS.

### `Value.invoke`

Invokes a function, passing `null` as the `this` argument.
`x->invoke("y")` is equivalent to `x("y")` in JS.

### `Value.delete`

Invokes the `delete` operator from JS on the property of the object.

### `Value.new`

Invokes the `new` operator on the value.

### `Value.get`

`x->get("y")` is equivalent to writing `x.y` in JS.

### `Value.set`

`x->set("y", 123)` is equivalent to writing `x["y"] = 123` in JS.

### `Value.length`

Shorthand for `x->get("length")->as_int() ?? 0`, since this operation is so common.

### `Value.index`

`x->index(y)` is equivalent to writing `x[y]` in JS.

### `Value.instance_of`

`x->instance_of(y)` is equivalent to writing `x instanceof y` in JS.

### `Value.equals`

Returns `true` if two values are equal.

### `Value.is_null`

Returns if the value contained is `null`.

### `Value.is_undefined`

Returns if the value contained is `undefined`.

### `Value.is_nan`

Returns if the value contained is `NaN`.

### `Value.truthy`

Return `true` if the value is considered "truthy" under JS's semantics.

### `Value.leak`

Removes the value from the tracked pool of objects, so it will not automatically be freed.

### `Value.release`

Frees the JS value being stored. After calling this the value should not be used anymore.


## Defining your own JS module

> This documentation will be coming soon!

