// @flow

import * as React from 'react';
import {ScrollView, View} from 'react-native';
import {getDateOnlyString, getFormattedEventTime} from '../../utils/Planning';
import {Card, withTheme} from 'react-native-paper';
import DateManager from "../../managers/DateManager";
import ImageModal from 'react-native-image-modal';
import BasicLoadingScreen from "../../components/Screens/BasicLoadingScreen";
import {apiRequest, ERROR_TYPE} from "../../utils/WebData";
import ErrorView from "../../components/Screens/ErrorView";
import CustomHTML from "../../components/Overrides/CustomHTML";
import CustomTabBar from "../../components/Tabbar/CustomTabBar";
import i18n from 'i18n-js';
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../managers/ThemeManager";

type Props = {
    navigation: StackNavigationProp,
    route: { params: { data: Object, id: number, eventId: number } },
    theme: CustomTheme
};

type State = {
    loading: boolean
};

const CLUB_INFO_PATH = "event/info";

/**
 * Class defining a planning event information page.
 */
class PlanningDisplayScreen extends React.Component<Props, State> {

    displayData: Object;
    shouldFetchData: boolean;
    eventId: number;
    errorCode: number;

    /**
     * Generates data depending on whether the screen was opened from the planning or from a link
     *
     * @param props
     */
    constructor(props) {
        super(props);

        if (this.props.route.params.data != null) {
            this.displayData = this.props.route.params.data;
            this.eventId = this.displayData.id;
            this.shouldFetchData = false;
            this.errorCode = 0;
            this.state = {
                loading: false,
            };
        } else {
            this.displayData = null;
            this.eventId = this.props.route.params.eventId;
            this.shouldFetchData = true;
            this.errorCode = 0;
            this.state = {
                loading: true,
            };
            this.fetchData();

        }
    }

    /**
     * Fetches data for the current event id from the API
     */
    fetchData = () => {
        this.setState({loading: true});
        apiRequest(CLUB_INFO_PATH, 'POST', {id: this.eventId})
            .then(this.onFetchSuccess)
            .catch(this.onFetchError);
    };

    /**
     * Hides loading and saves fetched data
     *
     * @param data Received data
     */
    onFetchSuccess = (data: Object) => {
        this.displayData = data;
        this.setState({loading: false});
    };

    /**
     * Hides loading and saves the error code
     *
     * @param error
     */
    onFetchError = (error: number) => {
        this.errorCode = error;
        this.setState({loading: false});
    };

    /**
     * Gets content to display
     *
     * @returns {*}
     */
    getContent() {
        let subtitle = getFormattedEventTime(
            this.displayData["date_begin"], this.displayData["date_end"]);
        let dateString = getDateOnlyString(this.displayData["date_begin"]);
        if (dateString !== null)
            subtitle += ' | ' + DateManager.getInstance().getTranslatedDate(dateString);
        return (
            <ScrollView style={{paddingLeft: 5, paddingRight: 5}}>
                <Card.Title
                    title={this.displayData.title}
                    subtitle={subtitle}
                />
                {this.displayData.logo !== null ?
                    <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                        <ImageModal
                            resizeMode="contain"
                            imageBackgroundColor={this.props.theme.colors.background}
                            style={{
                                width: 300,
                                height: 300,
                            }}
                            source={{
                                uri: this.displayData.logo,
                            }}
                        /></View>
                    : <View/>}

                {this.displayData.description !== null ?
                    <Card.Content style={{paddingBottom: CustomTabBar.TAB_BAR_HEIGHT + 20}}>
                        <CustomHTML html={this.displayData.description}/>
                    </Card.Content>
                    : <View/>}
            </ScrollView>
        );
    }

    /**
     * Shows an error view and use a custom message if the event does not exist
     *
     * @returns {*}
     */
    getErrorView() {
        if (this.errorCode === ERROR_TYPE.BAD_INPUT)
            return <ErrorView {...this.props} showRetryButton={false} message={i18n.t("planningScreen.invalidEvent")}
                              icon={"calendar-remove"}/>;
        else
            return <ErrorView {...this.props} errorCode={this.errorCode} onRefresh={this.fetchData}/>;
    }

    render() {
        if (this.state.loading)
            return <BasicLoadingScreen/>;
        else if (this.errorCode === 0)
            return this.getContent();
        else
            return this.getErrorView();
    }
}

export default withTheme(PlanningDisplayScreen);
