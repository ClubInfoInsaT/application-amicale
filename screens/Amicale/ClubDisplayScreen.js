// @flow

import * as React from 'react';
import {ScrollView, View} from 'react-native';
import HTML from "react-native-render-html";
import {Linking} from "expo";
import {Avatar, Card, Paragraph, withTheme} from 'react-native-paper';
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
                        icon="account-tie"/>}
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
                {this.getResponsiblesRender(this.displayData.responsibles)}
            </ScrollView>
        );
    }
}

export default withTheme(ClubDisplayScreen);
