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

import React, { useCallback, useEffect, useState } from 'react';
import { Title, useTheme } from 'react-native-paper';
import i18n from 'i18n-js';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Autolink from 'react-native-autolink';
import AlertDialog from '../../components/Dialogs/AlertDialog';
import { dateToString, getTimeOnlyString } from '../../utils/Planning';
import DateManager from '../../managers/DateManager';
import type { PlanexGroupType } from './GroupSelectionScreen';
import { MASCOT_STYLE } from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import { getPrettierPlanexGroupName } from '../../utils/Utils';
import GENERAL_STYLES from '../../constants/Styles';
import PlanexWebview, {
  JS_LOADED_MESSAGE,
} from '../../components/Screens/PlanexWebview';
import PlanexBottomBar from '../../components/Animations/PlanexBottomBar';
import {
  getPreferenceString,
  GeneralPreferenceKeys,
  PlanexPreferenceKeys,
} from '../../utils/asyncStorage';
import { usePlanexPreferences } from '../../context/preferencesContext';
import BasicLoadingScreen from '../../components/Screens/BasicLoadingScreen';
import { MainRoutes } from '../../navigation/MainNavigator';
import RequestScreen from '../../components/Screens/RequestScreen';
import { readData } from '../../utils/WebData';

type PlanexDownResponseType = {
  isPlanexDown: boolean;
};

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

// TODO: Replace URL
const PLANEX_INFO_URL = 'https://etud.insa-toulouse.fr/~leban/planex.json';

function PlanexScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { preferences } = usePlanexPreferences();

  const [dialogContent, setDialogContent] = useState<
    | undefined
    | {
        title: string | React.ReactElement;
        message: string | React.ReactElement;
        color: string;
      }
  >();
  const [injectJS, setInjectJS] = useState('');
  const [loading, setLoading] = useState(true);

  const getCurrentGroup: () => PlanexGroupType | undefined = useCallback(() => {
    let currentGroupString = getPreferenceString(
      PlanexPreferenceKeys.planexCurrentGroup,
      preferences
    );
    let group: PlanexGroupType;
    if (currentGroupString) {
      group = JSON.parse(currentGroupString);
      navigation.setOptions({
        title: getPrettierPlanexGroupName(group.name),
      });
      return group;
    }
    return undefined;
  }, [navigation, preferences]);

  const currentGroup = getCurrentGroup();

  /**
   * Gets the Webview, with an error view on top if no group is selected or if Planex is down.
   *
   * @returns {*}
   */
  const getWebView = (
    planexDownResponse: PlanexDownResponseType | undefined
  ) => {
    return (
      <PlanexWebview
        isPlanexDown={
          planexDownResponse !== undefined
            ? planexDownResponse.isPlanexDown
            : true
        }
        currentGroup={currentGroup}
        injectJS={injectJS}
        onMessage={onMessage}
        onRefreshClicked={fetchPlanexInfo}
      />
    );
  };

  const fetchPlanexInfo = () => (
    <RequestScreen
      request={() => readData<PlanexDownResponseType>(PLANEX_INFO_URL)}
      render={getWebView}
    />
  );

  /**
   * Callback used when the user clicks on the navigate to settings button.
   * This will hide the banner and open the SettingsScreen
   */
  const onGoToSettings = () => navigation.navigate(MainRoutes.Settings);

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
    if (event.nativeEvent.data === JS_LOADED_MESSAGE) {
      setLoading(false);
    } else {
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
    }
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

  useEffect(() => {
    const group = getCurrentGroup();
    if (group) {
      sendMessage('setGroup', group.id.toString());
      navigation.setOptions({ title: getPrettierPlanexGroupName(group.name) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCurrentGroup, navigation]);

  const showMascot =
    getPreferenceString(
      GeneralPreferenceKeys.defaultStartScreen,
      preferences
    )?.toLowerCase() !== 'planex';

  return (
    <View style={GENERAL_STYLES.flex}>
      {/* Allow to draw webview bellow banner */}
      <View style={styles.container}>
        {theme.dark ? ( // Force component theme update by recreating it on theme change
          fetchPlanexInfo()
        ) : (
          <View style={GENERAL_STYLES.flex}>{fetchPlanexInfo()}</View>
        )}
      </View>
      {loading ? (
        <View style={styles.container}>
          <BasicLoadingScreen />
        </View>
      ) : null}
      {showMascot ? (
        <MascotPopup
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
