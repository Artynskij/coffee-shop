import {StyleSheet, Text, View} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import {ISelectOption} from '../../types/dataType';

interface ISelect {
  data: ISelectOption[];
  selectedItem?: ISelectOption | null;
  setSelectedItem: (option: ISelectOption) => void;
  altText: string;
  notSelectedText: string;
}
export const Select = ({
  data: data,
  selectedItem: selectedItem,
  setSelectedItem: setSelectedItem,
  altText: altText,
  notSelectedText: notSelectedText,
}: ISelect) => {
  return (
    <View style={styles.SelectContainer}>
      {data ? (
        <ModalSelector
          data={data}
          cancelButtonAccessibilityLabel={'Закрыть'}
          supportedOrientations={['landscape']}
          accessible={true}
          initValue={selectedItem ? selectedItem.label : notSelectedText}
          onChange={option => setSelectedItem(option)}
        />
      ) : (
        <Text style={{color: '#fff'}}>{altText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  SelectContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: 10,
  },
});
