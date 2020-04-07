// @flow

import * as React from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import {
    ActivityIndicator,
    Avatar,
    Button,
    Card,
    List,
    Paragraph,
    ProgressBar,
    RadioButton,
    Subheading,
    withTheme
} from 'react-native-paper';
import AuthenticatedScreen from "../../components/Amicale/AuthenticatedScreen";
import {getTimeOnlyString, stringToDate} from "../../utils/Planning";
import LoadingConfirmDialog from "../../components/Dialog/LoadingConfirmDialog";
import ConnectionManager from "../../managers/ConnectionManager";
import ErrorDialog from "../../components/Dialog/ErrorDialog";

const ICON_AMICALE = require('../../../assets/amicale.png');

const FAKE_DATE = {
    "date_begin": "2020-04-06 21:50",
    "date_end": "2020-04-07 23:50",
    "date_result_begin": "2020-04-07 21:50",
    "date_result_end": "2020-04-07 21:50",
};

const FAKE_DATE2 = {
    "date_begin": null,
    "date_end": null,
    "date_result_begin": null,
    "date_result_end": null,
};

const FAKE_TEAMS = {
    has_voted: false,
    teams: [
        {
            id: 1,
            name: "TEST TEAM1",
        },
        {
            id: 2,
            name: "TEST TEAM2",
        },
    ],
};
const FAKE_TEAMS2 = {
    has_voted: false,
    teams: [
        {
            id: 1,
            name: "TEST TEAM1",
            votes: 1,
        },
        {
            id: 2,
            name: "TEST TEAM2",
            votes: 9,
        },
    ],
};

type Props = {
    navigation: Object,
    theme: Object,
}

type State = {
    selectedTeam: string,
    hasVoted: boolean,
    voteDialogVisible: boolean,
    errorDialogVisible: boolean,
    currentError: number,
}

class VoteScreen extends React.Component<Props, State> {

    state = {
        selectedTeam: "none",
        voteDialogVisible: false,
        errorDialogVisible: false,
        currentError: 0,
        hasVoted: false,
    };

    colors: Object;

    teams: Array<Object>;
    hasVoted: boolean;
    datesString: Object;
    dates: Object;

    today: Date;

    mainFlatListData: Array<Object>;
    totalVotes: number;

    authRef: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
        this.hasVoted = false;
        this.today = new Date();
        this.authRef = React.createRef();
        this.mainFlatListData = [
            {key: 'main'},
            {key: 'info'},
        ]
    }

    reloadData = () => this.authRef.current.reload();

    generateDateObject() {
        this.dates = {
            date_begin: stringToDate(this.datesString.date_begin),
            date_end: stringToDate(this.datesString.date_end),
            date_result_begin: stringToDate(this.datesString.date_result_begin),
            date_result_end: stringToDate(this.datesString.date_result_end),
        };
    }

    getDateString(date: Date, dateString: string) {
        if (this.today.getDate() === date.getDate())
            return getTimeOnlyString(dateString);
        else
            return dateString;
    }

    isVoteAvailable() {
        return this.dates.date_begin !== null;
    }

    isVoteRunning() {
        return this.today > this.dates.date_begin && this.today < this.dates.date_end;
    }

    isVoteStarted() {
        return this.today > this.dates.date_begin;
    }

    isResultRunning() {
        return this.today > this.dates.date_result_begin && this.today < this.dates.date_result_end;
    }

    isResultStarted() {
        return this.today > this.dates.date_result_begin;
    }

    mainRenderItem = ({item}: Object) => {
        if (item.key === 'info')
            return this.getTitleCard();
        else if (item.key === 'main' && this.isVoteAvailable())
            return this.getContent();
        else
            return null;
    };

    getScreen = (data: Array<Object>) => {
        data[0] = FAKE_TEAMS2;
        data[1] = FAKE_DATE;

        if (data[0] !== null) {
            this.teams = data[0].teams;
            this.hasVoted = data[0].has_voted;
        }
        this.datesString = data[1];
        this.generateDateObject();
        return (
            <View>
                {/*$FlowFixMe*/}
                <FlatList
                    data={this.mainFlatListData}
                    extraData={this.state.selectedTeam + this.state.hasVoted.toString()}
                    renderItem={this.mainRenderItem}
                />
                <LoadingConfirmDialog
                    visible={this.state.voteDialogVisible}
                    onDismiss={this.onVoteDialogDismiss}
                    onAccept={this.onVoteDialogAccept}
                    title={"VOTE?"}
                    titleLoading={"SENDING VOTE..."}
                    message={"SURE?"}
                />
                <ErrorDialog
                    visible={this.state.errorDialogVisible}
                    onDismiss={this.onErrorDialogDismiss}
                    errorCode={this.state.currentError}
                />
            </View>
        );
    };

    showVoteDialog = () => this.setState({voteDialogVisible: true});

    onVoteDialogDismiss = (voteStatus: boolean) => {
        voteStatus = voteStatus === undefined ? false : voteStatus;
        this.setState({
            voteDialogVisible: false,
            hasVoted: voteStatus,
        })
    };

    onVoteDialogAccept = async () => {
        return new Promise((resolve, reject) => {
            ConnectionManager.getInstance().authenticatedRequest(
                "elections/vote",
                ["vote"],
                [parseInt(this.state.selectedTeam)])
                .then(() => {
                    this.onVoteDialogDismiss(true);
                    resolve();
                })
                .catch((error: number) => {
                    this.onVoteDialogDismiss(false);
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
        this.reloadData();
    };

    getContent() {
        if (!this.isVoteStarted())
            return this.getTeaseVoteCard();
        else if (this.isVoteRunning() && (!this.hasVoted && !this.state.hasVoted))
            return this.getVoteCard();
        else if (!this.isResultStarted())
            return this.getWaitVoteCard();
        else if (this.isResultRunning())
            return this.getVoteResultCard();
        else
            return null;
    }

    getTitleCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={"VOTE"}
                    subtitle={"WHY"}
                    left={(props) => <Avatar.Image
                        {...props}
                        source={ICON_AMICALE}
                        style={styles.icon}
                    />}
                />
                <Card.Content>
                    <Paragraph>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus rhoncus porttitor
                        suscipit. Quisque hendrerit, quam id vestibulum vestibulum, lorem nisi hendrerit nisi, a
                        eleifend sapien diam ut elit. Curabitur sit amet vulputate lectus. Donec semper cursus sapien
                        vel finibus.
                    </Paragraph>
                    <Paragraph>
                        Sed et venenatis turpis. Fusce malesuada magna urna, sed vehicula sem luctus in. Vivamus
                        faucibus vel eros a ultricies. In sed laoreet ante, luctus mattis tellus. Etiam vitae ipsum
                        sagittis, consequat purus sed, blandit risus.
                    </Paragraph>
                </Card.Content>
            </Card>
        );
    }

    onVoteSelectionChange = (team: string) => {
        this.setState({selectedTeam: team})
    };

    onVotePress = () => {
        this.showVoteDialog();
    };

    voteKeyExtractor = (item: Object) => item.id.toString();

    voteRenderItem = ({item}: Object) => <RadioButton.Item label={item.name} value={item.id.toString()}/>;

    /**
     * The user has not voted yet, and the votes are open
     */
    getVoteCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={"VOTE OPEN"}
                    subtitle={"VOTE NOW"}
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
                            data={this.teams}
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
                        onPress={this.onVotePress}
                        style={{marginLeft: 'auto'}}
                        disabled={this.state.selectedTeam === "none"}
                    >
                        SEND VOTE
                    </Button>
                </Card.Actions>
            </Card>
        );
    }

    sortByVotes = (a: Object, b: Object) => b.votes - a.votes;

    getTotalVotes() {
        let count = 0;
        for (let i = 0; i < this.teams.length; i++) {
            count += this.teams[i].votes;
        }
        return count;
    }

    getWinnerId() {
        return this.teams[0].id;
    }

    /**
     * Votes have ended, results can be displayed
     */
    getVoteResultCard() {
        this.totalVotes = this.getTotalVotes();
        this.teams.sort(this.sortByVotes);
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={"RESULTS"}
                    subtitle={"AVAILABLE UNTIL " + this.getDateString(this.dates.date_result_end, this.datesString.date_result_end)}
                    left={(props) => <Avatar.Icon
                        {...props}
                        icon={"podium-gold"}
                    />}
                />
                <Card.Content>
                    <Subheading>TOTAL VOTES : {this.totalVotes}</Subheading>
                    {/*$FlowFixMe*/}
                    <FlatList
                        data={this.teams}
                        keyExtractor={this.voteKeyExtractor}
                        renderItem={this.resultRenderItem}
                    />
                </Card.Content>
            </Card>
        );
    }

    resultRenderItem = ({item}: Object) => {
        const isWinner = this.getWinnerId() === item.id;
        return (
            <Card style={{
                marginTop: 10,
                elevation: isWinner ? 5 : 3,
            }}>
                <List.Item
                    title={item.name}
                    description={item.votes + " VOTES"}
                    left={props => isWinner
                        ? <List.Icon {...props} icon="trophy" color={this.colors.primary}/>
                        : null}
                    titleStyle={{
                        color: isWinner
                            ? this.colors.primary
                            : this.colors.text
                    }}
                    style={{padding: 0}}
                />
                <ProgressBar progress={item.votes / this.totalVotes} color={this.colors.primary}/>
            </Card>
        );
    };

    /**
     * Vote will open shortly
     */
    getTeaseVoteCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={"VOTE INCOMING"}
                    subtitle={"GET READY"}
                    left={props => <Avatar.Icon
                        {...props}
                        icon="vote"/>}
                />
                <Card.Content>
                    <Paragraph>
                        VOTE STARTS
                        AT {this.getDateString(this.dates.date_begin, this.datesString.date_begin)}
                    </Paragraph>
                </Card.Content>
            </Card>
        );
    }

    /**
     * Votes have ended waiting for results
     */
    getWaitVoteCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={this.isVoteRunning() ? "VOTE SUBMITTED" : "VOTES HAVE ENDED"}
                    subtitle={"WAITING FOR RESULTS"}
                    left={(props) => <ActivityIndicator {...props}/>}
                />
                <Card.Content>
                    {
                        this.state.hasVoted
                            ? <Paragraph style={{color: this.colors.success}}>
                                VOTE SUBMITTED. THX FOR YOUR PARTICIPATION
                            </Paragraph>
                            : null
                    }
                    {
                        this.hasVoted
                            ? <Paragraph style={{color: this.colors.success}}>
                                THX FOR THE VOTE
                            </Paragraph>
                            : null
                    }
                    {
                        this.dates.date_result_begin !== null
                            ? <Paragraph>
                                RESULTS AVAILABLE
                                AT {this.getDateString(this.dates.date_result_begin, this.datesString.date_result_begin)}
                            </Paragraph>
                            : <Paragraph>RESULTS AVAILABLE SHORTLY</Paragraph>
                    }
                </Card.Content>
            </Card>
        );
    }

    render() {
        return (
            <AuthenticatedScreen
                {...this.props}
                ref={this.authRef}
                links={[
                    {
                        link: 'elections/teams',
                        mandatory: false,
                    },
                    {
                        link: 'elections/datesString',
                        mandatory: false,
                    },
                ]}
                renderFunction={this.getScreen}
            />
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

export default withTheme(VoteScreen);
