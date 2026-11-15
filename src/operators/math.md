# Math operators

Onyx has the following standard binary operators:

| Operator | Use | Works on |
| --- | --- | --- |
| `+` | Addition | integers, floats, multi-pointers |
| `-` | Subtraction | integers, floats, multi-pointers |
| `*` | Multiplication | integers, floats |
| `/` | Division | integers, floats |
| `%` | Modulo | integers |

Onyx also has the standard unary operators:

| Operator | Use | Works on |
| --- | --- | --- |
| `-` | Negation | integers, floats |

## Compound assignment

`+=`, `-=`, `*=`, `/=`, `%=`, and the other `op=` forms evaluate the left-hand side once. `arr[get_idx()] += 7` calls `get_idx` once.

A type with no built-in `op=` is still rewritten as `lhs = lhs + rhs`.


