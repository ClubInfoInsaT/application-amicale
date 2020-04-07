// @flow

import * as React from 'react';
import {ActivityIndicator, Card, Paragraph, withTheme} from "react-native-paper";
import {StyleSheet} from "react-native";

type Props = {
    startDate: string | null,
    justVoted: boolean,
    hasVoted: boolean,
    isVoteRunning: boolean,
}

class VoteWait extends React.Component<Props> {

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={this.props.isVoteRunning ? "VOTE SUBMITTED" : "VOTES HAVE ENDED"}
                    subtitle={"WAITING FOR RESULTS"}
                    left={(props) => <ActivityIndicator {...props}/>}
                />
                <Card.Content>
                    {
                        this.props.justVoted
                            ? <Paragraph style={{color: this.colors.success}}>
                                VOTE SUBMITTED. THX FOR YOUR PARTICIPATION
                            </Paragraph>
                            : null
                    }
                    {
                        this.props.hasVoted
                            ? <Paragraph style={{color: this.colors.success}}>
                                THX FOR THE VOTE
                            </Paragraph>
                            : null
                    }
                    {
                        this.props.startDate !== null
                            ? <Paragraph>
                                RESULTS AVAILABLE
                                AT {this.props.startDate}
                            </Paragraph>
                            : <Paragraph>RESULTS AVAILABLE SHORTLY</Paragraph>
                    }
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

export default withTheme(VoteWait);
