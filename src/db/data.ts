import {IDatabaseData} from '../types/dataType';
import database from './database';
export const ConstantsDbName = {
  category: 'category',
  product: 'product',
};
export const ConstantsFavoriteCategory = {
  addition: 'Дополнительно',
  coffee: 'Кофе',
  juices: 'Напитки',
};
const categories = [
  'Кофе',
  'Напитки',
  'Дополнительно',
  'Вода',
  'Батончики',
  'Перекус',
];
interface IProducts {
  title: string;
  category: string | number;
  quantity: string;
  unit: string;
}
const products: IProducts[] = [
  {title: 'Аура 0.5л газ', category: 'Вода', quantity: '0', unit: 'шт'},
  {title: 'NutAndGo ', category: 'Батончики', quantity: '0', unit: 'шт'},
  {title: 'Аура 0.5 газ', category: 'Вода', quantity: '0', unit: 'шт'},
  {
    title: 'Капучино M',
    category: ConstantsFavoriteCategory.coffee,
    quantity: '0',
    unit: 'стакан',
  },
  {
    title: 'Капучино L',
    category: ConstantsFavoriteCategory.coffee,
    quantity: '0',
    unit: 'стакан',
  },
  {
    title: 'Американо M',
    category: ConstantsFavoriteCategory.coffee,
    quantity: '0',
    unit: 'стакан',
  },
  {
    title: 'Сироп',
    category: ConstantsFavoriteCategory.addition,
    quantity: '0',
    unit: 'порция',
  },
  {
    title: 'Молоко',
    category: ConstantsFavoriteCategory.addition,
    quantity: '0',
    unit: 'порция',
  },
];
export const createStandardData = () => {
  database.getItems((itemsDb: IDatabaseData[]) => {
    categories.forEach(cat => {
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

  database.getItems((itemsDb: IDatabaseData[]) => {
    const categoriesInDb = itemsDb.filter(
      item => item.name === ConstantsDbName.category,
    );
    console.log(categoriesInDb);

    products.forEach(product => {
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
};
