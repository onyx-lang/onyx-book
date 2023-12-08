# #error

`#error` is used to produce a static, compile-time error.

To use it, simply place it outside of any procedure, and
include a compile-time string that is the error message.

```onyx
#error "This is a static error the prevents this program from compiling."

main :: () {
}
```

`#error` by itself is almost useless, but when combined with
[`#if`](./if.md), you can achieve something like a static-assertion.

```onyx
#if !#defined(something_important) {
	#error "'something_important' must be defined to compile."
}
```
