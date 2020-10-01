# What is OSLO?

*Offstack Language Overrides*, or **OSLO** provides a way for offstack web components to be able to integrate with language overrides in the LMS. Overrides allow changing the displayed text of almost any term on the platform. For example, if you want to change all occurrences of "Assignments" to "Dropbox" you can do that in the language management tool using language overrides.

*This documentation is intended for developers who would like to simply use language overrides in their web components. If you would like to see detailed documentation regarding architecture and implementation details, please visit this page [TODO - ADD LINK TO MAINTAINER DOCS]()*


# Setting up OSLO for your Webcomponent


  1. [Use Serge for translations](#use-serge-for-translations)
  2. [Follow the OSLO langterm naming convention](#follow-the-oslo-langterm-naming-convention)
  3. [Include your web component within the BSI project](#include-your-web-component-within-the-bsi-project)
  4. [Create a mixin to expose the `localize()` method](#create-a-mixin-to-expose-the-localize-method)


## Use Serge for translations

For more information on how to implement serge within your web component please read [Serge-Localize](https://docs.dev.d2l/index.php/Serge-Localize)


## Follow the OSLO langterm naming convention

The LAIM tool used in the LMS can only accept a set of valid characters. Currently OSLO will accept any character and convert characters not supported by the LAIM tool into their equivalent Unicode representation `\uXXXX"`.


> ⚠ Using invalid LAIM tool characters is not advised because it causes problems when searching for the langterm using the language management tool. Searching will not return a result when using the original character that was parsed.

To mitigate these problems, the following format is recommended:
```
{grandparent}\{parent}\camelCaseTermName
```
`\` can be used to provide hierarchy to term names and allow a grouping of related terms

**Valid characters include:**  
`\` `-` `_` `:` `@` `A-Z` `a-z` `0-9`

**Alternative valid formats:**
```
{grandparent}\{parent}\snake_case_term_name
{grandparent}\{parent}\kebab-case-term-name
{grandparent}:{parent}:camelCaseTermName
```

**Validation:**  
If you would like to test if your term name is valid visit https://regexr.com/ and use the following regex:
```
^[a-zA-Z0-9\\:_-@]*$
```


## Include your web component within the BSI project

This can be done following the [docs](https://github.com/Brightspace/brightspace-integration/blob/master/docs/web-components.md) on the BSI repo.
Specifically your component must do the following step:
> **Lang Terms**
> 
> Optionally, if your component has lang terms managed by Serge.io, add an entry to the .serge-mapping.json file:
> ```
> {
>   ...
>   "my-component": "my-component/my-component.serge.json"
>   ...
> }
> ```


## Create a mixin to expose the `localize()` method

For existing web components the `localize()` method would have been exposed when following the [`localize-mixin`](https://github.com/BrightspaceUI/core/blob/master/mixins/localize-mixin.md) documentation from `@Brightspace-UI/core`. In this case a few things will need to be changed.
- Add `resolveOverridesFunc()` to `getLocalizeResources`
- return `getLocalizeOverrideResources()` inside `if` block
- return `getLocalizeOverrideResources()` inside at end of function
**Important:** This will need to be done for each unique collection name you wish to have. (Each serge object will result in a new collection name)


### Example modifications to create an OSLO mixin

```diff
  import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
+ import { getLocalizeOverrideResources } from '@brightspace-ui/core/helpers/getLocalizeResources.js'; // NEWLY ADDED FOR OSLO
  
  export const MyComponentLocalizeMixin = superclass => class extends LocalizeMixin(superclass) {
  
      static async getLocalizeResources(langs) {
      
      
+         function resolveOverridesFunc() {                                                            // NEWLY ADDED FOR OSLO
+             return 'your-npm-package-name\\your-object-serge-name'; // Collection Name               // NEWLY ADDED FOR OSLO     
+         }                                                                                            // NEWLY ADDED FOR OSLO
          
          let translations;
          for await (const lang of langs) {
              switch (lang) {
                  case 'en':
                      translations = await import('./locales/en.js');
                          break;
                  case 'fr':
                      translations = await import('./locales/fr.js');
                      break;
                  }

-             if (translations && translations.default) {
-                 return {
-                     language: lang,
-                     resources: translations.default
-                 };
-             }
+             if (translations && translations.default) {
+                 return await getLocalizeOverrideResources(                                           // NEWLY ADDED FOR  OSLO                              
+                     lang,                                                                            // NEWLY ADDED FOR OSLO
+                     translations.default,                                                            // NEWLY ADDED FOR OSLO
+                     resolveOverridesFunc                                                             // NEWLY ADDED FOR OSLO
+                 );                                                                                   // NEWLY ADDED FOR OSLO
+             }
          }
          translations = await import('../lang/en.js');

-         return {
-             language: 'en',
-             resources: translations.default
-         };  
+         return await getLocalizeOverrideResources(                                                   // NEWLY ADDED FOR OSLO
+             'en',                                                                                    // NEWLY ADDED FOR OSLO
+             translations.default,                                                                    // NEWLY ADDED FOR OSLO
+             resolveOverridesFunc                                                                     // NEWLY ADDED FOR OSLO
+         );                                                                                           // NEWLY ADDED FOR OSLO
      }
  }
```


#### Resolve Override Function

This function must return the collection name for the collection the mixin is being used for.  
Your collection name is determined by npm package name combined with the serge object name.

**Example:**
`npm` package name
```javascript
//package.json
{
    "name": "d2l-activities"
}
```

`serge` object name
```javascript
//repo.serge.json 
{
    "name": "activityEditor",
    "parser_plugin": {
      "plugin": "parse_js"
    },
    "source_match": "en\\.js$",
    "source_dir": "components/d2l-activity-editor/lang",
    "output_file_path": "components/d2l-activity-editor/lang/%LANG%.js",
    "output_lang_rewrite": [
      "ar-sa ar",
      "zh-tw zh-tw"
    ]
  }
```
with the two above objects, the resulting collection name will be:
`d2l-activities\activityEditor`


```javascript
function resolveOverridesFunc() {
    return 'd2l-activities\\activityEditor'; // Collection Name     
} 
```
> **Note:** Make sure to escape the backslash `\`

### Using your mixin
Your component would then use this mixin and have access to the `localize()` method


```javascript
// en.js
export const val = {
  'hello': 'Hello {firstName}!'
};
```

```javascript
class MyComponent extends ComponentLocalizeMixin(LitElement) {
    render() {
        return html`<p>${this.localize('hello', {firstName: 'Mary'})}</p>`;
    }
}
```

# How to work with language overrides
1. [Background - The Language Management Tool](#background---the-language-management-tool)
2. [Creating a new collection](#creating-a-new-collection)
3. [Hiding a collection](#hiding-a-collection)
4. [Creating a new term](#creating-a-new-term)
5. [Usage in a web component](#usage-in-a-web-component)
6. [Deleting a term or collection](#deleting-a-term-or-collection)


## Background - The Language Management Tool

The language management tool is where Brightspace admins can search langterms and change their default values.

Get to the tool by navigating in Brightspace:  
> Gear(Settings) > Language Management > en-US - English (US)


![LangManagementTool](langmanagementtool.PNG)

Selecting "Web Components" from the Tool Package dropdown and hitting search will yield the above table. The table has 6 columns:
- Package
- Collection
- Term Name
- Term Type Default Value
- Custom Value

**Package**  
This is the tool package. When using OSLO with webcomponents your tool package will always be "WebComponents".

**Collection**  
The collection is a grouping of related Term Names. This grouping is up to the discretion of the group creating the terms. A new collection will be automatically created for every object in your [`serge.json`](#use-serge-for-translations) file.

Each collection will have the following naming convention:  
`"{npm-package-name}\{serge-object-name}"`

**Term Name**  
The term name listed in the created language files. This is the object referenced throughout the web component that will be replaced with translations or custom values by the language management tool.

Example terms can be seen in the [activities repository](https://github.com/BrightspaceHypermediaComponents/activities/blob/master/components/d2l-activity-editor/lang/en.js)

**Term Type Default Value**  
This is the default text that will appear throughout the application if left unmodified.

**Custom Value**  
An overridden value to replace the default value. This will be used by Brightspace Admins.


## Creating a new collection
A new collection can be created by making a new project using [Serge](https://docs.dev.d2l/index.php/Serge-Localize). When OSLO builds it will automatically add your collection to the LMS. The new collection name will be a combination of npm package name and serge project name
```
"{npm-package-name\serge-object-name}"
```

**Example**  
The following example will result in a collection name of `"d2l-activities\activityEditor"`

`npm` package name
```javascript
//package.json
{
    "name": "d2l-activities"
}
```

`serge` object name
```javascript
//repo.serge.json 
{
    "name": "activityEditor",
    "parser_plugin": {
      "plugin": "parse_js"
    },
    "source_match": "en\\.js$",
    "source_dir": "components/d2l-activity-editor/lang",
    "output_file_path": "components/d2l-activity-editor/lang/%LANG%.js",
    "output_lang_rewrite": [
      "ar-sa ar",
      "zh-tw zh-tw"
    ]
  }
```


## Hiding a collection

Collections can be hidden from the language managment tool UI without deleting the terms or collection from the database.

> ⚠ This should be used only sparingly and temporarily when needed, but there are some situations where you need to hide certain collections from the Language Management tool.

Scenarios you may want to hide a term or collection:
- TODO Scenario 1
- TODO Scenario 2
- TODO Scenario 3

To hide a collection, add your collection name to [this blocked collections list](https://github.com/Brightspace/lms/blob/master/lp/framework/core/D2L/lang/Provider/BlockedCollections.cs)

```diff
public static HashSet<string> BlockedCollectionsHash {
    get {
        return new HashSet<string>() {
          //Temporarily blocking these collections from language management
          //until we are using OSLO in these repos and can override
          @"d2l-activities\quickEval",
          @"d2l-activities\quickEval_EXPERIMENTAL",
+         @"{collection-name-you-want-to-block}",
    };
  }
}
```


## Creating a new term
Term Names are created in the lang files referenced by the serge project. Please be aware of the [OSLO naming convention](#follow-the-oslo-langterm-naming-convention)

The lang files are javascript files that export an object containing all lang terms in the collection.

```javascript
// en.js (in activities)
export default {
  "editor\\btnEditReleaseConditions": "Edit Release Conditions", // edit release conditions button
  "editor\\btnAddReleaseCondition": "Add Release Condition", // add release condition button
  "editor\\btnCreateNew": "Create New", // create new button
  // ...
  "content\\description": "Description", // Text label for description input field
  "content\\availabilityHeader": "Availability Dates", // availability header
}
```

To create a new term name, simply add a new item to the object in the form:
```javascript
"{termNameFollowingNamingConvention}": "Default Value"}
```


## Usage in a web component
1. Use the mixin created in the [Create a mixin](#create-a-mixin-to-expose-the-localize-method) section
2. call `this.localize("your-desired-term-name")` in your `render()` method


## Deleting a term or collection

After deleting or renaming a term inside a language file, it must also be removed from the LMS Database. Without these steps, an obsolete term or collection would remain in the Language Management UI which could be confusing for end users. Another consequence of this is that old terms that have not been populated with the `LangTypeId` in the `LANG_OBJECTS` table will have the type set to `NULL`. This will cause the Term Type column to be left empty for those terms on the Language Management UI.

**Steps:**
1. There are migration script helper sprocs that can easily be used to delete langterms. Create a migration script to delete the old langterm by using a script extension like [this](https://docs.dev.d2l/index.php/Migration_Script_Extensions#Delete_Lang_Terms)
2. To get the required `PackageName`, `CollectionName`, and `TermName` parameters for the sproc you can run a query like this:
```sql
SELECT
    P.Name as PackageName,
    C.Name as CollectionName,
    O.Name as TermName 
FROM LANG_OBJECTS O
JOIN LANG_COLLECTIONS C
    ON (O.CollectionId = C.CollectionId)
JOIN LANG_PACKAGES P
    ON (P.PackageId = C.PackageId)
WHERE O.Name = 'txtInsights';
```
Alternatively, you can directly enter this query into the Select clause of the migration script.

3. To easily delete an entire collection (and all contained terms) you can include the following query in the migration script using the collection name instead. This will delete all terms in the collection as well as the collection itself.

```sql
SELECT
    P.Name as PackageName,
    C.Name as CollectionName,
    O.Name as TermName 
FROM LANG_OBJECTS O
JOIN LANG_COLLECTIONS C
    ON (O.CollectionId = C.CollectionId)
JOIN LANG_PACKAGES P
    ON (P.PackageId = C.PackageId)
WHERE C.Name = 'd2l-rubric\d2l-rubric'
```

An example of where this is done, can be found [here](https://search.d2l.dev/xref/lms/src/db/dbchange/20.20.10.0/main/pre/DE40300_Delete_Non_Activity_Collections.sql?r=8c99fd5a)

5. The migration script can be tested locally by directly running it in SQL server, then querying the DB to see those terms have been deleted from the `LANG_OBJECTS` table.
6. Create a pull request and after it's approved, merge the script into master. The updated DB with the terms removed should appear in the next build.



# API documentation

TODO

[create-a-link-to-api-documentation]()
