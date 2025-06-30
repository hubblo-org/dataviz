
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

/* function generateName(): string {
	let output: string = "";
	let input: string = "abcdefghijklmnopqrstuvwxyz0123456789";



}
const dcDataWithNames = dcData.map((dc) => {
	const dcWithName = {... dc};
	dc.name = 


}); */
