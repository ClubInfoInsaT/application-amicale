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
    imageModalVisible: boolean,
};

function openWebLink(event, link) {
    Linking.openURL(link).catch((err) => console.error('Error opening link', err));
}

/**
 * Class defining a planning event information page.
 */
class PlanningDisplayScreen extends React.Component<Props, State> {

    displayData = this.props.route.params['data'];

    colors: Object;

    state = {
        imageModalVisible: false,
    };

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    showImageModal = () => {
        this.setState({imageModalVisible: true});
    };

    hideImageModal = () => {
        this.setState({imageModalVisible: false});
    };

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
