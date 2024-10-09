import {IDatabaseData, IRecipe} from '../types/dataType';
import database from './database';
export const ConstantsDbName = {
  category: 'category',
  product: 'product',
  formula: 'formula',
};
export const ConstantsCategory = {
  addition: 'Дополнительно',
  coffee: 'Кофе',
  juices: 'Напитки',
};
export const ConstantsAdditionProduct = {
  beans: 'Зерна',
  syrup: 'Сироп',
  juice: 'Сок',
  milk: 'Молоко',
};
const _categories = [
  ConstantsCategory.coffee,
  ConstantsCategory.juices,
  ConstantsCategory.addition,
  'Вода',
  'Батончики',
  'Перекус',
];

interface _IProducts {
  title: string;
  category: string | number;
  quantity: string;
  unit: string;
  recipe: IRecipe[];
}
const productsAdditional: _IProducts[] = [
  {
    title: ConstantsAdditionProduct.syrup,
    category: ConstantsCategory.addition,
    quantity: '0',
    unit: 'мл',
    recipe: [],
  },
  {
    title: ConstantsAdditionProduct.milk,
    category: ConstantsCategory.addition,
    quantity: '0',
    unit: 'мл',
    recipe: [],
  },
  {
    title: ConstantsAdditionProduct.beans,
    category: ConstantsCategory.addition,
    quantity: '0',
    unit: 'гр',
    recipe: [],
  },
  {
    title: ConstantsAdditionProduct.juice,
    category: ConstantsCategory.addition,
    quantity: '0',
    unit: 'мл',
    recipe: [],
  },
];
const _products: _IProducts[] = [
  {
    title: 'Аура 0.5л газ',
    category: 'Вода',
    quantity: '0',
    unit: 'шт',
    recipe: [],
  },
  {
    title: 'NutAndGo ',
    category: 'Батончики',
    quantity: '0',
    unit: 'шт',
    recipe: [],
  },
  {
    title: 'Аура 0.5 газ',
    category: 'Вода',
    quantity: '0',
    unit: 'шт',
    recipe: [],
  },
  {
    title: 'Капучино M',
    category: ConstantsCategory.coffee,
    quantity: '0',
    unit: 'стакан',
    recipe: [],
  },
  {
    title: 'Капучино L',
    category: ConstantsCategory.coffee,
    quantity: '0',
    unit: 'стакан',
    recipe: [],
  },
  {
    title: 'Американо M',
    category: ConstantsCategory.coffee,
    quantity: '0',
    unit: 'стакан',
    recipe: [],
  },
  ...productsAdditional,
];

const _formulaPortion = [
  {title: ConstantsAdditionProduct.beans, count: 9},
  {title: ConstantsAdditionProduct.syrup, count: 25},
  {title: ConstantsAdditionProduct.juice, count: 50},
  {title: ConstantsAdditionProduct.milk, count: 100},
];
export const createStandardData = () => {
  // Доавление категорий
  database.getItems((itemsDb: IDatabaseData[]) => {
    _categories.forEach(cat => {
      const findCat = itemsDb.find(
        item => JSON.parse(item.value).title === cat,
      );
      if (!findCat) {
        database.createItem({
          name: ConstantsDbName.category,
          value: JSON.stringify({title: cat}),
        });
      }
    });
  });
  // Доавление Продуктов
  database.getItems((itemsDb: IDatabaseData[]) => {
    const categoriesInDb = itemsDb.filter(
      item => item.name === ConstantsDbName.category,
    );
    _products.forEach(product => {
      const idCat = categoriesInDb.find(
        cat => JSON.parse(cat.value).title === product.category,
      )?.id;
      console.log(idCat);
      if (idCat) {
        product.category = +idCat;
      } else {
        product.category = 0;
      }

      const findProd = itemsDb.find(
        item => JSON.parse(item.value).title === product.title,
      );
      if (!findProd) {
        database.createItem({
          name: ConstantsDbName.product,
          value: JSON.stringify(product),
        });
      } else {
        database.updateItem({
          id: findProd.id,
          name: ConstantsDbName.product,
          value: JSON.stringify(product),
        });
      }
    });
  });
  // Доавление формул
  database.getItems((itemsDb: IDatabaseData[]) => {
    const formulaDb = itemsDb.find(
      item => item.name === ConstantsDbName.formula,
    );
    if (formulaDb) {
    } else {
      database.createItem({
        name: ConstantsDbName.formula,
        value: JSON.stringify(_formulaPortion),
      });
    }
  });
};

// export const getCategoriesFromData = (
//   productData: IDatabaseData[],
//   categoryData: IDatabaseData[],
// ) => {
//   let temp: any = {};
//   for (let i = 0; i < productData.length; i++) {
//     if (temp[JSON.parse(productData[i].value).category] === undefined) {
//       temp[JSON.parse(productData[i].value).category] = 1;
//     } else {
//       temp[JSON.parse(productData[i].value).category]++;
//     }
//   }
//   const categories = Object.keys(temp).map((temp: string) => {
//     const findCategory =
//       categoryData.find(item => item.id === +temp) || categoryData[0];
//     return findCategory;
//   });
//   categories.unshift({
//     name: 'category',
//     id: 0,
//     value: JSON.stringify({title: 'All'}),
//   });
//   return categories;
// };
