// @flow

import * as React from 'react';
import {Image} from 'react-native';
import {Container, Content, H1, H3, View} from 'native-base';
import CustomHeader from "../components/CustomHeader";
import ThemeManager from "../utils/ThemeManager";
import HTML from "react-native-render-html";
import {Linking} from "expo";
import PlanningEventManager from '../utils/PlanningEventManager';
import i18n from 'i18n-js';

type Props = {
    navigation: Object,
};

function openWebLink(link) {
    Linking.openURL(link).catch((err) => console.error('Error opening link', err));
}

/**
 * Class defining an about screen. This screen shows the user information about the app and it's author.
 */
export default class PlanningDisplayScreen extends React.Component<Props> {

    render() {
        const nav = this.props.navigation;
        const displayData = nav.getParam('data', []);
        return (
            <Container>
                <CustomHeader
                    navigation={nav}
                    title={displayData.title}
                    subtitle={PlanningEventManager.getFormattedTime(displayData)}
                    hasBackButton={true}/>
                <Content padder>
                    <H1>
                        {displayData.title}
                    </H1>
                    {displayData.logo !== null ?
                        <View style={{width: '100%', height: 300, marginTop: 20, marginBottom: 20}}>
                            <Image style={{flex: 1, resizeMode: "contain"}}
                                   source={{uri: displayData.logo}}/>
                        </View>
                        : <View/>}

                    {displayData.description !== null ?
                        // Surround description with div to allow text styling if the description is not html
                        <HTML html={"<div>" + displayData.description + "</div>"}
                              tagsStyles={{
                                  p: {
                                      color: ThemeManager.getCurrentThemeVariables().textColor,
                                      fontSize: ThemeManager.getCurrentThemeVariables().fontSizeBase
                                  },
                                  div: {color: ThemeManager.getCurrentThemeVariables().textColor}
                              }}
                              onLinkPress={(event, link) => openWebLink(link)}/>
                        : <View/>}
                </Content>
            </Container>
        );
    }
}
