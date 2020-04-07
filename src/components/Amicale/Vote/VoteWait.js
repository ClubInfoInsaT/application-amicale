// @flow

import * as React from 'react';
import {ActivityIndicator, Card, Paragraph, withTheme} from "react-native-paper";
import {StyleSheet} from "react-native";
import i18n from 'i18n-js';

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
                    title={this.props.isVoteRunning
                        ? i18n.t('voteScreen.wait.titleSubmitted')
                        : i18n.t('voteScreen.wait.titleEnded')}
                    subtitle={i18n.t('voteScreen.wait.subtitle')}
                    left={(props) => <ActivityIndicator {...props}/>}
                />
                <Card.Content>
                    {
                        this.props.justVoted
                            ? <Paragraph style={{color: this.colors.success}}>
                                {i18n.t('voteScreen.wait.messageSubmitted')}
                            </Paragraph>
                            : null
                    }
                    {
                        this.props.hasVoted
                            ? <Paragraph style={{color: this.colors.success}}>
                                {i18n.t('voteScreen.wait.messageVoted')}
                            </Paragraph>
                            : null
                    }
                    {
                        this.props.startDate !== null
                            ? <Paragraph>
                                {i18n.t('voteScreen.wait.messageDate') + ' ' + this.props.startDate}
                            </Paragraph>
                            : <Paragraph>{i18n.t('voteScreen.wait.messageDateUndefined')}</Paragraph>
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
