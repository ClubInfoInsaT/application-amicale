import React from "react";
import { View, TextInput, StyleSheet } from 'react-native'
import { Button, Text } from 'react-native-paper'
import GENERAL_STYLES from '../../constants/Styles';
import i18n from 'i18n-js';

type GroupEditPopupProps = {
    isVisible: boolean;
    popupText : string;
    onTextChange : (text : string) => void;
    onClose : () => void;
    onCancel: () => void;
}

const GroupEditPopUp : React.FC<GroupEditPopupProps> = ({ isVisible, popupText, onTextChange, onClose, onCancel}) => {
    
    const [error, setError] = React.useState<string | null>(null);

    const validateInput = (text: string) => {
        if (text.trim().length === 0) {
            setError(i18n.t('screens.planex.editNamePopup.errorEmpty'));
            return false;
        }
        if (text.length > 75) {
            setError(i18n.t('screens.planex.editNamePopup.errorTooLong'));
            return false;
        }
        const allowedCharacters = /^[\p{L}0-9_\s]+$/u;
        if (!allowedCharacters.test(text)) {
            setError(i18n.t('screens.planex.editNamePopup.errorInvalidChars'));
            return false;
        }
        setError(null);
        return true;
    }

    const handleTextChange = (text: string) => {
        onTextChange(text);
        validateInput(text);
    }

    const handleOnClose = () => {
        if (validateInput(popupText)) {
            onClose();
        }
    }
    if (!isVisible) return null;
    return (
        <View style = { styles.popupContainer }>
            <View style = { styles.popup }>
                <TextInput
                    style = { styles.textInput }
                    value = { popupText }
                    onChangeText = { handleTextChange }
                    multiline={true}
                    autoFocus= {true}
                />
                {error && <Text style= {styles.errorText}>{error}</Text>}
                <View style={styles.buttonContainer}>
                    <Button
                        style = {GENERAL_STYLES.centerHorizontal}
                        mode = "contained"
                        icon = "close"
                        contentStyle={{ flexDirection: "row-reverse"}}
                        onPress = { onCancel }
                        labelStyle={{fontSize:12}}
                    >
                        {i18n.t("screens.planex.editNamePopup.cancelButton")}
                    </Button>

                    <Button
                        style = {GENERAL_STYLES.centerHorizontal}
                        mode = "contained"
                        icon = "check"
                        contentStyle={{ flexDirection: "row-reverse"}}
                        onPress = { handleOnClose }
                        labelStyle={{fontSize:12}}
                    >
                        {i18n.t("screens.planex.editNamePopup.saveButton")}
                    </Button>
                    
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    popupContainer : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor : 'rgba(0,0,0,0.5)',
        position: 'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0
    },
    popup : {
        backgroundColor : 'rgb(39, 39, 39)',
        padding : 10,
        borderRadius : 10,
        width : '90%',
        maxWidth: 400,
        alignItems: 'center',
    },
    textInput : {
        fontSize : 20,
        marginBottom : 20,
        borderWidth: 2,
        borderColor: 'rgb(204,204,204)',
        padding : 15,
        borderRadius: 5,
        minHeight: 50,
        maxHeight: 200,
        backgroundColor: 'gray'
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
    }
});

export default GroupEditPopUp;