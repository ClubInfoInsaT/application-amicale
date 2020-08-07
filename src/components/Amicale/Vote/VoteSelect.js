// @flow

import * as React from 'react';
import {Avatar, Button, Card, RadioButton} from 'react-native-paper';
import {FlatList, StyleSheet, View} from 'react-native';
import i18n from 'i18n-js';
import ConnectionManager from '../../../managers/ConnectionManager';
import LoadingConfirmDialog from '../../Dialogs/LoadingConfirmDialog';
import ErrorDialog from '../../Dialogs/ErrorDialog';
import type {VoteTeamType} from '../../../screens/Amicale/VoteScreen';
import type {CardTitleIconPropsType} from '../../../constants/PaperStyles';

type PropsType = {
  teams: Array<VoteTeamType>,
  onVoteSuccess: () => void,
  onVoteError: () => void,
};

type StateType = {
  selectedTeam: string,
  voteDialogVisible: boolean,
  errorDialogVisible: boolean,
  currentError: number,
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  icon: {
    backgroundColor: 'transparent',
  },
});

export default class VoteSelect extends React.PureComponent<
  PropsType,
  StateType,
> {
  constructor() {
    super();
    this.state = {
      selectedTeam: 'none',
      voteDialogVisible: false,
      errorDialogVisible: false,
      currentError: 0,
    };
  }

  onVoteSelectionChange = (teamName: string): void =>
    this.setState({selectedTeam: teamName});

  voteKeyExtractor = (item: VoteTeamType): string => item.id.toString();

  voteRenderItem = ({item}: {item: VoteTeamType}): React.Node => (
    <RadioButton.Item label={item.name} value={item.id.toString()} />
  );

  showVoteDialog = (): void => this.setState({voteDialogVisible: true});

  onVoteDialogDismiss = (): void => this.setState({voteDialogVisible: false});

  onVoteDialogAccept = async (): Promise<void> => {
    return new Promise((resolve: () => void) => {
      const {state} = this;
      ConnectionManager.getInstance()
        .authenticatedRequest('elections/vote', {
          team: parseInt(state.selectedTeam, 10),
        })
        .then(() => {
          this.onVoteDialogDismiss();
          const {props} = this;
          props.onVoteSuccess();
          resolve();
        })
        .catch((error: number) => {
          this.onVoteDialogDismiss();
          this.showErrorDialog(error);
          resolve();
        });
    });
  };

  showErrorDialog = (error: number): void =>
    this.setState({
      errorDialogVisible: true,
      currentError: error,
    });

  onErrorDialogDismiss = () => {
    this.setState({errorDialogVisible: false});
    const {props} = this;
    props.onVoteError();
  };

  render(): React.Node {
    const {state, props} = this;
    return (
      <View>
        <Card style={styles.card}>
          <Card.Title
            title={i18n.t('screens.vote.select.title')}
            subtitle={i18n.t('screens.vote.select.subtitle')}
            left={(iconProps: CardTitleIconPropsType): React.Node => (
              <Avatar.Icon size={iconProps.size} icon="alert-decagram" />
            )}
          />
          <Card.Content>
            <RadioButton.Group
              onValueChange={this.onVoteSelectionChange}
              value={state.selectedTeam}>
              {/* $FlowFixMe */}
              <FlatList
                data={props.teams}
                keyExtractor={this.voteKeyExtractor}
                extraData={state.selectedTeam}
                renderItem={this.voteRenderItem}
              />
            </RadioButton.Group>
          </Card.Content>
          <Card.Actions>
            <Button
              icon="send"
              mode="contained"
              onPress={this.showVoteDialog}
              style={{marginLeft: 'auto'}}
              disabled={state.selectedTeam === 'none'}>
              {i18n.t('screens.vote.select.sendButton')}
            </Button>
          </Card.Actions>
        </Card>
        <LoadingConfirmDialog
          visible={state.voteDialogVisible}
          onDismiss={this.onVoteDialogDismiss}
          onAccept={this.onVoteDialogAccept}
          title={i18n.t('screens.vote.select.dialogTitle')}
          titleLoading={i18n.t('screens.vote.select.dialogTitleLoading')}
          message={i18n.t('screens.vote.select.dialogMessage')}
        />
        <ErrorDialog
          visible={state.errorDialogVisible}
          onDismiss={this.onErrorDialogDismiss}
          errorCode={state.currentError}
        />
      </View>
    );
  }
}
