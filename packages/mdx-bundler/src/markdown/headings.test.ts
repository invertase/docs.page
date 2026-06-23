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
});
