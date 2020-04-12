// @flow

import * as React from 'react';
import {Button, Card, withTheme} from 'react-native-paper';
import {Platform, StyleSheet} from "react-native";
import i18n from 'i18n-js';

type Props = {
    navigation: Object,
    theme: Object,
}

class ActionsDashBoardItem extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Props): boolean {
        return (nextProps.theme.dark !== this.props.theme.dark)
    }

    openDrawer = () => this.props.navigation.openDrawer();

    gotToSettings = () => this.props.navigation.navigate("settings");

    render() {
        console.log('render action dashboard');
        return (
            <Card style={{
                ...styles.card,
                borderColor: this.props.theme.colors.primary,
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
