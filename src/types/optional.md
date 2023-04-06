# Optional
Optional types in Onyx represent something that may or may not contain a value. They are simply written as `? T`.
> You may wonder why its written as `? T` instead of `T?`. This is to prevent ambiguity. For example,
> if you see `[] T?`, is this an optional slice of `T` (`([] T)?`)? or a slice of optional `T` (`[] (T?)`)? To avoid this problem
> the optional specifier is placed in the same place as the pointer/slice/etc. specifiers.

