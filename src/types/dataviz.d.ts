export declare type Node = {
  name: string;
  children?: Node[] | Leaf[];
};

export declare type Leaf = {
  name: string;
  category: string;
  value: number;
};
