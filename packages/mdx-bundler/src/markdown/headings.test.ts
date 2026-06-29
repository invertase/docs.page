import { describe, expect, test } from "bun:test";
import { extractHeadingNodes } from "./headings";

describe("extractHeadingNodes", () => {
  test("strips HTML and markdown link syntax from heading titles", () => {
    const headings = extractHeadingNodes(
      '## [<i class="fa-fw fa-solid fa-users"></i>&nbsp; Actors](/core-concepts/actors)',
    );

    expect(headings).toHaveLength(1);
    expect(headings[0]?.title).toBe("Actors");
    expect(headings[0]?.id).toBe("actors");
  });

  test("keeps plain heading titles", () => {
    const headings = extractHeadingNodes("## Plain Title");

    expect(headings[0]?.title).toBe("Plain Title");
    expect(headings[0]?.id).toBe("plain-title");
  });

  test("extracts markdown link label without URL", () => {
    const headings = extractHeadingNodes("## [Linked Title](/some/path)");

    expect(headings[0]?.title).toBe("Linked Title");
  });

  test("strips inline markdown links from mixed heading titles", () => {
    const headings = extractHeadingNodes(
      "## When [docs.page](https://docs.page) fits",
    );

    expect(headings[0]?.title).toBe("When docs.page fits");
    expect(headings[0]?.id).toBe("when-docspage-fits");
  });

  test("strips inline code and emphasis from heading titles", () => {
    expect(
      extractHeadingNodes("## Using `docs.page` in your project")[0]?.title,
    ).toBe("Using docs.page in your project");
    expect(extractHeadingNodes("## **Bold** and *italic* text")[0]?.title).toBe(
      "Bold and italic text",
    );
    expect(extractHeadingNodes("## ~~strikethrough~~ heading")[0]?.title).toBe(
      "strikethrough heading",
    );
    expect(extractHeadingNodes("## _underscore_ emphasis")[0]?.title).toBe(
      "underscore emphasis",
    );
  });

  test("strips mixed inline markdown from heading titles", () => {
    const headings = extractHeadingNodes(
      "## Mix `code`, [link](/path), and **bold**",
    );

    expect(headings[0]?.title).toBe("Mix code, link, and bold");
    expect(headings[0]?.id).toBe("mix-code-link-and-bold");
  });

  test("strips markdown inside link labels", () => {
    const headings = extractHeadingNodes(
      "## When [`docs.page`](https://docs.page) fits",
    );

    expect(headings[0]?.title).toBe("When docs.page fits");
  });
});
