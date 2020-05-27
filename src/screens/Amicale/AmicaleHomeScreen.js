// @flow

import * as React from 'react';
import {ScrollView, StyleSheet} from "react-native";
import {Button, withTheme} from 'react-native-paper';

type Props = {
    navigation: Object,
    route: Object,
}

type State = {}

class AmicaleHomeScreen extends React.Component<Props, State> {

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
                    icon={"login"}
                    onPress={() => nav.navigate("login")}
                >
                    LOGIN
                </Button>
                <Button
                    icon={"information"}
                    onPress={() => nav.navigate("amicale-contact")}
                >
                    INFO
                </Button>
                <Button
                    icon={"information"}
                    onPress={() => nav.navigate("club-list")}
                >
                    CLUBS
                </Button>
                <Button
                    icon={"information"}
                    onPress={() => nav.navigate("profile")}
                >
                    PROFILE
                </Button>
                <Button
                    icon={"information"}
                    onPress={() => nav.navigate("vote")}
                >
                    VOTE
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

export default withTheme(AmicaleHomeScreen);
