// @flow

import * as React from 'react';
import {ActivityIndicator, Card, Paragraph, Theme, withTheme} from "react-native-paper";
import {StyleSheet} from "react-native";
import i18n from 'i18n-js';

type Props = {
    startDate: string | null,
    justVoted: boolean,
    hasVoted: boolean,
    isVoteRunning: boolean,
    theme: Theme,
}

class VoteWait extends React.Component<Props> {

    shouldComponentUpdate() {
        return false;
    }

    render() {
        const colors = this.props.theme.colors;
        const startDate = this.props.startDate;
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
                            ? <Paragraph style={{color: colors.success}}>
                                {i18n.t('voteScreen.wait.messageSubmitted')}
                            </Paragraph>
                            : null
                    }
                    {
                        this.props.hasVoted
                            ? <Paragraph style={{color: colors.success}}>
                                {i18n.t('voteScreen.wait.messageVoted')}
                            </Paragraph>
                            : null
                    }
                    {
                        startDate != null
                            ? <Paragraph>
                                {i18n.t('voteScreen.wait.messageDate') + ' ' + startDate}
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
