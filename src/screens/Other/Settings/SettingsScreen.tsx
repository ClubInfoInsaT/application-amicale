/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import i18n from 'i18n-js';
import {
  RadioButton,
  Card,
  List,
  Switch,
  ToggleButton,
  useTheme,
} from 'react-native-paper';
import { Appearance } from 'react-native-appearance';
import CustomSlider from '../../../components/Overrides/CustomSlider';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';
import GENERAL_STYLES from '../../../constants/Styles';
import {
  usePreferences,
  useProxiwashPreferences,
} from '../../../context/preferencesContext';
import { useNavigation } from '@react-navigation/core';
import {
  getPreferenceBool,
  getPreferenceNumber,
  getPreferenceString,
  GeneralPreferenceKeys,
  ProxiwashPreferenceKeys,
} from '../../../utils/asyncStorage';

const styles = StyleSheet.create({
  slider: {
    flex: 1,
    marginHorizontal: 10,
    height: 50,
  },
  card: {
    margin: 5,
  },
  pickerContainer: {
    marginLeft: 30,
  },
});

/**
 * Class defining the Settings screen. This screen shows controls to modify app preferences.
 */
function SettingsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const generalPreferences = usePreferences();
  const proxiwashPreferences = useProxiwashPreferences();

  const nightMode = getPreferenceBool(
    GeneralPreferenceKeys.nightMode,
    generalPreferences.preferences
  ) as boolean;
  const nightModeFollowSystem =
    (getPreferenceBool(
      GeneralPreferenceKeys.nightModeFollowSystem,
      generalPreferences.preferences
    ) as boolean) && Appearance.getColorScheme() !== 'no-preference';
  const startScreenPickerSelected = getPreferenceString(
    GeneralPreferenceKeys.defaultStartScreen,
    generalPreferences.preferences
  ) as string;
  const selectedWash = getPreferenceString(
    ProxiwashPreferenceKeys.selectedWash,
    proxiwashPreferences.preferences
  ) as string;
  const isDebugUnlocked = getPreferenceBool(
    GeneralPreferenceKeys.debugUnlocked,
    generalPreferences.preferences
  ) as boolean;
  const notif = getPreferenceNumber(
    ProxiwashPreferenceKeys.proxiwashNotifications,
    proxiwashPreferences.preferences
  );
  const savedNotificationReminder = !notif || Number.isNaN(notif) ? 0 : notif;

  const onProxiwashNotifPickerValueChange = (value: number) => {
    proxiwashPreferences.updatePreferences(
      ProxiwashPreferenceKeys.proxiwashNotifications,
      value
    );
  };

  const onStartScreenPickerValueChange = (value: string) => {
    if (value != null) {
      generalPreferences.updatePreferences(
        GeneralPreferenceKeys.defaultStartScreen,
        value
      );
    }
  };

  const getProxiwashNotifPicker = () => {
    return (
      <CustomSlider
        style={styles.slider}
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={savedNotificationReminder}
        onValueChange={onProxiwashNotifPickerValueChange}
        thumbTintColor={theme.colors.primary}
        minimumTrackTintColor={theme.colors.primary}
      />
    );
  };

  const getProxiwashChangePicker = () => {
    return (
      <RadioButton.Group
        onValueChange={onSelectWashValueChange}
        value={selectedWash}
      >
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
  };

  const getStartScreenPicker = () => {
    return (
      <ToggleButton.Row
        onValueChange={onStartScreenPickerValueChange}
        value={startScreenPickerSelected}
        style={GENERAL_STYLES.centerHorizontal}
      >
        <ToggleButton icon="account-circle" value="services" />
        <ToggleButton icon="tshirt-crew" value="proxiwash" />
        <ToggleButton icon="triangle" value="home" />
        <ToggleButton icon="calendar-range" value="planning" />
        <ToggleButton icon="clock" value="planex" />
      </ToggleButton.Row>
    );
  };

  const onToggleNightMode = () => {
    generalPreferences.updatePreferences(
      GeneralPreferenceKeys.nightMode,
      !nightMode
    );
  };

  const onToggleNightModeFollowSystem = () => {
    generalPreferences.updatePreferences(
      GeneralPreferenceKeys.nightModeFollowSystem,
      !nightModeFollowSystem
    );
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
  const getToggleItem = (
    onPressCallback: () => void,
    icon: string,
    title: string,
    subtitle: string,
    state: boolean
  ) => {
    return (
      <List.Item
        title={title}
        description={subtitle}
        left={(props) => (
          <List.Icon color={props.color} style={props.style} icon={icon} />
        )}
        right={() => <Switch value={state} onValueChange={onPressCallback} />}
      />
    );
  };

  const getNavigateItem = (
    route: string,
    icon: string,
    title: string,
    subtitle: string,
    onLongPress?: () => void
  ) => {
    return (
      <List.Item
        title={title}
        description={subtitle}
        onPress={() => {
          navigation.navigate(route);
        }}
        left={(props) => (
          <List.Icon color={props.color} style={props.style} icon={icon} />
        )}
        right={(props) => (
          <List.Icon
            color={props.color}
            style={props.style}
            icon="chevron-right"
          />
        )}
        onLongPress={onLongPress}
      />
    );
  };

  const onSelectWashValueChange = (value: string) => {
    if (value != null) {
      proxiwashPreferences.updatePreferences(
        ProxiwashPreferenceKeys.selectedWash,
        value
      );
    }
  };

  const unlockDebugMode = () => {
    generalPreferences.updatePreferences(
      GeneralPreferenceKeys.debugUnlocked,
      true
    );
  };

  return (
    <CollapsibleScrollView>
      <Card style={styles.card}>
        <Card.Title title={i18n.t('screens.settings.generalCard')} />
        <List.Section>
          {Appearance.getColorScheme() !== 'no-preference'
            ? getToggleItem(
                onToggleNightModeFollowSystem,
                'theme-light-dark',
                i18n.t('screens.settings.nightModeAuto'),
                i18n.t('screens.settings.nightModeAutoSub'),
                nightModeFollowSystem
              )
            : null}
          {Appearance.getColorScheme() === 'no-preference' ||
          !nightModeFollowSystem
            ? getToggleItem(
                onToggleNightMode,
                'theme-light-dark',
                i18n.t('screens.settings.nightMode'),
                nightMode
                  ? i18n.t('screens.settings.nightModeSubOn')
                  : i18n.t('screens.settings.nightModeSubOff'),
                nightMode
              )
            : null}
          <List.Item
            title={i18n.t('screens.settings.startScreen')}
            description={i18n.t('screens.settings.startScreenSub')}
            left={(props) => (
              <List.Icon color={props.color} style={props.style} icon="power" />
            )}
          />
          {getStartScreenPicker()}
          {getNavigateItem(
            'dashboard-edit',
            'view-dashboard',
            i18n.t('screens.settings.dashboard'),
            i18n.t('screens.settings.dashboardSub')
          )}
        </List.Section>
      </Card>
      <Card style={styles.card}>
        <Card.Title title="Proxiwash" />
        <List.Section>
          <List.Item
            title={i18n.t('screens.settings.proxiwashNotifReminder')}
            description={i18n.t('screens.settings.proxiwashNotifReminderSub')}
            left={(props) => (
              <List.Icon
                color={props.color}
                style={props.style}
                icon="washing-machine"
              />
            )}
          />
          <View style={styles.pickerContainer}>
            {getProxiwashNotifPicker()}
          </View>
          <List.Item
            title={i18n.t('screens.settings.proxiwashChangeWash')}
            description={i18n.t('screens.settings.proxiwashChangeWashSub')}
            left={(props) => (
              <List.Icon
                color={props.color}
                style={props.style}
                icon="washing-machine"
              />
            )}
          />
          <View style={styles.pickerContainer}>
            {getProxiwashChangePicker()}
          </View>
        </List.Section>
      </Card>
      <Card style={styles.card}>
        <Card.Title title={i18n.t('screens.settings.information')} />
        <List.Section>
          {isDebugUnlocked
            ? getNavigateItem(
                'debug',
                'bug-check',
                i18n.t('screens.debug.title'),
                ''
              )
            : null}
          {getNavigateItem(
            'about',
            'information',
            i18n.t('screens.about.title'),
            i18n.t('screens.about.buttonDesc'),
            unlockDebugMode
          )}
          {getNavigateItem(
            'feedback',
            'comment-quote',
            i18n.t('screens.feedback.homeButtonTitle'),
            i18n.t('screens.feedback.homeButtonSubtitle')
          )}
        </List.Section>
      </Card>
    </CollapsibleScrollView>
  );
}

export default SettingsScreen;
