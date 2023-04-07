# Loading Files

When the source code for a project is split across multiple files, the Onyx compiler needs to be told where all of these files are, so it knows to load them. This can be done in a couple different ways.

## Using the CLI

When running `onyx run` or `onyx build`, a list of files is provided. All of these files will be loaded into the program, in their respective packages. This can be a reasonable way of doing things for a small project, but quickly becomes unwieldy.
```sh
$ onyx build source1.onyx source2.onyx source3.onyx ...
```

## Using `#load` directives

The idiomatic way of loading files into a program is using the `#load` directive.
The `#load` directive takes a compile-time string as the file name, tells the compiler to load that file.

There are a couple of things to understand as to how the compiler find the file to load given given a file name.
- If the file name starts with `./`, then the file is always loaded *relative* to the path of the file containing the `#load` directive.
- Otherwise, the *load path* is searched for a file matching that name.
    - By default, the load path has two directories in it: `.` and `ONYX_PATH`.

> Note, the compiler automatically caches the full path to every file loaded, so no file can be loaded more than once, even if multiple `#load` directives would load it.

```onyx
// Search the load path for file_a
#load "file_a"

// Load file_b from the same directory as the current file.
#load "./file_b"
```

## Modifying the load path

There are two ways to append to the list of directories searched when loading.
The first is to use the `-I` flags on the CLI.
```sh
onyx build -I /path/to/include source.onyx
```

The second is to use the `#load_path` directive. It acts the same way as the CLI flag, except it can be controlled using variables and static-if statements in the program.
```onyx
#load_path "/path/to/include"

#load "a_file_in_path_to_include"
```

## Using `#load_all`

Sometimes, every file in a directory needs to be loaded.
To make this less tedious, Onyx has the `#load_all` directive.
Much like `#load` it takes a compile-time string as the *path*, and it will load every `.onyx` file in that path, **but does not perform a recursive search**.
Any sub-directories will need a separate `#load_all` directive.

```onyx
#load_all "/path/to/include"

#load_all "/path/to/include/subdirectory"
```

