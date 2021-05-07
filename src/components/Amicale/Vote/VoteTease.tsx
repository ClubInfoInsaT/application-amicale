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
import { Avatar, Card, Paragraph } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import i18n from 'i18n-js';

type PropsType = {
  startDate: string;
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
});

export default function VoteTease(props: PropsType) {
  return (
    <Card style={styles.card}>
      <Card.Title
        title={i18n.t('screens.vote.tease.title')}
        subtitle={i18n.t('screens.vote.tease.subtitle')}
        left={(iconProps) => <Avatar.Icon size={iconProps.size} icon="vote" />}
      />
      <Card.Content>
        <Paragraph>
          {`${i18n.t('screens.vote.tease.message')} ${props.startDate}`}
        </Paragraph>
      </Card.Content>
    </Card>
  );
}
