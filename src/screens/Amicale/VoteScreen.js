// @flow

import * as React from 'react';
import {ScrollView, StyleSheet} from "react-native";
import {Avatar, Card, Paragraph, withTheme} from 'react-native-paper';
import AuthenticatedScreen from "../../components/Amicale/AuthenticatedScreen";

const ICON_AMICALE = require('../../../assets/amicale.png');

type Props = {
    navigation: Object,
    theme: Object,
}

type State = {}

class VoteScreen extends React.Component<Props, State> {

    state = {};

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    getScreen = (data: Object) => {
        console.log(data);
        return (
            <ScrollView>
                {this.getTitleCard()}
                {this.getVoteCard()}
            </ScrollView>
        );
    };

    getTitleCard() {
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

    getVoteCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={"VOTE OPEN"}
                    subtitle={"VALID UNTIL DATE END"}
                />
                <Card.Content>
                    <Paragraph>TEAM1</Paragraph>
                    <Paragraph>TEAM2</Paragraph>
                </Card.Content>
            </Card>
        );
    }

    getVoteResultCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={"VOTE RESULTS"}
                    subtitle={"DATE END RESULTS"}
                />
                <Card.Content>
                    <Paragraph>TEAM1</Paragraph>
                    <Paragraph>TEAM2</Paragraph>
                </Card.Content>
            </Card>
        );
    }

    getEmptyVoteCard() {

    }

    render() {
        return (
            <AuthenticatedScreen
                {...this.props}
                links={[
                    {
                        link: 'elections/teams',
                        mandatory: false,
                    },
                    {
                        link: 'elections/dates',
                        mandatory: true,
                    },
                ]}
                renderFunction={this.getScreen}
            />
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

export default withTheme(VoteScreen);
