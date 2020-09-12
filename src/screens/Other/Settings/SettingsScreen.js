// @flow

import * as React from 'react';
import {View} from 'react-native';
import i18n from 'i18n-js';
import {
  RadioButton,
  Card,
  List,
  Switch,
  ToggleButton,
  withTheme,
} from 'react-native-paper';
import {Appearance} from 'react-native-appearance';
import {StackNavigationProp} from '@react-navigation/stack';
import type {CustomThemeType} from '../../../managers/ThemeManager';
import ThemeManager from '../../../managers/ThemeManager';
import AsyncStorageManager from '../../../managers/AsyncStorageManager';
import CustomSlider from '../../../components/Overrides/CustomSlider';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';
import type {ListIconPropsType} from '../../../constants/PaperStyles';

type PropsType = {
  navigation: StackNavigationProp,
  theme: CustomThemeType,
};

type StateType = {
  nightMode: boolean,
  nightModeFollowSystem: boolean,
  startScreenPickerSelected: string,
  selectedWash: string,
  isDebugUnlocked: boolean,
};

/**
 * Class defining the Settings screen. This screen shows controls to modify app preferences.
 */
class SettingsScreen extends React.Component<PropsType, StateType> {
  savedNotificationReminder: number;

  /**
   * Loads user preferences into state
   */
  constructor() {
    super();
    const notifReminder = AsyncStorageManager.getString(
      AsyncStorageManager.PREFERENCES.proxiwashNotifications.key,
    );
    this.savedNotificationReminder = parseInt(notifReminder, 10);
    if (Number.isNaN(this.savedNotificationReminder))
      this.savedNotificationReminder = 0;

    this.state = {
      nightMode: ThemeManager.getNightMode(),
      nightModeFollowSystem:
        AsyncStorageManager.getBool(
          AsyncStorageManager.PREFERENCES.nightModeFollowSystem.key,
        ) && Appearance.getColorScheme() !== 'no-preference',
      startScreenPickerSelected: AsyncStorageManager.getString(
        AsyncStorageManager.PREFERENCES.defaultStartScreen.key,
      ),
      selectedWash: AsyncStorageManager.getString(
        AsyncStorageManager.PREFERENCES.selectedWash.key,
      ),
      isDebugUnlocked: AsyncStorageManager.getBool(
        AsyncStorageManager.PREFERENCES.debugUnlocked.key,
      ),
    };
  }

  /**
   * Saves the value for the proxiwash reminder notification time
   *
   * @param value The value to store
   */
  onProxiwashNotifPickerValueChange = (value: number) => {
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.proxiwashNotifications.key,
      value,
    );
  };

  /**
   * Saves the value for the proxiwash reminder notification time
   *
   * @param value The value to store
   */
  onStartScreenPickerValueChange = (value: string) => {
    if (value != null) {
      this.setState({startScreenPickerSelected: value});
      AsyncStorageManager.set(
        AsyncStorageManager.PREFERENCES.defaultStartScreen.key,
        value,
      );
    }
  };

  /**
   * Returns a picker allowing the user to select the proxiwash reminder notification time
   *
   * @returns {React.Node}
   */
  getProxiwashNotifPicker(): React.Node {
    const {theme} = this.props;
    return (
      <CustomSlider
        style={{flex: 1, marginHorizontal: 10, height: 50}}
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={this.savedNotificationReminder}
        onValueChange={this.onProxiwashNotifPickerValueChange}
        thumbTintColor={theme.colors.primary}
        minimumTrackTintColor={theme.colors.primary}
      />
    );
  }

  /**
   * Returns a radio picker allowing the user to select the proxiwash
   *
   * @returns {React.Node}
   */
  getProxiwashChangePicker(): React.Node {
    const {selectedWash} = this.state;
    return (
      <RadioButton.Group
        onValueChange={this.onSelectWashValueChange}
        value={selectedWash}>
        <RadioButton.Item
          label={i18n.t('screens.proxiwash.washinsa.title')}
          value="washinsa"
        />
        <RadioButton.Item
          label={i18n.t('screens.proxiwash.tripodeB.title')}
          value="tripodeB"
        />
      </RadioButton.Group>
    );
  }

  /**
   * Returns a picker allowing the user to select the start screen
   *
   * @returns {React.Node}
   */
  getStartScreenPicker(): React.Node {
    const {startScreenPickerSelected} = this.state;
    return (
      <ToggleButton.Row
        onValueChange={this.onStartScreenPickerValueChange}
        value={startScreenPickerSelected}
        style={{marginLeft: 'auto', marginRight: 'auto'}}>
        <ToggleButton icon="account-circle" value="services" />
        <ToggleButton icon="tshirt-crew" value="proxiwash" />
        <ToggleButton icon="triangle" value="home" />
        <ToggleButton icon="calendar-range" value="planning" />
        <ToggleButton icon="clock" value="planex" />
      </ToggleButton.Row>
    );
  }

  /**
   * Toggles night mode and saves it to preferences
   */
  onToggleNightMode = () => {
    const {nightMode} = this.state;
    ThemeManager.getInstance().setNightMode(!nightMode);
    this.setState({nightMode: !nightMode});
  };

  onToggleNightModeFollowSystem = () => {
    const {nightModeFollowSystem} = this.state;
    const value = !nightModeFollowSystem;
    this.setState({nightModeFollowSystem: value});
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.nightModeFollowSystem.key,
      value,
    );
    if (value) {
      const nightMode = Appearance.getColorScheme() === 'dark';
      ThemeManager.getInstance().setNightMode(nightMode);
      this.setState({nightMode});
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
  static getToggleItem(
    onPressCallback: () => void,
    icon: string,
    title: string,
    subtitle: string,
    state: boolean,
  ): React.Node {
    return (
      <List.Item
        title={title}
        description={subtitle}
        left={(props: ListIconPropsType): React.Node => (
          <List.Icon color={props.color} style={props.style} icon={icon} />
        )}
        right={(): React.Node => (
          <Switch value={state} onValueChange={onPressCallback} />
        )}
      />
    );
  }

  getNavigateItem(
    route: string,
    icon: string,
    title: string,
    subtitle: string,
    onLongPress?: () => void,
  ): React.Node {
    const {navigation} = this.props;
    return (
      <List.Item
        title={title}
        description={subtitle}
        onPress={() => {
          navigation.navigate(route);
        }}
        left={(props: ListIconPropsType): React.Node => (
          <List.Icon color={props.color} style={props.style} icon={icon} />
        )}
        right={(props: ListIconPropsType): React.Node => (
          <List.Icon
            color={props.color}
            style={props.style}
            icon="chevron-right"
          />
        )}
        onLongPress={onLongPress}
      />
    );
  }

  /**
   * Saves the value for the proxiwash selected wash
   *
   * @param value The value to store
   */
  onSelectWashValueChange = (value: string) => {
    if (value != null) {
      this.setState({selectedWash: value});
      AsyncStorageManager.set(
        AsyncStorageManager.PREFERENCES.selectedWash.key,
        value,
      );
    }
  };

  /**
   * Unlocks debug mode and saves its state to user preferences
   */
  unlockDebugMode = () => {
    this.setState({isDebugUnlocked: true});
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.debugUnlocked.key,
      true,
    );
  };

  render(): React.Node {
    const {nightModeFollowSystem, nightMode, isDebugUnlocked} = this.state;
    return (
      <CollapsibleScrollView>
        <Card style={{margin: 5}}>
          <Card.Title title={i18n.t('screens.settings.generalCard')} />
          <List.Section>
            {Appearance.getColorScheme() !== 'no-preference'
              ? SettingsScreen.getToggleItem(
                  this.onToggleNightModeFollowSystem,
                  'theme-light-dark',
                  i18n.t('screens.settings.nightModeAuto'),
                  i18n.t('screens.settings.nightModeAutoSub'),
                  nightModeFollowSystem,
                )
              : null}
            {Appearance.getColorScheme() === 'no-preference' ||
            !nightModeFollowSystem
              ? SettingsScreen.getToggleItem(
                  this.onToggleNightMode,
                  'theme-light-dark',
                  i18n.t('screens.settings.nightMode'),
                  nightMode
                    ? i18n.t('screens.settings.nightModeSubOn')
                    : i18n.t('screens.settings.nightModeSubOff'),
                  nightMode,
                )
              : null}
            <List.Item
              title={i18n.t('screens.settings.startScreen')}
              description={i18n.t('screens.settings.startScreenSub')}
              left={(props: ListIconPropsType): React.Node => (
                <List.Icon
                  color={props.color}
                  style={props.style}
                  icon="power"
                />
              )}
            />
            {this.getStartScreenPicker()}
            {this.getNavigateItem(
              'dashboard-edit',
              'view-dashboard',
              i18n.t('screens.settings.dashboard'),
              i18n.t('screens.settings.dashboardSub'),
            )}
          </List.Section>
        </Card>
        <Card style={{margin: 5}}>
          <Card.Title title="Proxiwash" />
          <List.Section>
            <List.Item
              title={i18n.t('screens.settings.proxiwashNotifReminder')}
              description={i18n.t('screens.settings.proxiwashNotifReminderSub')}
              left={(props: ListIconPropsType): React.Node => (
                <List.Icon
                  color={props.color}
                  style={props.style}
                  icon="washing-machine"
                />
              )}
            />
            <View style={{marginLeft: 30}}>
              {this.getProxiwashNotifPicker()}
            </View>
            <List.Item
              title="Test"
              description="Test"
              left={(props: ListIconPropsType): React.Node => (
                <List.Icon
                  color={props.color}
                  style={props.style}
                  icon="washing-machine"
                />
              )}
            />
            <View style={{marginLeft: 30}}>
              {this.getProxiwashChangePicker()}
            </View>
          </List.Section>
        </Card>
        <Card style={{margin: 5}}>
          <Card.Title title={i18n.t('screens.settings.information')} />
          <List.Section>
            {isDebugUnlocked
              ? this.getNavigateItem(
                  'debug',
                  'bug-check',
                  i18n.t('screens.debug.title'),
                  '',
                )
              : null}
            {this.getNavigateItem(
              'about',
              'information',
              i18n.t('screens.about.title'),
              i18n.t('screens.about.buttonDesc'),
              this.unlockDebugMode,
            )}
            {this.getNavigateItem(
              'feedback',
              'comment-quote',
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
