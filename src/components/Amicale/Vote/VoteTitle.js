// @flow

import * as React from 'react';
import {Avatar, Card, Paragraph} from "react-native-paper";
import {StyleSheet} from "react-native";

const ICON_AMICALE = require('../../../../assets/amicale.png');

type Props = {}

export default class VoteTitle extends React.Component<Props> {

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={"VOTE"}
                    subtitle={"WHY"}
                    left={(props) => <Avatar.Image
                        {...props}
                        source={ICON_AMICALE}
                        style={styles.icon}
                    />}
                />
                <Card.Content>
                    <Paragraph>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus rhoncus porttitor
                        suscipit. Quisque hendrerit, quam id vestibulum vestibulum, lorem nisi hendrerit nisi, a
                        eleifend sapien diam ut elit. Curabitur sit amet vulputate lectus. Donec semper cursus sapien
                        vel finibus.
                    </Paragraph>
                    <Paragraph>
                        Sed et venenatis turpis. Fusce malesuada magna urna, sed vehicula sem luctus in. Vivamus
                        faucibus vel eros a ultricies. In sed laoreet ante, luctus mattis tellus. Etiam vitae ipsum
                        sagittis, consequat purus sed, blandit risus.
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
