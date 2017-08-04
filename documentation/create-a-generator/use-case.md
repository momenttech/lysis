# Use case

In this example, we will create the TypeScript classes generator.

The aim is to create one class file per REST resource, with typed properties.

### package.json

Firstly, create a `package.json`, as usually, and require Lysis:

    npm install api-lysis --save-dev

### index.js

Create the core file of the generator: `index.js` and import utilities:

```
var path = require('path');
var lysisUtils = require('api-lysis').utils;
var handlebars = lysisUtils.getHandlebars();
```

Create a new class generator, here `tsClassesGenerator`:

```
var tsClassesGenerator = function(parameters) {

  var templatePath = path.join(__dirname, 'templates');

  // templates
  lysisUtils.registerTemplate('base-class', path.join(templatePath, 'base-class.ts.tpl'));
  lysisUtils.registerTemplate('extended-class', path.join(templatePath, 'extended-class.ts.tpl'));
  lysisUtils.registerTemplate('index', path.join(templatePath, 'index.ts.tpl'));

  var basePath = path.join(parameters.config.basePath, (parameters.generatorConfig.dir ? parameters.generatorConfig.dir : 'backend-classes'));

  lysisUtils.createDir(path.join(basePath, 'base'));

  // create resources files from templates
  for (var resourceName in parameters.context.resources) {
    var resource = parameters.context.resources[resourceName];
    var context = { resource: resource };
    var className = lysisUtils.toCamelCase(resource.title, 'upper');

    lysisUtils.createFile('base-class', `${basePath}/base/${className}Base.ts`, context);
    // if extended-class target files exists, do not overwrite (except when required from config)
    if (!lysisUtils.exists(`${basePath}/${className}.ts`)) {
      lysisUtils.createFile('extended-class', `${basePath}/${className}.ts`, context);
    }
  }

  // create index file
  lysisUtils.createFile('index', `${basePath}/index.ts`, parameters.context);
};

module.exports = tsClassesGenerator;
```

1. When starting generators, Lysis provides one [parameter](generator-parameters.md) (here: `parameters`) containing API resources.
2. `templatePath` contains the path of the directory containing templates.
3. Three templates are registered and will be used later in the generator.
4. The target directory structure is created.
5. For each resource in provided `parameters`, create the base class and the inherited empty version of the class. The resource is provided as a context to `createFile` calls.
7. The index file is created once classes are generated.

For further details, take a look to the [TypeScript classes generator](https://github.com/momenttech/lysis-typescript-classes-generator) and the [index.js file](https://github.com/momenttech/lysis-typescript-classes-generator/blob/master/index.js).

### Test the generator

Lysis provides a generator tester to get generator result without creating a frontend application.

At the end of `index.js`, add these lines:

```
if (require.main === module) {
  lysisUtils.getGeneratorTester()
  .setUrl('http://127.0.0.1:8000')
  .setGenerator(tsClassesGenerator)
  .test();
}
```

This code is executed only when `index.js` is called directly, i.e. not when using the Lysis CLI. In other words, it is executing when starting: `node index.js`.

In test mode, the generator is started in dry run mode: it displays results only and does not created any directories or files.

### Templates

This is an extract of the template generating base classes, `templates/base-class.ts.tpl`:

```
// This file should not be modified, as it can be overwritten by the generator.
// The '{{ ucc resource.title }}' class is here for customizations and will not be touched.

export class {{ ucc resource.title }}Base {
  {{#each resource.fields}}
  {{#unless writable}}readonly {{/unless}}{{ name }}: {{ jsType type }};
  {{/each}}
}
```

1. The class name is the `resource.title` transformed as upped camel case.
2. For each field of the resouce, `readonly` is added if the field is not writable, the name is displayed and the type transformed thanks to the `jsType` helper (e.g. `integer` is turned into `number`).


## More details

- [Lysis methods and helpers](lysisutils.md)
- [Handlebars](handlebars.md)
- [Generator parameters](generator-parameters.md)
