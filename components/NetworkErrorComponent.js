// @flow

import * as React from 'react';
import {Button, Subheading, withTheme} from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import i18n from 'i18n-js';

type Props = {
    navigation: Object,
    message: string,
    icon: string,
    onRefresh: Function,
}

type State = {
    refreshing: boolean,
}

class NetworkErrorComponent extends React.PureComponent<Props, State> {

    colors: Object;

    state = {
        refreshing: false,
    };

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    render() {
        return (
            <View style={styles.outer}>
                <View style={styles.inner}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons
                            name={this.props.icon}
                            size={150}
                            color={this.colors.textDisabled}/>
                    </View>
                    <Subheading style={{
                        ...styles.subheading,
                        color: this.colors.textDisabled
                    }}>
                        {this.props.message}
                    </Subheading>
                    <Button
                        mode={'contained'}
                        icon={'refresh'}
                        onPress={this.props.onRefresh}
                        style={styles.button}
                    >
                        {i18n.t("general.retry")}
                    </Button>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outer: {
        flex: 1,
    },
    inner: {
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    iconContainer: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20
    },
    subheading: {
        textAlign: 'center',
    },
    button: {
        marginTop: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
    }
});


export default withTheme(NetworkErrorComponent);
