import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import GENERAL_STYLES from '../../constants/Styles';
import { isValidFavoriteGroupName } from '../../utils/Utils';
import i18n from 'i18n-js';

type GroupEditPopupProps = {
  isVisible: boolean;
  popupText: string;
  onTextChange: (text: string) => void;
  onClose: () => void;
  onCancel: () => void;
};

const GroupEditPopUp: React.FC<GroupEditPopupProps> = ({
  isVisible,
  popupText,
  onTextChange,
  onClose,
  onCancel,
}) => {
  const [error, setError] = React.useState<string | null>(null);

  const handleTextChange = (text: string) => {
    try {
      onTextChange(text);
      isValidFavoriteGroupName(text);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleOnClose = () => {
    try {
      isValidFavoriteGroupName(popupText);
      onClose();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!isVisible) return null;
  return (
    <View style={styles.popupContainer}>
      <View style={styles.popup}>
        <TextInput
          style={styles.textInput}
          value={popupText}
          onChangeText={handleTextChange}
          multiline={true}
          autoFocus={true}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        <View style={styles.buttonContainer}>
          <Button
            style={GENERAL_STYLES.centerHorizontal}
            mode="contained"
            icon="close"
            contentStyle={styles.rowReverse}
            onPress={onCancel}
            labelStyle={styles.smallFont}
          >
            {i18n.t('screens.planex.editNamePopup.cancelButton')}
          </Button>

          <Button
            style={GENERAL_STYLES.centerHorizontal}
            mode="contained"
            icon="check"
            contentStyle={styles.rowReverse}
            onPress={handleOnClose}
            labelStyle={styles.smallFont}
          >
            {i18n.t('screens.planex.editNamePopup.saveButton')}
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  popup: {
    backgroundColor: 'rgb(39, 39, 39)',
    padding: 10,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  textInput: {
    fontSize: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgb(204,204,204)',
    padding: 15,
    borderRadius: 5,
    minHeight: 50,
    maxHeight: 200,
    backgroundColor: 'gray',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  smallFont: {
    fontSize: 12,
  },
});

export default GroupEditPopUp;
