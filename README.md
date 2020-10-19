# brightspace-integration

[![Build status](https://travis-ci.com/Brightspace/brightspace-integration.svg?branch=master)](https://travis-ci.com/Brightspace/brightspace-integration)
[![Dependency Status](https://img.shields.io/david/Brightspace/brightspace-integration.svg)](https://david-dm.org/Brightspace/brightspace-integration)

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

### Using the Configuration File

Go to the `{instance}/config/Infrastructure` directory and edit `D2L.LP.Web.UI.Html.Bsi.config.json`:

```json
{
  "endpoint": "http://localhost:8080/",
  "env": "dev"
}
```

Set the `endpoint` to the hostname & port where your local BSI is running. Typically this is `http://localhost:8080/`, but could vary if BSI is running on a different machine. Don't forget the trailing slash!

Then, set the `env` to match the environment of the BSI build that's running -- either "dev" or "prod".

Finally, restart IIS.

### Using Configuration Variables

In the Config Variable Browser of the Brightspace instance, set the value of the `d2l.System.BsiEndpointOverride` variable to the hostname & port where your local BSI is running. Typically this is `http://localhost:8080/`, but could vary if BSI is running on a different machine. Don't forget the trailing slash!

Then, set the `d2l.System.BsiEnvironmentOverride` config variable to match the environment of the BSI build that's running -- either "Development" or "Production".

## Web Components and Component-Based Applications

A typical use-case for running a local BSI is to work on a local web component or web component-based application alongside a Brightspace instance.

**Learn More:** [Web Components and Component-Based Applications in BSI](docs/web-components.md)

## Making a BSI Release

From 7:30am EST to 5:30pm PST (8:30am EDT to 6:30pm PDT), a Github Actions workflow runs every hour to check for new BSI dependency releases.  If changes exist, a PR is opened with the `package-lock.json` updates (or the existing open PR is updated).  Approving and merging this PR will kick off the automated tagging & release processes and a new version of BSI will be released.

If you need to add a new dependency to `package.json` or update a major version, you'll need to create this PR manually [using the steps below](#manually-refreshing-package-lockjson).  Updates to a cert or hotfix branch are also manual to make sure only what you need is updated.

### Manually refreshing `package-lock.json`

We use a `package-lock.json` file to lock our NPM dependencies. This ensures we only pick up changes to dependencies when we explicitly ask for them and are prepared to test them.

To fully refresh the lock file:
1) Windows: `ri ./node_modules -Recurse -Force` or *nix: `rm -rf ./node_modules`
2) `rm package-lock.json`
3) `npm i`

### Subdependency Conflicts

We never want to include multiple versions of the same dependency in our BSI builds. This would mean our users would end up downloading different versions of the same dependency, which for web components would result in the same custom element being registered multiple times, which isn't allowed.

If this happens, you'll see this error in the browser console:

> Uncaught DOMException: Failed to execute 'define' on 'CustomElementRegistry': the name "d2l-dependency" has already been used with this registry

BSI's CI attempts to detect this error by searching through the `package-lock` file for nested copies of the same thing. If it detects a duplicate, you'll get this CI failure:

> Duplicate sub-dependency detected "d2l-dependency" in "d2l-some-other-dependency". All front-end dependencies must be at root level of "package-lock.json" to avoid duplicate registrations. Check that the version ranges in "package.json" do not contain anything beyond the major version.

The most common cause of these errors is multiple projects referencing the same dependency via GitHub using different semver ranges in their `package.json` files. You can search the `package-lock.json` to find them. To solve the problem, ensure that all GitHub dependency references are identical.

### Pull Request

Make a pull request. Be aware of the new changes to the `package-lock.json` file, which may not be related to your project. If you pick up changes from other D2L projects, it's a good pratice to notify those folks in your pull request.

Once your pull request is approved and CI has passed, merge and the automatic tagging & releasing processes will start.

### Automatic Tagging

When a pull request is merged to `master`, a unique version tag corresponding with the current active development release of Brightspace will be automatically applied.

When a pull request is merged to a branch whose name matches our versioning scheme (e.g. `20.20.8`), a version tag for that release will be automatically applied.

To skip automatic tagging, include the text `[skip release]` in your merge commit message.

### Publishing to the CDN

For each tag, all BSI assets (contents of the `build` directory) will be published to the Brightspace CDN by its [Travis CI job](https://travis-ci.com/github/Brightspace/brightspace-integration).

The publish location will be: `https://s.brightspace.com/lib/bsi/{version}/`

### Updating Brightspace to reference new versions of BSI

For non-hotfix releases, an automated process exists to automatically update Brightspace to point at the latest release of BSI.

**Learn More:** [Brightspace BSI Sync Jobs](docs/sync-jobs.md)
