# Brightspace - BSI Sync Jobs

A set of [Jenkins jobs](https://prod.build.d2l/job/Dev/job/Core%20LMS/job/Sync%20BSI/) check for new BSI versions every 10 minutes during work hours and automatically update the configuration file to reference new versions. The update will be merged immediately, however CI is also triggerd for easy tracking. If a failure occurs, you will receive an email from Jenkins and a message will be sent to the `#build-triage` Slack channel. You should investigate and complete the process manually if needed.

**Important:** If you have other dependent LMS changes, please make sure you merge those before bumping BSI.

## Hotfixes

This automation is only done on LMS `master`. For hotfixes or updates to branches, you'll need to manually update the `endpoint` entry in [D2L.LP.Web.UI.Html.Bsi.config.json](https://git.dev.d2l/projects/CORE/repos/lms/browse/lp/_config/Infrastructure/D2L.LP.Web.UI.Html.Bsi.config.json) on the appropriate branch.

## Config Variable

For testing purposes, you can use the `d2l.System.BsiEndpointOverride` config variable to override the BSI endpoint on a test instance. That way you don't need to wait for a quad site with the above updates to test your BSI changes. This assumes they are not dependent on other LMS changes as well.