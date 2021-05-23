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

import React, { useState } from 'react';
import { Avatar, Button, Card, RadioButton } from 'react-native-paper';
import { FlatList, StyleSheet, View } from 'react-native';
import i18n from 'i18n-js';
import LoadingConfirmDialog from '../../Dialogs/LoadingConfirmDialog';
import ErrorDialog from '../../Dialogs/ErrorDialog';
import type { VoteTeamType } from '../../../screens/Amicale/VoteScreen';
import { ApiRejectType } from '../../../utils/WebData';
import { REQUEST_STATUS } from '../../../utils/Requests';
import { useAuthenticatedRequest } from '../../../context/loginContext';

type Props = {
  teams: Array<VoteTeamType>;
  onVoteSuccess: () => void;
  onVoteError: () => void;
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  button: {
    marginLeft: 'auto',
  },
});

function VoteSelect(props: Props) {
  const [selectedTeam, setSelectedTeam] = useState('none');
  const [voteDialogVisible, setVoteDialogVisible] = useState(false);
  const [currentError, setCurrentError] = useState<ApiRejectType>({
    status: REQUEST_STATUS.SUCCESS,
  });
  const request = useAuthenticatedRequest('elections/vote', {
    team: parseInt(selectedTeam, 10),
  });

  const voteKeyExtractor = (item: VoteTeamType) => item.id.toString();

  const voteRenderItem = ({ item }: { item: VoteTeamType }) => (
    <RadioButton.Item label={item.name} value={item.id.toString()} />
  );

  const showVoteDialog = () => setVoteDialogVisible(true);

  const onVoteDialogDismiss = () => setVoteDialogVisible(false);

  const onVoteDialogAccept = async (): Promise<void> => {
    return new Promise((resolve: () => void) => {
      request()
        .then(() => {
          onVoteDialogDismiss();
          props.onVoteSuccess();
          resolve();
        })
        .catch((error: ApiRejectType) => {
          onVoteDialogDismiss();
          setCurrentError(error);
          resolve();
        });
    });
  };

  const onErrorDialogDismiss = () => {
    setCurrentError({ status: REQUEST_STATUS.SUCCESS });
    props.onVoteError();
  };

  return (
    <View>
      <Card style={styles.card}>
        <Card.Title
          title={i18n.t('screens.vote.select.title')}
          subtitle={i18n.t('screens.vote.select.subtitle')}
          left={(iconProps) => (
            <Avatar.Icon size={iconProps.size} icon="alert-decagram" />
          )}
        />
        <Card.Content>
          <RadioButton.Group
            onValueChange={setSelectedTeam}
            value={selectedTeam}
          >
            <FlatList
              data={props.teams}
              keyExtractor={voteKeyExtractor}
              extraData={selectedTeam}
              renderItem={voteRenderItem}
            />
          </RadioButton.Group>
        </Card.Content>
        <Card.Actions>
          <Button
            icon={'send'}
            mode={'contained'}
            onPress={showVoteDialog}
            style={styles.button}
            disabled={selectedTeam === 'none'}
          >
            {i18n.t('screens.vote.select.sendButton')}
          </Button>
        </Card.Actions>
      </Card>
      <LoadingConfirmDialog
        visible={voteDialogVisible}
        onDismiss={onVoteDialogDismiss}
        onAccept={onVoteDialogAccept}
        title={i18n.t('screens.vote.select.dialogTitle')}
        titleLoading={i18n.t('screens.vote.select.dialogTitleLoading')}
        message={i18n.t('screens.vote.select.dialogMessage')}
      />
      <ErrorDialog
        visible={currentError.status !== REQUEST_STATUS.SUCCESS}
        onDismiss={onErrorDialogDismiss}
        status={currentError.status}
        code={currentError.code}
      />
    </View>
  );
}

export default VoteSelect;
