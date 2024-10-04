import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CustomIcon from './CustomIcon';
import {GLOBALSTYLE} from '../theme/theme';
interface ICounterValue {
  value: number;
}
export const CounterValue = () => {
  const decrementQuantityHandler = () => {
    setValue(value - 1);
  };
  const incrementQuantityHandler = () => {
    setValue(value + 1);
  };
  return (
    <View style={styles.CartItemSizeValueContainer}>
      <TouchableOpacity
        style={styles.CartItemIcon}
        onPress={() => {
          decrementQuantityHandler(id, data.size);
        }}>
        <CustomIcon
          name="minus"
          color={GLOBALSTYLE.COLORS.primaryWhiteHex}
          size={GLOBALSTYLE.FONTSIZE.size_10}
        />
      </TouchableOpacity>
      <View style={styles.CartItemQuantityContainer}>
        <Text style={styles.CartItemQuantityText}>{value}</Text>
      </View>
      <TouchableOpacity
        style={styles.CartItemIcon}
        onPress={() => {
          incrementQuantityHandler(id, data.size);
        }}>
        <CustomIcon
          name="add"
          color={GLOBALSTYLE.COLORS.primaryWhiteHex}
          size={GLOBALSTYLE.FONTSIZE.size_10}
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  CartItemSizeValueContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  CartItemIcon: {
    backgroundColor: GLOBALSTYLE.COLORS.primaryOrangeHex,
    padding: GLOBALSTYLE.SPACING.space_12,
    borderRadius: GLOBALSTYLE.BORDERRADIUS.radius_10,
  },
  CartItemQuantityContainer: {
    backgroundColor: GLOBALSTYLE.COLORS.primaryBlackHex,
    width: 80,
    borderRadius: GLOBALSTYLE.BORDERRADIUS.radius_10,
    borderWidth: 2,
    borderColor: GLOBALSTYLE.COLORS.primaryOrangeHex,
    alignItems: 'center',
    paddingVertical: GLOBALSTYLE.SPACING.space_4,
  },
  CartItemQuantityText: {
    fontFamily: GLOBALSTYLE.FONTFAMILY.poppins_semibold,
    fontSize: GLOBALSTYLE.FONTSIZE.size_16,
    color: GLOBALSTYLE.COLORS.primaryWhiteHex,
  },
});
