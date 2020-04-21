// @flow

import * as React from 'react';
import {ScrollView, StyleSheet} from "react-native";
import {Button, withTheme} from 'react-native-paper';

type Props = {
    navigation: Object,
    route: Object,
}

type State = {}

class InsaHomeScreen extends React.Component<Props, State> {

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
                    onPress={() => nav.navigate("self-menu")}
                >
                    RU
                </Button>
                <Button
                    icon={"information"}
                    onPress={() => nav.navigate("available-rooms")}
                >
                    AVAILABLE ROOMS
                </Button>
                <Button
                    icon={"information"}
                    onPress={() => nav.navigate("bib")}
                >
                    BIB
                </Button>
                <Button// TODO create webview
                    icon={"information"}
                    onPress={() => nav.navigate("self-menu")}
                >
                    EMAIL
                </Button>
                <Button// TODO create webview
                    icon={"information"}
                    onPress={() => nav.navigate("self-menu")}
                >
                    ENT
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

export default withTheme(InsaHomeScreen);
