// @flow

import * as React from 'react';
import {
    Container,
    Content,
    Left,
    ListItem,
    Right,
    Text,
    List,
    CheckBox,
    Body,
    CardItem,
    Card,
    Picker,
} from "native-base";
import CustomHeader from "../components/CustomHeader";
import ThemeManager from '../utils/ThemeManager';
import i18n from "i18n-js";
import {NavigationActions, StackActions} from "react-navigation";
import CustomMaterialIcon from "../components/CustomMaterialIcon";
import {AsyncStorage} from 'react-native'

const proxiwashNotifKey = "proxiwashNotifKey";

type Props = {
    navigation: Object,
};

type State = {
    nightMode: boolean,
    proxiwashNotifPickerSelected: string,
};

export default class SettingsScreen extends React.Component<Props, State> {
    state = {
        nightMode: ThemeManager.getInstance().getNightMode(),
        proxiwashNotifPickerSelected: "5"
    };

    async componentWillMount() {
        let val = await AsyncStorage.getItem(proxiwashNotifKey);
        if (val === null)
            val = "5";
        this.setState({
            proxiwashNotifPickerSelected: val,
        });
    }


    onProxiwashNotifPickerValueChange(value: string) {
        AsyncStorage.setItem(proxiwashNotifKey, value);
        this.setState({
            proxiwashNotifPickerSelected: value
        });
    }

    getProxiwashNotifPicker() {
        return (
            <Picker
                note
                mode="dropdown"
                style={{width: 120}}
                selectedValue={this.state.proxiwashNotifPickerSelected}
                onValueChange={(value) => this.onProxiwashNotifPickerValueChange(value)}
            >
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.never')} value="never"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.1')} value="1"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.2')} value="2"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.3')} value="3"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.5')} value="5"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.10')} value="10"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.20')} value="20"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.30')} value="30"/>
            </Picker>
        );
    }

    toggleNightMode() {
        ThemeManager.getInstance().setNightMode(!this.state.nightMode);
        this.setState({nightMode: !this.state.nightMode});
        // Alert.alert(i18n.t('settingsScreen.nightMode'), i18n.t('settingsScreen.restart'));
        this.resetStack();
    }

    resetStack() {
        const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({routeName: 'Main'})],
        });
        this.props.navigation.dispatch(resetAction);
        this.props.navigation.navigate('Settings');
    }

    getToggleItem(onPressCallback: Function, icon: string, text: string, subtitle: string) {
        return (
            <ListItem
                button
                thumbnail
                onPress={onPressCallback}
            >
                <Left>
                    <CustomMaterialIcon icon={icon}/>
                </Left>
                <Body>
                    <Text>
                        {text}
                    </Text>
                    <Text note>
                        {subtitle}
                    </Text>
                </Body>
                <Right style={{flex: 1}}>
                    <CheckBox checked={this.state.nightMode}
                              onPress={() => this.toggleNightMode()}/>
                </Right>
            </ListItem>
        );
    }

    static getGeneralItem(control: React.Node, icon: string, text: string, subtitle: string) {
        return (
            <ListItem
                thumbnail
            >
                <Left>
                    <CustomMaterialIcon icon={icon}/>
                </Left>
                <Body>
                    <Text>
                        {text}
                    </Text>
                    <Text note>
                        {subtitle}
                    </Text>
                </Body>

                <Right style={{flex: 1}}>
                    {control}
                </Right>
            </ListItem>
        );
    }

    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={i18n.t('screens.settings')}/>
                <Content>
                    <Card>
                        <CardItem header>
                            <Text>{i18n.t('settingsScreen.appearanceCard')}</Text>
                        </CardItem>
                        <List>
                            {this.getToggleItem(() => this.toggleNightMode(), 'theme-light-dark', i18n.t('settingsScreen.nightMode'), i18n.t('settingsScreen.nightModeSub'))}
                        </List>
                    </Card>
                    <Card>
                        <CardItem header>
                            <Text>Proxiwash</Text>
                        </CardItem>
                        <List>
                            {SettingsScreen.getGeneralItem(this.getProxiwashNotifPicker(), 'washing-machine', i18n.t('settingsScreen.proxiwashNotifReminder'), i18n.t('settingsScreen.proxiwashNotifReminderSub'))}
                        </List>
                    </Card>
                </Content>
            </Container>

        );
    }
}
