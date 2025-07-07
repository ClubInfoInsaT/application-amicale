import React from "react";
import { View, TextInput, StyleSheet } from 'react-native'
import { Button, Text } from 'react-native-paper'
import GENERAL_STYLES from '../../constants/Styles';

type GroupEditPopupProps = {
    isVisible: boolean;
    popupText : string;
    onTextChange : (text : string) => void;
    onClose : () => void;
}

const GroupEditPopUp : React.FC<GroupEditPopupProps> = ({ isVisible, popupText, onTextChange, onClose}) => {
    if (!isVisible) return null;
    return (
        <View style = { styles.popupContainer }>
            <View style = { styles.popup }>
                <TextInput
                    style = { styles.textInput }
                    value = { popupText }
                    onChangeText = { onTextChange }
                    placeholder = "Edit group name" //TODO
                />
                <Button
                    style = {GENERAL_STYLES.centerHorizontal}
                    mode = "contained"
                    icon = "close"
                    onPress = { onClose }
                >
                    Save Changes //TODO
                </Button>
            </View>
        </View>
    );
}

//  TODO: fix explicit margins, padding, etc
const styles = StyleSheet.create({
    popupContainer : {
        position : 'absolute',
        top : '40%',
        left : '10%',
        right : '10%',
        backgroundColor : 'rgba(50,0,0,0.5)',
        padding : 40,
        borderRadius : 10,
        justifyContent : 'center',
        alignItems : 'center',
        zIndex : 999, //wth ?
    },
    popup : {
        backgroundColor : 'gray',
        padding : 30,
        borderRadisu : 10,
        width : 250,
        justifyContent : 'center',
        alignItems : 'center',
    },
    textInput : {
        fontSize : 24,
        marginBottom : 20,
    },
});

export default GroupEditPopUp;