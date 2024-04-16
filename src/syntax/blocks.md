# Blocks
There are 3 ways of expressing a block of code in Onyx, depending on the number of statements in the block.

## Multi-statement Blocks
The first way is to use curly-braces (`{}`) to surround the statements in the block, with statements being delimited by a semi-colon.
```onyx
{
	stmt1;
	stmt2;
	// ...
}
```

## Single-statement Blocks
The second way is to place the `do` keyword before the statement to create a single-statement block. This is required in `if`, `while`, and `for` statements. You can of course write `{ stmt; }` instead of `do stmt;`  if you prefer.
```onyx
do stmt;

// More commonly
if some_condition do some_stmt;
```

## Zero-statement Blocks
The third and final way is a little redundant, but its in the language because it can be appealing to some people. When there needs to be a block, but no statements are needed, three dashes, `---`, can be used as an equivalent to `{}`.
```onyx
if condition ---

switch value {
	case 1 ---
	// ...
}
```
