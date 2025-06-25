import { parallelCoordinates } from "../../src";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

interface DC {
  type: string;
  status: string;
  power: number | string;
  waterUsage: number | string;
  surface: number;
}

const dcData: DC[] = [
  {
    type: "colocation",
    status: "open",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "colocation",
    status: "open",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "colocation",
    status: "open",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "colocation",
    status: "open",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "colocation",
    status: "open",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "colocation",
    status: "open",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "colocation",
    status: "open",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "colocation",
    status: "closed",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "colocation",
    status: "closed",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "colocation",
    status: "closed",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "colocation",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "colocation",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "colocation",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "colocation",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "colocation",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "colocation",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "colocation",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "hyperscaler",
    status: "open",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "hyperscaler",
    status: "open",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "hyperscaler",
    status: "open",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "hyperscaler",
    status: "open",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "hyperscaler",
    status: "open",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "hyperscaler",
    status: "open",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "hyperscaler",
    status: "open",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "hyperscaler",
    status: "open",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "hyperscaler",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "hyperscaler",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "hyperscaler",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "hyperscaler",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "hyperscaler",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "hyperscaler",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "private",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "private",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "private",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "private",
    status: "open",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "private",
    status: "closed",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "hyperscaler",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  },
  {
    type: "hyperscaler",
    status: "project",
    power: getRandomInt(10),
    waterUsage: getRandomInt(15),
    surface: getRandomInt(500)
  }
];

export function renderParallelCoordinates() {
  const plotId = "parallel-coordinates-plot";
  const mainDiv = document.getElementById("render-plot");
  const plotDiv = document.createElement("div");
  plotDiv.setAttribute("id", plotId);
  mainDiv?.appendChild(plotDiv);

  const xLabel = "type";
  const yLabel = "status";
  const isNotAnAxis = (value: string) => {
    if (value === xLabel || value == yLabel) {
      return false;
    }
    return true;
  };

  const dimensions = Object.keys(dcData[0]).filter(isNotAnAxis);
  const domains = [...new Set(dcData.map((element) => element.type))];
  parallelCoordinates(plotId, 800, 600, dimensions, "type", domains, dcData);
}
