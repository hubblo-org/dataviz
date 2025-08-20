import { dcData } from "./data/data";

const content = JSON.stringify(dcData);
const domains = ["open", "closed", "project"]; 
const div = document.createElement("div");
const sbPlot = document.createElement("stacked-bar-plot");
sbPlot.setAttribute("content", content);
sbPlot.setAttribute("domains", domains.toString());
sbPlot.setAttribute("width", "800");
sbPlot.setAttribute("height", "800");
sbPlot.setAttribute("x", "status");
sbPlot.setAttribute("y", "type");
const body = document.getElementsByTagName("body")[0]
body.append(div);
div.append(sbPlot);
