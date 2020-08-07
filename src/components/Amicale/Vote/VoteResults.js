// @flow

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
import type {CustomThemeType} from '../../../managers/ThemeManager';
import type {
  CardTitleIconPropsType,
  ListIconPropsType,
} from '../../../constants/PaperStyles';

type PropsType = {
  teams: Array<VoteTeamType>,
  dateEnd: string,
  theme: CustomThemeType,
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
    super();
    props.teams.sort(this.sortByVotes);
    this.getTotalVotes(props.teams);
    this.getWinnerIds(props.teams);
  }

  shouldComponentUpdate(): boolean {
    return false;
  }

  getTotalVotes(teams: Array<VoteTeamType>) {
    this.totalVotes = 0;
    for (let i = 0; i < teams.length; i += 1) {
      this.totalVotes += teams[i].votes;
    }
  }

  getWinnerIds(teams: Array<VoteTeamType>) {
    const max = teams[0].votes;
    this.winnerIds = [];
    for (let i = 0; i < teams.length; i += 1) {
      if (teams[i].votes === max) this.winnerIds.push(teams[i].id);
      else break;
    }
  }

  sortByVotes = (a: VoteTeamType, b: VoteTeamType): number => b.votes - a.votes;

  voteKeyExtractor = (item: VoteTeamType): string => item.id.toString();

  resultRenderItem = ({item}: {item: VoteTeamType}): React.Node => {
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
          left={(iconProps: ListIconPropsType): React.Node =>
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

  render(): React.Node {
    const {props} = this;
    return (
      <Card style={styles.card}>
        <Card.Title
          title={i18n.t('screens.vote.results.title')}
          subtitle={`${i18n.t('screens.vote.results.subtitle')} ${
            props.dateEnd
          }`}
          left={(iconProps: CardTitleIconPropsType): React.Node => (
            <Avatar.Icon size={iconProps.size} icon="podium-gold" />
          )}
        />
        <Card.Content>
          <Subheading>{`${i18n.t('screens.vote.results.totalVotes')} ${
            this.totalVotes
          }`}</Subheading>
          {/* $FlowFixMe */}
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
