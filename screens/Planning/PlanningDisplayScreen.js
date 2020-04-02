// @flow

import * as React from 'react';
import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import HTML from "react-native-render-html";
import {Linking} from "expo";
import {getDateOnlyString, getFormattedEventTime} from '../../utils/Planning';
import {Card, Portal, withTheme} from 'react-native-paper';
import DateManager from "../../managers/DateManager";
import ImageView from "react-native-image-viewing";

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
                    <TouchableOpacity onPress={this.showImageModal} style={{width: '100%', height: 300}}>
                        <Image style={{flex: 1, resizeMode: "contain"}}
                               source={{uri: this.displayData.logo}}/>
                    </TouchableOpacity>
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
                <Portal>
                    <ImageView
                        images={[{uri: this.displayData.logo}]}
                        imageIndex={0}
                        presentationStyle={"fullScreen"}
                        visible={this.state.imageModalVisible}
                        onRequestClose={this.hideImageModal}
                    />
                </Portal>
            </ScrollView>
        );
    }
}

export default withTheme(PlanningDisplayScreen);
