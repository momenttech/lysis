# Get started with Lysis

## Install Lysis command

    npm install api-lysis -g

Note: this step is optional. If you want to start the CLI without global installation, start `./node_modules/.bin/lysis` instead of `lysis`.

## Install Lysis in your dev dependencies

In your project directory (the one containing `package.json`):

    npm install api-lysis --save-dev

## Create a configuration file

Create a file `lysis.yml` with this content:

```
apis:
  http://localhost:8000:
    basePath: 'backend'
    hydraPrefix: 'hydra:'
    generators:
      lysis-typescript-classes-generator:
        dir: 'classes'
```

With this file, lysis parses the JSON LD documentation of the REST API at `http://localhost:8000` and apply the templates of the generator `lysis-typescript-classes-generator`.  
The result is written in `backend/classes`.

## Install generators

Our configuration file is set to use the generator `lysis-typescript-classes-generator`. It must be installed, as dev dependency:

    npm install lysis-typescript-classes-generator --save-dev

## Start Lysis

### Dry run mode

Start the CLI with the `dry-run` parameter to display generated files result, without writing it:

    lysis --dry-run

### Normal mode

To start the CLI, writing results:

    lysis

### More details

- [CLI parameters](cli.md)
- [Lysis configuration file](configuration.md)
- [Generators](generators.md)
