import type { MetaDescriptor } from "@remix-run/react";

export function getMetadata(): MetaDescriptor[] {
  const title = "docs.page | Ship documentation, like you ship code";
  const description =
    "Publish beautiful online documentation instantly,from your code editor using markdown and a public GitHub repository.";
  const image = "https://docs.page/social-preview.png";

  return [
    {
      title,
    },
    {
      name: "description",
      content: description,
    },
    {
      property: "og:title",
      content: title,
    },
    {
      property: "og:description",
      content: description,
    },
    {
      property: "og:image",
      content: image,
    },
    {
      name: "twitter:title",
      content: title,
    },
    {
      name: "twitter:description",
      content: description,
    },
    {
      name: "twitter:site",
      content: "@invertaseio",
    },
    {
      name: "twitter:image",
      content: image,
    },
  ];
}
