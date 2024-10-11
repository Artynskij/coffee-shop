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
  quantityReverse: string;
  unit: string;
  recipe: IRecipe[];
}
const productsAdditional: _IProducts[] = [
  {
    title: ConstantsAdditionProduct.syrup,
    category: ConstantsCategory.addition,
    quantity: '0',
    quantityReverse: '0',
    unit: 'мл',
    recipe: [],
  },
  {
    title: ConstantsAdditionProduct.milk,
    category: ConstantsCategory.addition,
    quantity: '0',
    quantityReverse: '0',
    unit: 'мл',
    recipe: [],
  },
  {
    title: ConstantsAdditionProduct.beans,
    category: ConstantsCategory.addition,
    quantity: '0',
    quantityReverse: '0',
    unit: 'гр',
    recipe: [],
  },
  {
    title: ConstantsAdditionProduct.juice,
    category: ConstantsCategory.addition,
    quantity: '0',
    quantityReverse: '0',
    unit: 'мл',
    recipe: [],
  },
];
const _products: _IProducts[] = [
  {
    title: 'Аура 0.5л газ',
    category: 'Вода',
    quantity: '0',
    quantityReverse: '0',
    unit: 'шт',
    recipe: [],
  },
  {
    title: 'NutAndGo ',
    category: 'Батончики',
    quantity: '0',
    quantityReverse: '0',
    unit: 'шт',
    recipe: [],
  },
  {
    title: 'Аура 0.5 газ',
    category: 'Вода',
    quantity: '0',
    quantityReverse: '0',
    unit: 'шт',
    recipe: [],
  },
  {
    title: 'Капучино M',
    category: ConstantsCategory.coffee,
    quantity: '0',
    quantityReverse: '0',
    unit: 'стакан',
    recipe: [],
  },
  {
    title: 'Капучино L',
    category: ConstantsCategory.coffee,
    quantity: '0',
    quantityReverse: '0',
    unit: 'стакан',
    recipe: [],
  },
  {
    title: 'Американо M',
    category: ConstantsCategory.coffee,
    quantity: '0',
    quantityReverse: '0',
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
export const createStandardData = async () => {
  async function createCategory() {
    const itemsDb = await database.getItems();

    // Добавление категорий
    for (const cat of _categories) {
      const findCat = itemsDb.find(
        item => JSON.parse(item.value).title === cat,
      );
      if (!findCat) {
        await database.createItem({
          name: ConstantsDbName.category,
          value: JSON.stringify({title: cat}),
        });
      }
    }
  }
  async function createProduct() {
    // Получение всех записей из базы данных

    const itemsDb = await database.getItems();
    // Добавление продуктов
    const categoriesInDb = itemsDb.filter(
      item => item.name === ConstantsDbName.category,
    );

    for (const product of _products) {
      const newProduct: _IProducts = JSON.parse(JSON.stringify(product));
      const idCat = categoriesInDb.find(cat => {
        return JSON.parse(cat.value).title === newProduct.category;
      });
      if (idCat) {
        newProduct.category = +idCat.id; // Присваиваем ID категории
      } else {
        return;
      }

      const findProd = itemsDb.find(
        item => JSON.parse(item.value).title === newProduct.title,
      );
      if (!findProd) {
        await database.createItem({
          name: ConstantsDbName.product,
          value: JSON.stringify(newProduct),
        });
      } else {
        await database.updateItem({
          id: findProd.id,
          name: ConstantsDbName.product,
          value: JSON.stringify(newProduct),
        });
      }
    }
  }
  async function createFormula() {
    const itemsDb = await database.getItems();
    // Добавление формулы
    const formulaDb = itemsDb.find(
      item => item.name === ConstantsDbName.formula,
    );
    if (!formulaDb) {
      await database.createItem({
        name: ConstantsDbName.formula,
        value: JSON.stringify(_formulaPortion),
      });
    }
  }
  try {
    await createCategory();
    await createProduct();
    await createFormula();
  } catch (error) {
    console.error('Error creating standard data:', error);
  }
};

export const getCategoriesFromData = (
  productData: IDatabaseData[],
  categoryData: IDatabaseData[],
) => {
  let temp: any = {};
  for (let i = 0; i < productData.length; i++) {
    if (temp[JSON.parse(productData[i].value).category] === undefined) {
      temp[JSON.parse(productData[i].value).category] = 1;
    } else {
      temp[JSON.parse(productData[i].value).category]++;
    }
  }
  const categories = Object.keys(temp).map((temp: string) => {
    const findCategory =
      categoryData.find(item => item.id === +temp) || categoryData[0];
    return findCategory;
  });
  categories.unshift({
    name: 'category',
    id: 0,
    value: JSON.stringify({title: 'All'}),
  });
  return categories;
};
