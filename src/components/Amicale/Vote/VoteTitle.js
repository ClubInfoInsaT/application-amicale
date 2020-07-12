// @flow

import * as React from 'react';
import {Avatar, Card, Paragraph} from "react-native-paper";
import {StyleSheet} from "react-native";
import i18n from 'i18n-js';

const ICON_AMICALE = require('../../../../assets/amicale.png');

export default class VoteTitle extends React.Component<{}> {

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={i18n.t('screens.vote.main.title')}
                    subtitle={i18n.t('screens.vote.main.subtitle')}
                    left={(props) => <Avatar.Image
                        {...props}
                        source={ICON_AMICALE}
                        style={styles.icon}
                    />}
                />
                <Card.Content>
                    <Paragraph>
                        {i18n.t('screens.vote.main.paragraph1')}
                    </Paragraph>
                    <Paragraph>
                        {i18n.t('screens.vote.main.paragraph2')}
                    </Paragraph>
                </Card.Content>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
    },
    icon: {
        backgroundColor: 'transparent'
    },
});
