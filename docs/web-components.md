# Web Components and Component-Based Applications in BSI

BSI serves as an integration point for our web components and component-based applications. We're using [open-wc](https://open-wc.org/)'s Rollup tooling to build our components and manage dependencies.

## Integrating a New Component

To integrate a new web component into BSI, perform the following steps:

### Add Dependency

You can add your component as an NPM dependency either using a GitHub reference or from NPM directly.

As a GitHub reference:

```json
// package.json
{
  "devDependencies": {
    "d2l-navigation": "BrightspaceUI/navigation#semver:^3"
  }
}
```

**Important**: do not include minor or patch versions for GitHub-based dependencies

Alternately, if your component is published to NPM you can pull it in that way:

```json
// package.json
{
  "devDependencies": {
    "@brightspace-ui/core": "^1"
  }
}
```

### Include it in the build

Inside `/rollup/rollup-wc.config.js`, add your component to either the `componentFiles` (for simple web components) or `appFiles` (for component-based applications) collections.

```javascript
const componentFiles = [
  ...
  './node_modules/<your-component>/path/to/component.js,
  ...
]
const appFiles = [
  ...
  './node_modules/<your-app/app.js'
]
```

Until the legacy Polymer build is retired, also add an entry to the `fragments` collection in `polymer.json`:

```json
{
  "fragments": [
    ...
    "./node_modules/<your-app/app.js",
    ...
  ]
}
```

### Lang Terms

Optionally, if your component has lang terms managed by Serge.io, add an entry to the `.serge-mapping.json` file:

```json
{
  ...
  "my-component": "my-component/my-component.serge.json"
  ...
}
```

## Local Component Development

A common use case for running a local BSI is to test out a web component you're also working on locally with a Brightspace instance. That way you can avoid releasing the component and pulling the new release into BSI until you're ready.

To link your local BSI with a local web component, follow these steps:
1. Ensure that your component has a valid `package.json` with a `name` entry
2. Ensure that BSI is already pulling in your component in its `package.json` as a dependency (see above)
3. In the component's directory, run `npm link`
4. In BSI, run `npm link <component-name>`, where `<component-name>` matches the entry in `package.json`
5. Follow the instructions in the [main README](../README.md) on building & running a local BSI and configuring Brightspace to use it