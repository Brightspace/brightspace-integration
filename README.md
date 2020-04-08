**Looking for the pre-Daylight `brightspace-integration`?** It's [over here](https://github.com/Brightspace/brightspace-integration/tree/daylight-off).

# brightspace-integration

[![Build status][ci-image]][ci-url]
[![Dependency Status][dependencies-image]][dependencies-url]

The goal of this project is to bring together many other external libraries and modules for inclusion into a particular build of Brightspace.

## Building

The first time you build, install the correct version of node and npm first, then install dependencies:

```shell
nvm install
npm i -g npm@6.8.0
npm install
```

Otherwise, just use the specified version of node and install dependencies:

```shell
nvm use
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

## Running Locally - Bundled Production Build

To test against a local Brightspace environment, first start serving the compiled assets:

```shell
npm run serve
```

This will run a web server on port `8080` pointing at the `build` directory. You'll need to manually rebuild if any of the assets change.

To point your Brightspace instance at the local integration project, there are two options:

Option 1:

In the Config Variable browser of your local instance, set the value of `d2l.System.BsiEndpointOverride` to the `brightspace-integration (BSI)` localhost server (or your computer's hostname) - You will need a trailing `/` (e.g./ `http://10.151.31.134:8080/`).

Option 2:

1. Go to your `{instance}/config/Infrastructure` directory
2. Edit `D2L.LP.Web.UI.Html.Bsi.config.json`
3. Change the `polymer-3` property to the `brightspace-integration (BSI)` localhost server (or your computer's hostname) - You will need a trailing `/` (e.g./ `http://10.151.31.134:8080/`)
4. Restart IIS

The config file will get overwritten during an LMS build.

### Running locally with a local web component

A common use case for running a local BSI is to test out a web component you're also working on locally. That way you can avoid releasing the component and pulling the new release into BSI until you're ready.

To link your local BSI with a local web component, follow these steps:
1. Ensure that your component has a valid `package.json` with a `name` entry
2. Ensure that BSI is already pulling in your component in its `package.json` as a dependency
3. In the component's directory, run `npm link`
4. In BSI, run `npm link <component-name>`, where `<component-name>` matches the entry in `package.json`
5. In BSI, run `rm -rf ./node_modules/<component-name>/node_modules`. This ensures that when `polymer build` is run, it does not end up with nested copies of components. **Caveat**: if your component is pulling in a new dependency that isn't already in BSI, this won't work. In this case, you can try deleting everything _except_ that new dependency, or installing that new dependency from BSI directly, without saving that to BSI's `package.json`.

Then follow the instructions in the previous section to serve BSI and point your local intance at it.

## Running Locally - Unbundled build

There is experimental support for running an unbundled BSI to improve the local developer workflow. The primary objective is to be able to modify local web components and see the changes in the local LMS without needing to keep re-running BSI's npm run build.

The unbundled workflow uses the `@open-wc/es-dev-server` to serve the web components and the other BSI static assets.

### Using the Script to Unbundle your build

You can unbundle your build using the `unbundle.py` script located in the `unbundle-script` folder.

Make sure you have Python 3.X installed, if not, you can install it using chocolatey (for Windows).
```shell
choco install python3
```

Installing Python on Mac using Homebrew:
```
brew install python
```

Once you have Python installed, running the script is simple. To unbundle your BSI all you need to do is run the following command.
```shell
python unbundle-script/unbundle.py --component-path="<path of component to unbundle>"
```

For example, if I wanted to unbundle my Activities repo, the command could look like this.
```shell
python unbundle-script/unbundle.py --component-path="C:\Users\d2l-employee\Developer\activities"
```

#### Advanced Script Usage

Running the script with only the `--component-path` argument makes some assumptions about your developer machine and setup. There are several optional arguments that can be passed to the script to make it work for your setup.

| Flag name            | Flag purpose                                                                                                                                                                     |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--bsi-path`           | Optional: This is the full-path to your BSI repo. If not passed, the script assumes the location of the script as the BSI repo.                                                  |
| `-cp`/`--component-path`     | Required: This is the full-path to the component you want to unbundle.                                                                                                           |
| `--instance-path`      | Optional: This is the full-path to your LMS instances. If not passed, defaults to `C:\D2L\instances`.                                                                            |
| `--web-server-path`    | Optional: This is the path of your BSI node web server. If not passed, defaults to `http://localhost:8080`.                                                                      |
| `--instance-name`      | Optional: This is the name of the LMS instance to unbundle. If not passed, defaults to `lsone`.                                                                                  |
| `-d`/`--dry`             | Optional: This only outputs the commands that will be run and does not actually run them.                                                                                        |
| `-fe`/`--front-end-only` | Optional: This flag only unbundles the front-end components (useful if your LMS is on a different 'machine'). Cannot be used in combination with the `-be\--back-end-only` flag. |
| `-be`/`--back-end-only`  | Optional: This flag only unbundles the back-end components (useful if your BSI is on a different 'machine'). Cannot be used in combination with the `-fe\--front-end-only` flag. |

Examples:

Using a custom BSI path and a custom LMS instance name.
```shell
python unbundle-script/unbundle.py --component-path="C:\Users\d2l-employee\Developer\activities" --bsi-path="C:\Users\d2l-employee\Developer\bsi" --instance-name="lstwo"
```

Dry-running the list of commands that will be run for a custom BSI path and a custom LMS instance path.
```shell
python unbundle-script/unbundle.py --component-path="C:\Users\d2l-employee\Developer\activities" --bsi-path="C:\Users\d2l-employee\Developer\bsi" --instance-path="C:\Users\d2l-employee\instances" --dry
```

Only executing the front-end unbundling procedure.
```shell
python unbundle-script/unbundle.py --component-path="C:\Users\d2l-employee\Developer\activities" --front-end-only
```

#### Running Unit Tests for the Unbundle Script

You can run the Unit Tests for the Unbundle Script using this command.

```shell
python unbundle-script/unbundle-tests.py
```

### Manual Unbundling Instructions

**es-dev-server requires node v10 or higher**

To use this workflow first do a regular BSI build to build the static assets.

```shell
npm run build
```

Follow the instructions above for pointing your Brightspace instance at the local integration project.
In addition to adding your local BSI endpoint to the `polymer-3` config, add a new property `"import-style": "esm"`.
This instructs the LMS to reference web components using standard `import` script tags rather than using `amd` style defines.

Now start the `es-dev-server` by running

```shell
npm start
```

This will run a server to start serving the static assets from the `build` folder and the web components from the source folders.

Now you should be able to modify a local web component file, refresh the browser and immediately see your changes without doing a new build.

The `es-dev-server` configuration can be tweaked by updating `es-dev-server.config.js`.

See the following for more options:

[es-dev-server configuration](https://open-wc.org/developing/es-dev-server.html#node-version)

### Known Limitations of the unbundled build

The build uses `es-dev-server` 'modern' comptability mode to transpile the Javascript on the fly using babel. However, it doesn't currently have any support for other transformations or polyfills that are supported by `es-dev-server` because we are not using `es-dev-server` to generate the index.html file. So it should work for the evergreen browsers but won't work for IE11, and if you are using dynamic imports, they will not work on Edge < 17.

If the unbundled build proves to be useful we may put more effort into adding support for other features.

The unbundled build also uses a customized `.browserslistrc-es-dev-server` because the standard BSI `.browserslistrc` file includes IE11 which causes `es-dev-server` to throw an error as it assumes you will use it's legacy compatibility support for IE11.

## Want a slightly faster build?

When we bundle our web components, we produce an ES6 bundle for browsers who support it, and an ES5 transpiled bundle for IE11. If you don't care about IE11, you can exclude that part of the build by running `npm run build-no-es5` or `npm run serve-no-es5`.

## NPM Dependency Locking

We use a `package-lock.json` file to lock our NPM dependencies. This ensures we only pick up changes to dependencies when we explicitly ask for them and are prepared to test them.

Any command that would normally add or update `package.json` will also update `package-lock.json` -- `npm install`, `npm update` etc. Just be cognizant of the changes you're making.

### `package-lock.json` Refresh

Current versions of npm (6.8-6.10) do not always flatten package-lock.json with an `npm i`.  You may end up with many test errors like:

```
Polymer sub-dependency detected "d2l-organizations" in "d2l-activities". All Polymer dependencies must be at root level of "package-lock.json" to avoid duplicate registrations. Check that the version ranges in "package.json" do not contain anything beyond the major version.
```

If you've ensured that you aren't importing multiple versions, try the following:
1) Windows: `ri ./node_modules -Recurse -Force` or *nix: `rm -rf ./node_modules`
2) `rm package-lock.json`
3) `npm i`

This sequence will fully refresh your package-lock.json.


[Read more in the `package-lock` documentation...](https://docs.npmjs.com/files/package-locks)

## Web Components

This project serves as an integration point for our web components and we are using [Polymer CLI's](https://polymer-library.polymer-project.org/3.0/docs/apps/build-for-production) `build` command to manage common dependencies between components and generate web component bundles.

To integrate a new web component into BSI, perform the following steps:

1. Reference your component as an NPM dependency using the path to the repository plus a semver tag (e.g. `"d2l-navigation": "BrightspaceUI/navigation#semver:^3"`). **Do not include minor or patch versions.**
2. Add a JavaScript file (i.e. `d2l-my-component.js`) to the `web-components` directory that imports the new web component. (i.e. `../node_modules/my-component/my-component.js`)
3. Reference the new JavaScript file from the fragments list in `polymer.json`
4. (optional) If your component has langterms, add an entry to the `.serge-mapping.json` (e.g. `"my-component": "my-component/my-component.serge.json"`)

## Tagging & Publishing

When a pull request is merged to `master`, a version tag corresponding with the current active development release of Brightspace will be automatically applied by CI. A build number will be incremented for each build.

When a pull request is merged to a branch whose name matches our versioning scheme (e.g. `20.19.5`), a version tag for that release will be automatically applied.

For each tag, the project assets (contents of the `build` directory) will be automatically published to the Brightspace CDN by its [Travis CI job](https://travis-ci.org/Brightspace/brightspace-integration).

The publish location will be: `https://s.brightspace.com/lib/bsi/{version}/`

To skip automatic tagging and releasing, include the text `[skip release]` in your merge commit message.

## Updating LP to reference the new version of BSI

A set of [Jenkins jobs](https://prod.build.d2l/job/Dev/job/Core%20LMS/job/Sync%20BSI/) checks for new BSI versions every 10 minutes during work hours and automatically updates LP to reference your version. Although it merges the change to LP quickly, it also triggers a CI for easy tracking in case there is a problem with the assets published to the CDN. In case of failures you will receive an email from Jenkins (and a message will be sent to the `#build-triage` Slack channel), so that you can investigate and complete the process manually if needed.

This will ensure that the LP (and new CD builds) are using the latest version of BSI.

Note that this is only done on LMS `master`. For hotfixes or updates to branches you'll need to update LP manually by creating a pull request on the appropriate branch in LP
that updates the `polymer-3` line of [D2L.LP.Web.UI.Html.Bsi.config.json](https://git.dev.d2l/projects/CORE/repos/lms/browse/lp/_config/Infrastructure/D2L.LP.Web.UI.Html.Bsi.config.json)

*If you have other dependent Core Lms changes, please make sure you merge those lms changes before bumping BSI.*

Note that for testing purposes you can use the `d2l.System.BsiEndpointOverride` config variable to override the BSI endpoint on a test instance, so you don't need to wait for a quad site with the above LP updates to test your BSI changes, assuming they are not dependent on other LMS changes as well.

## Contributing
Contributions are welcome, please submit a pull request!

### Code Style

This repository is configured with [EditorConfig](http://editorconfig.org) rules and
contributions should make use of them.

[ci-url]: https://travis-ci.com/Brightspace/brightspace-integration
[ci-image]: https://travis-ci.com/Brightspace/brightspace-integration.svg?branch=master
[dependencies-url]: https://david-dm.org/Brightspace/brightspace-integration
[dependencies-image]: https://img.shields.io/david/Brightspace/brightspace-integration.svg
