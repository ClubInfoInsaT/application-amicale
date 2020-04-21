// @flow

import * as React from 'react';
import {Avatar, Card, List, withTheme} from 'react-native-paper';
import {StyleSheet} from "react-native";
import {DrawerNavigationProp} from "@react-navigation/drawer";
import type {CustomTheme} from "../../managers/ThemeManager";

const ICON_AMICALE = require("../../../assets/amicale.png");

type Props = {
    navigation: DrawerNavigationProp,
    theme: CustomTheme,
}

class ActionsDashBoardItem extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Props): boolean {
        return (nextProps.theme.dark !== this.props.theme.dark)
    }

    render() {
        return (
            <Card style={{
                ...styles.card,
                borderColor: this.props.theme.colors.primary,
            }}>
                <List.Item
                    title={"AMICALE"}
                    description={"VOTRE COMPTE"}
                    left={props => <Avatar.Image
                        {...props}
                        size={54}
                        source={ICON_AMICALE}
                        style={styles.avatar}/>}
                    right={props => <List.Icon {...props} icon="chevron-right"/>}
                    onPress={() => this.props.navigation.navigate("amicale-home")}
                />
                <List.Item
                    title={"STUDENT WEBSITES"}
                    description={"TROP COOL"}
                    left={props => <List.Icon {...props} icon="web"/>}
                    right={props => <List.Icon {...props} icon="chevron-right"/>}
                    onPress={() => this.props.navigation.navigate("websites-home")}
                />
                <List.Item
                    title={"SERVICES INSA"}
                    description={"TROP BIEN"}
                    left={props => <List.Icon {...props} icon="star"/>}
                    right={props => <List.Icon {...props} icon="chevron-right"/>}
                    onPress={() => this.props.navigation.navigate("insa-home")}
                />
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
        elevation: 4,
        borderWidth: 1,
    },
    avatar: {
        backgroundColor: 'transparent'
    },
});

export default withTheme(ActionsDashBoardItem);
