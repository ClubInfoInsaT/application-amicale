// @flow

import * as React from 'react';
import {Image, ScrollView, View} from 'react-native';
import ThemeManager from "../utils/ThemeManager";
import HTML from "react-native-render-html";
import {Linking} from "expo";
import PlanningEventManager from '../utils/PlanningEventManager';
import {Subheading, Title} from 'react-native-paper';

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
export default class PlanningDisplayScreen extends React.Component<Props> {

    displayData = this.props.route.params['data'];

    render() {
        // console.log("rendering planningDisplayScreen");
        return (
            <ScrollView style={{paddingLeft: 5, paddingRight: 5}}>
                <Title>
                    {this.displayData.title}
                </Title>
                <Subheading style={{marginTop: 10,}}>
                    {PlanningEventManager.getFormattedTime(this.displayData)}
                </Subheading>
                {this.displayData.logo !== null ?
                    <View style={{width: '100%', height: 300, marginTop: 20, marginBottom: 20}}>
                        <Image style={{flex: 1, resizeMode: "contain"}}
                               source={{uri: this.displayData.logo}}/>
                    </View>
                    : <View/>}

                {this.displayData.description !== null ?
                    // Surround description with div to allow text styling if the description is not html
                    <HTML html={"<div>" + this.displayData.description + "</div>"}
                          tagsStyles={{
                              p: {
                                  color: ThemeManager.getCurrentThemeVariables().text,
                              },
                              div: {color: ThemeManager.getCurrentThemeVariables().text}
                          }}
                          onLinkPress={openWebLink}/>
                    : <View/>}
            </ScrollView>
        );
    }
}
