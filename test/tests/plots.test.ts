import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { addSelect, ColorFunction, highlight, minMaxScaling } from "../../src/plots";
import { scaleOrdinal, schemeTableau10 } from "d3";

const initialInnerHtml = `
<div id="render-plot"><div id="plot-container"></div></div>
`;
describe("addSelect test suite", () => {
  const testData = [
    { test: "test", value: "value", property: "property", anotherProperty: "another property" }
  ];
  const labelText = "Select a property for value distribution:";
  const xLabel = "test";
  const yLabel = "value";

  it("should create a select element with a label", () => {
    document.body.innerHTML = initialInnerHtml;
    addSelect("plot-container", testData, xLabel, yLabel, 800, "property");
    expect(screen.getByLabelText(labelText)).toBeVisible();
  });

  it("should have options that are not the axis labels", () => {
    document.body.innerHTML = initialInnerHtml;
    addSelect("plot-container", testData, xLabel, yLabel, 800, "property");
    const select = screen.getByLabelText(labelText);
    const options = within(select).getAllByRole("option");
    const isNotAnAxis = (value: string) => {
      if (value === xLabel || value === yLabel) {
        return false;
      }
      return true;
    };
    const properties = Object.keys(testData[0]).filter(isNotAnAxis);
    options.forEach((option, index) => expect(option).toHaveTextContent(properties[index]));
  });

  it("should set the select value as the selected property", async () => {
    const user = userEvent.setup();
    document.body.innerHTML = initialInnerHtml;
    addSelect("plot-container", testData, xLabel, yLabel, 800, "property");
    const select = screen.getByLabelText(labelText);
    const options: HTMLOptionElement[] = within(select).getAllByRole("option");
    expect(options[0]).toBeVisible();
    expect(options[0].selected).toBeTruthy();
    expect(options[1].selected).toBeFalsy();
    await user.selectOptions(select, ["anotherProperty"]);
    expect(options[1]).toBeVisible();
    expect(options[1].selected).toBeTruthy();
    expect(options[0].selected).toBeFalsy();
  });
});

describe("highlight test suite", () => {
  const testDomains = ["private", "public", "hyperscale"];
  const color = scaleOrdinal().domain(testDomains).range(schemeTableau10);
  function renderDiv() {
    const div = document.createElement("div");
    document.body.append(div);
    const highlightElements = highlight("class", testDomains, color as ColorFunction);
    div.append(highlightElements.label);
    div.append(highlightElements.select);
  }

  it("should have a label for the select element", () => {
    renderDiv();

    const selectElement = screen.getByLabelText("Select a category to highlight", { exact: false });
    expect(selectElement).toBeVisible();
  });
  it("should have no category selected as initial option value", () => {
    renderDiv();
    const selectElement = screen.getByLabelText("Select a category to highlight", { exact: false });
    const options = within(selectElement).getAllByRole("option");
    const noneOption: HTMLOptionElement = options.filter(
      (option) => option.textContent === "none"
    )[0];
    expect(noneOption.selected).toBeTruthy();
  });
});

describe("minMaxScaling test suite", () => {
  it("computes a value position on a scale, to be set between 0 and 1", () => {
    const values = [
      { value: 15 },
      { value: 54 },
      { value: 6 },
      { value: 7 },
      { value: 456 },
      { value: 657 },
      { value: 2 },
      { value: 3 },
      { value: 0 }
    ];
    const result = minMaxScaling(["value"], values);
    expect(result[1].value).toEqual(0.08);
  });
  it("computes all value positions for each provided data property, without modifying other properties", () => {
    const values = [
      { type: "private", value: 15 },
      { type: "private", value: 54 },
      { type: "private", value: 6 },
      { type: "private", value: 7 },
      { type: "private", value: 456 },
      { type: "private", value: 657 },
      { type: "private", value: 2 },
      { type: "private", value: 3 },
      { type: "private", value: 0 }
    ];
    const result = minMaxScaling(["value"], values);
    expect(result[1].value).toEqual(0.08);
    expect(result[1].type).toEqual("private");
  });
});
