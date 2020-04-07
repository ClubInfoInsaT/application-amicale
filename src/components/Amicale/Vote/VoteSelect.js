// @flow

import * as React from 'react';
import {Avatar, Button, Card, RadioButton} from "react-native-paper";
import {FlatList, StyleSheet, View} from "react-native";
import ConnectionManager from "../../../managers/ConnectionManager";
import LoadingConfirmDialog from "../../Dialog/LoadingConfirmDialog";
import ErrorDialog from "../../Dialog/ErrorDialog";
import i18n from 'i18n-js';

type Props = {
    teams: Array<Object>,
    onVoteSuccess: Function,
    onVoteError: Function,
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

    voteKeyExtractor = (item: Object) => item.id.toString();

    voteRenderItem = ({item}: Object) => <RadioButton.Item label={item.name} value={item.id.toString()}/>;

    showVoteDialog = () => this.setState({voteDialogVisible: true});

    onVoteDialogDismiss = () => this.setState({voteDialogVisible: false,});

    onVoteDialogAccept = async () => {
        return new Promise((resolve, reject) => {
            ConnectionManager.getInstance().authenticatedRequest(
                "elections/vote",
                ["vote"],
                [parseInt(this.state.selectedTeam)])
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
                        title={i18n.t('voteScreen.select.title')}
                        subtitle={i18n.t('voteScreen.select.subtitle')}
                        left={(props) => <Avatar.Icon
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
                            {i18n.t('voteScreen.select.sendButton')}
                        </Button>
                    </Card.Actions>
                </Card>
                <LoadingConfirmDialog
                    visible={this.state.voteDialogVisible}
                    onDismiss={this.onVoteDialogDismiss}
                    onAccept={this.onVoteDialogAccept}
                    title={i18n.t('voteScreen.select.dialogTitle')}
                    titleLoading={i18n.t('voteScreen.select.dialogTitleLoading')}
                    message={i18n.t('voteScreen.select.dialogMessage')}
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
