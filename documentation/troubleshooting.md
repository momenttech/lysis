# Troubleshooting

## Resource names are truncated

In resources, the first letter of the name are missing. For example, `Book` name is `ook`.

The cause: the API URL contains the trailing slash, and should not.

For example: it should be `http://localhost:8000` (and not `http://localhost:8000/`).

## Object properties type is string

For example, with two resources: `Book` and `Review`, the property `book` of the `Review` class is `string`, instead of `Book`.

This is maybe due to the `book` namespace. For now, two kinds of ranges are handled:

- `http://localhost:8000/docs.jsonld#Book`, i.e. `<something>#Book`
- `http://schema.org/Book`, i.e. `<something>shema.org/Book`

If the range of your `Book` does not follow one of these schemes, let us now.

## Entity ids are not present from JSON LD docs

If you use API Platform, upgrade to 2.1.
