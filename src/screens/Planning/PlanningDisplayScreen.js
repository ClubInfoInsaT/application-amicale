// @flow

import * as React from 'react';
import {ScrollView, View} from 'react-native';
import HTML from "react-native-render-html";
import {Linking} from "expo";
import {getDateOnlyString, getFormattedEventTime} from '../../utils/Planning';
import {Card, withTheme} from 'react-native-paper';
import DateManager from "../../managers/DateManager";
import ImageModal from 'react-native-image-modal';

type Props = {
    navigation: Object,
    route: Object
};

type State = {
};

function openWebLink(event, link) {
    Linking.openURL(link).catch((err) => console.error('Error opening link', err));
}

const FAKE_EVENT = {
    "id": 142,
    "title": "Soir\u00e9e Impact'INSA",
    "logo": null,
    "date_begin": "2020-04-22 19:00",
    "date_end": "2020-04-22 00:00",
    "description": "<p>R\u00e9servation salle de boom + PK pour la soir\u00e9e Impact'Insa<\/p>",
    "club": "Impact Insa",
    "category_id": 10,
    "url": "https:\/\/www.amicale-insat.fr\/event\/142\/view"
};

/**
 * Class defining a planning event information page.
 */
class PlanningDisplayScreen extends React.Component<Props, State> {

    displayData: Object;
    shouldFetchData: boolean;
    eventId: number;

    colors: Object;

    state = {

    };

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;

        if (this.props.route.params.data !== undefined) {
            this.displayData = this.props.route.params.data;
            this.eventId = this.props.route.params.data.eventId;
            this.shouldFetchData = false;
        } else {
            this.displayData = FAKE_EVENT;
            this.eventId = this.props.route.params.eventId;
            this.shouldFetchData = true;
            console.log(this.eventId);
        }
    }

    render() {
        // console.log("rendering planningDisplayScreen");
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
                    // Surround description with div to allow text styling if the description is not html
                    <Card.Content>
                        <HTML html={"<div>" + this.displayData.description + "</div>"}
                              tagsStyles={{
                                  p: {color: this.colors.text,},
                                  div: {color: this.colors.text}
                              }}
                              onLinkPress={openWebLink}/>
                    </Card.Content>
                    : <View/>}
            </ScrollView>
        );
    }
}

export default withTheme(PlanningDisplayScreen);
