import {StyleSheet, TextInput, View} from 'react-native';
import {GLOBALSTYLE} from '../../theme/theme';

interface IInput {
  value: string;
  setValue: (text: string) => void;
  placeholder: string;
}
export const Input = ({
  value: value,
  setValue: setValue,
  placeholder,
}: IInput) => {
  return (
    <View style={styles.InputContainer}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={text => {
          setValue(text);
          //   searchCoffee(text);
        }}
        placeholderTextColor={GLOBALSTYLE.COLORS.primaryLightGreyHex}
        style={styles.InputText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  InputContainer: {
    flexDirection: 'row',
    // margin: GLOBALSTYLE.SPACING.space_30,
    borderRadius: GLOBALSTYLE.BORDERRADIUS.radius_20,
    backgroundColor: GLOBALSTYLE.COLORS.primaryDarkGreyHex,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: GLOBALSTYLE.COLORS.primaryOrangeHex,
    marginBottom: GLOBALSTYLE.SPACING.space_10,
  },
  InputText: {
    flex: 1,
    height: GLOBALSTYLE.SPACING.space_20 * 3,
    fontFamily: GLOBALSTYLE.FONTFAMILY.poppins_medium,
    fontSize: GLOBALSTYLE.FONTSIZE.size_14,
    color: GLOBALSTYLE.COLORS.primaryWhiteHex,
    paddingHorizontal: GLOBALSTYLE.SPACING.space_10,
  },
});
