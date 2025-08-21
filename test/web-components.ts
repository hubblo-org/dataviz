import { dcData } from "./data/data";

const content = JSON.stringify(dcData);
const domains = ["open", "closed", "project"]; 
const div = document.createElement("div");
div.textContent = "Stacked Bar Plot";
const sbPlot = document.createElement("stacked-bar-plot");
sbPlot.setAttribute("content", content);
sbPlot.setAttribute("domains", domains.toString());
sbPlot.setAttribute("x", "status");
sbPlot.setAttribute("y", "type");
const body = document.getElementsByTagName("body")[0]
body.append(div);
div.append(sbPlot);


const contentForAc = JSON.stringify([
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
const div2 = document.createElement("div");
div2.textContent = "Area Chart"
body.append(div2);
const ac = document.createElement("area-chart");
ac.setAttribute("content", contentForAc);
ac.setAttribute("x", "date");
ac.setAttribute("y", "number");
ac.setAttribute("z", "group");
ac.setAttribute("normalizing", "false");
div2.append(ac);
