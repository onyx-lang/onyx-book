# Defer

`defer`-statements allow you to run a statement or block when the enclosing block is exited.
```onyx
{
	println("1");
	defer println("3");
	println("2");
}
```
This example will print:
```
1
2
3
```

`defer` statements are pushed onto a stack. When the block exits, they are popped off the stack in reverse order.
```onyx
{
	defer println("3");
	defer println("2");
	defer println("1");
}
```
This example will also print:
```
1
2
3
```

## Create/Destroy Pattern

`defer` statements enable the following "create/destroy" pattern.
```onyx
thing := create_something();
defer destroy_something(thing);
```
Because deferred statements run in any case that execution leaves a block, they safely guarantee that the resource will be destroyed. Also, because `defer` statements are stacked, they guarantee destroying resources happens in the correct order.
```onyx
outer_thing := create_outer_thing();
defer destroy_outer_thing(outer_thing);

inner_thing := create_inner_thing(outer_thing);
defer destroy_inner_thing(inner_thing);
```
