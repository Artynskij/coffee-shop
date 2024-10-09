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
import GradientBGIcon from '../components/GradientBGIcon';
import {useEffect, useState} from 'react';
import {IDatabaseData, IFormula} from '../types/dataType';
import {IconCancel, IconEdit} from '../components/Icons/Icons';
import database from '../db/database';
import {ConstantsDbName} from '../db/data';
import {Input} from '../components/UI/Input';
import {Button} from '../components/UI/Button';
interface IFormulaDbParse {
  id: number;
  name: string;
  value: IFormula[];
}
const FormFormulaScreen = ({navigation}: any) => {
  const [formulaData, setFormulaData] = useState<IFormulaDbParse>();
  const [formulaEditId, setFormulaEditId] = useState<number | null>(null);
  const [formulaValueInput, setFormulaValueInput] = useState<string>('');
  useEffect(() => {
    loadItems();
  }, []);
  const loadItems = () => {
    database.getItems((data: IDatabaseData[]) => {
      const formulaDb = data.find(item => {
        return item.name === ConstantsDbName.formula;
      }) as IDatabaseData;

      setFormulaData({
        id: formulaDb?.id,
        name: formulaDb?.name,
        value: JSON.parse(formulaDb.value) as IFormula[],
      });
    });
  };
  const clearInputs = () => {
    setFormulaValueInput('');
    setFormulaEditId(null);
  };
  const validateData = () => {
    if (formulaEditId === null) {
      ToastAndroid.showWithGravity(
        `Выбери для чего менять будем, Алеша`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return false;
    }
    if (!formulaValueInput) {
      ToastAndroid.showWithGravity(
        `Мне кажется стоит данные ввести`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return false;
    }
    if (!+formulaValueInput) {
      ToastAndroid.showWithGravity(
        `Циферки требеются, а не эта шляпа`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return false;
    }
    return true;
  };
  const handlerActionFormula = () => {
    if (!validateData()) return;
    const newFormulaValue = formulaData?.value.map((item, index) => {
      if (index === formulaEditId) {
        item.count = +formulaValueInput;
      }
      return item;
    });
    database.updateItem({
      id: formulaData?.id as number,
      name: formulaData?.name as string,
      value: JSON.stringify(newFormulaValue),
    });
    clearInputs();
    ToastAndroid.showWithGravity(
      `Порционность изменина`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };
  const handlerEditCategory = ({
    id: id,
    formulaData: formulaData,
  }: {
    id: number;
    formulaData: IFormula;
  }) => {
    if (formulaEditId === id) {
      setFormulaEditId(null);
      clearInputs();
      return;
    }
    setFormulaEditId(id);
    setFormulaValueInput(formulaData.count.toString());
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

        <Text style={styles.HeaderText}>Изменение порционность</Text>
        <View style={styles.EmptyView} />
      </View>
      <Input
        placeholder="Введите количество"
        setValue={setFormulaValueInput}
        value={formulaValueInput}
      />
      <Button text="Изменить" handlerAction={handlerActionFormula} />
      <ScrollView style={styles.ListProduct}>
        {(formulaData?.value.length as number) > 0 ? (
          formulaData?.value.map((data: IFormula, index: number) => {
            return (
              <View style={styles.ListProduct_item} key={index}>
                <Text>
                  Одна порция {data.title}. {data.count} условных едениц
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    handlerEditCategory({
                      id: index,
                      formulaData: data,
                    });
                  }}>
                  {formulaEditId === index ? <IconCancel /> : <IconEdit />}
                </TouchableOpacity>
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
    borderColor: GLOBALSTYLE.COLORS.primaryOrangeHex,
    padding: GLOBALSTYLE.SPACING.space_10,
    backgroundColor: GLOBALSTYLE.COLORS.primaryWhiteHex,
    color: GLOBALSTYLE.COLORS.primaryLightGreyHex,
    marginBottom: 5,
    fontSize: GLOBALSTYLE.FONTSIZE.size_18,
  },
});
export default FormFormulaScreen;
