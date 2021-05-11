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

import React, { useCallback, useRef, useState } from 'react';
import { Title, useTheme } from 'react-native-paper';
import i18n from 'i18n-js';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import Autolink from 'react-native-autolink';
import ThemeManager from '../../managers/ThemeManager';
import WebViewScreen from '../../components/Screens/WebViewScreen';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import AlertDialog from '../../components/Dialogs/AlertDialog';
import { dateToString, getTimeOnlyString } from '../../utils/Planning';
import DateManager from '../../managers/DateManager';
import AnimatedBottomBar from '../../components/Animations/AnimatedBottomBar';
import ErrorView from '../../components/Screens/ErrorView';
import type { PlanexGroupType } from './GroupSelectionScreen';
import { MASCOT_STYLE } from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import { getPrettierPlanexGroupName } from '../../utils/Utils';
import GENERAL_STYLES from '../../constants/Styles';
import Urls from '../../constants/Urls';

// // JS + JQuery functions used to remove alpha from events. Copy paste in browser console for quick testing
// // Remove alpha from given Jquery node
// function removeAlpha(node) {
//     let bg = node.css("background-color");
//     if (bg.match("^rgba")) {
//         let a = bg.slice(5).split(',');
//         // Fix for tooltips with broken background
//         if (parseInt(a[0]) === parseInt(a[1]) && parseInt(a[1]) === parseInt(a[2]) && parseInt(a[2]) === 0) {
//             a[0] = a[1] = a[2] = '255';
//         }
//         let newBg ='rgb(' + a[0] + ',' + a[1] + ',' + a[2] + ')';
//         node.css("background-color", newBg);
//     }
// }
// // Observe for planning DOM changes
// let observer = new MutationObserver(function(mutations) {
//     for (let i = 0; i < mutations.length; i++) {
//         if (mutations[i]['addedNodes'].length > 0 &&
//             ($(mutations[i]['addedNodes'][0]).hasClass("fc-event") || $(mutations[i]['addedNodes'][0]).hasClass("tooltiptopicevent")))
//             removeAlpha($(mutations[i]['addedNodes'][0]))
//     }
// });
// // observer.observe(document.querySelector(".fc-body"), {attributes: false, childList: true, characterData: false, subtree:true});
// observer.observe(document.querySelector("body"), {attributes: false, childList: true, characterData: false, subtree:true});
// // Run remove alpha a first time on whole planning. Useful when code injected after planning fully loaded.
// $(".fc-event-container .fc-event").each(function(index) {
//     removeAlpha($(this));
// });

// Watch for changes in the calendar and call the remove alpha function to prevent invisible events
const OBSERVE_MUTATIONS_INJECTED =
  'function removeAlpha(node) {\n' +
  '    let bg = node.css("background-color");\n' +
  '    if (bg.match("^rgba")) {\n' +
  "        let a = bg.slice(5).split(',');\n" +
  '        // Fix for tooltips with broken background\n' +
  '        if (parseInt(a[0]) === parseInt(a[1]) && parseInt(a[1]) === parseInt(a[2]) && parseInt(a[2]) === 0) {\n' +
  "            a[0] = a[1] = a[2] = '255';\n" +
  '        }\n' +
  "        let newBg ='rgb(' + a[0] + ',' + a[1] + ',' + a[2] + ')';\n" +
  '        node.css("background-color", newBg);\n' +
  '    }\n' +
  '}\n' +
  '// Observe for planning DOM changes\n' +
  'let observer = new MutationObserver(function(mutations) {\n' +
  '    for (let i = 0; i < mutations.length; i++) {\n' +
  "        if (mutations[i]['addedNodes'].length > 0 &&\n" +
  '            ($(mutations[i][\'addedNodes\'][0]).hasClass("fc-event") || $(mutations[i][\'addedNodes\'][0]).hasClass("tooltiptopicevent")))\n' +
  "            removeAlpha($(mutations[i]['addedNodes'][0]))\n" +
  '    }\n' +
  '});\n' +
  '// observer.observe(document.querySelector(".fc-body"), {attributes: false, childList: true, characterData: false, subtree:true});\n' +
  'observer.observe(document.querySelector("body"), {attributes: false, childList: true, characterData: false, subtree:true});\n' +
  '// Run remove alpha a first time on whole planning. Useful when code injected after planning fully loaded.\n' +
  '$(".fc-event-container .fc-event").each(function(index) {\n' +
  '    removeAlpha($(this));\n' +
  '});';

// Overrides default settings to send a message to the webview when clicking on an event
const FULL_CALENDAR_SETTINGS = `
let calendar = $('#calendar').fullCalendar('getCalendar');
calendar.option({
  eventClick: function (data, event, view) {
      let message = {
      title: data.title,
      color: data.color,
      start: data.start._d,
      end: data.end._d,
    };
   window.ReactNativeWebView.postMessage(JSON.stringify(message));
  }
});`;

// Mobile friendly CSS
const CUSTOM_CSS =
  'body>.container{padding-top:20px; padding-bottom: 50px}header,#entite,#groupe_visibility,#calendar .fc-left,#calendar .fc-right{display:none}#calendar .fc-agendaWeek-view .fc-content-skeleton .fc-title{font-size:.6rem}#calendar .fc-agendaWeek-view .fc-content-skeleton .fc-time{font-size:.5rem}#calendar .fc-month-view .fc-content-skeleton .fc-title{font-size:.6rem}#calendar .fc-month-view .fc-content-skeleton .fc-time{font-size:.7rem}.fc-axis{font-size:.8rem;width:15px!important}.fc-day-header{font-size:.8rem}.fc-unthemed td.fc-today{background:#be1522; opacity:0.4}';

// Dark mode CSS, to be used with the mobile friendly css
const CUSTOM_CSS_DARK =
  'body{background-color:#121212}.fc-unthemed .fc-content,.fc-unthemed .fc-divider,.fc-unthemed .fc-list-heading td,.fc-unthemed .fc-list-view,.fc-unthemed .fc-popover,.fc-unthemed .fc-row,.fc-unthemed tbody,.fc-unthemed td,.fc-unthemed th,.fc-unthemed thead{border-color:#222}.fc-toolbar .fc-center>*,h2,table{color:#fff}.fc-event-container{color:#121212}.fc-event-container .fc-bg{opacity:0.2;background-color:#000}.fc-unthemed td.fc-today{background:#be1522; opacity:0.4}';

// Inject the custom css into the webpage
const INJECT_STYLE = `$('head').append('<style>${CUSTOM_CSS}</style>');`;

// Inject the dark mode into the webpage, to call after the custom css inject above
const INJECT_STYLE_DARK = `$('head').append('<style>${CUSTOM_CSS_DARK}</style>');`;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
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
  const barRef = useRef<typeof AnimatedBottomBar>();

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
  const getWebView = () => {
    return (
      <View style={GENERAL_STYLES.flex}>
        {!currentGroup ? (
          <ErrorView
            icon={'account-clock'}
            message={i18n.t('screens.planex.noGroupSelected')}
          />
        ) : null}
        <WebViewScreen
          url={Urls.planex.planning}
          initialJS={generateInjectedJS(currentGroup)}
          injectJS={injectJS}
          onMessage={onMessage}
          onScroll={onScroll}
          showAdvancedControls={false}
        />
      </View>
    );
  };

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
   * Binds the onScroll event to the control bar for automatic hiding based on scroll direction and speed
   *
   * @param event
   */
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (barRef.current) {
      barRef.current.onScroll(event);
    }
  };

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

  /**
   * Generates custom JavaScript to be injected into the webpage
   *
   * @param groupID The current group selected
   */
  const generateInjectedJS = (group: PlanexGroupType | undefined) => {
    let customInjectedJS = `$(document).ready(function() {
      ${OBSERVE_MUTATIONS_INJECTED}
      ${INJECT_STYLE}
      ${FULL_CALENDAR_SETTINGS}`;
    if (group) {
      customInjectedJS += `displayAde(${group.id});`;
    }
    if (DateManager.isWeekend(new Date())) {
      customInjectedJS += `calendar.next();`;
    }
    if (ThemeManager.getNightMode()) {
      customInjectedJS += INJECT_STYLE_DARK;
    }
    customInjectedJS += 'removeAlpha();});true;'; // Prevents crash on ios
    return customInjectedJS;
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
            ? { borderColor: dialogContent.color, borderWidth: 2 }
            : undefined
        }
      />
      <AnimatedBottomBar
        navigation={navigation}
        ref={barRef}
        onPress={sendMessage}
        seekAttention={currentGroup === undefined}
      />
    </View>
  );
}

export default PlanexScreen;
