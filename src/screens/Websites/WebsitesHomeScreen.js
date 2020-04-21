// @flow

import * as React from 'react';
import {ScrollView, StyleSheet} from "react-native";
import {Button, withTheme} from 'react-native-paper';

type Props = {
    navigation: Object,
    route: Object,
}

type State = {}

class WebsitesHomeScreen extends React.Component<Props, State> {

    state = {};

    colors: Object;

    constructor(props) {
        super(props);

        this.colors = props.theme.colors;
    }

    render() {
        const nav = this.props.navigation;
        return (
            <ScrollView>
                <Button
                    icon={"information"}
                    onPress={() => nav.navigate("amicale-website")}
                >
                    AMICALE
                </Button>
                <Button
                    icon={"information"}
                    onPress={() => nav.navigate("elus-etudiants")}
                >
                    ELUS ETUDIANTS
                </Button>
                <Button
                    icon={"information"}
                    onPress={() => nav.navigate("tutorinsa")}
                >
                    TUTOR INSA
                </Button>
                <Button
                    icon={"information"}
                    onPress={() => nav.navigate("wiketud")}
                >
                    WIKETUD
                </Button>
                <Button
                    icon={"information"}
                    onPress={() => nav.navigate("proximo")}
                >
                    PROXIMO
                </Button>
                <Button
                    icon={"information"}
                    onPress={() => nav.navigate("planning")}
                >
                    PLANNING
                </Button>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    card: {
        margin: 10,
    },
    header: {
        fontSize: 36,
        marginBottom: 48
    },
    textInput: {},
    btnContainer: {
        marginTop: 5,
        marginBottom: 10,
    }
});

export default withTheme(WebsitesHomeScreen);
