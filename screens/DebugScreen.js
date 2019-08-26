// @flow

import * as React from 'react';
import {Body, Card, CardItem, Container, Content, Left, List, ListItem, Right, Text,} from "native-base";
import CustomHeader from "../components/CustomHeader";
import ThemeManager from '../utils/ThemeManager';
import i18n from "i18n-js";
import CustomMaterialIcon from "../components/CustomMaterialIcon";
import Touchable from "react-native-platform-touchable";
import {Alert, Platform, Clipboard} from "react-native";
import AsyncStorageManager from "../utils/AsyncStorageManager";
import NotificationsManager from "../utils/NotificationsManager";

type Props = {
    navigation: Object,
};

/**
 * Class defining the Debug screen. This screen allows the user to get detailed information on the app/device.
 */
export default class DebugScreen extends React.Component<Props> {

    alertCurrentExpoToken() {
        let token = AsyncStorageManager.getInstance().preferences.expoToken.current;
        console.log(token);
        Alert.alert(
            'Expo Token',
            token,
            [
                {text: 'Copy', onPress: () => Clipboard.setString(token)},
                {text: 'OK'}
            ]
        );
    }

    async forceExpoTokenUpdate() {
        await NotificationsManager.forceExpoTokenUpdate();
        this.alertCurrentExpoToken();
    }


    static getGeneralItem(onPressCallback: Function, icon: string, title: string, subtitle: string) {
        return (
            <CardItem
                button
                onPress={onPressCallback}
            >
                <Left>
                    <CustomMaterialIcon icon={icon}/>
                </Left>
                <Body>
                    <Text>
                        {title}
                    </Text>
                    <Text note>
                        {subtitle}
                    </Text>
                </Body>
                <Right/>
            </CardItem>
        );
    }

    getRightButton() {
        return (
            <Touchable
                style={{padding: 6}}
                onPress={() => this.props.navigation.navigate('AboutScreen')}>
                <CustomMaterialIcon
                    color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                    icon="information"/>
            </Touchable>
        );
    }

    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={i18n.t('screens.debug')} hasBackButton={true}
                              rightButton={this.getRightButton()}/>
                <Content padder>
                    <Card>
                        <CardItem header>
                            <Text>
                                Notifications
                            </Text>
                        </CardItem>
                        <List>
                            {DebugScreen.getGeneralItem(() => this.alertCurrentExpoToken(), 'bell', 'Get current Expo Token', '')}
                            {DebugScreen.getGeneralItem(() => this.forceExpoTokenUpdate(),'bell-ring', 'Force Expo token update', '')}
                        </List>
                    </Card>
                </Content>
            </Container>

        );
    }
}
