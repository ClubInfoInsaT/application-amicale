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

import React, { useCallback, useState } from 'react';
import { Title, useTheme } from 'react-native-paper';
import i18n from 'i18n-js';
import { StyleSheet, View } from 'react-native';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import Autolink from 'react-native-autolink';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import AlertDialog from '../../components/Dialogs/AlertDialog';
import { dateToString, getTimeOnlyString } from '../../utils/Planning';
import DateManager from '../../managers/DateManager';
import type { PlanexGroupType } from './GroupSelectionScreen';
import { MASCOT_STYLE } from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import { getPrettierPlanexGroupName } from '../../utils/Utils';
import GENERAL_STYLES from '../../constants/Styles';
import PlanexWebview from '../../components/Screens/PlanexWebview';
import PlanexBottomBar from '../../components/Animations/PlanexBottomBar';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  popup: {
    borderWidth: 2,
  },
});

type Props = {
  route: {
    params: {
      group?: PlanexGroupType;
    };
  };
};

function PlanexScreen(props: Props) {
  const navigation = useNavigation();
  const theme = useTheme();

  const [dialogContent, setDialogContent] = useState<
    | undefined
    | {
        title: string | React.ReactElement;
        message: string | React.ReactElement;
        color: string;
      }
  >();
  const [injectJS, setInjectJS] = useState('');

  const getCurrentGroup = (): PlanexGroupType | undefined => {
    let currentGroupString = AsyncStorageManager.getString(
      AsyncStorageManager.PREFERENCES.planexCurrentGroup.key
    );
    let group: PlanexGroupType;
    if (currentGroupString !== '') {
      group = JSON.parse(currentGroupString);
      navigation.setOptions({
        title: getPrettierPlanexGroupName(group.name),
      });
      return group;
    }
    return undefined;
  };

  const [currentGroup, setCurrentGroup] = useState<PlanexGroupType | undefined>(
    getCurrentGroup()
  );

  useFocusEffect(
    useCallback(() => {
      if (props.route.params?.group) {
        // reset params to prevent infinite loop
        selectNewGroup(props.route.params.group);
        navigation.dispatch(CommonActions.setParams({ group: undefined }));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.route.params])
  );
  /**
   * Gets the Webview, with an error view on top if no group is selected.
   *
   * @returns {*}
   */
  const getWebView = () => (
    <PlanexWebview
      currentGroup={currentGroup}
      injectJS={injectJS}
      onMessage={onMessage}
    />
  );

  /**
   * Callback used when the user clicks on the navigate to settings button.
   * This will hide the banner and open the SettingsScreen
   */
  const onGoToSettings = () => navigation.navigate('settings');

  /**
   * Sends a FullCalendar action to the web page inside the webview.
   *
   * @param action The action to perform, as described in the FullCalendar doc https://fullcalendar.io/docs/v3.
   * Or "setGroup" with the group id as data to set the selected group
   * @param data Data to pass to the action
   */
  const sendMessage = (action: string, data?: string) => {
    let command;
    if (action === 'setGroup') {
      command = `displayAde(${data})`;
    } else {
      command = `$('#calendar').fullCalendar('${action}', '${data}')`;
    }
    // String must resolve to true to prevent crash on iOS
    command += ';true;';
    // Change the injected
    if (command === injectJS) {
      command += ';true;';
    }
    setInjectJS(command);
  };

  /**
   * Shows a dialog when the user clicks on an event.
   *
   * @param event
   */
  const onMessage = (event: { nativeEvent: { data: string } }) => {
    const data: {
      start: string;
      end: string;
      title: string;
      color: string;
    } = JSON.parse(event.nativeEvent.data);
    const startDate = dateToString(new Date(data.start), true);
    const endDate = dateToString(new Date(data.end), true);
    const startString = getTimeOnlyString(startDate);
    const endString = getTimeOnlyString(endDate);

    let msg = `${DateManager.getInstance().getTranslatedDate(startDate)}\n`;
    if (startString != null && endString != null) {
      msg += `${startString} - ${endString}`;
    }
    showDialog(data.title, msg, data.color);
  };

  /**
   * Shows a simple dialog to the user.
   *
   * @param title The dialog's title
   * @param message The message to show
   */
  const showDialog = (title: string, message: string, color?: string) => {
    const finalColor = color ? color : theme.colors.surface;
    setDialogContent({
      title: (
        <Autolink
          text={title}
          hashtag={'facebook'}
          component={Title}
          truncate={32}
          email={true}
          url={true}
          phone={true}
        />
      ),
      message: message,
      color: finalColor,
    });
  };

  const hideDialog = () => setDialogContent(undefined);

  /**
   * Sends the webpage a message with the new group to select and save it to preferences
   *
   * @param group The group object selected
   */
  const selectNewGroup = (group: PlanexGroupType) => {
    sendMessage('setGroup', group.id.toString());
    setCurrentGroup(group);
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.planexCurrentGroup.key,
      group
    );

    navigation.setOptions({ title: getPrettierPlanexGroupName(group.name) });
  };

  return (
    <View style={GENERAL_STYLES.flex}>
      {/* Allow to draw webview bellow banner */}
      <View style={styles.container}>
        {theme.dark ? ( // Force component theme update by recreating it on theme change
          getWebView()
        ) : (
          <View style={GENERAL_STYLES.flex}>{getWebView()}</View>
        )}
      </View>
      {AsyncStorageManager.getString(
        AsyncStorageManager.PREFERENCES.defaultStartScreen.key
      ).toLowerCase() !== 'planex' ? (
        <MascotPopup
          prefKey={AsyncStorageManager.PREFERENCES.planexShowMascot.key}
          title={i18n.t('screens.planex.mascotDialog.title')}
          message={i18n.t('screens.planex.mascotDialog.message')}
          icon="emoticon-kiss"
          buttons={{
            action: {
              message: i18n.t('screens.planex.mascotDialog.ok'),
              icon: 'cog',
              onPress: onGoToSettings,
            },
            cancel: {
              message: i18n.t('screens.planex.mascotDialog.cancel'),
              icon: 'close',
              color: theme.colors.warning,
            },
          }}
          emotion={MASCOT_STYLE.INTELLO}
        />
      ) : null}
      <AlertDialog
        visible={dialogContent !== undefined}
        onDismiss={hideDialog}
        title={dialogContent ? dialogContent.title : ''}
        message={dialogContent ? dialogContent.message : ''}
        style={
          dialogContent
            ? { borderColor: dialogContent.color, ...styles.popup }
            : undefined
        }
      />
      <PlanexBottomBar
        onPress={sendMessage}
        seekAttention={currentGroup === undefined}
      />
    </View>
  );
}

export default PlanexScreen;
