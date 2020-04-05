// @flow

import * as React from 'react';
import {ScrollView} from 'react-native';
import {Linking} from "expo";
import {Text, withTheme} from 'react-native-paper';

type Props = {
};

type State = {
};

function openWebLink(event, link) {
    Linking.openURL(link).catch((err) => console.error('Error opening link', err));
}

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
                <Text>TEXT</Text>
            </ScrollView>
        );
    }
}

export default withTheme(ClubAboutScreen);
