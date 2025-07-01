import { sankeyDiagram } from "../../src";
import { sourcesTargets } from "../data/data";

export function renderSankey() {
  const plotId = "sankey-plot";
  const mainDiv = document.getElementById("render-plot");
  const plotDiv = document.createElement("div");
  plotDiv.setAttribute("id", plotId);
  mainDiv?.appendChild(plotDiv);

  const links = sourcesTargets;
  const nodes = [
    { name: "Nuclear", category: "Energy" },
    { name: "Renewable", category: "Energy" },
    { name: "Gas", category: "Energy" },
    { name: "Water", category: "Cooling" },
    { name: "Refrigerant", category: "Cooling" },
    { name: "Data centers", category: "IT" },
    { name: "Industry", category: "Industry" },
    { name: "Domestic appliances", category: "Domestic" }
  ];
  const data = { nodes, links };

  sankeyDiagram(plotId, data, 1200, 1000, "Twh");
}
