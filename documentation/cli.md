# Lysis CLI

For now, the CLI has only one parameter: `dry-run`.

Other configuration is done using the [yaml configuration file](configuration.md).

## Start Lysis

To start Lysis, in the project folder, containing `lysis.yml`:

    lysis

Every APIs in `lysis.yml` are read, every generators are started and files are written.

## The dry run parameter

The dry-run parameters is mostly useful to test configuration, template and output.

When using it, result is not written in files, it is only displayed in the console.

    lysis --dry-run

## Other parameters

As usually with CLI, two administrative parameters are available:

- `--help`: displays help
- `--version`: displays version
