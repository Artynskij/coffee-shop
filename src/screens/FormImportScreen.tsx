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
import {IDatabaseData, IProduct} from '../types/dataType';

import database from '../db/database';
import {IconCancel, IconEdit} from '../components/Icons/Icons';
import {Input} from '../components/UI/Input';
import {Button} from '../components/UI/Button';
import {Switcher} from '../components/Switcher';

const getCategoriesFromData = (
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

const FormImportScreen = ({navigation}: any) => {
  const [categoryData, setCategoryData] = useState<IDatabaseData[]>([]);
  const [productQuantityInput, setProductQuantityInput] = useState<string>('');

  const [productData, setProductData] = useState<IDatabaseData[]>([]);

  const [productEditId, setProductEditId] = useState<number>(0);

  useEffect(() => {
    loadItems();
  }, []);
  const clearInputs = () => {
    setProductQuantityInput('');
    setProductEditId(0);
  };
  const validateData = () => {
    if (!productQuantityInput) {
      ToastAndroid.showWithGravity(
        'Сколько добавить то?',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return false;
    }
    if (Number.isNaN(+productQuantityInput) || +productQuantityInput < 0) {
      ToastAndroid.showWithGravity(
        `Вы ввели какую-то шляпу`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return false;
    }
    return true;
  };
  const loadItems = () => {
    database.getItems((data: IDatabaseData[]) => {
      const categories = data.filter(item => {
        return item.name === 'category';
      });
      const products = data.filter(item => {
        return item.name === 'product';
      });
      setCategoryData(getCategoriesFromData(products, categories));
      setProductData(products);
    });
  };
  const editProduct = () => {
    database.getItemById(productEditId, (item: IDatabaseData) => {
      const productValue: IProduct = JSON.parse(item.value);
      const pushObject: IProduct = {
        category: productValue.category,
        title: productValue.title,
        unit: productValue.unit,
        quantity: (+productValue.quantity + +productQuantityInput).toString(),
        recipe: productValue.recipe,
      };
      database.updateItem({
        id: productEditId,
        name: 'product',
        value: JSON.stringify(pushObject),
      });
      ToastAndroid.showWithGravity(
        'Товар обновился.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      clearInputs();
      loadItems();
    });
  };
  const handlerActionProduct = () => {
    if (productEditId) {
      if (!validateData()) {
        return;
      }
      editProduct();
    } else {
      ToastAndroid.showWithGravity(
        `Я же сказал выберите товар`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };
  const handlerEditCategory = ({id: id}: {id: number}) => {
    if (productEditId === id) {
      clearInputs();
      return;
    }
    // setProductQuantityInput(quantity);

    setProductEditId(id);
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
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

        <Text style={styles.HeaderText}>Добавление привоз</Text>
        <View style={styles.EmptyView} />
      </View>
      <Input
        placeholder="Количество в цифрах"
        value={productQuantityInput}
        setValue={setProductQuantityInput}
      />
      <Button
        handlerAction={handlerActionProduct}
        text={productEditId ? ' Добавить привоз' : 'Выберите товар'}
      />
      <Text style={styles.HeaderText}>Товары</Text>
      <Switcher
        titles={categoryData}
        callbackFunc={indexSwitcher => {
          database.getItems((items: IDatabaseData[]) => {
            const filteredData =
              categoryData[indexSwitcher].id === 0
                ? items.filter(item => item.name === 'product')
                : items.filter(item => {
                    return (
                      item.name === 'product' &&
                      JSON.parse(item.value).category ===
                        categoryData[indexSwitcher].id
                    );
                  });
            setProductData(filteredData);
          });
        }}
      />
      <ScrollView style={styles.List}>
        {productData?.length > 0 ? (
          productData.map((item: IDatabaseData) => {
            const data: IProduct = JSON.parse(item.value);
            return (
              <View style={styles.List_item} key={item.id}>
                <Text>
                  {data.title}. Количество {data.quantity}.
                </Text>
                <View style={styles.GroupButton}>
                  <TouchableOpacity
                    onPress={() => {
                      handlerEditCategory({
                        id: item.id,
                      });
                    }}>
                    {productEditId === item.id ? <IconCancel /> : <IconEdit />}
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
  Button: {
    fontSize: FONTSIZE.size_20,
    backgroundColor: COLORS.primaryOrangeHex,
    padding: 12,
    marginBottom: 5,
    borderRadius: 15,
  },
  List: {
    display: 'flex',
    flexDirection: 'column',
  },
  List_item: {
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
  SelectContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: 10,
  },

  ScreenContainer: {
    flex: 1,
    // alignItems: 'flex-start',
    backgroundColor: GLOBALSTYLE.COLORS.primaryBlackHex,
    padding: GLOBALSTYLE.SPACING.space_15,
  },
  HeaderContainer: {
    paddingVertical: GLOBALSTYLE.SPACING.space_15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  InputContainer: {
    flexDirection: 'row',

    borderRadius: GLOBALSTYLE.BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: GLOBALSTYLE.COLORS.primaryOrangeHex,
    marginBottom: GLOBALSTYLE.SPACING.space_10,
  },
  InputText: {
    flex: 1,
    height: GLOBALSTYLE.SPACING.space_20 * 3,
    fontFamily: GLOBALSTYLE.FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    paddingHorizontal: GLOBALSTYLE.SPACING.space_10,
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
});
export default FormImportScreen;
