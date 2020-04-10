// @flow

import * as React from 'react';
import {Image, ScrollView, View} from 'react-native';
import {Text, withTheme} from 'react-native-paper';
import i18n from 'i18n-js';

type Props = {
};

type State = {
};

/**
 * Class defining a planning event information page.
 */
class ClubAboutScreen extends React.Component<Props, State> {

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    render() {
        return (
            <ScrollView style={{padding: 5}}>
                <View style={{
                    width: '100%',
                    height: 100,
                    marginTop: 20,
                    marginBottom: 20,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image
                        source={require('../../../../assets/amicale.png')}
                        style={{flex: 1, resizeMode: "contain"}}
                        resizeMode="contain"/>
                </View>
                <Text>{i18n.t("clubs.aboutText")}</Text>
            </ScrollView>
        );
    }
}

export default withTheme(ClubAboutScreen);
