import type { Data } from "@observablehq/plot";
import { select } from "d3";
import {
  axisX,
  axisY,
  barX,
  dot,
  formatIsoDate,
  gridY,
  line,
  plot,
  ruleX,
  ruleY,
  selectLast,
  text
} from "@observablehq/plot";

interface ImpactFactor {
  impactCriterion: string;
  amount: number;
}

interface ImpactFactorWithScope {
  scope: string;
  amount: number;
}

interface Axes {
  x: string;
  y: string;
}

export function assignAxes(impactFactor: ImpactFactor | ImpactFactorWithScope) {
  const keys = Object.keys(impactFactor);
  const axes: Axes = { x: keys[1], y: keys[0] };
  return axes;
}

export function horizontalBarPlot<Type>(
  nodeId: string,
  data: Type,
  width: number,
  height: number,
  xLabel: string,
  yLabel: string,
  lollipop: boolean
) {
  let div = document.querySelector(nodeId);
  div?.firstChild?.remove();

  if (div) {
    const lollipopMarks = [
      ruleX([0]),
      axisX({ tickSpacing: 100 }),
      ruleY(data as Data, {
        x: xLabel,
        y: yLabel,
        stroke: xLabel,
        tip: { format: { y: (d) => `${d.replace("\n", " ")}` }, lineWidth: 100 },
        strokeWidth: 5,
        sort: { y: "x", order: "descending" }
      }),
      dot(data as Data, { x: xLabel, y: yLabel, fill: xLabel, r: 10 })
    ];

    const barMarks = [
      ruleX([0]),
      axisX({ tickSpacing: 100 }),
      barX(data as Data, {
        x: xLabel,
        y: yLabel,
        fill: xLabel,
        tip: { format: { y: (d) => `${d.replace("\n", " ")}` }, lineWidth: 100 },
        sort: { y: "x", order: "descending" }
      })
    ];
    const barPlot = plot({
      width: width,
      height: height,
      y: { grid: true },
      marks: lollipop ? lollipopMarks : barMarks
    });
    div.append(barPlot);
  }
}

export function addLogo(nodeId: string, logo: string) {
  // When a legend is created with the generated plot, a figure element is added to the selected div.
  // The first child is then the div with the legend elements.
  const logoDiv = select(nodeId).select("figure").select("div").append("div").attr("class", "logo");

  logoDiv.append("img").attr("src", logo);
  logoDiv.append("span").text("Hubblo").attr("class", "logo");
}

export function stackedBarPlot<Type>(
  nodeId: string,
  data: Type,
  width: number,
  height: number,
  domains: string[],
  yLabel: string,
  xLabel: string,
  domainColor: string
) {
  let div = document.querySelector(nodeId);
  div?.firstChild?.remove();
  if (div) {
    const barPlot = plot({
      width: width,
      height: height,
      className: "plot",
      color: { legend: true, domain: domains },
      x: { percent: true },
      marks: [
        axisY({ fontSize: 12, label: null, marginLeft: 60 }),
        axisX({ marginBottom: 48 }),
        barX(data as Data, {
          y: yLabel,
          x: xLabel,
          fill: domainColor,
          order: domains,
          offset: "normalize",
          tip: true
        })
      ]
    });

    div.append(barPlot);
  }
}

// Renders a line chart or a multiple line chart.
// Specify the `zDimension` to identify the key to group data with and render multiple lines in the chart.
export function lineChart<Type>(
  nodeId: string,
  data: Type,
  width: number,
  height: number,
  xLabel: string,
  yLabel: string,
  zDimension?: string
) {
  let div = document.querySelector(nodeId);
  div?.firstChild?.remove();

  const lineMarks = [
    gridY({ strokeDasharray: "0.75,2", strokeOpacity: 1 }),
    axisY({
      tickSize: 0,
      dx: 38,
      dy: -6,
      labelOffset: -36,
      lineAnchor: "bottom"
    }),
    ruleY([0]),
    line(data as Data, { x: xLabel, y: yLabel, z: zDimension, markerEnd: "dot" })
  ];

  const multiLineMarks = lineMarks.concat([
    text(
      data as Data,
      selectLast({
        x: xLabel,
        y: yLabel,
        z: zDimension,
        text: zDimension,
        textAnchor: "start",
        dx: 3
      })
    )
  ]);

  if (div) {
    const lineChart = plot({
      height: height,
      marginLeft: 0,
      round: true,
      style: "overflow:visible",
      width: width,
      x: { label: null, insetLeft: 36, type: "time", ticks: "year" },
      marks: zDimension ? multiLineMarks : lineMarks
    });

    div.append(lineChart);
  }
}
