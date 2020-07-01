// @flow


import * as React from 'react';
import {StackNavigationProp} from "@react-navigation/stack";
import WebViewScreen from "../../components/Screens/WebViewScreen";
import AvailableWebsites from "../../constants/AvailableWebsites";
import BasicLoadingScreen from "../../components/Screens/BasicLoadingScreen";

type Props = {
    navigation: StackNavigationProp,
    route: { params: { host: string, path: string | null, title: string } },
}

class WebsiteScreen extends React.Component<Props> {

    fullUrl: string;
    injectedJS: { [key: string]: string };
    customPaddingFunctions: {[key: string]: (padding: string) => string}

    host: string;

    constructor(props: Props) {
        super(props);
        this.props.navigation.addListener('focus', this.onScreenFocus);
        this.injectedJS = {};
        this.customPaddingFunctions = {};
        this.injectedJS[AvailableWebsites.websites.AVAILABLE_ROOMS] =
            'document.querySelector(\'head\').innerHTML += \'<meta name="viewport" content="width=device-width, initial-scale=1.0">\';' +
            'document.querySelector(\'head\').innerHTML += \'<style>body,body>.container2{padding-top:0;width:100%}b,body>.container2>h1,body>.container2>h3,br,header{display:none}.table-bordered td,.table-bordered th{border:none;border-right:1px solid #dee2e6;border-bottom:1px solid #dee2e6}.table{padding:0;margin:0;width:200%;max-width:200%;display:block}tbody{display:block;width:100%}thead{display:block;width:100%}.table tbody tr,tbody tr[bgcolor],thead tr{width:100%;display:inline-flex}.table tbody td,.table thead td[colspan]{padding:0;flex:1;height:50px;margin:0}.table tbody td[bgcolor=white],.table thead td,.table>tbody>tr>td:nth-child(1){flex:0 0 150px;height:50px}</style>\'; true;';

        this.injectedJS[AvailableWebsites.websites.BIB] =
            'document.querySelector(\'head\').innerHTML += \'<meta name="viewport" content="width=device-width, initial-scale=1.0">\';' +
            'document.querySelector(\'head\').innerHTML += \'<style>.hero-unit,.navbar,footer{display:none}.hero-unit-form,.hero-unit2,.hero-unit3{background-color:#fff;box-shadow:none;padding:0;margin:0}.hero-unit-form h4{font-size:2rem;line-height:2rem}.btn{font-size:1.5rem;line-height:1.5rem;padding:20px}.btn-danger{background-image:none;background-color:#be1522}.table{font-size:.8rem}.table td{padding:0;height:18.2333px;border:none;border-bottom:1px solid #c1c1c1}.table td[style="max-width:55px;"]{max-width:110px!important}.table-bordered{min-width:50px}th{height:50px}.table-bordered{border-collapse:collapse}</style>\';' +
            'if ($(".hero-unit-form").length > 0 && $("#customBackButton").length === 0)' +
            '$(".hero-unit-form").append("' +
            '<div style=\'width: 100%; display: flex\'>' +
            '<a style=\'margin: auto\' href=\'' + AvailableWebsites.websites.BIB + '\'>' +
            '<button id=\'customBackButton\' class=\'btn btn-primary\'>Retour</button>' +
            '</a>' +
            '</div>");true;';

        this.customPaddingFunctions[AvailableWebsites.websites.BLUEMIND] = (padding: string) => {
            return (
                "$('head').append('<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">');" +
                "$('.minwidth').css('top', " + padding + ");" +
                "$('#mailview-bottom').css('min-height', 500);"
            );
        };
        this.customPaddingFunctions[AvailableWebsites.websites.WIKETUD] = (padding: string) => {
            return (
                "$('#p-logo-text').css('top', 10 + " + padding + ");" +
                "$('#site-navigation h2').css('top', 10 + " + padding + ");" +
                "$('#site-tools h2').css('top', 10 + " + padding + ");" +
                "$('#user-tools h2').css('top', 10 + " + padding + ");"
            );
        }
    }

    onScreenFocus = () => {
        this.handleNavigationParams();
    };

    /**
     *
     */
    handleNavigationParams() {
        if (this.props.route.params != null) {
            this.host = this.props.route.params.host;
            let path = this.props.route.params.path;
            const title = this.props.route.params.title;
            if (this.host != null && path != null) {
                path = path.replace(this.host, "");
                this.fullUrl = this.host + path;
            }else
                this.fullUrl = this.host;

            if (title != null)
                this.props.navigation.setOptions({title: title});
        }
    }

    render() {
        let injectedJavascript = "";
        let customPadding = null;
        if (this.host != null && this.injectedJS[this.host] != null)
            injectedJavascript = this.injectedJS[this.host];
        if (this.host != null && this.customPaddingFunctions[this.host] != null)
            customPadding = this.customPaddingFunctions[this.host];

        if (this.fullUrl != null) {
            return (
                <WebViewScreen
                    {...this.props}
                    url={this.fullUrl}
                    customJS={injectedJavascript}
                    customPaddingFunction={customPadding}
                />
            );
        } else {
            return (
                <BasicLoadingScreen/>
            );
        }

    }
}

export default WebsiteScreen;
