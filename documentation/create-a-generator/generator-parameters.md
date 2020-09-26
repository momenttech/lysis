## Generator parameters

When starting a generator, Lysis provides an object as parameter containing:

- `rawApi`: the raw API result, from [parseHydraDocumentation](https://github.com/api-platform/api-doc-parser).
- `context`: the API result enhanced, ready to use in templates to generate files.
- `config`: the API configuration from the YAML file.
- `generatorConfig`: the generator configuration, still from the YAML file.

### Context

The context is an object with:

- `entrypoint`: the entrypoint URI, i.e. the API URI
- `title`: the API title
- `resources`: an object containing the API resources, as (resource name => resource properties)

#### Resource properties

- `name`: the resource name, for example `books`
- `title`: the resource title, for example `Book`
- `url`: the resource URL, for example `http://127.0.0.1:8000/books`
- `fields`: the resource fields, as (field name => field properties)

#### Field properties

- `name`: the field name, for example `id`
- `description`: the field description
- `type`: an object containing type properties
- `required`: a boolean
- `readable`: a boolean
- `writable`: a boolean

### Type properties

- `type`:
- `scalar`:
- `range`:
- `id`:
- `resource`:

The type is:

- integer
- decimal
- string
- boolean
- date
- time
- dateTime
- email
- url
- bla bla type...


### Config

It is an object containing:

- `basePath`: the base directory, in which create sub directories and write files
- `hydraPrefix`: the hydra prefix, mostly used to retrieve field documentation.

### GeneratorConfig

It is an object, it depends on your generator.
