// @flow

import * as React from 'react';
import {
    Body,
    Card,
    CardItem,
    CheckBox,
    Container,
    Content,
    Left,
    List,
    ListItem,
    Picker,
    Right,
    Text,
} from "native-base";
import CustomHeader from "../components/CustomHeader";
import ThemeManager from '../utils/ThemeManager';
import i18n from "i18n-js";
import {NavigationActions, StackActions} from "react-navigation";
import CustomMaterialIcon from "../components/CustomMaterialIcon";
import AsyncStorageManager from "../utils/AsyncStorageManager";
import Touchable from "react-native-platform-touchable";
import {Platform} from "react-native";
import NotificationsManager from "../utils/NotificationsManager";

type Props = {
    navigation: Object,
};

type State = {
    nightMode: boolean,
    proxiwashNotifPickerSelected: string,
    startScreenPickerSelected: string,
};

/**
 * Class defining the Settings screen. This screen shows controls to modify app preferences.
 */
export default class SettingsScreen extends React.Component<Props, State> {
    state = {
        nightMode: ThemeManager.getNightMode(),
        proxiwashNotifPickerSelected: AsyncStorageManager.getInstance().preferences.proxiwashNotifications.current,
        startScreenPickerSelected: AsyncStorageManager.getInstance().preferences.defaultStartScreen.current,
    };

    /**
     * Save the value for the proxiwash reminder notification time
     *
     * @param value The value to store
     */
    onProxiwashNotifPickerValueChange(value: string) {
        let key = AsyncStorageManager.getInstance().preferences.proxiwashNotifications.key;
        AsyncStorageManager.getInstance().savePref(key, value);
        this.setState({
            proxiwashNotifPickerSelected: value
        });
        let intVal = 0;
        if (value !== 'never')
            intVal = parseInt(value);
        NotificationsManager.setMachineReminderNotificationTime(intVal);
    }

    /**
     * Save the value for the proxiwash reminder notification time
     *
     * @param value The value to store
     */
    onStartScreenPickerValueChange(value: string) {
        let key = AsyncStorageManager.getInstance().preferences.defaultStartScreen.key;
        AsyncStorageManager.getInstance().savePref(key, value);
        this.setState({
            startScreenPickerSelected: value
        });
    }

    /**
     * Returns a picker allowing the user to select the proxiwash reminder notification time
     *
     * @returns {React.Node}
     */
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
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.5')} value="5"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.10')} value="10"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.20')} value="20"/>
                <Picker.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.30')} value="30"/>
            </Picker>
        );
    }

    /**
     * Returns a picker allowing the user to select the start screen
     *
     * @returns {React.Node}
     */
    getStartScreenPicker() {
        return (
            <Picker
                note
                mode="dropdown"
                style={{width: 120}}
                selectedValue={this.state.startScreenPickerSelected}
                onValueChange={(value) => this.onStartScreenPickerValueChange(value)}
            >
                <Picker.Item label={i18n.t('screens.home')} value="Home"/>
                <Picker.Item label={i18n.t('screens.planning')} value="Planning"/>
                <Picker.Item label={i18n.t('screens.proxiwash')} value="Proxiwash"/>
                <Picker.Item label={i18n.t('screens.proximo')} value="Proximo"/>
                <Picker.Item label={'Planex'} value="Planex"/>
            </Picker>
        );
    }

    /**
     * Toggle night mode and save it to preferences
     */
    toggleNightMode() {
        ThemeManager.getInstance().setNightMode(!this.state.nightMode);
        this.setState({nightMode: !this.state.nightMode});
        this.resetStack();
    }

    /**
     * Reset react navigation stack to allow for a theme reset
     */
    resetStack() {
        const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({routeName: 'Main'})],
        });
        this.props.navigation.dispatch(resetAction);
    }

    /**
     * Get a list item using a checkbox control
     *
     * @param onPressCallback The callback when the checkbox state changes
     * @param icon The icon name to display on the list item
     * @param title The text to display as this list item title
     * @param subtitle The text to display as this list item subtitle
     * @returns {React.Node}
     */
    getToggleItem(onPressCallback: Function, icon: string, title: string, subtitle: string) {
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
                        {title}
                    </Text>
                    <Text note>
                        {subtitle}
                    </Text>
                </Body>
                <Right>
                    <CheckBox
                        checked={this.state.nightMode}
                        onPress={() => this.toggleNightMode()}
                        style={{marginRight: 20}}/>
                </Right>
            </ListItem>
        );
    }

    /**
     * Get a list item using the specified control
     *
     * @param control The custom control to use
     * @param icon The icon name to display on the list item
     * @param title The text to display as this list item title
     * @param subtitle The text to display as this list item subtitle
     * @returns {React.Node}
     */
    static getGeneralItem(control: React.Node, icon: string, title: string, subtitle: string) {
        return (
            <ListItem
                thumbnail
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

                <Right>
                    {control}
                </Right>
            </ListItem>
        );
    }

    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={i18n.t('screens.settings')} hasBackButton={true}/>
                <Content padder>
                    <Card>
                        <CardItem header>
                            <Text>{i18n.t('settingsScreen.generalCard')}</Text>
                        </CardItem>
                        <List>
                            {this.getToggleItem(() => this.toggleNightMode(), 'theme-light-dark', i18n.t('settingsScreen.nightMode'), i18n.t('settingsScreen.nightModeSub'))}
                            {SettingsScreen.getGeneralItem(this.getStartScreenPicker(), 'power', i18n.t('settingsScreen.startScreen'), i18n.t('settingsScreen.startScreenSub'))}
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
