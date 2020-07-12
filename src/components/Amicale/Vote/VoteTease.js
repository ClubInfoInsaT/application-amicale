// @flow

import * as React from 'react';
import {Avatar, Card, Paragraph} from "react-native-paper";
import {StyleSheet} from "react-native";
import i18n from 'i18n-js';

type Props = {
    startDate: string,
}

export default class VoteTease extends React.Component<Props> {

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={i18n.t('screens.vote.tease.title')}
                    subtitle={i18n.t('screens.vote.tease.subtitle')}
                    left={props => <Avatar.Icon
                        {...props}
                        icon="vote"/>}
                />
                <Card.Content>
                    <Paragraph>
                        {i18n.t('screens.vote.tease.message') + ' ' + this.props.startDate}
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
