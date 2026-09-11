import { describe, expect, test } from "bun:test";
import { utmProperties, utmQueryString } from "./utm";

const url = (search: string) => new URL(`https://docs.page/${search}`);

describe("utmProperties", () => {
  test("returns nothing when no utm params are present", () => {
    expect(utmProperties(url(""))).toEqual({});
    expect(utmProperties(url("?ref=hn"))).toEqual({});
  });

  test("collects the recognised params", () => {
    expect(utmProperties(url("?utm_source=x&utm_campaign=launch"))).toEqual({
      utm_source: "x",
      utm_campaign: "launch",
    });
  });
});

describe("utmQueryString", () => {
  test("is empty when no utm params are present", () => {
    expect(utmQueryString(url(""))).toBe("");
  });

  test("forwards a subset in the recognised order", () => {
    expect(utmQueryString(url("?utm_campaign=launch&utm_source=x"))).toBe(
      "?utm_source=x&utm_campaign=launch",
    );
  });

  test("forwards all five params", () => {
    expect(
      utmQueryString(
        url(
          "?utm_source=x&utm_medium=cpc&utm_campaign=launch&utm_term=docs&utm_content=hero",
        ),
      ),
    ).toBe(
      "?utm_source=x&utm_medium=cpc&utm_campaign=launch&utm_term=docs&utm_content=hero",
    );
  });

  test("drops unknown params", () => {
    expect(utmQueryString(url("?utm_source=x&ref=hn&redirect=/evil"))).toBe(
      "?utm_source=x",
    );
  });

  test("encodes values so they cannot break out of the link", () => {
    expect(
      utmQueryString(
        url(
          `?utm_campaign=${encodeURIComponent('spring sale" onclick="alert(1)')}&utm_source=${encodeURIComponent("a&utm_medium=injected")}`,
        ),
      ),
    ).toBe(
      "?utm_source=a%26utm_medium%3Dinjected&utm_campaign=spring+sale%22+onclick%3D%22alert%281%29",
    );
  });
});
