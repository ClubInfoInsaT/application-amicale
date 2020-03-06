// @flow

import * as React from 'react';
import {ScrollView, View} from "react-native";
import ThemeManager from '../utils/ThemeManager';
import i18n from "i18n-js";
import AsyncStorageManager from "../utils/AsyncStorageManager";
import NotificationsManager from "../utils/NotificationsManager";
import {Card, List, Switch, RadioButton, Text, TouchableRipple} from 'react-native-paper';

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

    onProxiwashNotifPickerValueChange: Function;
    onStartScreenPickerValueChange: Function;
    onToggleNightMode: Function;

    constructor() {
        super();
        this.onProxiwashNotifPickerValueChange = this.onProxiwashNotifPickerValueChange.bind(this);
        this.onStartScreenPickerValueChange = this.onStartScreenPickerValueChange.bind(this);
        this.onToggleNightMode = this.onToggleNightMode.bind(this);
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
            <List.Item
                title={title}
                description={subtitle}
                left={props => <List.Icon {...props} icon={icon}/>}
                right={props => control}
            />
        );
    }

    getRadioButton(onPress: Function, value: string, label: string) {
        return (
            <TouchableRipple
                onPress={onPress}
            >
                <View pointerEvents="none">
                    <Text>{label}</Text>
                    <RadioButton value={value} />
                </View>
            </TouchableRipple>
        );
    }

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
            <RadioButton.Group
                onValueChange={this.onProxiwashNotifPickerValueChange}
                value={this.state.proxiwashNotifPickerSelected}
            >
                <RadioButton.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.never')} value="never"/>
                <RadioButton.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.5')} value="5"/>
                <RadioButton.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.10')} value="10"/>
                <RadioButton.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.20')} value="20"/>
                <RadioButton.Item label={i18n.t('settingsScreen.proxiwashNotifReminderPicker.30')} value="30"/>
            </RadioButton.Group>
        );
    }

    /**
     * Returns a picker allowing the user to select the start screen
     *
     * @returns {React.Node}
     */
    getStartScreenPicker() {
        return (
            <RadioButton.Group
                onValueChange={this.onStartScreenPickerValueChange}
                value={this.state.startScreenPickerSelected}
            >
                <RadioButton.Item label={i18n.t('screens.home')} value="Home" style={{color: "#fff"}}/>
                <RadioButton.Item label={i18n.t('screens.planning')} value="Planning"/>
                <RadioButton.Item label={i18n.t('screens.proxiwash')} value="Proxiwash"/>
                <RadioButton.Item label={i18n.t('screens.proximo')} value="Proximo"/>
                <RadioButton.Item label={'Planex'} value="Planex"/>
            </RadioButton.Group>
        );
    }

    /**
     * Toggle night mode and save it to preferences
     */
    onToggleNightMode() {
        ThemeManager.getInstance().setNightMode(!this.state.nightMode);
        this.setState({nightMode: !this.state.nightMode});
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
            <List.Item
                title={title}
                description={subtitle}
                left={props => <List.Icon {...props} icon={icon}/>}
                right={props =>
                    <Switch
                        value={this.state.nightMode}
                        onValueChange={onPressCallback}
                    />}
            />
        );
    }

    render() {
        return (
            <ScrollView>
                <Card style={{margin: 5}}>
                    <Card.Title title={i18n.t('settingsScreen.generalCard')}/>
                    <List.Section>
                        {this.getToggleItem(this.onToggleNightMode, 'theme-light-dark', i18n.t('settingsScreen.nightMode'), i18n.t('settingsScreen.nightModeSub'))}
                        <List.Accordion
                            title={i18n.t('settingsScreen.startScreen')}
                            description={i18n.t('settingsScreen.startScreenSub')}
                            left={props => <List.Icon {...props} icon="power" />}
                        >
                            {this.getStartScreenPicker()}
                        </List.Accordion>
                    </List.Section>
                </Card>
                <Card style={{margin: 5}}>
                    <Card.Title title="Proxiwash"/>
                    <List.Accordion
                        title={i18n.t('settingsScreen.proxiwashNotifReminder')}
                        description={i18n.t('settingsScreen.proxiwashNotifReminderSub')}
                        left={props => <List.Icon {...props} icon="washing-machine" />}
                    >
                        {this.getProxiwashNotifPicker()}
                    </List.Accordion>
                </Card>

            </ScrollView>
        );
    }
}
