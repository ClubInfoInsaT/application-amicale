import React from 'react';
import { View } from 'react-native';
import GENERAL_STYLES from '../../constants/Styles';
import Urls from '../../constants/Urls';
import DateManager from '../../managers/DateManager';
import ThemeManager from '../../managers/ThemeManager';
import { PlanexGroupType } from '../../screens/Planex/GroupSelectionScreen';
import ErrorView from './ErrorView';
import WebViewScreen from './WebViewScreen';
import i18n from 'i18n-js';

type Props = {
  currentGroup?: PlanexGroupType;
  injectJS: string;
  onMessage: (event: { nativeEvent: { data: string } }) => void;
};

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

function PlanexWebview(props: Props) {
  return (
    <View style={GENERAL_STYLES.flex}>
      {!props.currentGroup ? (
        <ErrorView
          icon={'account-clock'}
          message={i18n.t('screens.planex.noGroupSelected')}
        />
      ) : null}
      <WebViewScreen
        url={Urls.planex.planning}
        initialJS={generateInjectedJS(props.currentGroup)}
        injectJS={props.injectJS}
        onMessage={props.onMessage}
        showAdvancedControls={false}
      />
    </View>
  );
}

export default PlanexWebview;
