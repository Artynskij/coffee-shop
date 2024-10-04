import {StyleSheet, Text, View} from 'react-native';
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
  const styles = StyleSheet.create({
    Button: {
      fontSize: GLOBALSTYLE.FONTSIZE.size_20,
      backgroundColor: GLOBALSTYLE.COLORS.primaryOrangeHex,
      padding: 12,
      marginBottom: 5,
      borderRadius: 15,
    },
  });
  return (
    <View>
      <Text onPress={handlerAction} style={styles.Button}>
        {text}
      </Text>
    </View>
  );
};
