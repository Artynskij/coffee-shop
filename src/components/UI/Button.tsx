import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GLOBALSTYLE} from '../../theme/theme';

interface IButton {
  text: string;
  type?: 'dark' | 'light';
  handlerAction: () => void;
}
export const Button = ({
  text: text,
  type: type,
  handlerAction: handlerAction,
}: IButton) => {
  return (
    <View>
      <TouchableOpacity onPress={handlerAction}>
        <Text style={styles.Button}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  Button: {
    color: GLOBALSTYLE.COLORS.primaryGreyHex,
    fontSize: GLOBALSTYLE.FONTSIZE.size_20,

    backgroundColor: GLOBALSTYLE.COLORS.primaryOrangeHex,
    padding: 12,
    marginBottom: 5,
    borderRadius: 15,
  },
});
