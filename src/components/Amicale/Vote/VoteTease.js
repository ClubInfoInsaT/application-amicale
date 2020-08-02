// @flow

import * as React from 'react';
import {Avatar, Card, Paragraph} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import i18n from 'i18n-js';

type PropsType = {
  startDate: string,
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  icon: {
    backgroundColor: 'transparent',
  },
});

export default class VoteTease extends React.Component<PropsType> {
  shouldComponentUpdate(): boolean {
    return false;
  }

  render(): React.Node {
    const {props} = this;
    return (
      <Card style={styles.card}>
        <Card.Title
          title={i18n.t('screens.vote.tease.title')}
          subtitle={i18n.t('screens.vote.tease.subtitle')}
          left={({size}: {size: number}): React.Node => (
            <Avatar.Icon size={size} icon="vote" />
          )}
        />
        <Card.Content>
          <Paragraph>
            {`${i18n.t('screens.vote.tease.message')} ${props.startDate}`}
          </Paragraph>
        </Card.Content>
      </Card>
    );
  }
}
