// @flow

import * as React from 'react';
import {Avatar, Button, Card, RadioButton} from "react-native-paper";
import {FlatList, StyleSheet, View} from "react-native";
import ConnectionManager from "../../../managers/ConnectionManager";
import LoadingConfirmDialog from "../../Dialogs/LoadingConfirmDialog";
import ErrorDialog from "../../Dialogs/ErrorDialog";
import i18n from 'i18n-js';
import type {team} from "../../../screens/Amicale/VoteScreen";

type Props = {
    teams: Array<team>,
    onVoteSuccess: () => void,
    onVoteError: () => void,
}

type State = {
    selectedTeam: string,
    voteDialogVisible: boolean,
    errorDialogVisible: boolean,
    currentError: number,
}


export default class VoteSelect extends React.PureComponent<Props, State> {

    state = {
        selectedTeam: "none",
        voteDialogVisible: false,
        errorDialogVisible: false,
        currentError: 0,
    };

    onVoteSelectionChange = (team: string) => this.setState({selectedTeam: team});

    voteKeyExtractor = (item: team) => item.id.toString();

    voteRenderItem = ({item}: { item: team }) => <RadioButton.Item label={item.name} value={item.id.toString()}/>;

    showVoteDialog = () => this.setState({voteDialogVisible: true});

    onVoteDialogDismiss = () => this.setState({voteDialogVisible: false,});

    onVoteDialogAccept = async () => {
        return new Promise((resolve) => {
            ConnectionManager.getInstance().authenticatedRequest(
                "elections/vote",
                {"team": parseInt(this.state.selectedTeam)})
                .then(() => {
                    this.onVoteDialogDismiss();
                    this.props.onVoteSuccess();
                    resolve();
                })
                .catch((error: number) => {
                    this.onVoteDialogDismiss();
                    this.showErrorDialog(error);
                    resolve();
                });
        });
    };

    showErrorDialog = (error: number) => this.setState({
        errorDialogVisible: true,
        currentError: error,
    });

    onErrorDialogDismiss = () => {
        this.setState({errorDialogVisible: false});
        this.props.onVoteError();
    };

    render() {
        return (
            <View>
                <Card style={styles.card}>
                    <Card.Title
                        title={i18n.t('screens.vote.select.title')}
                        subtitle={i18n.t('screens.vote.select.subtitle')}
                        left={(props) =>
                            <Avatar.Icon
                                {...props}
                                icon={"alert-decagram"}
                            />}
                    />
                    <Card.Content>
                        <RadioButton.Group
                            onValueChange={this.onVoteSelectionChange}
                            value={this.state.selectedTeam}
                        >
                            {/*$FlowFixMe*/}
                            <FlatList
                                data={this.props.teams}
                                keyExtractor={this.voteKeyExtractor}
                                extraData={this.state.selectedTeam}
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
                            disabled={this.state.selectedTeam === "none"}
                        >
                            {i18n.t('screens.vote.select.sendButton')}
                        </Button>
                    </Card.Actions>
                </Card>
                <LoadingConfirmDialog
                    visible={this.state.voteDialogVisible}
                    onDismiss={this.onVoteDialogDismiss}
                    onAccept={this.onVoteDialogAccept}
                    title={i18n.t('screens.vote.select.dialogTitle')}
                    titleLoading={i18n.t('screens.vote.select.dialogTitleLoading')}
                    message={i18n.t('screens.vote.select.dialogMessage')}
                />
                <ErrorDialog
                    visible={this.state.errorDialogVisible}
                    onDismiss={this.onErrorDialogDismiss}
                    errorCode={this.state.currentError}
                />
            </View>
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
