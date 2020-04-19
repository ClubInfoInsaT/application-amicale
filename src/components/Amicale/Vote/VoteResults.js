// @flow

import * as React from 'react';
import {Avatar, Card, List, ProgressBar, Subheading, Theme, withTheme} from "react-native-paper";
import {FlatList, StyleSheet} from "react-native";
import i18n from 'i18n-js';
import type {team} from "../../../screens/Amicale/VoteScreen";


type Props = {
    teams: Array<team>,
    dateEnd: string,
    theme: Theme,
}

class VoteResults extends React.Component<Props> {

    totalVotes: number;
    winnerIds: Array<number>;

    constructor(props) {
        super();
        props.teams.sort(this.sortByVotes);
        this.getTotalVotes(props.teams);
        this.getWinnerIds(props.teams);
    }

    shouldComponentUpdate() {
        return false;
    }

    sortByVotes = (a: team, b: team) => b.votes - a.votes;

    getTotalVotes(teams: Array<team>) {
        this.totalVotes = 0;
        for (let i = 0; i < teams.length; i++) {
            this.totalVotes += teams[i].votes;
        }
    }

    getWinnerIds(teams: Array<team>){
        let max = teams[0].votes;
        this.winnerIds= [];
        for (let i = 0; i < teams.length; i++) {
            if (teams[i].votes === max)
                this.winnerIds.push(teams[i].id);
            else
                break;
        }
    }

    voteKeyExtractor = (item: team) => item.id.toString();

    resultRenderItem = ({item}: {item: team}) => {
        const isWinner = this.winnerIds.indexOf(item.id) !== -1;
        const isDraw = this.winnerIds.length > 1;
        const colors = this.props.theme.colors;
        return (
            <Card style={{
                marginTop: 10,
                elevation: isWinner ? 5 : 3,
            }}>
                <List.Item
                    title={item.name}
                    description={item.votes + ' ' + i18n.t('voteScreen.results.votes')}
                    left={props => isWinner
                        ? <List.Icon {...props} icon={isDraw ? "trophy-outline" : "trophy"} color={colors.primary}/>
                        : null}
                    titleStyle={{
                        color: isWinner
                            ? colors.primary
                            : colors.text
                    }}
                    style={{padding: 0}}
                />
                <ProgressBar progress={item.votes / this.totalVotes} color={colors.primary}/>
            </Card>
        );
    };

    render() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={i18n.t('voteScreen.results.title')}
                    subtitle={i18n.t('voteScreen.results.subtitle') + ' ' + this.props.dateEnd}
                    left={(props) => <Avatar.Icon
                        {...props}
                        icon={"podium-gold"}
                    />}
                />
                <Card.Content>
                    <Subheading>{i18n.t('voteScreen.results.totalVotes') + ' ' +this.totalVotes}</Subheading>
                    {/*$FlowFixMe*/}
                    <FlatList
                        data={this.props.teams}
                        keyExtractor={this.voteKeyExtractor}
                        renderItem={this.resultRenderItem}
                    />
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

export default withTheme(VoteResults);
