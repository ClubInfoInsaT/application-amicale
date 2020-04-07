// @flow

import * as React from 'react';
import {Avatar, Card, Paragraph} from "react-native-paper";
import {StyleSheet} from "react-native";

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
                    title={"VOTE INCOMING"}
                    subtitle={"GET READY"}
                    left={props => <Avatar.Icon
                        {...props}
                        icon="vote"/>}
                />
                <Card.Content>
                    <Paragraph>
                        VOTE STARTS
                        AT {this.props.startDate}
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
