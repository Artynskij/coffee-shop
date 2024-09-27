import React, {useEffect} from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, FONTSIZE, GLOBALSTYLE} from '../theme/theme';
import {useState} from 'react';
import GradientBGIcon from '../components/GradientBGIcon';
import {ICategory} from '../types/dataType';

import database from '../db/database';

const FormCategoryScreen = ({navigation, route}: any) => {
  // const categoryStore = useStore((state: any) => state.category);
  const [categoryTitleInput, setCategoryTitleInput] = useState<string>('');
  const [categoryValueInput, setCategoryValueInput] = useState<string>('');
  const [categoryData, setCategoryData] = useState<{
    id: Number;
    value: ICategory[];
    name: string;
  }>();
  useEffect(() => {
    database.getItems((data: any) => {
      const foundTable = data.find((item: any) => item.name === 'category');
      setCategoryData({
        id: foundTable.id,
        value: JSON.parse(foundTable.value),
        name: foundTable.name,
      });
    });
  }, []);
  const handlerAddCategory = () => {
    if (!categoryData) return;
    const pushObject: ICategory = {
      id: categoryData?.value[categoryData.value.length - 1]?.id + 1 || 1,
      title: categoryTitleInput,
      value: categoryValueInput,
    };
    if (categoryData?.value.length > 0) {
      setCategoryData([...categoryData, pushObject]);
      database.updateItem(1, 'category', JSON.stringify(categoryData));
    } else {
      setCategoryData([...categoryData, pushObject]);
      database.createItem(
        'category',
        JSON.stringify([...categoryData, pushObject]),
      );
    }
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

        <Text style={styles.HeaderText}>Добавление категории</Text>
        <View style={styles.EmptyView} />
      </View>
      <View style={styles.InputContainer}>
        <TextInput
          placeholder="Категория название на русском"
          value={categoryTitleInput}
          onChangeText={text => {
            setCategoryTitleInput(text);
            //   searchCoffee(text);
          }}
          placeholderTextColor={COLORS.primaryLightGreyHex}
          style={styles.InputText}
        />
      </View>
      <View style={styles.InputContainer}>
        <TextInput
          placeholder="Категория название на английском"
          value={categoryValueInput}
          onChangeText={text => {
            setCategoryValueInput(text);
            //   searchCoffee(text);
          }}
          placeholderTextColor={COLORS.primaryLightGreyHex}
          style={styles.InputText}
        />
      </View>
      <View>
        <Text onPress={handlerAddCategory} style={styles.Button}>
          Создать категорию
        </Text>
      </View>
      <View style={styles.List}>
        {categoryData ? (
          categoryData.map((item: ICategory) => {
            return (
              <View key={item.id}>
                <Text>
                  Категория: {item.title}. Значени: {item.value}. ID: {item.id}
                </Text>
              </View>
            );
          })
        ) : (
          <Text>Нихуя</Text>
        )}
      </View>

      <FlatList
        // style={styles.TestList}
        data={categoryData} // Используем состояние items
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View>
            <Text>
              {/* onPress={() => handleDelete(item.id)} */}
              {item.title}: {item.value}
            </Text>
          </View>
        )}
      />
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
    borderRadius: 10,
    padding: GLOBALSTYLE.SPACING.space_10,
    backgroundColor: GLOBALSTYLE.COLORS.primaryWhiteHex,
    color: GLOBALSTYLE.COLORS.primaryLightGreyHex,
  },
  //   не мои стили
  ScreenContainer: {
    flex: 1,
    backgroundColor: GLOBALSTYLE.COLORS.primaryBlackHex,
    padding: GLOBALSTYLE.SPACING.space_15,
  },
  HeaderContainer: {
    // paddingHorizontal: GLOBALSTYLE.SPACING.space_24,
    paddingVertical: GLOBALSTYLE.SPACING.space_15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  InputContainer: {
    flexDirection: 'row',
    // margin: GLOBALSTYLE.SPACING.space_30,
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
  LottieAnimation: {
    flex: 1,
  },
  ScrollViewFlex: {
    flexGrow: 1,
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
  PaymentOptionsContainer: {
    padding: GLOBALSTYLE.SPACING.space_15,
    gap: GLOBALSTYLE.SPACING.space_15,
  },
  CreditCardContainer: {
    padding: GLOBALSTYLE.SPACING.space_10,
    gap: GLOBALSTYLE.SPACING.space_10,
    borderRadius: GLOBALSTYLE.BORDERRADIUS.radius_15 * 2,
    borderWidth: 3,
  },
  CreditCardTitle: {
    fontFamily: GLOBALSTYLE.FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    marginLeft: GLOBALSTYLE.SPACING.space_10,
  },
  CreditCardBG: {
    backgroundColor: COLORS.primaryGreyHex,
    borderRadius: GLOBALSTYLE.BORDERRADIUS.radius_25,
  },
  LinearGradientStyle: {
    borderRadius: GLOBALSTYLE.BORDERRADIUS.radius_25,
    gap: GLOBALSTYLE.SPACING.space_36,
    paddingHorizontal: GLOBALSTYLE.SPACING.space_15,
    paddingVertical: GLOBALSTYLE.SPACING.space_10,
  },
  CreditCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  CreditCardNumberContainer: {
    flexDirection: 'row',
    gap: GLOBALSTYLE.SPACING.space_10,
    alignItems: 'center',
  },
  CreditCardNumber: {
    fontFamily: GLOBALSTYLE.FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
    letterSpacing: GLOBALSTYLE.SPACING.space_4 + GLOBALSTYLE.SPACING.space_2,
  },
  CreditCardNameSubitle: {
    fontFamily: GLOBALSTYLE.FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.secondaryLightGreyHex,
  },
  // CreditCardNameTitle: {
  //   fontFamily: GLOBALSTYLE.FONTFAMILY.poppins_medium,
  //   fontSize: FONTSIZE.size_18,
  //   color: COLORS.primaryWhiteHex,
  // },
  CreditCardNameContainer: {
    alignItems: 'flex-start',
  },
  CreditCardDateContainer: {
    alignItems: 'flex-end',
  },
});
export default FormCategoryScreen;
