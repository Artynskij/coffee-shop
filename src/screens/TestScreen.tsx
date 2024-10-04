import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
} from 'react-native';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import {FlatList} from 'react-native';

import {Dimensions} from 'react-native';
import Database from '../db/database';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import { createStandardData } from '../db/data';

const getCategoriesFromData = (data: any) => {
  let temp: any = {};
  for (let i = 0; i < data.length; i++) {
    if (temp[data[i].name] == undefined) {
      temp[data[i].name] = 1;
    } else {
      temp[data[i].name]++;
    }
  }
  let categories = Object.keys(temp);
  categories.unshift('All');
  return categories;
};

const TestScreen = ({navigation}: any) => {
  const mockProductList = useStore((state: any) => state.mockProduct);
  const CoffeeList = useStore((state: any) => state.CoffeeList);

  const [mockProduct, setMockProduct] = useState(mockProductList);
  const [categories, setCategories] = useState(
    getCategoriesFromData(CoffeeList),
  );
  const [itemsDB, setItemsDB] = useState<any>();
  const [nameText, setNameText] = useState('');
  const [surnameText, setSurnameText] = useState('');
  const [categoryIndex, setCategoryIndex] = useState({
    index: 0,
    category: categories[0],
  });

  useEffect(() => {
    loadItems(); // Загрузка данных из БД
  }, []);

  // Функция для загрузки данных из БД
  const loadItems = () => {
    Database.getItems((data: any[]) => {
      setItemsDB(data);
    });
  };
  const ListRef: any = useRef<FlatList>();

  const handleDelete = (id: number) => {
    Database.deleteItem(id);
    loadItems(); // Обновляем данные после вставки
  };
  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />

      {/* App Header */}
      {/* <HeaderBar /> */}

      <Text style={styles.ScreenTitle}>Тестовая страница</Text>
      <TouchableOpacity onPress={() => navigation.push('FormCategory')}>
        <Text style={styles.Button}>Добавить категорию</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.push('FormProduct')}>
        <Text style={styles.Button}>Добавить товар</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.push('FormImport')}>
        <Text style={styles.Button}>Добавить привоз</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => createStandardData()}>
        <Text style={styles.Button}>Добавить дефолтные категории и товары</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={loadItems}>
        <Text style={styles.TestButton}>Получить данные</Text>
      </TouchableOpacity>
      <FlatList
        style={styles.TestList}
        data={itemsDB} // Используем состояние items
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View>
            <Text onPress={() => handleDelete(item.id)}>
              {item.name}: {item.value} : {item.id}
            </Text>
          </View>
        )}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.CategoryScrollViewStyle}>
        {mockProduct.map((data: any, index: number) => (
          <View
            key={index.toString()}
            style={styles.CategoryScrollViewContainer}>
            <TouchableOpacity
              style={styles.CategoryScrollViewItem}
              onPress={() => {
                ListRef?.current?.scrollToOffset({
                  animated: true,
                  offset: 0,
                });
                setCategoryIndex({
                  index: index,
                  category: mockProduct[index],
                });
                //   setSortedCoffee([
                //     ...getCoffeeList(mockProduct[index], CoffeeList),
                //   ]);
              }}>
              <Text
                style={[
                  styles.CategoryText,
                  categoryIndex.index == index
                    ? {color: COLORS.primaryOrangeHex}
                    : {},
                ]}>
                {data.category}
              </Text>
              {categoryIndex.index == index ? (
                <View style={styles.ActiveCategory} />
              ) : (
                <></>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  TestButton: {
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: COLORS.primaryWhiteHex,
    padding: 12,
  },
  TestList: {
    backgroundColor: COLORS.primaryWhiteHex,
  },
  Button: {
    fontSize: FONTSIZE.size_20,
    backgroundColor: COLORS.primaryOrangeHex,
    padding: 12,
    marginBottom: 5,
  },
  //   не мои стили
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_30,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    margin: SPACING.space_30,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
  CategoryScrollViewStyle: {
    paddingHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20,
  },
  CategoryScrollViewContainer: {
    paddingHorizontal: SPACING.space_15,
  },
  CategoryScrollViewItem: {
    alignItems: 'center',
  },
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  ActiveCategory: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },
  FlatListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_30,
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  },
  CoffeeBeansTitle: {
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
  },
});

export default TestScreen;
