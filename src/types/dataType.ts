export interface ISelectOption {
  key: number;
  label: string;
}

export interface IDatabaseData {
  id: number;
  name: string;
  value: string;
}
// export interface ICategoryInData {
//   title: string;
//   id: number;
// }
export interface ICategory {
  title: string;
}
export interface IRecipe {
  count: number;
  category: number;
}
export interface IProduct {
  title: string;
  category: number;
  quantity: string;
  unit: string;
  recipe: IRecipe[];
}
