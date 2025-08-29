import { expect, $, browser } from "@wdio/globals";
import * as matchers from "@testing-library/jest-dom/matchers";
import { dcData } from "../data/data";
expect.extend(matchers);
import "../../src/components";

const inputCheckbox = 'input[type="checkbox"]';
const inputSelect = 'input[type="select"]';
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
const titleForNormalizedAreaChart = `${title}, normalized`;

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

  // When the normalized area chart is visible, the legend linking colors with data groups ("swatches") will be visible to the user.
  it("displays the normalized area chart with a legend when the user clicks on the normalize checkbox", async () => {
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

  it("displays a normalized area chart and allows switching between displays when both normalized and normalizing are true", async () => {
    const ac = setupAreaChart("true", "true");
    const acCheckbox = await $("area-chart").shadow$(`${inputCheckbox}`);
    const svgAreaCaption = await $("area-chart").shadow$("div > figure").$("figcaption");
    expect(await svgAreaCaption.getText()).toEqual(`${titleForNormalizedAreaChart}`);
    await acCheckbox.click();
    const svgAreaCharts = await $("area-chart").shadow$(`svg > ${ariaLabelText}`).$$("g");
    expectedGroups.forEach(async (group, index) => {
      expect(await svgAreaCharts[index].getText()).toEqual(group);
      expect(await svgAreaCharts[index]).toBeDisplayed();
    });
    ac.remove();
  });
});

describe("parallel coordinates component test suite", () => {
  const isNotAnAxis = (value: string) => {
    if (value === "type" || value == "status") {
      return false;
    }
    return true;
  };
  const content = JSON.stringify(dcData);
  const dimensions = Object.keys(dcData[0]).filter(isNotAnAxis);
  const domains = [...new Set(dcData.map((element) => element.type))];
  function setupParallelCoordinates() {
    const pc = document.createElement("parallel-coordinates");
    pc.setAttribute("content", content);
    pc.setAttribute("dimensions", dimensions.toString());
    pc.setAttribute("domain", "type");
    pc.setAttribute("domains", domains.toString());
    document.body.appendChild(pc);
    return pc;
  }
  it("displays the parallel-coordinates plot, and an element to allow highlighting the selected group elements", async () => {
    const pc = setupParallelCoordinates();
    const svg = await $("parallel-coordinates").shadow$("svg");
    const highlight = await $("parallel-coordinates").shadow$("select");
    await highlight.selectByAttribute("value", "hyperscaler");
    expect(svg).toBeDisplayed();
    expect(highlight).toBeDisplayed();
    expect(await highlight.getValue()).toEqual("hyperscaler");
    pc.remove();
  });

  it("highlights the selected group elements on the parallel-coordinates plot", async () => {
    const pc = setupParallelCoordinates();
    const highlight = await $("parallel-coordinates").shadow$("select");
    await highlight.selectByAttribute("value", "hyperscaler");
    const paths = await $("parallel-coordinates").shadow$("svg > .line").$$("path");
    const otherPaths = await paths.filter(async (path) => (await path.getText()) != "hyperscaler");
    const hyperscalerPaths = await paths.filter(
      async (path) => (await path.getText()) === "hyperscaler"
    );
    hyperscalerPaths.forEach(async (path) => {
      const colorAttribute = await path.getAttribute("stroke");
      expect(await colorAttribute).not.toEqual("lightgrey");
    });
    otherPaths.forEach(async (path) => {
      const colorAttribute = await path.getAttribute("stroke");
      expect(await colorAttribute).toEqual("lightgrey");
    });
    pc.remove();
  });
});
