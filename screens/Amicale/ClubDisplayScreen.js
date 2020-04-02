// @flow

import * as React from 'react';
import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import HTML from "react-native-render-html";
import {Linking} from "expo";
import {Avatar, Card, Paragraph, Portal, withTheme} from 'react-native-paper';
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
class ClubDisplayScreen extends React.Component<Props, State> {

    displayData = this.props.route.params['data'];

    colors: Object;

    state = {
        imageModalVisible: false,
    };

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    componentDidMount(): * {
        this.props.navigation.setOptions({title: this.displayData.name})
    }

    showImageModal = () => {
        this.setState({imageModalVisible: true});
    };

    hideImageModal = () => {
        this.setState({imageModalVisible: false});
    };

    getResponsiblesRender(resp: Array<string>) {
        let final = [];
        for (let i = 0; i < resp.length; i++) {
            final.push(<Paragraph>{resp[i]}</Paragraph>)
        }
        return (
            <Card style={{marginTop: 10, marginBottom: 10}}>
                <Card.Title
                    title={"RESPO"}
                    subtitle={"CONTACTS"}
                    left={(props) => <Avatar.Icon
                        style={{backgroundColor: 'transparent'}}
                        {...props}
                        icon="account-tie" />}
                />
                <Card.Content>
                    {final}
                </Card.Content>
            </Card>
        );
    }

    render() {
        return (
            <ScrollView style={{paddingLeft: 5, paddingRight: 5}}>
                {this.displayData.logo !== null ?
                    <TouchableOpacity
                        onPress={this.showImageModal}
                        style={{width: '100%', height: 300, marginBottom: 10}}>
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
                {this.getResponsiblesRender(this.displayData.responsibles)}
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

export default withTheme(ClubDisplayScreen);
