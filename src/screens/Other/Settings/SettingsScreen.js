// @flow

import * as React from 'react';
import {View} from "react-native";
import type {CustomTheme} from "../../../managers/ThemeManager";
import ThemeManager from '../../../managers/ThemeManager';
import i18n from "i18n-js";
import AsyncStorageManager from "../../../managers/AsyncStorageManager";
import {Card, List, Switch, ToggleButton, withTheme} from 'react-native-paper';
import {Appearance} from "react-native-appearance";
import CustomSlider from "../../../components/Overrides/CustomSlider";
import {StackNavigationProp} from "@react-navigation/stack";
import CollapsibleScrollView from "../../../components/Collapsible/CollapsibleScrollView";

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
};

type State = {
    nightMode: boolean,
    nightModeFollowSystem: boolean,
    notificationReminderSelected: number,
    startScreenPickerSelected: string,
    isDebugUnlocked: boolean,
};

/**
 * Class defining the Settings screen. This screen shows controls to modify app preferences.
 */
class SettingsScreen extends React.Component<Props, State> {

    savedNotificationReminder: number;

    /**
     * Loads user preferences into state
     */
    constructor() {
        super();
        let notifReminder = AsyncStorageManager.getString(AsyncStorageManager.PREFERENCES.proxiwashNotifications.key);
        this.savedNotificationReminder = parseInt(notifReminder);
        if (isNaN(this.savedNotificationReminder))
            this.savedNotificationReminder = 0;

        this.state = {
            nightMode: ThemeManager.getNightMode(),
            nightModeFollowSystem: AsyncStorageManager.getBool(AsyncStorageManager.PREFERENCES.nightModeFollowSystem.key)
                && Appearance.getColorScheme() !== 'no-preference',
            notificationReminderSelected: this.savedNotificationReminder,
            startScreenPickerSelected: AsyncStorageManager.getString(AsyncStorageManager.PREFERENCES.defaultStartScreen.key),
            isDebugUnlocked: AsyncStorageManager.getBool(AsyncStorageManager.PREFERENCES.debugUnlocked.key)
        };
    }

    /**
     * Unlocks debug mode and saves its state to user preferences
     */
    unlockDebugMode = () => {
        this.setState({isDebugUnlocked: true});
        AsyncStorageManager.set(AsyncStorageManager.PREFERENCES.debugUnlocked.key, true);
    }

    /**
     * Saves the value for the proxiwash reminder notification time
     *
     * @param value The value to store
     */
    onProxiwashNotifPickerValueChange = (value: number) => {
        this.setState({notificationReminderSelected: value});
        AsyncStorageManager.set(AsyncStorageManager.PREFERENCES.proxiwashNotifications.key, value);
    };

    /**
     * Saves the value for the proxiwash reminder notification time
     *
     * @param value The value to store
     */
    onStartScreenPickerValueChange = (value: string) => {
        if (value != null) {
            this.setState({startScreenPickerSelected: value});
            AsyncStorageManager.set(AsyncStorageManager.PREFERENCES.defaultStartScreen.key, value);
        }
    };

    /**
     * Returns a picker allowing the user to select the proxiwash reminder notification time
     *
     * @returns {React.Node}
     */
    getProxiwashNotifPicker() {
        return (
            <CustomSlider
                style={{flex: 1, marginHorizontal: 10, height: 50}}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={this.savedNotificationReminder}
                onValueChange={this.onProxiwashNotifPickerValueChange}
                thumbTintColor={this.props.theme.colors.primary}
                minimumTrackTintColor={this.props.theme.colors.primary}
            />
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
                style={{marginLeft: 'auto', marginRight: 'auto'}}
            >
                <ToggleButton icon="account-circle" value="services"/>
                <ToggleButton icon="tshirt-crew" value="proxiwash"/>
                <ToggleButton icon="triangle" value="home"/>
                <ToggleButton icon="calendar-range" value="planning"/>
                <ToggleButton icon="clock" value="planex"/>
            </ToggleButton.Row>
        );
    }

    /**
     * Toggles night mode and saves it to preferences
     */
    onToggleNightMode = () => {
        ThemeManager.getInstance().setNightMode(!this.state.nightMode);
        this.setState({nightMode: !this.state.nightMode});
    };

    onToggleNightModeFollowSystem = () => {
        const value = !this.state.nightModeFollowSystem;
        this.setState({nightModeFollowSystem: value});
        AsyncStorageManager.set(AsyncStorageManager.PREFERENCES.nightModeFollowSystem.key, value);
        if (value) {
            const nightMode = Appearance.getColorScheme() === 'dark';
            ThemeManager.getInstance().setNightMode(nightMode);
            this.setState({nightMode: nightMode});
        }
    };

    /**
     * Gets a list item using a checkbox control
     *
     * @param onPressCallback The callback when the checkbox state changes
     * @param icon The icon name to display on the list item
     * @param title The text to display as this list item title
     * @param subtitle The text to display as this list item subtitle
     * @param state The current state of the switch
     * @returns {React.Node}
     */
    getToggleItem(onPressCallback: Function, icon: string, title: string, subtitle: string, state: boolean) {
        return (
            <List.Item
                title={title}
                description={subtitle}
                left={props => <List.Icon {...props} icon={icon}/>}
                right={() =>
                    <Switch
                        value={state}
                        onValueChange={onPressCallback}
                    />}
            />
        );
    }

    getNavigateItem(route: string, icon: string, title: string, subtitle: string, onLongPress?: () => void) {
        return (
            <List.Item
                title={title}
                description={subtitle}
                onPress={() => this.props.navigation.navigate(route)}
                left={props => <List.Icon {...props} icon={icon}/>}
                right={props => <List.Icon {...props} icon={"chevron-right"}/>}
                onLongPress={onLongPress}
            />
        );
    }

    render() {
        return (
            <CollapsibleScrollView>
                <Card style={{margin: 5}}>
                    <Card.Title title={i18n.t('screens.settings.generalCard')}/>
                    <List.Section>
                        {Appearance.getColorScheme() !== 'no-preference' ? this.getToggleItem(
                            this.onToggleNightModeFollowSystem,
                            'theme-light-dark',
                            i18n.t('screens.settings.nightModeAuto'),
                            i18n.t('screens.settings.nightModeAutoSub'),
                            this.state.nightModeFollowSystem
                        ) : null}
                        {
                            Appearance.getColorScheme() === 'no-preference' || !this.state.nightModeFollowSystem ?
                                this.getToggleItem(
                                    this.onToggleNightMode,
                                    'theme-light-dark',
                                    i18n.t('screens.settings.nightMode'),
                                    this.state.nightMode ?
                                        i18n.t('screens.settings.nightModeSubOn') :
                                        i18n.t('screens.settings.nightModeSubOff'),
                                    this.state.nightMode
                                ) : null
                        }
                        <List.Item
                            title={i18n.t('screens.settings.startScreen')}
                            description={i18n.t('screens.settings.startScreenSub')}
                            left={props => <List.Icon {...props} icon="power"/>}
                        />
                        {this.getStartScreenPicker()}
                        {this.getNavigateItem(
                            "dashboard-edit",
                            "view-dashboard",
                            i18n.t('screens.settings.dashboard'),
                            i18n.t('screens.settings.dashboardSub')
                        )}
                    </List.Section>
                </Card>
                <Card style={{margin: 5}}>
                    <Card.Title title="Proxiwash"/>
                    <List.Section>
                        <List.Item
                            title={i18n.t('screens.settings.proxiwashNotifReminder')}
                            description={i18n.t('screens.settings.proxiwashNotifReminderSub')}
                            left={props => <List.Icon {...props} icon="washing-machine"/>}
                            opened={true}
                        />
                        <View style={{marginLeft: 30}}>
                            {this.getProxiwashNotifPicker()}
                        </View>
                    </List.Section>
                </Card>
                <Card style={{margin: 5}}>
                    <Card.Title title={i18n.t('screens.settings.information')}/>
                    <List.Section>
                        {this.state.isDebugUnlocked
                            ? this.getNavigateItem(
                                "debug",
                                "bug-check",
                                i18n.t('screens.debug.title'),
                                ""
                            )
                            : null}
                        {this.getNavigateItem(
                            "about",
                            "information",
                            i18n.t('screens.about.title'),
                            i18n.t('screens.about.buttonDesc'),
                            this.unlockDebugMode,
                        )}
                        {this.getNavigateItem(
                            "feedback",
                            "comment-quote",
                            i18n.t('screens.feedback.homeButtonTitle'),
                            i18n.t('screens.feedback.homeButtonSubtitle'),
                        )}
                    </List.Section>
                </Card>
            </CollapsibleScrollView>
        );
    }
}

export default withTheme(SettingsScreen);
