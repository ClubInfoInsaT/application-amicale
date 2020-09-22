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
import {Avatar, Card, Paragraph, useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import i18n from 'i18n-js';

type PropsType = {
  startDate: string | null;
  justVoted: boolean;
  hasVoted: boolean;
  isVoteRunning: boolean;
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  icon: {
    backgroundColor: 'transparent',
  },
});

export default function VoteWait(props: PropsType) {
  const theme = useTheme();
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
        left={(iconProps) => (
          <Avatar.Icon size={iconProps.size} icon="progress-check" />
        )}
      />
      <Card.Content>
        {props.justVoted ? (
          <Paragraph style={{color: theme.colors.success}}>
            {i18n.t('screens.vote.wait.messageSubmitted')}
          </Paragraph>
        ) : null}
        {props.hasVoted ? (
          <Paragraph style={{color: theme.colors.success}}>
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
