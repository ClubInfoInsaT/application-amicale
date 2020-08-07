// @flow

import * as React from 'react';
import {Avatar, Card, Paragraph, withTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import i18n from 'i18n-js';
import type {CustomThemeType} from '../../../managers/ThemeManager';
import type {CardTitleIconPropsType} from '../../../constants/PaperStyles';

type PropsType = {
  startDate: string | null,
  justVoted: boolean,
  hasVoted: boolean,
  isVoteRunning: boolean,
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

class VoteWait extends React.Component<PropsType> {
  shouldComponentUpdate(): boolean {
    return false;
  }

  render(): React.Node {
    const {props} = this;
    const {startDate} = props;
    return (
      <Card style={styles.card}>
        <Card.Title
          title={
            props.isVoteRunning
              ? i18n.t('screens.vote.wait.titleSubmitted')
              : i18n.t('screens.vote.wait.titleEnded')
          }
          subtitle={i18n.t('screens.vote.wait.subtitle')}
          left={(iconProps: CardTitleIconPropsType): React.Node => (
            <Avatar.Icon size={iconProps.size} icon="progress-check" />
          )}
        />
        <Card.Content>
          {props.justVoted ? (
            <Paragraph style={{color: props.theme.colors.success}}>
              {i18n.t('screens.vote.wait.messageSubmitted')}
            </Paragraph>
          ) : null}
          {props.hasVoted ? (
            <Paragraph style={{color: props.theme.colors.success}}>
              {i18n.t('screens.vote.wait.messageVoted')}
            </Paragraph>
          ) : null}
          {startDate != null ? (
            <Paragraph>
              {`${i18n.t('screens.vote.wait.messageDate')} ${startDate}`}
            </Paragraph>
          ) : (
            <Paragraph>
              {i18n.t('screens.vote.wait.messageDateUndefined')}
            </Paragraph>
          )}
        </Card.Content>
      </Card>
    );
  }
}

export default withTheme(VoteWait);
