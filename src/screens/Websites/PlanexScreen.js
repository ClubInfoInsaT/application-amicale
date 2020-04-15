// @flow

import * as React from 'react';
import ThemeManager from "../../managers/ThemeManager";
import WebViewScreen from "../../components/Screens/WebViewScreen";
import {Avatar, Banner, withTheme} from "react-native-paper";
import i18n from "i18n-js";
import {View} from "react-native";
import AsyncStorageManager from "../../managers/AsyncStorageManager";
import AlertDialog from "../../components/Dialog/AlertDialog";
import {withCollapsible} from "../../utils/withCollapsible";
import {dateToString, getTimeOnlyString} from "../../utils/Planning";
import DateManager from "../../managers/DateManager";
import AnimatedBottomBar from "../../components/Custom/AnimatedBottomBar";
import {CommonActions} from "@react-navigation/native";
import ErrorView from "../../components/Custom/ErrorView";

type Props = {
    navigation: Object,
    route: Object,
    theme: Object,
    collapsibleStack: Object,
}

type State = {
    bannerVisible: boolean,
    dialogVisible: boolean,
    dialogTitle: string,
    dialogMessage: string,
    currentGroup: Object,
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

// Watch for changes in the calendar and call the remove alpha function
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

const FULL_CALENDAR_SETTINGS = `
var calendar = $('#calendar').fullCalendar('getCalendar');
calendar.option({
  eventClick: function (data, event, view) {
      var message = {
      title: data.title,
      color: data.color,
      start: data.start._d,
      end: data.end._d,
    };
   window.ReactNativeWebView.postMessage(JSON.stringify(message));
  }
});`;

const LISTEN_TO_MESSAGES = `
document.addEventListener("message", function(event) {
    //alert(event.data);
    var data = JSON.parse(event.data);
    if (data.action === "setGroup")
        displayAde(data.data);
    else
        $('#calendar').fullCalendar(data.action, data.data);
}, false);`

const CUSTOM_CSS = "body>.container{padding-top:20px; padding-bottom: 50px}header,#entite,#groupe_visibility,#calendar .fc-left,#calendar .fc-right{display:none}.fc-toolbar .fc-center{width:100%}.fc-toolbar .fc-center>*{float:none;width:100%;margin:0}#entite{margin-bottom:5px!important}#entite,#groupe{width:calc(100% - 20px);margin:0 10px}#groupe_visibility{width:100%}#calendar .fc-agendaWeek-view .fc-content-skeleton .fc-title{font-size:.6rem}#calendar .fc-agendaWeek-view .fc-content-skeleton .fc-time{font-size:.5rem}#calendar .fc-month-view .fc-content-skeleton .fc-title{font-size:.6rem}#calendar .fc-month-view .fc-content-skeleton .fc-time{font-size:.7rem}.fc-axis{font-size:.8rem;width:15px!important}.fc-day-header{font-size:.8rem}.fc-unthemed td.fc-today{background:#be1522; opacity:0.4}";
const CUSTOM_CSS_DARK = "body{background-color:#121212}.fc-unthemed .fc-content,.fc-unthemed .fc-divider,.fc-unthemed .fc-list-heading td,.fc-unthemed .fc-list-view,.fc-unthemed .fc-popover,.fc-unthemed .fc-row,.fc-unthemed tbody,.fc-unthemed td,.fc-unthemed th,.fc-unthemed thead{border-color:#222}.fc-toolbar .fc-center>*,h2,table{color:#fff}.fc-event-container{color:#121212}.fc-event-container .fc-bg{opacity:0.2;background-color:#000}.fc-unthemed td.fc-today{background:#be1522; opacity:0.4}";

const INJECT_STYLE = `
$('head').append('<meta name="viewport" content="width=device-width, initial-scale=0.9">');
$('head').append('<style>` + CUSTOM_CSS + `</style>');
`;

/**
 * Class defining the app's Planex screen.
 * This screen uses a webview to render the page
 */
class PlanexScreen extends React.Component<Props, State> {

    webScreenRef: Object;
    barRef: Object;

    customInjectedJS: string;

    /**
     * Defines custom injected JavaScript to improve the page display on mobile
     */
    constructor() {
        super();
        this.webScreenRef = React.createRef();
        this.barRef = React.createRef();

        let currentGroup = AsyncStorageManager.getInstance().preferences.planexCurrentGroup.current;
        if (currentGroup === '')
            currentGroup = {name: "SELECT GROUP", id: -1};
        else
            currentGroup = JSON.parse(currentGroup);
        this.state = {
            bannerVisible:
                AsyncStorageManager.getInstance().preferences.planexShowBanner.current === '1' &&
                AsyncStorageManager.getInstance().preferences.defaultStartScreen.current !== 'Planex',
            dialogVisible: false,
            dialogTitle: "",
            dialogMessage: "",
            currentGroup: currentGroup,
        };
        this.generateInjectedJS(currentGroup.id);
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', this.onScreenFocus);
    }

    onScreenFocus = () => {
        this.handleNavigationParams();
    };

    handleNavigationParams = () => {
        if (this.props.route.params !== undefined) {
            if (this.props.route.params.group !== undefined && this.props.route.params.group !== null) {
                // reset params to prevent infinite loop
                this.selectNewGroup(this.props.route.params.group);
                this.props.navigation.dispatch(CommonActions.setParams({group: null}));
            }
        }
    };

    selectNewGroup(group: Object) {
        this.sendMessage('setGroup', group.id);
        this.setState({currentGroup: group});
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.planexCurrentGroup.key,
            JSON.stringify(group));
        this.generateInjectedJS(group.id);
    }

    generateInjectedJS(groupID: number) {
        this.customInjectedJS = "$(document).ready(function() {"
            + OBSERVE_MUTATIONS_INJECTED
            + FULL_CALENDAR_SETTINGS
            + "displayAde(" + groupID + ");" // Reset Ade
            + LISTEN_TO_MESSAGES
            + INJECT_STYLE;

        if (ThemeManager.getNightMode())
            this.customInjectedJS += "$('head').append('<style>" + CUSTOM_CSS_DARK + "</style>');";

        this.customInjectedJS +=
            'removeAlpha();' +
            '});true;'; // Prevents crash on ios
    }

    // componentWillUpdate(prevProps: Props) {
    //     if (prevProps.theme.dark !== this.props.theme.dark)
    //         this.generateInjectedCSS();
    // }

    /**
     * Callback used when closing the banner.
     * This hides the banner and saves to preferences to prevent it from reopening
     */
    onHideBanner = () => {
        this.setState({bannerVisible: false});
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.planexShowBanner.key,
            '0'
        );
    };

    /**
     * Callback used when the used click on the navigate to settings button.
     * This will hide the banner and open the SettingsScreen
     *
     */
    onGoToSettings = () => {
        this.onHideBanner();
        this.props.navigation.navigate('settings');
    };

    sendMessage = (action: string, data: any) => {
        this.webScreenRef.current.postMessage(JSON.stringify({action: action, data: data}));
    }

    onMessage = (event: Object) => {
        let data = JSON.parse(event.nativeEvent.data);
        let startDate = dateToString(new Date(data.start), true);
        let endDate = dateToString(new Date(data.end), true);
        let msg = DateManager.getInstance().getTranslatedDate(startDate) + "\n";
        msg += getTimeOnlyString(startDate) + ' - ' + getTimeOnlyString(endDate);
        this.showDialog(data.title, msg)
    };

    showDialog = (title: string, message: string) => {
        this.setState({
            dialogVisible: true,
            dialogTitle: title,
            dialogMessage: message,
        });
    };

    hideDialog = () => {
        this.setState({
            dialogVisible: false,
        });
    };

    onScroll = (event: Object) => {
        this.barRef.current.onScroll(event);
    };

    getWebView() {
        const showWebview = this.state.currentGroup.id !== -1;

        return (
            <View style={{height: '100%'}}>
                {!showWebview
                    ? <ErrorView
                        {...this.props}
                        icon={'account-clock'}
                        message={i18n.t("planexScreen.noGroupSelected")}
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
                />
            </View>
        );
    }

    render() {
        const {containerPaddingTop} = this.props.collapsibleStack;
        return (
            <View style={{height: '100%'}}>
                <Banner
                    style={{
                        marginTop: this.state.bannerVisible ? containerPaddingTop : 0,
                    }}
                    visible={this.state.bannerVisible}
                    actions={[
                        {
                            label: i18n.t('planexScreen.enableStartOK'),
                            onPress: this.onGoToSettings,
                        },
                        {
                            label: i18n.t('planexScreen.enableStartCancel'),
                            onPress: this.onHideBanner,
                        },

                    ]}
                    icon={() => <Avatar.Icon
                        icon={'information'}
                        size={40}
                    />}
                >
                    {i18n.t('planexScreen.enableStartScreen')}
                </Banner>
                <AlertDialog
                    visible={this.state.dialogVisible}
                    onDismiss={this.hideDialog}
                    title={this.state.dialogTitle}
                    message={this.state.dialogMessage}/>
                {this.props.theme.dark // Force component theme update
                    ? this.getWebView()
                    : <View style={{height: '100%'}}>{this.getWebView()}</View>}
                <AnimatedBottomBar
                    {...this.props}
                    ref={this.barRef}
                    onPress={this.sendMessage}
                    currentGroup={this.state.currentGroup.name}
                />
            </View>
        );
    }
}

export default withCollapsible(withTheme(PlanexScreen));