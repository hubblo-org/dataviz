import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { addSelect } from "../../src/plots";

describe("addSelect test suite", () => {
  const testData = [
    { test: "test", value: "value", property: "property", anotherProperty: "another property" }
  ];
  const labelText = "Select a property for value distribution:";
  const xLabel = "test";
  const yLabel = "value";

  it("should create a select element with a label", () => {
    document.body.innerHTML = `
<div id="render-plot"><div id="plot-container"></div></div>
`;
    addSelect("plot-container", xLabel, yLabel, testData);
    expect(screen.getByLabelText(labelText)).toBeVisible();
  });
  it("should have options that are not the axis labels", () => {
    document.body.innerHTML = `
<div id="render-plot"><div id="plot-container"></div></div>
`;
    addSelect("plot-container", xLabel, yLabel, testData);
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
    document.body.innerHTML = `
<div id="render-plot"><div id="plot-container"></div></div>
`;
    addSelect("plot-container", xLabel, yLabel, testData);
    const select = screen.getByLabelText(labelText);
    const options = within(select).getAllByRole("option");
    expect(options[0]).toBeVisible();
    await user.selectOptions(select, ["anotherProperty"]);
    expect(options[1]).toBeVisible();
  });
});
