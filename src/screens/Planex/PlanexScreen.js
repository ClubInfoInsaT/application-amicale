// @flow

import * as React from 'react';
import type {CustomTheme} from "../../managers/ThemeManager";
import ThemeManager from "../../managers/ThemeManager";
import WebViewScreen from "../../components/Screens/WebViewScreen";
import {withTheme} from "react-native-paper";
import i18n from "i18n-js";
import {View} from "react-native";
import AsyncStorageManager from "../../managers/AsyncStorageManager";
import AlertDialog from "../../components/Dialogs/AlertDialog";
import {dateToString, getTimeOnlyString} from "../../utils/Planning";
import DateManager from "../../managers/DateManager";
import AnimatedBottomBar from "../../components/Animations/AnimatedBottomBar";
import {CommonActions} from "@react-navigation/native";
import ErrorView from "../../components/Screens/ErrorView";
import {StackNavigationProp} from "@react-navigation/stack";
import type {group} from "./GroupSelectionScreen";
import {MASCOT_STYLE} from "../../components/Mascot/Mascot";
import MascotPopup from "../../components/Mascot/MascotPopup";

type Props = {
    navigation: StackNavigationProp,
    route: { params: { group: group } },
    theme: CustomTheme,
}

type State = {
    mascotDialogVisible: boolean,
    dialogVisible: boolean,
    dialogTitle: string,
    dialogMessage: string,
    currentGroup: group,
}


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
    '        let a = bg.slice(5).split(\',\');\n' +
    '        // Fix for tooltips with broken background\n' +
    '        if (parseInt(a[0]) === parseInt(a[1]) && parseInt(a[1]) === parseInt(a[2]) && parseInt(a[2]) === 0) {\n' +
    '            a[0] = a[1] = a[2] = \'255\';\n' +
    '        }\n' +
    '        let newBg =\'rgb(\' + a[0] + \',\' + a[1] + \',\' + a[2] + \')\';\n' +
    '        node.css("background-color", newBg);\n' +
    '    }\n' +
    '}\n' +
    '// Observe for planning DOM changes\n' +
    'let observer = new MutationObserver(function(mutations) {\n' +
    '    for (let i = 0; i < mutations.length; i++) {\n' +
    '        if (mutations[i][\'addedNodes\'].length > 0 &&\n' +
    '            ($(mutations[i][\'addedNodes\'][0]).hasClass("fc-event") || $(mutations[i][\'addedNodes\'][0]).hasClass("tooltiptopicevent")))\n' +
    '            removeAlpha($(mutations[i][\'addedNodes\'][0]))\n' +
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

const CUSTOM_CSS = "body>.container{padding-top:20px; padding-bottom: 50px}header,#entite,#groupe_visibility,#calendar .fc-left,#calendar .fc-right{display:none}#calendar .fc-agendaWeek-view .fc-content-skeleton .fc-title{font-size:.6rem}#calendar .fc-agendaWeek-view .fc-content-skeleton .fc-time{font-size:.5rem}#calendar .fc-month-view .fc-content-skeleton .fc-title{font-size:.6rem}#calendar .fc-month-view .fc-content-skeleton .fc-time{font-size:.7rem}.fc-axis{font-size:.8rem;width:15px!important}.fc-day-header{font-size:.8rem}.fc-unthemed td.fc-today{background:#be1522; opacity:0.4}";
const CUSTOM_CSS_DARK = "body{background-color:#121212}.fc-unthemed .fc-content,.fc-unthemed .fc-divider,.fc-unthemed .fc-list-heading td,.fc-unthemed .fc-list-view,.fc-unthemed .fc-popover,.fc-unthemed .fc-row,.fc-unthemed tbody,.fc-unthemed td,.fc-unthemed th,.fc-unthemed thead{border-color:#222}.fc-toolbar .fc-center>*,h2,table{color:#fff}.fc-event-container{color:#121212}.fc-event-container .fc-bg{opacity:0.2;background-color:#000}.fc-unthemed td.fc-today{background:#be1522; opacity:0.4}";

const INJECT_STYLE = `
$('head').append('<style>` + CUSTOM_CSS + `</style>');
`;

/**
 * Class defining the app's Planex screen.
 * This screen uses a webview to render the page
 */
class PlanexScreen extends React.Component<Props, State> {

    webScreenRef: { current: null | WebViewScreen };
    barRef: { current: null | AnimatedBottomBar };

    customInjectedJS: string;

    /**
     * Defines custom injected JavaScript to improve the page display on mobile
     */
    constructor(props) {
        super(props);
        this.webScreenRef = React.createRef();
        this.barRef = React.createRef();

        let currentGroup = AsyncStorageManager.getInstance().preferences.planexCurrentGroup.current;
        if (currentGroup === '')
            currentGroup = {name: "SELECT GROUP", id: -1, isFav: false};
        else {
            currentGroup = JSON.parse(currentGroup);
            props.navigation.setOptions({title: currentGroup.name})
        }
        this.state = {
            mascotDialogVisible:
                AsyncStorageManager.getInstance().preferences.planexShowBanner.current === '1' &&
                AsyncStorageManager.getInstance().preferences.defaultStartScreen.current !== 'Planex',
            dialogVisible: false,
            dialogTitle: "",
            dialogMessage: "",
            currentGroup: currentGroup,
        };
        this.generateInjectedJS(currentGroup.id);
    }

    /**
     * Register for events and show the banner after 2 seconds
     */
    componentDidMount() {
        this.props.navigation.addListener('focus', this.onScreenFocus);
    }

    /**
     * Callback used when closing the banner.
     * This hides the banner and saves to preferences to prevent it from reopening
     */
    onMascotDialogCancel = () => {
        this.setState({mascotDialogVisible: false});
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.planexShowBanner.key,
            '0'
        );
    };


    /**
     * Callback used when the user clicks on the navigate to settings button.
     * This will hide the banner and open the SettingsScreen
     */
    onGoToSettings = () => {
        this.onMascotDialogCancel();
        this.props.navigation.navigate('settings');
    };

    onScreenFocus = () => {
        this.handleNavigationParams();
    };

    /**
     * If navigations parameters contain a group, set it as selected
     */
    handleNavigationParams = () => {
        if (this.props.route.params != null) {
            if (this.props.route.params.group !== undefined && this.props.route.params.group !== null) {
                // reset params to prevent infinite loop
                this.selectNewGroup(this.props.route.params.group);
                this.props.navigation.dispatch(CommonActions.setParams({group: null}));
            }
        }
    };

    /**
     * Sends the webpage a message with the new group to select and save it to preferences
     *
     * @param group The group object selected
     */
    selectNewGroup(group: group) {
        this.sendMessage('setGroup', group.id);
        this.setState({currentGroup: group});
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.planexCurrentGroup.key,
            JSON.stringify(group)
        );
        this.props.navigation.setOptions({title: group.name});
        this.generateInjectedJS(group.id);
    }

    /**
     * Generates custom JavaScript to be injected into the webpage
     *
     * @param groupID The current group selected
     */
    generateInjectedJS(groupID: number) {
        this.customInjectedJS = "$(document).ready(function() {"
            + OBSERVE_MUTATIONS_INJECTED
            + FULL_CALENDAR_SETTINGS
            + "displayAde(" + groupID + ");" // Reset Ade
            + (DateManager.isWeekend(new Date()) ? "calendar.next()" : "")
            + INJECT_STYLE;

        if (ThemeManager.getNightMode())
            this.customInjectedJS += "$('head').append('<style>" + CUSTOM_CSS_DARK + "</style>');";

        this.customInjectedJS += 'removeAlpha();});true;'; // Prevents crash on ios
    }

    /**
     * Only update the screen if the dark theme changed
     *
     * @param nextProps
     * @returns {boolean}
     */
    shouldComponentUpdate(nextProps: Props): boolean {
        if (nextProps.theme.dark !== this.props.theme.dark)
            this.generateInjectedJS(this.state.currentGroup.id);
        return true;
    }


    /**
     * Sends a FullCalendar action to the web page inside the webview.
     *
     * @param action The action to perform, as described in the FullCalendar doc https://fullcalendar.io/docs/v3.
     * Or "setGroup" with the group id as data to set the selected group
     * @param data Data to pass to the action
     */
    sendMessage = (action: string, data: any) => {
        let command;
        if (action === "setGroup")
            command = "displayAde(" + data + ")";
        else
            command = "$('#calendar').fullCalendar('" + action + "', '" + data + "')";
        if (this.webScreenRef.current != null)
            this.webScreenRef.current.injectJavaScript(command + ';true;'); // Injected javascript must end with true
    };

    /**
     * Shows a dialog when the user clicks on an event.
     *
     * @param event
     */
    onMessage = (event: { nativeEvent: { data: string } }) => {
        const data: { start: string, end: string, title: string, color: string } = JSON.parse(event.nativeEvent.data);
        const startDate = dateToString(new Date(data.start), true);
        const endDate = dateToString(new Date(data.end), true);
        const startString = getTimeOnlyString(startDate);
        const endString = getTimeOnlyString(endDate);

        let msg = DateManager.getInstance().getTranslatedDate(startDate) + "\n";
        if (startString != null && endString != null)
            msg += startString + ' - ' + endString;
        this.showDialog(data.title, msg)
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
            dialogTitle: title,
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
    onScroll = (event: SyntheticEvent<EventTarget>) => {
        if (this.barRef.current != null)
            this.barRef.current.onScroll(event);
    };

    /**
     * Gets the Webview, with an error view on top if no group is selected.
     *
     * @returns {*}
     */
    getWebView() {
        const showWebview = this.state.currentGroup.id !== -1;

        return (
            <View style={{height: '100%'}}>
                {!showWebview
                    ? <ErrorView
                        {...this.props}
                        icon={'account-clock'}
                        message={i18n.t("screens.planex.noGroupSelected")}
                        showRetryButton={false}
                    />
                    : null}
                <WebViewScreen
                    ref={this.webScreenRef}
                    navigation={this.props.navigation}
                    url={PLANEX_URL}
                    customJS={this.customInjectedJS}
                    onMessage={this.onMessage}
                    onScroll={this.onScroll}
                    showAdvancedControls={false}
                />
            </View>
        );
    }

    render() {
        return (
            <View
                style={{flex: 1}}
            >
                {/*Allow to draw webview bellow banner*/}
                <View style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                }}>
                    {this.props.theme.dark // Force component theme update by recreating it on theme change
                        ? this.getWebView()
                        : <View style={{height: '100%'}}>{this.getWebView()}</View>}
                </View>
                <MascotPopup
                    visible={this.state.mascotDialogVisible}
                    title={i18n.t("screens.planex.mascotDialog.title")}
                    message={i18n.t("screens.planex.mascotDialog.message")}
                    icon={"emoticon-kiss"}
                    buttons={{
                        action: {
                            message: i18n.t("screens.planex.mascotDialog.ok"),
                            icon: "settings",
                            onPress: this.onGoToSettings,
                        },
                        cancel: {
                            message: i18n.t("screens.planex.mascotDialog.cancel"),
                            icon: "close",
                            color: this.props.theme.colors.warning,
                            onPress: this.onMascotDialogCancel,
                        }
                    }}
                    emotion={MASCOT_STYLE.INTELLO}
                />
                <AlertDialog
                    visible={this.state.dialogVisible}
                    onDismiss={this.hideDialog}
                    title={this.state.dialogTitle}
                    message={this.state.dialogMessage}/>
                <AnimatedBottomBar
                    {...this.props}
                    ref={this.barRef}
                    onPress={this.sendMessage}
                    seekAttention={this.state.currentGroup.id === -1}
                />
            </View>
        );
    }
}

export default withTheme(PlanexScreen);
