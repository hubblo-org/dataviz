function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export interface DC {
  type: string;
  status: string;
  power: number | string;
  waterUsage: number | string;
  surface: number;
}

export const dcData: DC[] = [
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

export const sourcesTargets = [
  { source: "Nuclear", target: "Data centers", value: getRandomInt(500) },
  { source: "Renewable", target: "Data centers", value: getRandomInt(500) },
  { source: "Gas", target: "Data centers", value: getRandomInt(500) },
  { source: "Water", target: "Data centers", value: getRandomInt(500) },
  { source: "Refrigerant", target: "Data centers", value: getRandomInt(500) },
  { source: "Nuclear", target: "Domestic appliances", value: getRandomInt(500) },
  { source: "Renewable", target: "Domestic appliances", value: getRandomInt(500) },
  { source: "Gas", target: "Domestic appliances", value: getRandomInt(500) },
  { source: "Water", target: "Domestic appliances", value: getRandomInt(500) },
  { source: "Refrigerant", target: "Domestic appliances", value: getRandomInt(500) },
  { source: "Nuclear", target: "Industry", value: getRandomInt(500) },
  { source: "Renewable", target: "Industry", value: getRandomInt(500) },
  { source: "Gas", target: "Industry", value: getRandomInt(500) },
  { source: "Water", target: "Industry", value: getRandomInt(500) },
  { source: "Refrigerant", target: "Industry", value: getRandomInt(500) }
];
