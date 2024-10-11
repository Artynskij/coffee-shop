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
import {GLOBALSTYLE} from '../theme/theme';
import {useState} from 'react';
import GradientBGIcon from '../components/GradientBGIcon';
import {ICategory, IDatabaseData} from '../types/dataType';

import database from '../db/database';
import {IconCancel, IconDelete, IconEdit} from '../components/Icons/Icons';
import {Input} from '../components/UI/Input';
import {Button} from '../components/UI/Button';

const FormCategoryScreen = ({navigation}: any) => {
  const [categoryTitleInput, setCategoryTitleInput] = useState<string>('');
  const [categoryEditId, setCategoryEditId] = useState<number>(0);

  const [categoryData, setCategoryData] = useState<IDatabaseData[]>([]);
  useEffect(() => {
    loadItems();
  }, []);
  const loadItems = async () => {
    const dataDb = await database.getItems();

    const categories = dataDb.filter(item => {
      return item.name === 'category';
    });
    setCategoryData(categories);
  };
  const editCategory = () => {
    if (!categoryData) {
      ToastAndroid.showWithGravity(
        'Не все данные введены',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    const pushObject: ICategory = {
      title: categoryTitleInput,
      // value: categoryValueInput,
    };
    database.updateItem({
      id: categoryEditId,
      name: 'category',
      value: JSON.stringify(pushObject),
    });
    ToastAndroid.showWithGravity(
      'Категория изменена.',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    setCategoryEditId(0);
    loadItems();
  };
  const addCategory = () => {
    const pushObject: ICategory = {
      title: categoryTitleInput,
    };

    database.createItem({name: 'category', value: JSON.stringify(pushObject)});
    ToastAndroid.showWithGravity(
      `${pushObject.title} категория добавлена.`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    setCategoryTitleInput('');
    loadItems();
  };
  const handlerActionCategory = () => {
    if (!categoryTitleInput) {
      // || !categoryValueInput
      ToastAndroid.showWithGravity(
        `Пожалуйста введите все требуемые данные`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    if (categoryEditId) {
      editCategory();
    } else {
      addCategory();
    }
  };
  const handlerDeleteCategory = (id: number, title: string) => {
    database.deleteItem(id);
    ToastAndroid.showWithGravity(
      `${title} категория удалена.`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    loadItems();
  };
  const handlerEditCategory = ({
    id: id,
    name: name,
  }: {
    id: number;
    name: string;
  }) => {
    if (categoryEditId === id) {
      setCategoryTitleInput('');
      // setCategoryValueInput('');
      setCategoryEditId(0);
      return;
    }
    setCategoryTitleInput(name);
    // setCategoryValueInput(value);
    setCategoryEditId(id);
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

        <Text style={styles.HeaderText}>Добавление категории</Text>
        <View style={styles.EmptyView} />
      </View>
      <Input
        placeholder="Категория название на русском"
        setValue={setCategoryTitleInput}
        value={categoryTitleInput}
      />
      <Button
        handlerAction={handlerActionCategory}
        text={categoryEditId ? ' Изменить Категорию' : 'Создать категорию'}
      />
      <Text style={styles.HeaderText}>Категории</Text>
      <ScrollView style={styles.List}>
        {categoryData?.length > 0 ? (
          categoryData.map((item: IDatabaseData) => {
            const data: ICategory = JSON.parse(item.value);
            return (
              <View style={styles.List_item} key={item.id}>
                <Text style={{color: GLOBALSTYLE.COLORS.primaryDarkGreyHex}}>
                  Категория: {data.title}.
                </Text>
                <View style={styles.GroupButton}>
                  <TouchableOpacity
                    onPress={() => {
                      handlerEditCategory({
                        id: item.id,
                        name: data.title,
                      });
                    }}>
                    {categoryEditId === item.id ? <IconCancel /> : <IconEdit />}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handlerDeleteCategory(item.id, data.title);
                    }}>
                    <IconDelete />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={{color: GLOBALSTYLE.COLORS.primaryWhiteHex}}>
            Нету существующих категорий.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
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
    borderColor: GLOBALSTYLE.COLORS.primaryOrangeHex,
    padding: GLOBALSTYLE.SPACING.space_10,
    backgroundColor: GLOBALSTYLE.COLORS.primaryWhiteHex,
    color: GLOBALSTYLE.COLORS.primaryLightGreyHex,
    marginBottom: 5,
    fontSize: GLOBALSTYLE.FONTSIZE.size_18,
  },

  GroupButton: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
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

  HeaderText: {
    fontFamily: GLOBALSTYLE.FONTFAMILY.poppins_semibold,
    fontSize: GLOBALSTYLE.FONTSIZE.size_20,
    color: GLOBALSTYLE.COLORS.primaryWhiteHex,
  },
  EmptyView: {
    height: GLOBALSTYLE.SPACING.space_36,
    width: GLOBALSTYLE.SPACING.space_36,
  },
});
export default FormCategoryScreen;
