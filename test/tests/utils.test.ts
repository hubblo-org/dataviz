import { describe, expect, it } from "vitest";
import { hierarchy } from "d3";
import { dcData, nestedDcData } from "../data/data";
import { formatForTreemap, normalizeValues, sanitizeNumber } from "../../src";
import { parseToBoolean } from "../../src/utils";
import { Leaf, Node } from "../../src/types/dataviz";

describe("normalizeValues test suite", () => {
  it("normalizes numeric values for each property of an element to a quality", () => {
    const dataCenters = [
      {
        type: "colocation",
        status: "open",
        power: 1,
        waterUsage: 2,
        surface: 500
      },
      {
        type: "colocation",
        status: "open",
        power: 3,
        waterUsage: 3,
        surface: 2750
      },
      {
        type: "hyperscaler",
        status: "open",
        power: 5,
        waterUsage: 5,
        surface: 5000
      },
      {
        type: "colocation",
        status: "open",
        power: 7.5,
        waterUsage: 6,
        surface: 7500
      },
      {
        type: "hyperscaler",
        status: "open",
        power: 10,
        waterUsage: 8,
        surface: 10000
      }
    ];
    const normalizedData = normalizeValues(dataCenters);

    const pertinentProperties = ["power", "waterUsage", "surface"];

    pertinentProperties.forEach((property) => {
      expect(normalizedData[0][property]).toStrictEqual("low");
      expect(normalizedData[1][property]).toStrictEqual("average");
      expect(normalizedData[2][property]).toStrictEqual("average");
      expect(normalizedData[3][property]).toStrictEqual("average");
      expect(normalizedData[4][property]).toStrictEqual("high");
    });
  });
});

describe("sanitizeNumber test suite", () => {
  it("returns a number if the parsed string can be cast as number", () => {
    const string = "456";
    const result = sanitizeNumber(string);
    expect(result).toStrictEqual(456);
  });
  it("throws an error if the parsed string cannot be cast as number", () => {
    const string = "xyz";
    expect(() => sanitizeNumber(string)).toThrowError(
      /^Provided string cannot be cast as number!$/
    );
  });
});

describe("parseToBoolean test suite", () => {
  it("parses a string to return the wanted boolean", () => {
    const trueString = "true";
    const falseString = "false";

    const expectedTrue = parseToBoolean(trueString);
    expect(expectedTrue).toStrictEqual(true);

    const expectedFalse = parseToBoolean(falseString);
    expect(expectedFalse).toStrictEqual(false);
  });

  it("throws an error if the string cannot be parsed as boolean", () => {
    const string = "not a boolean";
    expect(() => parseToBoolean(string)).toThrowError(
      /Provided string cannot be parsed as a boolean$/
    );
  });
});

describe("formatForTreemap test suite", () => {
  it("converts a data structure to a tree structure usable for a treemap", () => {
    const categories = Object.keys(dcData[0]).filter((key) => typeof dcData[0][key] === "number");
    const tree = formatForTreemap("dcData", categories, dcData);
    tree.children.forEach((leaf) => {
      leaf.children.forEach((obj: Leaf) => expect(obj.value).toBeTypeOf("number"));
    });
  });
});
