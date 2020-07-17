# Web Components and Component-Based Applications in BSI

BSI serves as an integration point for our web components and component-based applications. We're using [open-wc](https://open-wc.org/)'s Rollup tooling to build our components and manage dependencies.

## Integrating a New Component

To integrate a new web component into BSI, perform the following steps:

### Add Dependency

You can add your component as an NPM dependency either using a GitHub reference to a public repo or from NPM directly.

As a GitHub reference:

```json
// package.json
{
  "devDependencies": {
    "d2l-navigation": "BrightspaceUI/navigation#semver:^3"
  }
}
```

**Important**: do not include minor or patch versions for GitHub-based dependencies as it can result in duplicate copies of components, and consequently browser errors related to multiple definitions of those components with the same tag name.

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

### Lang Terms

Optionally, if your component has lang terms managed by Serge.io, add an entry to the `.serge-mapping.json` file:

```json
{
  ...
  "my-component": "my-component/my-component.serge.json"
  ...
}
```

## Using Components on Brightspace Pages

Once a component is included in BSI, you can then start to reference it from pages in Brightspace.

### Create an IBsiAsset

In your project, add a new `IBsiAsset` representation of your component's file in BSI. The easiest way to do this is through Visual Studio's `Add` > `New Item...` menu, select `Desire2Learn` and then `BsiAsset`. Name your asset `{ComponentName}Module.codegen`.

The contents of the file should look like this:

```xml
<?xml version="1.0" encoding="utf-8"?>
<bsiAsset xmlns="http://schemas.desire2learn.com/codegen/bsiAsset/v3.0">
  <typeName>D2L.YourProduct.Your.Namespace.ComponentNameModule</typeName>
  <path>node_modules/<your-component>/path/to/component</path>
  <extension>js</extension>
</bsiAsset>
```

The path here should match exactly what was included in the build earlier in BSI's `/rollup/rollup-wc.config.js` file.

Build your solution once so that the codegen can generate a class for your component.

### Load the BSI Asset

The last step is to actually load your component's asset file whenever it gets rendered to a page. Usually it's easiest to wrap your component in a [View-Data-Based Control](https://docs.dev.d2l/index.php/HOWTO_Create_a_View-Data-Based_Control), load the asset from the control's renderer, and then use that control whenever you want to render your component.

To load the asset, dependency inject `IBsiLoader` and call `LoadModules()`:

```csharp
partial class MyComponent {

  internal sealed class Renderer : IViewDataRenderer<MyComponent> {

    private readonly IBsiLoader m_bsiLoader;

    public Renderer( IBsiLoader bsiLoader ) {
      m_bsiLoader = bsiLoader;
    }

    void IViewDataRenderer<MyComponent>.Render(
        IHtmlRenderContext rc,
        MyControl viewData
      ) {

      m_bsiLoader.LoadModules( ComponentNameModule.Instance );

      rc.Writer.WriteTagBeginFull("d2l-my-component");
      rc.Writer.WriteTagEnd("d2l-my-component");

    }

  }

}
```

Now whenever `MyComponent` is rendered in a view, you should see your component's BSI asset loaded from the CDN.

## Local Component Development

A common use case for running a local BSI is to test out a web component you're also working on locally with a Brightspace instance. That way you can avoid releasing the component and pulling the new release into BSI until you're ready.

To link your local BSI with a local web component, follow these steps:
1. Ensure that your component has a valid `package.json` with a `name` entry
2. Ensure that BSI is already pulling in your component in its `package.json` as a dependency (see above)
3. In the component's directory, run `npm link`
4. In BSI, run `npm link <component-name>`, where `<component-name>` matches the `name` entry in `package.json`
5. Follow the instructions in the [main README](../README.md) on building & running a local BSI and configuring Brightspace to use it

This process creates a symbolic link from BSI's `node_modules/<your-component>` directory to the local location of the component on your system. If you want to revert things back, simply delete the directory and `npm update`. Your component will then be freshly pulled from NPM.
