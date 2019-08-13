// @flow

import * as React from 'react';
import {Button, H3, Text} from 'native-base';
import i18n from "i18n-js";
import {Platform, View} from "react-native";
import CustomMaterialIcon from "../components/CustomMaterialIcon";
import ThemeManager from "../utils/ThemeManager";
import {Linking, Notifications} from "expo";
import BaseContainer from "../components/BaseContainer";

type Props = {
    navigation: Object,
}

/**
 * Opens a link in the device's browser
 * @param link The link to open
 */
function openWebLink(link) {
    Linking.openURL(link).catch((err) => console.error('Error opening link', err));
}

/**
 * Class defining the app's planning screen
 */
export default class PlanningScreen extends React.Component<Props> {

    render() {
        const nav = this.props.navigation;
        return (
            <BaseContainer navigation={nav} headerTitle={i18n.t('screens.planning')}>
                <View style={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: 100,
                        marginBottom: 20
                    }}>
                        <CustomMaterialIcon
                            icon={'forklift'}
                            fontSize={100}
                            width={100}
                            color={ThemeManager.getCurrentThemeVariables().fetchedDataSectionListErrorText}/>
                    </View>

                    <H3 style={{
                        textAlign: 'center',
                        marginRight: 20,
                        marginLeft: 20,
                        color: ThemeManager.getCurrentThemeVariables().fetchedDataSectionListErrorText
                    }}>
                        {i18n.t('planningScreen.wipTitle')}
                    </H3>
                    <Text style={{
                        textAlign: 'center',
                        color: ThemeManager.getCurrentThemeVariables().fetchedDataSectionListErrorText
                    }}>
                        {i18n.t('planningScreen.wipSubtitle')}
                    </Text>
                    {Platform.OS === 'android' ?
                        <Button block style={{marginTop: 20, marginRight: 10, marginLeft: 10}}
                                onPress={() => openWebLink('https://expo.io/@amicaleinsat/application-amicale')}>
                            <Text>Try the beta</Text>
                        </Button>
                        : <View/>}
                </View>
            </BaseContainer>
        );
    }
}

