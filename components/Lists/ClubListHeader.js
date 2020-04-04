// @flow

import * as React from 'react';
import {Card, List, Text, withTheme} from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import i18n from 'i18n-js';

type Props = {
    categoryRender: Function,
    categories: Array<Object>,
}

type State = {
    expanded: boolean,
}

class ClubListHeader extends React.Component<Props, State> {

    state = {
        expanded: true
    };

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    getCategoriesRender() {
        let final = [];
        for (let i = 0; i < this.props.categories.length; i++) {
            final.push(this.props.categoryRender(this.props.categories[i], this.props.categories[i].id));
        }
        return final;
    }

    onPress = () => this.setState({expanded: !this.state.expanded});

    render() {
        return (
            <Card style={styles.card}>
                <List.Accordion
                    title={i18n.t("clubs.categories")}
                    left={props => <List.Icon {...props} icon="star"/>}
                    expanded={this.state.expanded}
                    onPress={this.onPress}
                >
                    <Text style={styles.text}>{i18n.t("clubs.categoriesFilterMessage")}</Text>
                    <View style={styles.chipContainer}>
                        {this.getCategoriesRender()}
                    </View>
                </List.Accordion>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        margin: 5
    },
    text: {
        paddingLeft: 0,
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    chipContainer: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 0,
        marginBottom: 5,
    },
});

export default withTheme(ClubListHeader);
