import { lineChart } from "../../src";

const oneLine = [
  { group: "colocation", date: "2013-01-01", number: 45 },
  { group: "colocation", date: "2014-01-01", number: 30 },
  { group: "colocation", date: "2015-01-01", number: 50 },
  { group: "colocation", date: "2016-01-01", number: 55 },
  { group: "colocation", date: "2017-01-01", number: 60 },
  { group: "colocation", date: "2018-01-01", number: 120 },
  { group: "colocation", date: "2019-01-01", number: 75 },
  { group: "colocation", date: "2020-01-01", number: 40 }
];
const multiLines = [
  { group: "colocation", date: "2013-01-01", number: 45 },
  { group: "colocation", date: "2014-01-01", number: 30 },
  { group: "colocation", date: "2015-01-01", number: 50 },
  { group: "colocation", date: "2016-01-01", number: 55 },
  { group: "colocation", date: "2017-01-01", number: 60 },
  { group: "colocation", date: "2018-01-01", number: 120 },
  { group: "colocation", date: "2019-01-01", number: 75 },
  { group: "colocation", date: "2020-01-01", number: 40 },
  { group: "hyperscaler", date: "2013-01-01", number: 35 },
  { group: "hyperscaler", date: "2014-01-01", number: 20 },
  { group: "hyperscaler", date: "2015-01-01", number: 40 },
  { group: "hyperscaler", date: "2016-01-01", number: 50 },
  { group: "hyperscaler", date: "2017-01-01", number: 35 },
  { group: "hyperscaler", date: "2018-01-01", number: 100 },
  { group: "hyperscaler", date: "2019-01-01", number: 60 },
  { group: "hyperscaler", date: "2020-01-01", number: 20 }
];

export function renderLineChart() {
  const plotId = "line-chart-plot";
  const mainDiv = document.getElementById("render-plot");
  const plotDiv = document.createElement("div");
  plotDiv.setAttribute("id", plotId);
  mainDiv?.appendChild(plotDiv);

  lineChart(`#${plotId}`, oneLine, 800, 600, "date", "number");
}

export function renderMultiLinesChart() {
  const plotId = "line-chart-plot";
  const mainDiv = document.getElementById("render-plot");
  const plotDiv = document.createElement("div");
  plotDiv.setAttribute("id", plotId);
  mainDiv?.appendChild(plotDiv);

  lineChart(`#${plotId}`, multiLines, 800, 600, "date", "number", "group");
}
