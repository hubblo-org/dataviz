import { DC, dcData } from "../data/data";
import { scatterPlot } from "../../src";

export function renderScatterplot() {
  const plotId = "scatterplot-plot";
  const mainDiv = document.getElementById("render-plot");
  const plotDiv = document.createElement("div");
  plotDiv.setAttribute("id", plotId);
  mainDiv?.appendChild(plotDiv);

  const domains = Object.keys(dcData[0]);
  scatterPlot(plotId, dcData, 800, 600, "power", "waterUsage", "type", domains);
}
