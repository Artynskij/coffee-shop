import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {useCallback, useEffect, useState} from 'react';
import database from '../db/database';
import {GLOBALSTYLE} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';

import {IDatabaseData, IFormula, IProduct} from '../types/dataType';
import {ConstantsDbName, getCategoriesFromData} from '../db/data';
import {Switcher} from '../components/Switcher';
import {CounterValue} from '../components/CounterValue';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {Button} from '../components/UI/Button';
import {useFocusEffect} from '@react-navigation/native';
// import {IconCancel, IconEdit} from '../components/Icons/Icons';

const HomeScreenNew = ({navigation}: any) => {
  //   const [categoryData, setCategoryData] = useState<IDatabaseData[]>([]);
  const [productData, setProductData] = useState<IDatabaseData[]>([]);
  const [categoryOfProductData, setCategoryOfProductData] = useState<
    IDatabaseData[]
  >([]);
  const [formulaData, setFormulaData] = useState<IFormula[]>([]);

  const tabBarHeight = useBottomTabBarHeight();
  useEffect(() => {
    const firstRender = async () => {
      await loadItems();
    };
    firstRender();
  }, []);
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        await loadItems();
      };
      loadData();
    }, []),
  );
  const loadItems = async () => {
    const dataDb = await database.getItems();

    const categories = dataDb.filter(item => {
      return item.name === ConstantsDbName.category;
    });
    const products = dataDb.filter(item => {
      return item.name === ConstantsDbName.product;
    });
    const formula = dataDb.find(item => {
      return item.name === ConstantsDbName.formula;
    });

    setCategoryOfProductData(getCategoriesFromData(products, categories));

    setProductData(products);
    if (formula) {
      setFormulaData(JSON.parse(formula.value));
    }
  };
  const changeOfRecipe = async (product: IDatabaseData) => {
    const prodValue: IProduct = JSON.parse(product.value);
    prodValue.recipe.forEach(async recipeOne => {
      //   доп
      const recipeProduct: IDatabaseData = await database.getItemById(
        recipeOne.category,
      );
      const recipeProductValue: IProduct = JSON.parse(recipeProduct.value);

      const findFormula = formulaData.find(
        item => item.title === recipeProductValue.title,
      ) as IFormula;
      recipeProductValue.quantity = (
        +recipeProductValue.quantity -
        findFormula.count * +prodValue.quantityReverse * +recipeOne.count
      ).toString();
      console.log(`${findFormula.title} formula ${findFormula.count}`);
      console.log(`${prodValue.title} prodValue ${+prodValue.quantityReverse}`);
      console.log(`${+recipeOne.category} recipeOne ${+recipeOne.count}`);

      database.updateItem({
        id: recipeProduct.id,
        name: recipeProduct.name,
        value: JSON.stringify(recipeProductValue),
      });
    });

    prodValue.quantityReverse = '0';
    console.log(
      `четвертая проверка ${prodValue.title} ${prodValue.quantityReverse}`,
    );
    database.updateItem({
      id: product.id,
      name: product.name,
      value: JSON.stringify(prodValue),
    });
  };
  const changeQuantity = (product: IDatabaseData) => {
    const prodValue: IProduct = JSON.parse(product.value);
    prodValue.quantity = (
      +prodValue.quantity - +prodValue.quantityReverse
    ).toString();
    prodValue.quantityReverse = '0';
    database.updateItem({
      id: product.id,
      name: product.name,
      value: JSON.stringify(prodValue),
    });
  };
  const handlerSellButton = () => {
    productData.forEach(product => {
      const prodValue: IProduct = JSON.parse(product.value);
      if (+prodValue.quantityReverse > 0) {
        console.log(
          `Первая проверка ${prodValue.title} ${prodValue.quantityReverse}`,
        );

        if (prodValue.recipe.length > 0) {
          console.log(
            `вторая проверка ${prodValue.title} ${prodValue.quantityReverse}`,
          );
          changeOfRecipe(product);
        } else {
          changeQuantity(product);
        }
      }
    });
    loadItems();
    ToastAndroid.showWithGravity(
      `Красава. Почти рекорд.`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };
  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={GLOBALSTYLE.COLORS.primaryBlackHex} />
      <View>
        {/* App Header */}
        <HeaderBar />

        <Text style={styles.ScreenTitle}>Продай кофеек{'\n'}Если сможешь</Text>
      </View>

      <Switcher
        titles={categoryOfProductData}
        callbackFunc={async indexSwitcher => {
          const dataDb = await database.getItems();

          const filteredData =
            categoryOfProductData[indexSwitcher].id === 0
              ? dataDb.filter(item => item.name === 'product')
              : dataDb.filter(item => {
                  return (
                    item.name === 'product' &&
                    JSON.parse(item.value).category ===
                      categoryOfProductData[indexSwitcher].id
                  );
                });
          setProductData(filteredData);
        }}
      />
      <Button handlerAction={handlerSellButton} text="Продать" />
      <ScrollView style={[styles.ListProduct, {marginBottom: tabBarHeight}]}>
        {productData?.length > 0 ? (
          productData.map((item: IDatabaseData, index) => {
            const data: IProduct = JSON.parse(item.value);

            return (
              <View style={styles.ListProduct_item} key={item.id}>
                <Text
                  style={{
                    color: GLOBALSTYLE.COLORS.primaryDarkGreyHex,
                    fontSize: GLOBALSTYLE.FONTSIZE.size_18,
                    fontFamily: GLOBALSTYLE.FONTFAMILY.poppins_light,
                  }}>
                  {data.title}. {data.quantity}
                </Text>
                <CounterValue
                  decrementQuantityHandler={() => {
                    const updateProduct = productData.map((prod, i) => {
                      if (i === index) {
                        const newValue: IProduct = JSON.parse(prod.value);
                        newValue.quantityReverse = (
                          +newValue.quantityReverse - 1
                        ).toString();
                        database.updateItem({
                          id: prod.id,
                          name: prod.name,
                          value: JSON.stringify(newValue),
                        });
                        return {
                          id: prod.id,
                          name: prod.name,
                          value: JSON.stringify(newValue),
                        };
                      } else {
                        return prod;
                      }
                    });
                    setProductData(updateProduct);
                  }}
                  incrementQuantityHandler={() => {
                    const updateProduct = productData.map((prod, i) => {
                      if (i === index) {
                        const newValue: IProduct = JSON.parse(prod.value);
                        newValue.quantityReverse = (
                          +newValue.quantityReverse + 1
                        ).toString();
                        database.updateItem({
                          id: prod.id,
                          name: prod.name,
                          value: JSON.stringify(newValue),
                        });
                        return {
                          id: prod.id,
                          name: prod.name,
                          value: JSON.stringify(newValue),
                        };
                      } else {
                        return prod;
                      }
                    });
                    setProductData(updateProduct);
                  }}
                  value={+data.quantityReverse}
                />
              </View>
            );
          })
        ) : (
          <Text style={{color: GLOBALSTYLE.COLORS.primaryWhiteHex}}>
            Товаров нету
          </Text>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: GLOBALSTYLE.COLORS.primaryBlackHex,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  HeaderContainer: {
    paddingVertical: GLOBALSTYLE.SPACING.space_15,
    flexDirection: 'column',
    alignItems: 'center',
  },
  ScreenTitle: {
    fontSize: GLOBALSTYLE.FONTSIZE.size_28,
    fontFamily: GLOBALSTYLE.FONTFAMILY.poppins_semibold,
    color: GLOBALSTYLE.COLORS.primaryWhiteHex,
    paddingLeft: GLOBALSTYLE.SPACING.space_30,
  },
  ListProduct: {
    display: 'flex',
    flexDirection: 'column',
    // flexGrow: 1,
  },
  ListProduct_item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: GLOBALSTYLE.COLORS.primaryOrangeHex,
    padding: GLOBALSTYLE.SPACING.space_10,
    backgroundColor: GLOBALSTYLE.COLORS.primaryWhiteHex,
    color: GLOBALSTYLE.COLORS.primaryLightGreyHex,
    marginBottom: 5,
    fontSize: GLOBALSTYLE.FONTSIZE.size_18,
  },
});
export default HomeScreenNew;
