---
title: Advanced
description: Learn about the details of how things are working internally.
---

# Advanced

## Static page generation

docs.page is built on-top of Next.js, which allows pages to be built and served statically. In most cases, a static HTML file will be served to users. Following the ["stale while revalidate"](https://tools.ietf.org/html/rfc5861) methodology each documentation page served lives for 30 seconds. After this time Next.js will rebuild the page behind the scenes and serve the updated HTML file on subsequent requests.

> TLDR; Each page is statically cached for 30 seconds.

However, since docs.page is a fully dynamic documentation website generator, pages which have never been accessed before will have no cached HTML to serve. In this instance, Next.js will fetch the content from GitHub and serve the HTML on demand, then cache it. Rather than blocking the request (which can be a few seconds whilst the GitHub API is queried and the HTML is generated), a loading screen is presented to the users. Once cached, users will always be presented with a static HTML file of the page.

Also keep in mind, each time a new build of docs.page (a push to the [`master`](https://github.com/invertase/docs.page) branch) is deployed, all previously cached files are lost and will have to be rebuilt again (showing a loading state).

Although only a small number of users will experience this "loading" state, docs.page provides a way to always ensure a static version of documentation pages can be served. This can be useful for high-traffic projects who want to ensure users are always served an instant HTML file for their most important pages.

To enable static page generation for your project, define the "paths" you wish to be statically built on each new build by providing a `paths` array within your `docs.json`:

```json title=docs.json
{
  "paths": ["/", "installation", "installation/android", "installation/ios"]
}
```

Next, [create a Pull Request](https://github.com/invertase/docs.page/blob/master/repositories.txt) to add your repository to the `repositories.txt` file at the root of the docs.page repository.

Whenever the project undergoes a new build, each repository within the `repositories.txt` file will be queried and the paths provided will be built.

## Indexing

By adding a `docs.json` file to your repository indexing will then be enabled. However indexing is disabled:

- If the repository has no `docs.json` file.
- If the `noindex` configuration value within the `docs.json` file is set to `true`.
- If the repository is a fork.
- If the current page is not from the repositories default branch.

## Forks / Branches / Pull Requests
