import { lineChart } from "../../src";

const data = [
  { date: "2013-01-01", number: 45 },
  { date: "2014-01-01", number: 30 },
  { date: "2015-01-01", number: 50 },
  { date: "2016-01-01", number: 55 },
  { date: "2017-01-01", number: 60 },
  { date: "2018-01-01", number: 120 },
  { date: "2019-01-01", number: 75 },
  { date: "2020-01-01", number: 40 },
];

export function renderLineChart() {
  const plotId = "line-chart-plot";
  const mainDiv = document.getElementById("render-plot");
  const plotDiv = document.createElement("div");
  plotDiv.setAttribute("id", plotId);
  mainDiv?.appendChild(plotDiv);

  lineChart(`#${plotId}`, data, 800, 600, "date", "number");
}
