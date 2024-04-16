# Format Strings

When specifying the format string for `printf` or `conv.format`, there are a number of options you can
use to configure how the resulting string will be formatted. Format specifiers are specified between
curly-braces (`{}`) in the format string. There is a one-to-one mapping between the number of curly-braces
and arguments provided to `conv.format`, at least at the moment.

This table provides brief defintions as to what can appear between the curly braces.

| Symbol | Use |
|---|---|
| `*` | If the variable is a pointer, dereference the pointer and format the result |
| `p` | Pretty formatting |
| `.N` | Sets the decimal precision when formatting a float to be `N` digits |
| `bN` | Sets the base when formatting an integer to be `N` |
| `x` | Shorthand for `b16` |
| `wN` | Left-pad to `N` characters long (this might not work for everything) |
| `"` | Quote string in double quotes. Quotes are only added to `str`s |
| `'` | Quote string in single quotes. Quotes are only added to `str`s |
| `d` | Disable printing enums as strings and print as numbers instead |

