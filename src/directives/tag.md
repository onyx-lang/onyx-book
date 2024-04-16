# #tag

`#tag` is used to attach static metadata to various compile-time objects.
This metadata can then be accessed using the `runtime.info` package.

To tag something, simply place one or more `#tag`s before the binding.
The order of the tags are preserved when using them.

The metadata that is attached has to be a *compile-time* known value,
because it will be serialized and placed in the data section of the
resulting binary. It could be a numeric, string, structure or array literal
for example.


## Structures

Here is an example of a structure tagged with a string literal.

```onyx
#tag "option:hidden"
Value :: struct {
    // ...
}
```

To access tags on a structure, use the `get_type_info` function from `runtime.info` to
get the `Type_Info` of the structure. Then use `->as_struct()` to convert it to a
`Type_Info_Struct`. Then you can use the `.tags` property to access the stored data.
It is simply an array of `any`, which can be used with the utilities for `any` found
in `core.misc`.

```onyx
use runtime.info { get_type_info }
use core { printf, misc }

main :: () {
    info := get_type_info(Value)->as_struct();
    for tag in info.tags {
        if tag.type == str {
            value := * misc.any_as(tag, str);
            printf("Value: {}\n", value);
        }
    }
}
```

## Structure members

```onyx
Value :: struct {
    #tag "a value"
    member_name: i32;
}
```

To access tags on a structure member, do the same steps as above, and then use
the `members` array on the `Type_Info_Struct`. On each member's info there is a `tags`
array of that contains all the tags defined the member, in the order they were
defined.

```onyx
use runtime.info { get_type_info }
use core { printf, misc }

main :: () {
    info := get_type_info(Value)->as_struct();
    for member in info.members {
        for tag in member.tags {
            if tag.type == str {
                value := * misc.any_as(tag, str);
                printf("Value: {}\n", value);
            }
        }
    }
}
```

## Unions

Tags on unions behave in exactly the same manner as tags on structures.

## Unions Variants

Tags on union variants behave in exactly the same manner as tags on structure members.

## Procedures

Tag information for procedures is located in the `runtime.info.tagged_procedures` array.
You can either loop through this array manually, or you can use the helper procedure
`runtime.info.get_procedures_with_tag`.

```onyx
use runtime.info {get_procedures_with_tag}
use core {printf}

Metadata :: struct { name: str }

#tag Metadata.{ "name is foo" }
foo :: () { }

#tag Metadata.{ "name is bar" }
bar :: () { }


main :: () {
    // Provide the type of the tag.
    procs := get_procedures_with_tag(Metadata);
    for p in procs {
        printf("Procedure is: {}\n", p.func);
        printf("Procedure type is: {}\n", p.type);
        printf("Tag is: {}\n", p.tag);
        printf("Procedure is in package: {}\n", p.pack);
    }
}
```

## Globals

Like tagged procedures, tagged global information lives in `runtime.info.tagged_globals`.
You can either loop through it directly, or use the helper procedure `runtime.info.get_globals_with_tag`.

```onyx
use runtime.info {get_globals_with_tag}
use core {printf}

Metadata :: struct { name: str }

#tag Metadata.{ "name is foo" }
foo: i32


main :: () {
    // Provide the type of the tag.
    globs := get_globals_with_tag(Metadata);
    for g in globs {
        printf("Global address is: {}\n", g.data);
        printf("Global type is: {}\n", g.type);
        printf("Tag is: {}\n", g.tag);
        printf("Global is in package: {}\n", g.pack);
    }
}
```
