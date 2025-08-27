import { expect, $, browser } from "@wdio/globals";
import * as matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);
import { screen, within } from "@testing-library/dom";
import "../../src/components";

const checkboxAriaRole = '[role="checkbox"]';
const ariaLabelText = '[aria-label="text"]';
const ariaLabelArea = '[aria-label="area"]';
const expectedGroups = ["colocation", "hyperscaler", "retail"];

const multiLines = JSON.stringify([
  { group: "colocation", date: "2013-01-01", number: 45 },
  { group: "colocation", date: "2014-01-01", number: 30 },
  { group: "colocation", date: "2015-01-01", number: 50 },
  { group: "colocation", date: "2016-01-01", number: 55 },
  { group: "colocation", date: "2017-01-01", number: 60 },
  { group: "colocation", date: "2018-01-01", number: 125 },
  { group: "colocation", date: "2019-01-01", number: 80 },
  { group: "colocation", date: "2020-01-01", number: 45 },
  { group: "retail", date: "2013-01-01", number: 0 },
  { group: "retail", date: "2014-01-01", number: 0 },
  { group: "retail", date: "2015-01-01", number: 0 },
  { group: "retail", date: "2016-01-01", number: 0 },
  { group: "retail", date: "2017-01-01", number: 60 },
  { group: "retail", date: "2018-01-01", number: 120 },
  { group: "retail", date: "2019-01-01", number: 75 },
  { group: "retail", date: "2020-01-01", number: 40 },
  { group: "hyperscaler", date: "2013-01-01", number: 35 },
  { group: "hyperscaler", date: "2014-01-01", number: 20 },
  { group: "hyperscaler", date: "2015-01-01", number: 40 },
  { group: "hyperscaler", date: "2016-01-01", number: 50 },
  { group: "hyperscaler", date: "2017-01-01", number: 35 },
  { group: "hyperscaler", date: "2018-01-01", number: 100 },
  { group: "hyperscaler", date: "2019-01-01", number: 60 },
  { group: "hyperscaler", date: "2020-01-01", number: 20 }
]);
describe("areaChart without normalization component test suite", () => {
  function setupAreaChart() {
    const ac = document.createElement("area-chart");
    ac.setAttribute("content", multiLines);
    ac.setAttribute("x", "date");
    ac.setAttribute("y", "number");
    ac.setAttribute("z", "group");
    ac.setAttribute("normalizing", "false");
    document.body.appendChild(ac);
    return ac;
  }

  //Not entirely satisfying test as it relies heavily on the SVG structure generated
  //by Observable Plot, but as close as what the end user will see as it can get.
  it("displays an area chart for each datacenter group", async () => {
    const ac = setupAreaChart();
    const svgAreaCharts = await $("area-chart").shadow$(`svg > ${ariaLabelText}`).$$("g");
    expectedGroups.forEach(async (group, index) => {
      expect(await svgAreaCharts[index].getText()).toEqual(group);
      expect(await svgAreaCharts[index]).toBeDisplayed();
    });
    ac.remove();
  });
});

describe("areaChart with normalization component test suite", () => {
  function setupAreaChart() {
    const ac = document.createElement("area-chart");
    ac.setAttribute("content", multiLines);
    ac.setAttribute("x", "date");
    ac.setAttribute("y", "number");
    ac.setAttribute("z", "group");
    ac.setAttribute("normalizing", "true");
    document.body.appendChild(ac);
    return ac;
  }
  it("displays a checkbox allowing to normalize rendered values on area chart", async () => {
    const ac = setupAreaChart();
    const acCheckbox = await $("area-chart").$(`${checkboxAriaRole} > input`);
    expect(acCheckbox).toBeDisplayed();
    expect(acCheckbox).toHaveText("Normalize values");
    expect(acCheckbox.getValue()).toBeTruthy();
    ac.remove();
  });

  it("allows to display non normalized values when clicking on the normalize checkbox", async () => {
    const ac = setupAreaChart();
    const acCheckbox = await $("area-chart").$(`${checkboxAriaRole} > input`);
    await acCheckbox.click();
    const svgAreaCharts = await $("area-chart").shadow$(`svg > ${ariaLabelText}`).$$("g");
    expectedGroups.forEach(async (group, index) => {
      expect(await svgAreaCharts[index].getText()).toEqual(group);
      expect(await svgAreaCharts[index]).toBeDisplayed();
    });
    ac.remove();
  });

  it("displays the normalized area chart when the user clicks again on the normalize checkbox", async () => {
    const ac = setupAreaChart();
    const acCheckbox = await $("area-chart").$(`${checkboxAriaRole} > input`);
    await acCheckbox.click();
    await acCheckbox.click();
    const swatchesDiv = await $("area-chart").shadow$("div").$("//div[contains(@class, 'swatches')]");
    await expect(swatchesDiv).toBeDisplayed();
    ac.remove();
  });
});
