// @flow

import * as React from 'react';
import {ScrollView, View} from 'react-native';
import {getDateOnlyString, getFormattedEventTime} from '../../utils/Planning';
import {Card, withTheme} from 'react-native-paper';
import DateManager from "../../managers/DateManager";
import ImageModal from 'react-native-image-modal';
import BasicLoadingScreen from "../../components/Custom/BasicLoadingScreen";
import {apiRequest} from "../../utils/WebData";
import ErrorView from "../../components/Custom/ErrorView";
import CustomHTML from "../../components/Custom/CustomHTML";

type Props = {
    navigation: Object,
    route: Object
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

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;

        if (this.props.route.params.data !== undefined) {
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

    fetchData = () => {
        this.setState({loading: true});
        apiRequest(CLUB_INFO_PATH, 'POST', {id: this.eventId})
            .then(this.onFetchSuccess)
            .catch(this.onFetchError);
    };

    onFetchSuccess = (data: Object) => {
        this.displayData = data;
        this.setState({loading: false});
    };

    onFetchError = (error: number) => {
        this.errorCode = error;
        this.setState({loading: false});
    };

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
                            imageBackgroundColor={this.colors.background}
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
                    <Card.Content>
                        <CustomHTML html={this.displayData.description}/>
                    </Card.Content>
                    : <View/>}
            </ScrollView>
        );
    }

    render() {
        if (this.state.loading)
            return <BasicLoadingScreen/>;
        else if (this.errorCode === 0)
            return this.getContent();
        else
            return <ErrorView {...this.props} errorCode={this.errorCode} onRefresh={this.fetchData}/>;
    }
}

export default withTheme(PlanningDisplayScreen);
