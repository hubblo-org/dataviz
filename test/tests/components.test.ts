import { expect, $, browser } from "@wdio/globals";
import * as matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);
import "../../src/components";

const inputCheckbox = 'input[type="checkbox"]';
const ariaLabelText = '[aria-label="text"]';
const expectedGroups = ["colocation", "hyperscaler", "retail"];

function setupAreaChart(normalized: string, normalizing: string) {
  const ac = document.createElement("area-chart");
  ac.setAttribute("content", multiLines);
  ac.setAttribute("x", "date");
  ac.setAttribute("y", "number");
  ac.setAttribute("z", "group");
  ac.setAttribute("title", title);
  ac.setAttribute("normalized", normalized);
  ac.setAttribute("normalizing", normalizing);
  document.body.appendChild(ac);
  return ac;
}
const title = "Data centers";
const titleForNormalizedAreaChart = `${title}, normalized`

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

describe("normalized areaChart component test suite", () => {
  it("displays a normalized area chart with a title", async () => {
    const ac = setupAreaChart("true", "false");
    const svgAreaCaption = await $("area-chart").shadow$("div > figure").$("figcaption");
    expect(await svgAreaCaption.getText()).toEqual(`${titleForNormalizedAreaChart}`);
    ac.remove();
  });
});

describe("areaChart without normalization component test suite", () => {
  it("displays a title for the component", async () => {
    const ac = setupAreaChart("false", "false");
    const svgAreaCaption = await $("area-chart").shadow$("div > figure").$("figcaption");
    expect(await svgAreaCaption.getText()).toEqual(`${title}`);
    ac.remove();
  });
  //Not entirely satisfying test as it relies heavily on the SVG structure generated
  //by Observable Plot, but as close as what the end user will see as it can get.
  it("displays an area chart for each datacenter group", async () => {
    const ac = setupAreaChart("false", "false");
    const svgAreaCharts = await $("area-chart").shadow$(`svg > ${ariaLabelText}`).$$("g");
    expectedGroups.forEach(async (group, index) => {
      expect(await svgAreaCharts[index].getText()).toEqual(group);
      expect(await svgAreaCharts[index]).toBeDisplayed();
    });
    ac.remove();
  });
});

describe("areaChart with normalization component test suite", () => {
  it("displays a checkbox allowing to normalize rendered values on the area chart", async () => {
    const ac = setupAreaChart("false", "true");
    const acCheckbox = await $("area-chart").shadow$(`${inputCheckbox}`);
    expect(acCheckbox).toBeDisplayed();
    expect(acCheckbox).toHaveText("Normalize values");
    expect(acCheckbox.getValue()).toBeTruthy();
    ac.remove();
  });

  it("displays a title for the component with normalization", async () => {
    const ac = setupAreaChart("false", "true");
    const acCheckbox = await $("area-chart").shadow$(`${inputCheckbox}`);
    await acCheckbox.click();
    const svgAreaCaption = await $("area-chart").shadow$("div > figure").$("figcaption");
    expect(await svgAreaCaption.getText()).toEqual(`${titleForNormalizedAreaChart}`);
    ac.remove();
  });

  it("displays the normalized area chart when the user clicks on the normalize checkbox", async () => {
    const ac = setupAreaChart("false", "true");
    const acCheckbox = await $("area-chart").shadow$(`${inputCheckbox}`);
    await acCheckbox.click();
    const swatchesDiv = await $("area-chart")
      .shadow$("div")
      .$("//div[contains(@class, 'swatches')]");
    await expect(swatchesDiv).toBeDisplayed();
    ac.remove();
  });

  it("allows to display non normalized area charts again when clicking twice on the normalize checkbox", async () => {
    const ac = setupAreaChart("false", "true");
    const acCheckbox = await $("area-chart").shadow$(`${inputCheckbox}`);
    await acCheckbox.click();
    await acCheckbox.click();
    const svgAreaCharts = await $("area-chart").shadow$(`svg > ${ariaLabelText}`).$$("g");
    expectedGroups.forEach(async (group, index) => {
      expect(await svgAreaCharts[index].getText()).toEqual(group);
      expect(await svgAreaCharts[index]).toBeDisplayed();
    });
    ac.remove();
  });
});
