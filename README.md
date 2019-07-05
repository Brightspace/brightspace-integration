**Looking for the pre-Daylight `brightspace-integration`?** It's [over here](https://github.com/Brightspace/brightspace-integration/tree/daylight-off).

# brightspace-integration

[![Build status][ci-image]][ci-url]
[![Dependency Status][dependencies-image]][dependencies-url]

The goal of this project is to bring together many other external libraries and modules for inclusion into a particular build of Brightspace.

## Building

The first time you build, install dependencies:

```shell
npm install
```

Rebuild assets to the `build` directory:

```shell
npm run build
```

### Troubleshooting on Windows

Building BSI in Windows doesn't always go smoothly. Here are some of the issues that have been encountered, and their potential solutions:

Trouble | Shooting
------------ | -------------
**build:icons fails:** ```cannot copy from `...'images\**\*.*'` to `...'images\**\*.*'`: cannot read from `...'images\**\*.*'`: ENOENT: no such file or directory, open '...'images\**\*.*''``` | remove single quotes from `package.json`.`scripts`.`build:icons`
**npm i fails:** ```error: [cli.main]   Promise rejection: Error: Failed to execute "git ls-remote --tags --heads https://github.com/Polymer/polymer.git", exit code of #128 fatal: Unable to find remote helper for 'https'``` | Run `git config --global url."https://".insteadOf git://` in command prompt

## Running Locally

To test against a local Brightspace environment, first start serving the compiled assets:

```shell
npm run serve
```

This will run a web server on port `8080` pointing at the `build` directory. You'll need to manually rebuild if any of the assets change.

To point your Brightspace instance at the local integration project:

1. Go to your `{instance}/config/Infrastructure` directory
2. Edit `D2L.LP.Web.UI.Html.Bsi.config.json`
3. Change the `polymer-3` property to the `brightspace-integration (BSI)` localhost server (or your computer's hostname) - note the trailing `/`
4. Restart IIS

The config file will get overwritten during an LMS build.

## Want a slightly faster build?

When we bundle our web components, we produce an ES6 bundle for browsers who support it, and an ES5 transpiled bundle for IE11. If you don't care about IE11, you can exclude that part of the build by running `npm run build-no-es5` or `npm run serve-no-es5`.

## NPM Dependency Locking

We use a `package-lock.json` file to lock our NPM dependencies. This ensures we only pick up changes to dependencies when we explicitly ask for them and are prepared to test them.

Any command that would normally add or update `package.json` will also update `package-lock.json` -- `npm install`, `npm update` etc. Just be cognizant of the changes you're making.

[Read more in the `package-lock` documentation...](https://docs.npmjs.com/files/package-locks)

## Web Components

This project serves as an integration point for our web components and we are using [Polymer CLI's](https://polymer-library.polymer-project.org/3.0/docs/apps/build-for-production) `build` command to manage common dependencies between components and generate web component bundles.

To integrate a new web component into BSI, perform the following steps:

1. Reference your component as an NPM dependency using the path to the repository plus a semver tag (e.g. `"d2l-navigation": "BrightspaceUI/navigation#semver:^3"`). **Do not include minor or patch versions.**
2. Add a JavaScript file (i.e. `d2l-my-component.js`) to the `web-components` directory that imports the new web component. (i.e. `../node_modules/my-component/my-component.js`)
3. Reference the new JavaScript file from the fragments list in `polymer.json`

## Tagging & Publishing

When a pull request is merged to `master`, a version tag corresponding with the current active development release of Brightspace will be automatically applied by CI. A build number will be incremented for each build.

When a pull request is merged to a branch whose name matches our versioning scheme (e.g. `20.19.5`), a version tag for that release will be automatically applied.

For each tag, the project assets (contents of the `build` directory) will be automatically published to the Brightspace CDN by its [Travis CI job](https://travis-ci.org/Brightspace/brightspace-integration).

The publish location will be: `https://s.brightspace.com/lib/bsi/{version}/`

To skip automatic tagging and releasing, include the text `[skip release]` in your merge commit message.

## Updating LP to reference the new version of BSI

Once a new release of BSI has been automatically published to the CDN, you'll need to update LP to reference your version. Create a pull request in LP
that updates the `polymer-3` line of [D2L.LP.Web.UI.Html.Bsi.config.json](https://git.dev.d2l/projects/CORE/repos/lms/browse/lp/_config/Infrastructure/D2L.LP.Web.UI.Html.Bsi.config.json)

This will ensure that the LP (and new CD builds) are using the latest version of BSI.

*If there are more than just your changes between the BSI version you are bumping from and the BSI version you are bumping to please add the owner of the those changes to your PR, and coordinate with them to ensure that any Core LMS PRs corresponding to the BSI changes are accounted for. Thank you!*

## Contributing
Contributions are welcome, please submit a pull request!

### Code Style

This repository is configured with [EditorConfig](http://editorconfig.org) rules and
contributions should make use of them.

[ci-url]: https://travis-ci.org/Brightspace/brightspace-integration
[ci-image]: https://img.shields.io/travis/Brightspace/brightspace-integration.svg
[dependencies-url]: https://david-dm.org/Brightspace/brightspace-integration
[dependencies-image]: https://img.shields.io/david/Brightspace/brightspace-integration.svg
