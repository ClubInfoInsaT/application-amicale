// @flow

import * as React from 'react';
import {Image, ScrollView, View} from 'react-native';
import HTML from "react-native-render-html";
import {Linking} from "expo";
import PlanningEventManager from '../../utils/PlanningEventManager';
import {Card, withTheme} from 'react-native-paper';
import DateManager from "../../utils/DateManager";

type Props = {
    navigation: Object,
    route: Object
};

function openWebLink(event, link) {
    Linking.openURL(link).catch((err) => console.error('Error opening link', err));
}

/**
 * Class defining an about screen. This screen shows the user information about the app and it's author.
 */
class PlanningDisplayScreen extends React.Component<Props> {

    displayData = this.props.route.params['data'];

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    render() {
        // console.log("rendering planningDisplayScreen");
        let subtitle = PlanningEventManager.getFormattedEventTime(
            this.displayData["date_begin"], this.displayData["date_end"]);
        let dateString = PlanningEventManager.getDateOnlyString(this.displayData["date_begin"]);
        if (dateString !== null)
            subtitle += ' | ' + DateManager.getInstance().getTranslatedDate(dateString);
        return (
            <ScrollView style={{paddingLeft: 5, paddingRight: 5}}>
                <Card.Title
                    title={this.displayData.title}
                    subtitle={subtitle}
                />
                {this.displayData.logo !== null ?
                    <View style={{width: '100%', height: 300}}>
                        <Image style={{flex: 1, resizeMode: "contain"}}
                               source={{uri: this.displayData.logo}}/>
                    </View>
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
