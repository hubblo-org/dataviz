import { lineChart } from "../../src";

const data = [
  { date: 2013, number: 45 },
  { date: 2014, number: 30 },
  { date: 2015, number: 50 }
];
export function renderLineChart() {
  const plotId = "line-chart-plot";
  const mainDiv = document.getElementById("render-plot");
  const plotDiv = document.createElement("div");
  plotDiv.setAttribute("id", plotId);
  mainDiv?.appendChild(plotDiv);

  lineChart(`#${plotId}`, data, "date", "number");
}
