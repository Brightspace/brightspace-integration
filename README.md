# brightspace-integration

[![Build status][https://travis-ci.com/Brightspace/brightspace-integration.svg?branch=master]][https://travis-ci.com/Brightspace/brightspace-integration]
[![Dependency Status][https://img.shields.io/david/Brightspace/brightspace-integration.svg]][https://david-dm.org/Brightspace/brightspace-integration]

This project brings together many off-stack components, libraries and modules for inclusion into a particular build of Brightspace.

## Installation

```shell
npm install
```

## Building & Running a Local BSI

There are two ways to build and run a local BSI, both with their pros & cons.

### Development Build

Use this build for rapid local development. It supports hot reloading, meaning local changes will automatically be picked up after reloading your browser. The build output is less optimized, so in-browser performance may be slightly degraded.

```shell
# starts a server on port 8080
npm start
```

**Important:** make sure the Brightspace instance using this build of BSI is [configured to be in "development" mode](#configuring-brightspace-to-use-a-local-bsi).

### Production Build

This is the same build that we use for production, and closely reflects how production sites will behave. It's more optimized and will perform better in a browser. However, the production build takes several minutes to complete, does not work with `npm link`-ed local dependencies, and will need to be re-run after each modification. It is therefore not suitable for rapid development & prototyping.

```shell
# build to `/build` directory
npm run build

# starts a server on port 8080
npm run start:prod
```

**Important:** make sure the Brightspace instance using this build of BSI is [configured to be in "production" mode](#configuring-brightspace-to-use-a-local-bsi).

## Configuring Brightspace to Use a Local BSI

Once you have a local BSI built and running, you need to tell the Brightspace instance that you'd like to use it. There are a couple ways to do this:

### Using Configuration Variables

In the Config Variable Browser of the Brightspace instance, set the value of the `d2l.System.BsiEndpointOverride` variable to the hostname & port where your local BSI is running. Typically this is `http://localhost:8080/`, but could vary if BSI is running on a different machine. Don't forget the trailing slash!

Then, set the `d2l.System.BsiEnvironmentOverride` config variable to match the environment of the BSI build that's running -- either "Development" or "Production".

### Using the Configuration File

Go to the `{instance}/config/Infrastructure` directory and edit `D2L.LP.Web.UI.Html.Bsi.config.json`:

```json
{
  "endpoint":  "http://localhost:8080/",
  "env": "dev"
}
```

Set the `endpoint` to the hostname & port where your local BSI is running. Typically this is `http://localhost:8080/`, but could vary if BSI is running on a different machine. Don't forget the trailing slash!

Then, set the `env` to match the environment of the BSI build that's running -- either "dev" or "prod".

Finally, restart IIS.

## Web Components and Component-Based Applications

A typical use-case for running a local BSI is to work on a local web component or web component-based application alongside a Brightspace instance.

Learn More: [Web Components and Component-Based Applications in BSI](docs/web-components.md)

## NPM Dependency Locking

We use a `package-lock.json` file to lock our NPM dependencies. This ensures we only pick up changes to dependencies when we explicitly ask for them and are prepared to test them.

Any command that would normally add or update `package.json` will also update `package-lock.json` -- `npm install`, `npm update` etc. Just be cognizant of the changes you're making.

### `package-lock.json` Refresh

Current versions of npm (6.8-6.10) do not always flatten package-lock.json with an `npm i`.  You may end up with many CI errors like:

```
Polymer sub-dependency detected "d2l-organizations" in "d2l-activities". All Polymer dependencies must be at root level of "package-lock.json" to avoid duplicate registrations. Check that the version ranges in "package.json" do not contain anything beyond the major version.
```

If you've ensured that you aren't importing multiple versions, try the following:
1) Windows: `ri ./node_modules -Recurse -Force` or *nix: `rm -rf ./node_modules`
2) `rm package-lock.json`
3) `npm i`

This sequence will fully refresh your package-lock.json.

Learn More: [`package-lock` NPM documentation](https://docs.npmjs.com/files/package-locks)

## Tagging & Publishing

When a pull request is merged to `master`, a version tag corresponding with the current active development release of Brightspace will be automatically applied by CI. A build number will be incremented for each build.

When a pull request is merged to a branch whose name matches our versioning scheme (e.g. `20.19.5`), a version tag for that release will be automatically applied.

For each tag, the project assets (contents of the `build` directory) will be automatically published to the Brightspace CDN by its [Travis CI job](https://travis-ci.com/github/Brightspace/brightspace-integration).

The publish location will be: `https://s.brightspace.com/lib/bsi/{version}/`

To skip automatic tagging and releasing, include the text `[skip release]` in your merge commit message.

### Updating Brightspace to reference the new version of BSI

A set of [Jenkins jobs](https://prod.build.d2l/job/Dev/job/Core%20LMS/job/Sync%20BSI/) checks for new BSI versions every 10 minutes during work hours and automatically updates the configuration file to reference new versions. Although it merges the change quickly, CI is also triggerd for easy tracking in case there is a problem. In case of failures, you will receive an email from Jenkins (and a message will be sent to the `#build-triage` Slack channel), so that you can investigate and complete the process manually if needed.

This will ensure that the LP (and new CD builds) are using the latest version of BSI.

Note that this is only done on LMS `master`. For hotfixes or updates to branches you'll need to update manually by creating a pull request on the appropriate branch in LP
that updates the `endpoint` line of [D2L.LP.Web.UI.Html.Bsi.config.json](https://git.dev.d2l/projects/CORE/repos/lms/browse/lp/_config/Infrastructure/D2L.LP.Web.UI.Html.Bsi.config.json)

*If you have other dependent Core Lms changes, please make sure you merge those lms changes before bumping BSI.*

Note that for testing purposes you can use the `d2l.System.BsiEndpointOverride` config variable to override the BSI endpoint on a test instance, so you don't need to wait for a quad site with the above LP updates to test your BSI changes, assuming they are not dependent on other LMS changes as well.
