import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GLOBALSTYLE} from '../theme/theme';
import {useRef, useState} from 'react';
import {IDatabaseData} from '../types/dataType';
interface ISwitcher {
  titles: IDatabaseData[];
  callbackFunc: (indexSwitcher: number) => void;
}
export const Switcher = ({
  titles: titles,
  callbackFunc: callbackFunc,
}: ISwitcher) => {
  const ListRef: any = useRef<FlatList>();

  const [categoryIndex, setCategoryIndex] = useState({
    index: 0,
    category: titles[0],
  });
  return (
    <View>
      {titles.length > 1 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.CategoryScrollViewStyle}>
          {titles.map((data: IDatabaseData, index: number) => (
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
                    category: titles[index],
                  });
                  callbackFunc(index);
                }}>
                <Text
                  style={[
                    styles.CategoryText,
                    categoryIndex.index === index
                      ? {color: GLOBALSTYLE.COLORS.primaryOrangeHex}
                      : {},
                  ]}>
                  {JSON.parse(data.value).title}
                </Text>
                {categoryIndex.index === index ? (
                  <View style={styles.ActiveCategory} />
                ) : (
                  <></>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        ''
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  CategoryScrollViewStyle: {
    // paddingHorizontal: GLOBALSTYLE.SPACING.space_20,

    // marginBottom: GLOBALSTYLE.SPACING.space_10,
    borderBottomWidth: 10,
    borderBottomColor: GLOBALSTYLE.COLORS.primaryOrangeHex,
  },
  CategoryScrollViewContainer: {
    paddingHorizontal: GLOBALSTYLE.SPACING.space_15,
  },
  CategoryScrollViewItem: {
    alignItems: 'center',
  },
  CategoryText: {
    fontFamily: GLOBALSTYLE.FONTFAMILY.poppins_semibold,
    fontSize: GLOBALSTYLE.FONTSIZE.size_16,
    color: GLOBALSTYLE.COLORS.primaryLightGreyHex,
    marginBottom: GLOBALSTYLE.SPACING.space_4,
  },
  ActiveCategory: {
    height: GLOBALSTYLE.SPACING.space_10,
    width: GLOBALSTYLE.SPACING.space_10,
    borderRadius: GLOBALSTYLE.BORDERRADIUS.radius_10,
    backgroundColor: GLOBALSTYLE.COLORS.primaryOrangeHex,
  },
});
