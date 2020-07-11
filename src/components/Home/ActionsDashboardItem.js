// @flow

import * as React from 'react';
import {List, withTheme} from 'react-native-paper';
import {View} from "react-native";
import type {CustomTheme} from "../../managers/ThemeManager";
import i18n from 'i18n-js';
import {StackNavigationProp} from "@react-navigation/stack";

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
}

class ActionsDashBoardItem extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Props): boolean {
        return (nextProps.theme.dark !== this.props.theme.dark);
    }

    render() {
        return (
            <View>
                <List.Item
                    title={i18n.t("feedbackScreen.homeButtonTitle")}
                    description={i18n.t("feedbackScreen.homeButtonSubtitle")}
                    left={props => <List.Icon {...props} icon={"bug"}/>}
                    right={props => <List.Icon {...props} icon={"chevron-right"}/>}
                    onPress={() => this.props.navigation.navigate("feedback")}
                    style={{paddingTop: 0, paddingBottom: 0, marginLeft: 10, marginRight: 10}}
                />
            </View>

        );
    }
}

export default withTheme(ActionsDashBoardItem);
