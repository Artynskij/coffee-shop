import React, {useEffect} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

import {COLORS, FONTSIZE, GLOBALSTYLE} from '../theme/theme';
import {useState} from 'react';
import GradientBGIcon from '../components/GradientBGIcon';
import {
  IDatabaseData,
  IProduct,
  IRecipe,
  ISelectOption,
} from '../types/dataType';

import database from '../db/database';
import {IconCancel, IconDelete, IconEdit} from '../components/Icons/Icons';
import {Input} from '../components/UI/Input';
import {Select} from '../components/UI/Select';
import {Button} from '../components/UI/Button';
import {ConstantsDbName, ConstantsFavoriteCategory} from '../db/data';
import {CounterValue} from '../components/CounterValue';

const FormProductScreen = ({navigation}: any) => {
  // const categoryStore = useStore((state: any) => state.category);
  const [productTitleInput, setProductTitleInput] = useState<string>('');
  const [productUnitInput, setProductUnitInput] = useState<string>('');
  const [productQuantityInput, setProductQuantityInput] = useState<string>('');
  const [selectedProductCategory, setSelectedProductCategory] = useState<{
    key: number;
    label: string;
  } | null>(null);

  const [recipe, setRecipe] = useState<IRecipe[]>([]);

  const [productEditId, setProductEditId] = useState<number>(0);

  const [categoryData, setCategoryData] = useState<IDatabaseData[]>([]);
  const [productData, setProductData] = useState<IDatabaseData[]>([]);
  useEffect(() => {
    loadItems();
  }, []);
  const validateData = () => {
    if (!selectedProductCategory || !productTitleInput || !productUnitInput) {
      ToastAndroid.showWithGravity(
        `Для начала введите все данные`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return false;
    }
    if (Number.isNaN(+productQuantityInput) || +productQuantityInput < 0) {
      ToastAndroid.showWithGravity(
        `Вы ввели какую-то шляпу в количестве`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return false;
    }
    return true;
  };
  const clearInputs = () => {
    setProductTitleInput('');
    setProductUnitInput('');
    setProductQuantityInput('');
    setSelectedProductCategory(null);
    setProductEditId(0);
    setRecipe([]);
  };
  const loadItems = () => {
    database.getItems((data: IDatabaseData[]) => {
      const categories = data.filter(item => {
        return item.name === ConstantsDbName.category;
      });
      const products = data.filter(item => {
        return item.name === ConstantsDbName.product;
      });

      setCategoryData(categories);
      setProductData(products);
    });
  };
  const editProduct = () => {
    if (!productTitleInput) {
      ToastAndroid.showWithGravity(
        'Не все данные введены',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    const pushObject: IProduct = {
      title: productTitleInput,
      unit: productUnitInput.toLocaleLowerCase(),
      quantity: productQuantityInput,
      category: selectedProductCategory?.key as number,
      recipe: recipe,
    };
    database.updateItem({
      id: productEditId,
      name: ConstantsDbName.product,
      value: JSON.stringify(pushObject),
    });
    ToastAndroid.showWithGravity(
      'Товар изменен.',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    clearInputs();
    loadItems();
  };
  const addProduct = () => {
    if (!validateData()) {
      return;
    }

    const pushObject: IProduct = {
      title: productTitleInput,
      unit: productUnitInput.toLocaleLowerCase(),
      quantity: productQuantityInput,
      category: selectedProductCategory?.key as number,
      recipe: recipe,
    };

    database.createItem({
      name: ConstantsDbName.product,
      value: JSON.stringify(pushObject),
    });
    ToastAndroid.showWithGravity(
      `${pushObject.title} товар добавлен.`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    clearInputs();
    loadItems();
  };
  const handlerActionProduct = () => {
    if (productEditId) {
      editProduct();
    } else {
      addProduct();
    }
  };
  const handlerDeleteProduct = (id: number, title: string) => {
    database.deleteItem(id);
    ToastAndroid.showWithGravity(
      `${title} товар удален.`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    loadItems();
  };
  const handlerEditCategory = ({
    id: id,
    productValue: productValue,
  }: {
    id: number;
    productValue: IProduct;
  }) => {
    if (productEditId === id) {
      clearInputs();
      return;
    }
    setProductTitleInput(productValue.title);
    setProductQuantityInput(productValue.quantity);
    setProductUnitInput(productValue.unit);
    setRecipe(productValue.recipe);
    database.getItemById(productValue.category, item => {
      setSelectedProductCategory({
        key: productValue.category,
        label: JSON.parse(item.value).title,
      });
    });

    setProductEditId(id);
  };
  const handlerRecipeSelect = (option: ISelectOption) => {
    const haveRecipe = recipe.find(r => r.category === option.key);
    if (!haveRecipe) {
      setRecipe(prevRecipe => [
        ...prevRecipe,
        {category: option.key, count: 1},
      ]);
    }
  };
  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={GLOBALSTYLE.COLORS.primaryBlackHex} />
      <View style={styles.HeaderContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}>
          <GradientBGIcon
            name="left"
            color={GLOBALSTYLE.COLORS.primaryLightGreyHex}
            size={GLOBALSTYLE.FONTSIZE.size_16}
          />
        </TouchableOpacity>

        <Text style={styles.HeaderText}>Добавление товара</Text>
        <View style={styles.EmptyView} />
      </View>

      <Input
        placeholder="Товар название на русском"
        value={productTitleInput}
        setValue={setProductTitleInput}
      />
      <Input
        placeholder="Единица измерения"
        value={productUnitInput}
        setValue={setProductUnitInput}
      />
      <Input
        placeholder="Количество в цифрах"
        value={productQuantityInput}
        setValue={setProductQuantityInput}
      />
      <Select
        data={categoryData?.map(item => {
          return {
            key: item.id,
            label: JSON.parse(item.value)?.title as string,
          };
        })}
        selectedItem={selectedProductCategory}
        setSelectedItem={setSelectedProductCategory}
        altText="Нету категорий"
        notSelectedText="Выбрать категорию"
      />

      <Text style={{color: 'white', fontSize: GLOBALSTYLE.FONTSIZE.size_18}}>
        Рецепт
      </Text>

      <Select
        data={productData
          ?.filter(
            //поиск кегории дополнительно
            product =>
              JSON.parse(product.value).category ===
              categoryData.find(
                category =>
                  JSON.parse(category.value).title ===
                  ConstantsFavoriteCategory.addition,
              )?.id,
          )
          .map((product: IDatabaseData) => {
            const productData = JSON.parse(product.value) as IProduct;
            return {
              key: product.id,
              label: productData.title,
            };
          })}
        selectedItem={{key: 0, label: 'Выбрать ингридиент'}}
        setSelectedItem={handlerRecipeSelect}
        altText="Нету допов"
        notSelectedText="Выбрать ингридиент"
      />
      <View style={styles.RecipeContainer}>
        {recipe.length > 0 ? (
          <>
            {recipe.map((recipeItem, index) => {
              return (
                <View style={styles.RecipeItem} key={index}>
                  <View style={{display: 'flex'}}>
                    <Text style={styles.RecipeTitle} key={index}>
                      {
                        JSON.parse(
                          productData.find(
                            prod => prod.id === recipeItem.category,
                          )?.value as string,
                        ).title
                      }
                    </Text>
                  </View>
                  <View>
                    <CounterValue
                      decrementQuantityHandler={() => {
                        const updatedRecipe = recipe
                          .map((recipeItem, i) => {
                            return i === index && recipeItem.count > 0
                              ? {...recipeItem, count: recipeItem.count - 1}
                              : recipeItem;
                          })
                          .filter(item => item.count > 0);

                        setRecipe(updatedRecipe);
                      }}
                      incrementQuantityHandler={() => {
                        const updatedRecipe = recipe.map((recipeItem, i) =>
                          i === index
                            ? {...recipeItem, count: recipeItem.count + 1}
                            : recipeItem,
                        );
                        setRecipe(updatedRecipe);
                      }}
                      value={recipeItem.count}
                    />
                  </View>
                </View>
              );
            })}
          </>
        ) : (
          ''
        )}
      </View>
      <Button
        handlerAction={handlerActionProduct}
        text={productEditId ? ' Изменить товар' : 'Создать товар'}
      />
      <Text style={styles.HeaderText}>Товары</Text>
      <ScrollView style={styles.ListProduct}>
        {productData?.length > 0 ? (
          productData.map((item: IDatabaseData) => {
            const data: IProduct = JSON.parse(item.value);
            return (
              <View style={styles.ListProduct_item} key={item.id}>
                <Text>
                  {data.title}. {data.quantity} {data.unit}. recipe -
                  {data.recipe?.length > 0 ? 'true' : 'false'}
                </Text>
                <View style={styles.GroupButton}>
                  <TouchableOpacity
                    onPress={() => {
                      handlerEditCategory({
                        id: item.id,
                        productValue: data,
                      });
                    }}>
                    {productEditId === item.id ? <IconCancel /> : <IconEdit />}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handlerDeleteProduct(item.id, data.title);
                    }}>
                    <IconDelete />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={{color: 'white'}}>Товаров нету</Text>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: GLOBALSTYLE.COLORS.primaryBlackHex,
    padding: GLOBALSTYLE.SPACING.space_15,
  },
  HeaderContainer: {
    paddingVertical: GLOBALSTYLE.SPACING.space_15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  HeaderText: {
    fontFamily: GLOBALSTYLE.FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
  },
  EmptyView: {
    height: GLOBALSTYLE.SPACING.space_36,
    width: GLOBALSTYLE.SPACING.space_36,
  },
  RecipeContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: GLOBALSTYLE.SPACING.space_10,
  },
  RecipeItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: GLOBALSTYLE.SPACING.space_4,
    marginBottom: GLOBALSTYLE.SPACING.space_4,
    borderBottomWidth: 2,
    borderBottomColor: GLOBALSTYLE.COLORS.primaryOrangeHex,
  },
  RecipeTitle: {
    color: 'white',
    paddingRight: GLOBALSTYLE.SPACING.space_10,
    fontSize: GLOBALSTYLE.FONTSIZE.size_18,
  },
  ListProduct: {
    display: 'flex',
    flexDirection: 'column',
  },
  ListProduct_item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primaryOrangeHex,
    padding: GLOBALSTYLE.SPACING.space_10,
    backgroundColor: GLOBALSTYLE.COLORS.primaryWhiteHex,
    color: GLOBALSTYLE.COLORS.primaryLightGreyHex,
    marginBottom: 5,
    fontSize: FONTSIZE.size_18,
  },
  GroupButton: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
});
export default FormProductScreen;
