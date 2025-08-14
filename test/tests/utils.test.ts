import { describe, expect, it } from "vitest";
import { dcData } from "../data/data";
import { normalizeValues } from "../../src";

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
        type: "hyperscaler",
        status: "open",
        power: 5,
        waterUsage: 5,
        surface: 5000 
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
      expect(normalizedData[2][property]).toStrictEqual("high");
    });
  });
});
