# #export

`#export` adds a procedure to the export-list of the compiled WebAssembly
binary. This is a crucial piece of functionality when trying to use Onyx
in other environments, such as from JS or in plugin systems.

The syntax for `#export` looks like this.
```onyx
#export "export name here" exported_procedure
```

The name provided must be a compile-time string.
The exported procedure can either be a reference to a procedure,
or a procedure literal itself.

```onyx
#export "add" (x, y: i32) -> i32 {
	return x + y;
}
```

