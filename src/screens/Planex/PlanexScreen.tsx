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

// @flow

import * as React from 'react';
import {Title, withTheme} from 'react-native-paper';
import i18n from 'i18n-js';
import {NativeScrollEvent, NativeSyntheticEvent, View} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Autolink from 'react-native-autolink';
import ThemeManager from '../../managers/ThemeManager';
import WebViewScreen from '../../components/Screens/WebViewScreen';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import AlertDialog from '../../components/Dialogs/AlertDialog';
import {dateToString, getTimeOnlyString} from '../../utils/Planning';
import DateManager from '../../managers/DateManager';
import AnimatedBottomBar from '../../components/Animations/AnimatedBottomBar';
import ErrorView from '../../components/Screens/ErrorView';
import type {PlanexGroupType} from './GroupSelectionScreen';
import {MASCOT_STYLE} from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import {getPrettierPlanexGroupName} from '../../utils/Utils';

type PropsType = {
  navigation: StackNavigationProp<any>;
  route: {params: {group: PlanexGroupType}};
  theme: ReactNativePaper.Theme;
};

type StateType = {
  dialogVisible: boolean;
  dialogTitle: string | React.ReactNode;
  dialogMessage: string;
  currentGroup: PlanexGroupType;
};

const PLANEX_URL = 'http://planex.insa-toulouse.fr/';

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

const CUSTOM_CSS =
  'body>.container{padding-top:20px; padding-bottom: 50px}header,#entite,#groupe_visibility,#calendar .fc-left,#calendar .fc-right{display:none}#calendar .fc-agendaWeek-view .fc-content-skeleton .fc-title{font-size:.6rem}#calendar .fc-agendaWeek-view .fc-content-skeleton .fc-time{font-size:.5rem}#calendar .fc-month-view .fc-content-skeleton .fc-title{font-size:.6rem}#calendar .fc-month-view .fc-content-skeleton .fc-time{font-size:.7rem}.fc-axis{font-size:.8rem;width:15px!important}.fc-day-header{font-size:.8rem}.fc-unthemed td.fc-today{background:#be1522; opacity:0.4}';
const CUSTOM_CSS_DARK =
  'body{background-color:#121212}.fc-unthemed .fc-content,.fc-unthemed .fc-divider,.fc-unthemed .fc-list-heading td,.fc-unthemed .fc-list-view,.fc-unthemed .fc-popover,.fc-unthemed .fc-row,.fc-unthemed tbody,.fc-unthemed td,.fc-unthemed th,.fc-unthemed thead{border-color:#222}.fc-toolbar .fc-center>*,h2,table{color:#fff}.fc-event-container{color:#121212}.fc-event-container .fc-bg{opacity:0.2;background-color:#000}.fc-unthemed td.fc-today{background:#be1522; opacity:0.4}';

const INJECT_STYLE = `
$('head').append('<style>${CUSTOM_CSS}</style>');
`;

/**
 * Class defining the app's Planex screen.
 * This screen uses a webview to render the page
 */
class PlanexScreen extends React.Component<PropsType, StateType> {
  webScreenRef: {current: null | WebViewScreen};

  barRef: {current: null | AnimatedBottomBar};

  customInjectedJS: string;

  /**
   * Defines custom injected JavaScript to improve the page display on mobile
   */
  constructor(props: PropsType) {
    super(props);
    this.webScreenRef = React.createRef();
    this.barRef = React.createRef();
    this.customInjectedJS = '';
    let currentGroupString = AsyncStorageManager.getString(
      AsyncStorageManager.PREFERENCES.planexCurrentGroup.key,
    );
    let currentGroup: PlanexGroupType;
    if (currentGroupString === '') {
      currentGroup = {name: 'SELECT GROUP', id: -1};
    } else {
      currentGroup = JSON.parse(currentGroupString);
      props.navigation.setOptions({
        title: getPrettierPlanexGroupName(currentGroup.name),
      });
    }
    this.state = {
      dialogVisible: false,
      dialogTitle: '',
      dialogMessage: '',
      currentGroup,
    };
    this.generateInjectedJS(currentGroup.id);
  }

  /**
   * Register for events and show the banner after 2 seconds
   */
  componentDidMount() {
    const {navigation} = this.props;
    navigation.addListener('focus', this.onScreenFocus);
  }

  /**
   * Only update the screen if the dark theme changed
   *
   * @param nextProps
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {props, state} = this;
    if (nextProps.theme.dark !== props.theme.dark) {
      this.generateInjectedJS(state.currentGroup.id);
    }
    return true;
  }

  /**
   * Gets the Webview, with an error view on top if no group is selected.
   *
   * @returns {*}
   */
  getWebView() {
    const {props, state} = this;
    const showWebview = state.currentGroup.id !== -1;

    return (
      <View style={{height: '100%'}}>
        {!showWebview ? (
          <ErrorView
            navigation={props.navigation}
            icon="account-clock"
            message={i18n.t('screens.planex.noGroupSelected')}
            showRetryButton={false}
          />
        ) : null}
        <WebViewScreen
          ref={this.webScreenRef}
          navigation={props.navigation}
          url={PLANEX_URL}
          customJS={this.customInjectedJS}
          onMessage={this.onMessage}
          onScroll={this.onScroll}
          showAdvancedControls={false}
        />
      </View>
    );
  }

  /**
   * Callback used when the user clicks on the navigate to settings button.
   * This will hide the banner and open the SettingsScreen
   */
  onGoToSettings = () => {
    const {navigation} = this.props;
    navigation.navigate('settings');
  };

  onScreenFocus = () => {
    this.handleNavigationParams();
  };

  /**
   * Sends a FullCalendar action to the web page inside the webview.
   *
   * @param action The action to perform, as described in the FullCalendar doc https://fullcalendar.io/docs/v3.
   * Or "setGroup" with the group id as data to set the selected group
   * @param data Data to pass to the action
   */
  sendMessage = (action: string, data?: string) => {
    let command;
    if (action === 'setGroup') {
      command = `displayAde(${data})`;
    } else {
      command = `$('#calendar').fullCalendar('${action}', '${data}')`;
    }
    if (this.webScreenRef.current != null) {
      this.webScreenRef.current.injectJavaScript(`${command};true;`);
    } // Injected javascript must end with true
  };

  /**
   * Shows a dialog when the user clicks on an event.
   *
   * @param event
   */
  onMessage = (event: {nativeEvent: {data: string}}) => {
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
    this.showDialog(data.title, msg);
  };

  /**
   * Shows a simple dialog to the user.
   *
   * @param title The dialog's title
   * @param message The message to show
   */
  showDialog = (title: string, message: string) => {
    this.setState({
      dialogVisible: true,
      // @ts-ignore
      dialogTitle: <Autolink text={title} component={Title} />,
      dialogMessage: message,
    });
  };

  /**
   * Hides the dialog
   */
  hideDialog = () => {
    this.setState({
      dialogVisible: false,
    });
  };

  /**
   * Binds the onScroll event to the control bar for automatic hiding based on scroll direction and speed
   *
   * @param event
   */
  onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (this.barRef.current != null) {
      this.barRef.current.onScroll(event);
    }
  };

  /**
   * If navigations parameters contain a group, set it as selected
   */
  handleNavigationParams = () => {
    const {props} = this;
    if (props.route.params != null) {
      if (
        props.route.params.group !== undefined &&
        props.route.params.group !== null
      ) {
        // reset params to prevent infinite loop
        this.selectNewGroup(props.route.params.group);
        props.navigation.dispatch(CommonActions.setParams({group: null}));
      }
    }
  };

  /**
   * Sends the webpage a message with the new group to select and save it to preferences
   *
   * @param group The group object selected
   */
  selectNewGroup(group: PlanexGroupType) {
    const {navigation} = this.props;
    this.sendMessage('setGroup', group.id.toString());
    this.setState({currentGroup: group});
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.planexCurrentGroup.key,
      group,
    );
    navigation.setOptions({title: getPrettierPlanexGroupName(group.name)});
    this.generateInjectedJS(group.id);
  }

  /**
   * Generates custom JavaScript to be injected into the webpage
   *
   * @param groupID The current group selected
   */
  generateInjectedJS(groupID: number) {
    this.customInjectedJS = `$(document).ready(function() {${OBSERVE_MUTATIONS_INJECTED}${FULL_CALENDAR_SETTINGS}displayAde(${groupID});${
      // Reset Ade
      DateManager.isWeekend(new Date()) ? 'calendar.next()' : ''
    }${INJECT_STYLE}`;

    if (ThemeManager.getNightMode()) {
      this.customInjectedJS += `$('head').append('<style>${CUSTOM_CSS_DARK}</style>');`;
    }

    this.customInjectedJS += 'removeAlpha();});true;'; // Prevents crash on ios
  }

  render() {
    const {props, state} = this;
    return (
      <View style={{flex: 1}}>
        {/* Allow to draw webview bellow banner */}
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
          }}>
          {props.theme.dark ? ( // Force component theme update by recreating it on theme change
            this.getWebView()
          ) : (
            <View style={{height: '100%'}}>{this.getWebView()}</View>
          )}
        </View>
        {AsyncStorageManager.getString(
          AsyncStorageManager.PREFERENCES.defaultStartScreen.key,
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
                onPress: this.onGoToSettings,
              },
              cancel: {
                message: i18n.t('screens.planex.mascotDialog.cancel'),
                icon: 'close',
                color: props.theme.colors.warning,
              },
            }}
            emotion={MASCOT_STYLE.INTELLO}
          />
        ) : null}
        <AlertDialog
          visible={state.dialogVisible}
          onDismiss={this.hideDialog}
          title={state.dialogTitle}
          message={state.dialogMessage}
        />
        <AnimatedBottomBar
          navigation={props.navigation}
          ref={this.barRef}
          onPress={this.sendMessage}
          seekAttention={state.currentGroup.id === -1}
        />
      </View>
    );
  }
}

export default withTheme(PlanexScreen);
