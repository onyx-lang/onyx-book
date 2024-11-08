# Loading Files

When the source code for a project is split across multiple files, the Onyx compiler needs to be told where all of these files are, so it knows to load them. This can be done in a couple different ways.

## Using the CLI

When running `onyx run` or `onyx build`, a list of files is provided. All of these files will be loaded into the program, in their respective packages. This can be a reasonable way of doing things for a small project, but quickly becomes unwieldy.
```sh
$ onyx build source1.onyx source2.onyx source3.onyx ...
```

## Using `#load` directives

The idiomatic way of loading files into a program is using the `#load` directive.
The `#load` directive is followed by a compile-time string as the file name, and tells the compiler to load that file.

The given file name is used to search relative to path of the file that contains the `#load` directive.

The file name can also be of the form `"mapped_directory:filename"`.
In this case, the file will be searched for in the given mapped directory.
By default, there is only one mapped directory named `core`, and it is set to `$ONYX_PATH/core`.
Other mapped directories can be set using the command-line argument `--map-dir`.

> Note, the compiler automatically caches the full path to every file loaded, so no file can be loaded more than once, even if multiple `#load` directives would load it.

```onyx
// Load file_a from the same directory as the current file.
#load "file_a"

// Load file_b from the mapped directory 'foo'.
#load "foo:file_b"
```

## Using `#load_all`

Sometimes, every file in a directory needs to be loaded.
To make this less tedious, Onyx has the `#load_all` directive.
Much like `#load` it takes a compile-time string as the *path* relative to the current file,
and it will load every `.onyx` file in that path, **but does not perform a recursive search**.
Any sub-directories will need a separate `#load_all` directive.

```onyx
#load_all "/path/to/include"

#load_all "/path/to/include/subdirectory"
```

