# LysisUtils methods and helpers

## Overview

LysisUtils is a part of Lysis.

Most of methods required when writing a generator are (or should be) present in LysisUtils.

## Import LysisUtils in your generator

Include it in the generator:

```
var lysisUtils = require('api-lysis').utils;
```

## Available methods

The provided methods:

- `toCamelCase(text, whichCase)`: change text to camel case. The parameter `whichCase` is `upper` or `lower` to enable upper camel case or lower camel case.  
It is mainly useful when naming generated files from resource name.
- `registerTemplate(id, path)`: register and compile an Handlebars template as `id`.
- `createFile(id, dest, context)`: create a file from the template designated with `id`, write it to `dest`, using the provided `context` to populate data.
- `evalTemplate(id, context)` is really similar to `createFile`, except it only returns the transformed template. This is mostly useful to display a message at the end of the generation.
- `createDir(dir)`: create a directory.
- `exists(path)`: check whether a fil or a directory exists.
- `getHandlebars()`: returns the Handlebars object.
- `getGeneratorTester()`: returns the generator tester instance, to test your generator without creating a fake project. More details below.

`createFile` and `createDir` only display the result and do not create anything when using the `dry-run` CLI parameter.
