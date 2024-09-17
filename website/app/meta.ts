import type { LinkDescriptor } from "@remix-run/node";
import type { MetaDescriptor } from "@remix-run/react";

export function getMetadata(): MetaDescriptor[] {
  const title = "docs.page | Ship documentation, like you ship code";
  const description =
    "Publish beautiful online documentation instantly, from your code editor using markdown and a public GitHub repository.";
  const image = "https://docs.page/_docs.page/social-preview.png";

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

export function getLinkDescriptors(): LinkDescriptor[] {
  return [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/_docs.page/favicon/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/_docs.page/favicon/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/_docs.page/favicon/favicon-16x16.png",
    },
    {
      rel: "manifest",
      href: "/_docs.page/favicon/site.webmanifest",
    },
    {
      rel: "mask-icon",
      href: "/_docs.page/favicon/safari-pinned-tab.svg",
      color: "#5bbad5",
    },
  ];
}
