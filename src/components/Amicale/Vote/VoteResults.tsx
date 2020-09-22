/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import {
  Avatar,
  Card,
  List,
  ProgressBar,
  Subheading,
  withTheme,
} from 'react-native-paper';
import {FlatList, StyleSheet} from 'react-native';
import i18n from 'i18n-js';
import type {VoteTeamType} from '../../../screens/Amicale/VoteScreen';

type PropsType = {
  teams: Array<VoteTeamType>;
  dateEnd: string;
  theme: ReactNativePaper.Theme;
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  icon: {
    backgroundColor: 'transparent',
  },
});

class VoteResults extends React.Component<PropsType> {
  totalVotes: number;

  winnerIds: Array<number>;

  constructor(props: PropsType) {
    super(props);
    props.teams.sort(this.sortByVotes);
    this.totalVotes = this.getTotalVotes(props.teams);
    this.winnerIds = this.getWinnerIds(props.teams);
  }

  shouldComponentUpdate(): boolean {
    return false;
  }

  getTotalVotes(teams: Array<VoteTeamType>) {
    let totalVotes = 0;
    for (let i = 0; i < teams.length; i += 1) {
      totalVotes += teams[i].votes;
    }
    return totalVotes;
  }

  getWinnerIds(teams: Array<VoteTeamType>) {
    const max = teams[0].votes;
    let winnerIds = [];
    for (let i = 0; i < teams.length; i += 1) {
      if (teams[i].votes === max) {
        winnerIds.push(teams[i].id);
      } else {
        break;
      }
    }
    return winnerIds;
  }

  sortByVotes = (a: VoteTeamType, b: VoteTeamType): number => b.votes - a.votes;

  voteKeyExtractor = (item: VoteTeamType): string => item.id.toString();

  resultRenderItem = ({item}: {item: VoteTeamType}) => {
    const isWinner = this.winnerIds.indexOf(item.id) !== -1;
    const isDraw = this.winnerIds.length > 1;
    const {props} = this;
    return (
      <Card
        style={{
          marginTop: 10,
          elevation: isWinner ? 5 : 3,
        }}>
        <List.Item
          title={item.name}
          description={`${item.votes} ${i18n.t('screens.vote.results.votes')}`}
          left={(iconProps) =>
            isWinner ? (
              <List.Icon
                style={iconProps.style}
                icon={isDraw ? 'trophy-outline' : 'trophy'}
                color={props.theme.colors.primary}
              />
            ) : null
          }
          titleStyle={{
            color: isWinner
              ? props.theme.colors.primary
              : props.theme.colors.text,
          }}
          style={{padding: 0}}
        />
        <ProgressBar
          progress={item.votes / this.totalVotes}
          color={props.theme.colors.primary}
        />
      </Card>
    );
  };

  render() {
    const {props} = this;
    return (
      <Card style={styles.card}>
        <Card.Title
          title={i18n.t('screens.vote.results.title')}
          subtitle={`${i18n.t('screens.vote.results.subtitle')} ${
            props.dateEnd
          }`}
          left={(iconProps) => (
            <Avatar.Icon size={iconProps.size} icon="podium-gold" />
          )}
        />
        <Card.Content>
          <Subheading>
            {`${i18n.t('screens.vote.results.totalVotes')} ${this.totalVotes}`}
          </Subheading>
          <FlatList
            data={props.teams}
            keyExtractor={this.voteKeyExtractor}
            renderItem={this.resultRenderItem}
          />
        </Card.Content>
      </Card>
    );
  }
}

export default withTheme(VoteResults);
