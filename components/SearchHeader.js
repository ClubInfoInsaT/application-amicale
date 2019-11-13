// @flow

import * as React from "react";
import {Header} from "native-base";
import {Platform, StyleSheet} from "react-native";
import {getStatusBarHeight} from "react-native-status-bar-height";
import Touchable from 'react-native-platform-touchable';
import ThemeManager from "../utils/ThemeManager";
import CustomMaterialIcon from "./CustomMaterialIcon";
import {TextInput} from "react-native-paper";
import i18n from "i18n-js";


type Props = {
    navigation: Object,
    searchFunction: Function
};

type State = {
    searchString: string
}


/**
 * Custom component defining a search header using native base
 */
export default class SearchHeader extends React.Component<Props, State> {
    state = {
        searchString: "Test",
    };

    render() {
        /* TODO:
            - hard coded color (not theme-specific),
            - bugs with placeHolder and underlineColorAndroid (do not work),
            - subtle offset of the text to fix in the inputText
            - not tested on iOS
         */
        return (
            <Header style={styles.header}>
                <Touchable
                    style={{
                        alignItems: "center",
                        flexDirection: "row",
                        padding: 7,
                    }}
                    onPress={() => this.props.navigation.goBack()}>
                    <CustomMaterialIcon
                        color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                        icon="arrow-left" />
                </Touchable>

                <TextInput
                    style={{
                        flex: 1,
                        backgroundColor: "#CA535D",
                        margin: 7,
                    }}
                    underlineColorAndroid={"transparent"}
                    placeHolder={i18n.t("proximoScreen.search")}
                    autoFocus={true}
                    onChangeText={text => this.setState({searchString: text})}
                    onSubmitEditing={text => {
                        this.setState({searchString: text});
                        this.props.searchFunction(this.state.searchString);
                    }}
                />

                <Touchable
                    style={{
                        alignItems: "center",
                        flexDirection: "row",
                        padding: 7,
                    }}
                    onPress={() => this.props.searchFunction(this.state.searchString)}>
                    <CustomMaterialIcon
                        color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                        icon="magnify"/>
                </Touchable>
            </Header>
        );
    }
};


// Fix header in status bar on Android
const styles = StyleSheet.create({
    header: {
        paddingTop: getStatusBarHeight(),
        height: 54 + getStatusBarHeight(),
    },
});
