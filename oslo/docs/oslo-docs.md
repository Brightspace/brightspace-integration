# What is OSLO?
*Offstack Language Overrides*, or **OSLO** provides a way for offstack web components to be able to integrate with language overrides in the LMS. Language overrides allow a customer to change the the displayed text of almost any term on the platform. For example, if you want to change all the locations that say "Assignments" to read "Dropbox" you can do that in the language management tool using language overrides.

# Seting up OSLO for your Webcomponent
## Pre-requisites
Before you can use OSLO you need to do the following:
### 1. Use Serge for translations
For more information on how to implement serge within your web component please read [Serge-Localize](https://docs.dev.d2l/index.php/Serge-Localize)
### 2. Follow the OSLO langterm naming convention
The LAIM tool used in the LMS can only accept a set of valid characters. Currently any character can be used when naming a langterm, however, if an invalid character is used, the OSLO build step will convert those characters into their equiavalent unicode representation `\uXXXX"`.
Using invalid LAIM tool characters is not advised because it causes problems when searching for the langterm using the language management tool. Searching will not return a result when using the original character that was parsed.

To mitigate these problems, the following format is recommended:
```
{grandparent}\{parent}\camelCaseTermName
```
`\` can be used to provide hierarchy to term names and allow a grouping of related terms

Valid characters include:
- `\`
- `-`
- `_`
- `:`
- `A-Z`
- `a-z`
- `0-9`

Alternative valid formats:
```
{grandparent}\{parent}\snake_case_term_name
{grandparent}\{parent}\kebab-case-term-name
{grandparent}:{parent}:camelCaseTermName
```

If you would like to test if your term name is valid visit https://regexr.com/ and use the following regex:
```
^[a-zA-Z0-9\\:_-]*$
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

# How to use OSLO and language overrides

## Using @Brightspace-UI/Core to retrieve the langterm
TODO
- [`getLocalizeOverrideResources`](https://github.com/BrightspaceUI/core/blob/master/helpers/getLocalizeResources.js#L334)
- Create a mixin using above function similar to [this](https://github.com/BrightspaceHypermediaComponents/activities/blob/master/components/d2l-activity-editor/mixins/d2l-activity-editor-lang-mixin.js)

## Creating a new collection
TODO

## Hiding a collection

TODO

In some cases, you may want to hide collections from appearing in the language management UI without deleting the terms or collection from the database. In this scenario you can add these collections to this blocked collections list and they will be hidden from the user.

## Deleting a collection
TODO

## Creating a new term
TODO

## Deleting a term
TODO

# API documentation

TODO

[create-a-link-to-api-documentation]()