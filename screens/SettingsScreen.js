// @flow

import * as React from 'react';
import {ScrollView} from "react-native";
import ThemeManager from '../utils/ThemeManager';
import i18n from "i18n-js";
import AsyncStorageManager from "../utils/AsyncStorageManager";
import NotificationsManager from "../utils/NotificationsManager";
import {Card, List, Switch, ToggleButton} from 'react-native-paper';
import {Appearance} from "react-native-appearance";

type Props = {
    navigation: Object,
};

type State = {
    nightMode: boolean,
    nightModeFollowSystem: boolean,
    proxiwashNotifPickerSelected: string,
    startScreenPickerSelected: string,
};

/**
 * Class defining the Settings screen. This screen shows controls to modify app preferences.
 */
export default class SettingsScreen extends React.Component<Props, State> {
    state = {
        nightMode: ThemeManager.getNightMode(),
        nightModeFollowSystem: AsyncStorageManager.getInstance().preferences.nightModeFollowSystem.current === '1' &&
        Appearance.getColorScheme() !== 'no-preference',
        proxiwashNotifPickerSelected: AsyncStorageManager.getInstance().preferences.proxiwashNotifications.current,
        startScreenPickerSelected: AsyncStorageManager.getInstance().preferences.defaultStartScreen.current,
    };

    onProxiwashNotifPickerValueChange: Function;
    onStartScreenPickerValueChange: Function;
    onToggleNightMode: Function;
    onToggleNightModeFollowSystem: Function;

    constructor() {
        super();
        this.onProxiwashNotifPickerValueChange = this.onProxiwashNotifPickerValueChange.bind(this);
        this.onStartScreenPickerValueChange = this.onStartScreenPickerValueChange.bind(this);
        this.onToggleNightMode = this.onToggleNightMode.bind(this);
        this.onToggleNightModeFollowSystem = this.onToggleNightModeFollowSystem.bind(this);
    }

    /**
     * Save the value for the proxiwash reminder notification time
     *
     * @param value The value to store
     */
    onProxiwashNotifPickerValueChange(value: string) {
        if (value != null) {
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
    }

    /**
     * Save the value for the proxiwash reminder notification time
     *
     * @param value The value to store
     */
    onStartScreenPickerValueChange(value: string) {
        if (value != null) {
            let key = AsyncStorageManager.getInstance().preferences.defaultStartScreen.key;
            AsyncStorageManager.getInstance().savePref(key, value);
            this.setState({
                startScreenPickerSelected: value
            });
        }
    }

    /**
     * Returns a picker allowing the user to select the proxiwash reminder notification time
     *
     * @returns {React.Node}
     */
    getProxiwashNotifPicker() {
        return (
            <ToggleButton.Row
                onValueChange={this.onProxiwashNotifPickerValueChange}
                value={this.state.proxiwashNotifPickerSelected}
            >
                <ToggleButton icon="close" value="never"/>
                <ToggleButton icon="numeric-2" value="2"/>
                <ToggleButton icon="numeric-5" value="5"/>
            </ToggleButton.Row>
        );
    }

    /**
     * Returns a picker allowing the user to select the start screen
     *
     * @returns {React.Node}
     */
    getStartScreenPicker() {
        return (
            <ToggleButton.Row
                onValueChange={this.onStartScreenPickerValueChange}
                value={this.state.startScreenPickerSelected}
            >
                <ToggleButton icon="shopping" value="Proximo"/>
                <ToggleButton icon="calendar-range" value="Planning"/>
                <ToggleButton icon="triangle" value="Home"/>
                <ToggleButton icon="washing-machine" value="Proxiwash"/>
                <ToggleButton icon="timetable" value="Planex"/>
            </ToggleButton.Row>
        );
    }

    /**
     * Toggle night mode and save it to preferences
     */
    onToggleNightMode() {
        ThemeManager.getInstance().setNightMode(!this.state.nightMode);
        this.setState({nightMode: !this.state.nightMode});
    }

    onToggleNightModeFollowSystem() {
        const value = !this.state.nightModeFollowSystem;
        this.setState({nightModeFollowSystem: value});
        let key = AsyncStorageManager.getInstance().preferences.nightModeFollowSystem.key;
        AsyncStorageManager.getInstance().savePref(key, value ? '1' : '0');
        if (value) {
            const nightMode = Appearance.getColorScheme() === 'dark';
            ThemeManager.getInstance().setNightMode(nightMode);
            this.setState({nightMode: nightMode});
        }
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
    getToggleItem(onPressCallback: Function, icon: string, title: string, subtitle: string, state: boolean) {
        return (
            <List.Item
                title={title}
                description={subtitle}
                left={props => <List.Icon {...props} icon={icon}/>}
                right={props =>
                    <Switch
                        value={state}
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
                        {Appearance.getColorScheme() !== 'no-preference' ? this.getToggleItem(
                            this.onToggleNightModeFollowSystem,
                            'theme-light-dark',
                            i18n.t('settingsScreen.nightModeAuto'),
                            this.state.nightMode ?
                                i18n.t('settingsScreen.nightModeSubOn') :
                                i18n.t('settingsScreen.nightModeSubOff'),
                            this.state.nightModeFollowSystem
                        ) : null}
                        {
                            Appearance.getColorScheme() === 'no-preference' || !this.state.nightModeFollowSystem ?
                            this.getToggleItem(
                                this.onToggleNightMode,
                                'theme-light-dark',
                                i18n.t('settingsScreen.nightMode'),
                                this.state.nightMode ?
                                    i18n.t('settingsScreen.nightModeSubOn') :
                                    i18n.t('settingsScreen.nightModeSubOff'),
                                this.state.nightMode
                            ) : null
                        }
                        <List.Accordion
                            title={i18n.t('settingsScreen.startScreen')}
                            description={i18n.t('settingsScreen.startScreenSub')}
                            left={props => <List.Icon {...props} icon="power"/>}
                        >
                            {this.getStartScreenPicker()}
                        </List.Accordion>
                    </List.Section>
                </Card>
                <Card style={{margin: 5}}>
                    <Card.Title title="Proxiwash"/>
                    <List.Section>
                        <List.Accordion
                            title={i18n.t('settingsScreen.proxiwashNotifReminder')}
                            description={i18n.t('settingsScreen.proxiwashNotifReminderSub')}
                            left={props => <List.Icon {...props} icon="washing-machine"/>}
                        >
                            {this.getProxiwashNotifPicker()}
                        </List.Accordion>
                    </List.Section>
                </Card>

            </ScrollView>
        );
    }
}
