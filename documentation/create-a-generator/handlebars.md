# Handlebars

Lysis uses Handlebars as template engine. Take a look to the [documentation](http://handlebarsjs.com/) for further details.

## Built-in helpers

[Handlebars provides a lot of helpers](http://handlebarsjs.com/builtin_helpers.html), such as `if` or `each`.

[Lysis provides many more helpers](handlebars-helpers.md), such as `ucc` for upper camel case, or `jsType` to turn JSON LD type into JavaScript type.

## Custom Handlebars helpers

It is also possible to define helpers in your generator.

The first thing is to import Handlebars from `LysisUtils`.

```
var handlebars = lysisUtils.getHandlebars();
```

Then, write helpers:

```
handlebars.registerHelper('myHelper', function(content) {
  // do some changes
  return content;
});
```
