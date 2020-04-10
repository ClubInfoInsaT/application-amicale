// @flow

import * as React from 'react';
import {Button, Card, withTheme} from 'react-native-paper';
import {Platform, StyleSheet} from "react-native";
import i18n from 'i18n-js';

type Props = {
    navigation: Object,
    theme: Object,
}

class ActionsDashBoardItem extends React.PureComponent<Props> {

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = this.props.theme.colors;
    }

    openDrawer = () => this.props.navigation.openDrawer();

    gotToSettings = () => this.props.navigation.navigate("settings");

    render() {
        return (
            <Card style={{
                ...styles.card,
                borderColor: this.colors.primary,
            }}>
                <Card.Content style={styles.content}>
                    <Button
                        icon="information"
                        mode="contained"
                        onPress={this.openDrawer}
                        style={styles.servicesButton}
                    >
                        {i18n.t("homeScreen.servicesButton")}
                    </Button>
                    {
                        // Leave space to fix ios icon position
                        Platform.OS === 'ios'
                            ? <Button
                                icon="settings"
                                mode="contained"
                                onPress={this.gotToSettings}
                                style={styles.settingsButton}
                                compact
                            > </Button>
                            : <Button
                                icon="settings"
                                mode="contained"
                                onPress={this.gotToSettings}
                                style={styles.settingsButton}
                                compact
                            />
                    }

                </Card.Content>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        width: 'auto',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        overflow: 'hidden',
        elevation: 4,
        borderWidth: 1,
    },
    avatar: {
        backgroundColor: 'transparent'
    },
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    servicesButton: {
        marginLeft: 'auto',
        marginRight: 5,
    },
    settingsButton: {
        marginLeft: 5,
        marginRight: 'auto',
    }
});

export default withTheme(ActionsDashBoardItem);
