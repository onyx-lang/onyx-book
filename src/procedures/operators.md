# Operator overloading
Onyx's operator overloading syntax is very similar to its `#match` syntax, except `#operator` is used, followed by the operator to overload. For example, this defines the `+` operator for `str`.
```onyx
#operator + (s1, s2: str) -> str {
    return string.concat(s1, s2);
}
```

The following operators can be overloaded:
```onyx
Arithemetic: +  -   *   / %
Comparison:  == !=  <   <= > >=
Bitwise:     &  |   ^   << >> >>>
Logic:       && ||
Assignment:  += -=  *= /= %=
             &= |=  <<= >>= >>>=
Subscript:   [] []= &[]
```

Most of these are self explanatory.
